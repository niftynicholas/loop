angular.module('app.main.controllers')

.controller('planRouteCtrl', function($scope, leafletData, $http, $state, $ionicPopup, dataShare, sharedRoute, $cordovaGeolocation) {
    var token = "";
    var searchLimit = 10; //10 or more because has digit 0 to 9 for last digit in postal code

    // $scope.favourites = [{name: "123", lat: 123, lng: 123}, {name: "asd", lat: 123, lng: 123}];
    // $scope.favourites = [];

    /**
    * Ajax call to get token from OneMap
    */
    $.ajax({
        dataType: 'json',
        url: 'http://www.onemap.sg/API/services.svc/getToken',
        async: false,
        data: {
            'accessKEY': '2WpSB38gVk6Shp1NiEgk0eTAHRsv4jGu7cs4N1r8KipyJJyB7uN8+hl3LXNq2iX1c/wdJhIStL4a6kEacP8CT/HQfXmkWp25|mv73ZvjFcSo=',
        },
        success: function(data) {
            token = data.GetToken[0].NewToken;
        }
    });

    if (typeof(token) == "undefined") {
        token = 'xkg8VRu6Ol+gMH+SUamkRIEB7fKzhwMvfMo/2U8UJcFhdvR4yN1GutmUIA3A6r3LDhot215OVVkZvNRzjl28TNUZgYFSswOi';
    }

    var hasCurrentLocation = false;
    $('#startPoint').focus(function() {
        // var favourites = localStorage.getItem("favourites");
        // if(favourites != null){
        //     console.log(favourites);
        //     $scope.favourites = JSON.parse(favourites);
        // }else{
        //     console.log("FAVOURITES IS NULL");
        // }
        if(!hasCurrentLocation){
            if (dataShare.data != false && typeof(dataShare.getData().currentLocation.lat) != "undefined") {
                $('#startResult').append('<div class="item" onclick="displayInfo(\'' + "Current Location" + '\',' + dataShare.getData().currentLocation.lat + ',' + dataShare.getData().currentLocation.lng + ',\'start\')">' + "Current Location" + '</div>');
                hasCurrentLocation = true;
            } else {
                $cordovaGeolocation.getCurrentPosition({
                    timeout: 3000,
                    enableHighAccuracy: true
                }).then(function(position) {
                    $('#startResult').append('<div class="item" onclick="displayInfo(\'' + "Current Location" + '\',' + position.coords.latitude + ',' + position.coords.longitude + ',\'start\')">' + "Current Location" + '</div>');
                    hasCurrentLocation = true;
                }, function(err) {
                    console.log("Location not found");
                });
            }
        }
    });

    // $('#startPoint').focusout(function() {
    //     $('#startResult').empty();
    // });
    //
    // $('#endPoint').focusout(function() {
    //     $('#endResult').empty();
    // });

    /**
    * Populate Search Results for Start Point
    */
    $('#startPoint').keyup(function() {
        var input = $('#startPoint').val();
        //To add Home / Office for Advanced Navigation Module
        if (input.length == 0) {
            $('#startResult').html("");
            if (dataShare.data != false && typeof(dataShare.getData().currentLocation.lat) != "undefined") {
                $('#startResult').append('<div class="item" onclick="displayInfo(\'' + "Current Location" + '\',' + dataShare.getData().currentLocation.lat + ',' + dataShare.getData().currentLocation.lng + ',\'start\')">' + "Current Location" + '</div>');
            } else {
                $cordovaGeolocation.getCurrentPosition({
                    timeout: 3000,
                    enableHighAccuracy: true
                }).then(function(position) {
                    $('#startResult').append('<div class="item" onclick="displayInfo(\'' + "Current Location" + '\',' + position.coords.latitude + ',' + position.coords.longitude + ',\'start\')">' + "Current Location" + '</div>');
                }, function(err) {
                    console.log("Location not found");
                });
            }
        } else {
            var type = 'WGS84';
            var requestURL = 'http://www.onemap.sg/APIV2/services.svc/basicSearchV2?callback=?';
            $.getJSON(requestURL, {
                'token': token,
                'searchVal': input,
                'projSys': type,
            }, function(data) {
                $('#startResult').html("");
                //If data is length > 2 means there are multiple results
                if (data.SearchResults.length > 2) {
                    var toLoopTill = searchLimit;
                    if (data.SearchResults.length < 11) {
                        //if results were lesser than current searchLimit set
                        toLoopTill = data.SearchResults.length - 1;
                    }
                    for (var i = 1; i <= toLoopTill; i++) {
                        var searchVal = data.SearchResults[i].SEARCHVAL;
                        var lat = data.SearchResults[i].Y;
                        var lng = data.SearchResults[i].X;
                        if (searchVal != null) {
                            //Populate the results in the startResult div
                            $('#startResult').append('<div class="item" onclick="displayInfo(\'' + searchVal + '\',' + lat + ',' + lng + ',\'start\')">' + searchVal + '</div>');
                            // $('#startResult').append('<div class="item" onclick="displayInfo(\'' + searchVal + '\',' + lat + ',' + lng + ',\'start\')">' + '<i id="star'+ i +'" class="ion-ios-star-outline" style="float:right;color:#ffba49" onclick="favLocation(star'+ i + ')"></i>' + searchVal + '</div>');
                        }

                    }
                } else if (data.SearchResults.length == 2) {
                    //If data length == 2 means there is only 1 result
                    $('#startPoint').attr('data-val', data.SearchResults[1].SEARCHVAL);
                    $('#startPoint').attr('data-latlng', [data.SearchResults[1].Y, data.SearchResults[1].X]);
                } else {
                    //No results were found
                    $('#startResult').html("");
                    $('#startPoint').removeAttr("data-latlng");
                }
            });
        }
    });

    /**
    * Populate Search Results for End Point
    */
    $('#endPoint').keyup(function() {
        var input = $('#endPoint').val(),
        type = 'WGS84';
        var requestURL = 'http://www.onemap.sg/APIV2/services.svc/basicSearchV2?callback=?';
        $.getJSON(requestURL, {
            'token': token,
            'searchVal': input,
            'projSys': type,
        }, function(data) {
            $('#endResult').html("");
            //If data is length > 2 means there are multiple results
            if (data.SearchResults.length > 2) {
                var toLoopTill = searchLimit;
                if (data.SearchResults.length < 11) {
                    //if results were lesser than current searchLimit set
                    toLoopTill = data.SearchResults.length - 1;
                }
                for (var i = 1; i <= toLoopTill; i++) {
                    var searchVal = data.SearchResults[i].SEARCHVAL;
                    var lat = data.SearchResults[i].Y;
                    var lng = data.SearchResults[i].X;
                    if (searchVal != null) {
                        //Populate the results in the endResult div
                        $('#endResult').append('<div class="item" onclick="displayInfo(\'' + searchVal + '\',' + lat + ',' + lng + ',\'end\')">' + searchVal + '</div>');
                    }

                }
            } else if (data.SearchResults.length == 2) {
                //If data length == 2 means there is only 1 result
                $('#endPoint').attr('data-val', data.SearchResults[1].SEARCHVAL);
                $('#endPoint').attr('data-latlng', [data.SearchResults[1].Y, data.SearchResults[1].X]);
            } else {
                //No results were found
                $('#endResult').html("");
                $('#endPoint').removeAttr("data-latlng");
            }
        });
    });

    $scope.planRoute = function() {

        var startInput = document.getElementById("startPoint");
        var endInput = document.getElementById("endPoint");
        var startLatLng = startInput.getAttribute("data-latlng");
        var endLatLng = endInput.getAttribute("data-latlng");

        if (startLatLng != null && endLatLng != null) {
            startLatLng = startLatLng.split(",");
            endLatLng = endLatLng.split(",");

            var startPointName = startInput.getAttribute("data-val");
            if (startPointName == "Current Location") {
                startPointName = "Starting Location";
            }
            var endPointName = endInput.getAttribute("data-val");

            dataShare.data = {
                startLatLng: startLatLng,
                endLatLng: endLatLng,
                startPointName: startPointName,
                endPointName: endPointName,
                type: $scope.buttons[$scope.activeButton].text,
                oneMapToken: token
            }

            $state.go("planResult");

        } else {
            if (startLatLng == null && endLatLng == null) {
                $scope.showAlert();
            } else if (startLatLng == null) {
                $scope.showInvalidStartAlert();
            } else if (endLatLng == null) {
                $scope.showInvalidEndAlert();
            }
        }

    }

    /**
    * Calculate Route based on Start & End Points
    */

    // Invalid Start Point
    $scope.showAlert = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Invalid Start & End Points',
            template: 'Please select a valid start and end point.'
        });
        alertPopup.then(function(res) {});
    };


    // Invalid Start Point
    $scope.showInvalidStartAlert = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Invalid Start Point',
            template: 'Please select a valid start point and try again.'
        });
        alertPopup.then(function(res) {});
    };

    // Invalid End Point
    $scope.showInvalidEndAlert = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Invalid End Point',
            template: 'Please select a valid end point and try again.'
        });
        alertPopup.then(function(res) {});
    };

    $scope.buttons = [{icon: '', text: 'Shortest'}, {icon: '', text: 'Safest'}];
    $scope.activeButton = 0;
    $scope.setActiveButton = function(index) {
        $scope.activeButton = index;
    };

})

// var clickFavourite = false;

function displayInfo(searchVal, lat, lng, type) {
    $('#' + type + 'Point').val(searchVal);
    $('#' + type + 'Point').attr('data-val', searchVal);
    $('#' + type + 'Point').attr('data-latlng', [lat, lng]);
    $('#' + type + 'Result').html("");
    hasCurrentLocation = false;

    // if(!clickFavourite){
    //     $('#' + type + 'Point').val(searchVal);
    //     $('#' + type + 'Point').attr('data-val', searchVal);
    //     $('#' + type + 'Point').attr('data-latlng', [lat, lng]);
    //     $('#' + type + 'Result').html("");
    //     hasCurrentLocation = false;
    // }
    // clickFavourite = false;
}

// function favLocation(id){ //, lat, lng
//     clickFavourite = true;
//     if($(id).attr('class') == "ion-ios-star"){
//         //Unfavourite
//         $(id).attr('class', 'ion-ios-star-outline');
//     }else{
//         //Favourite
//         //Add to Database
//         localStorage.setItem("favourites", JSON.stringify([{name:"123"}]));
//         $(id).attr('class', 'ion-ios-star');
//     }
// }
