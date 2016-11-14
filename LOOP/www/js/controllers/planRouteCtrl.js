angular.module('app.main.controllers')

.controller('planRouteCtrl', function($scope, leafletData, $http, $state, $ionicPopup, dataShare, sharedRoute, $cordovaGeolocation, CONSTANTS, $ionicLoading) {
    $scope.input = {};
    var token = "";
    var searchLimit = 10; //10 or more because has digit 0 to 9 for last digit in postal code

    /**
    * Ajax call to get token from OneMap
    */
    $ionicLoading.show({
        template: '<p>Loading...</p><ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner>'
    });

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

    $http({
        url: CONSTANTS.API_URL + "cyclist/route/getLocations",
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            token: localStorage.getItem("token")
        }
    }).then(function successCallback(response) {
        favourites = response.data.favouriteLocations;
        $ionicLoading.hide();
    }, function errorCallback(response) {
        // Invalid Start Point
        $ionicLoading.hide();
        $ionicPopup.alert({
            title: '<b>Error</b>',
            template: 'Unable to Load Favourite Locations'
        });
    });

    var delURL = CONSTANTS.API_URL + "cyclist/route/deleteLocation";
    var hasCurrentLocation = false;
    $('#startPoint').focus(function() {
        $('#endResult').html("");
        hasEndFavourite = false;
        var startPoint = $('#startPoint').val();
        if(!hasCurrentLocation && startPoint.length==0){
            hasCurrentLocation = true;
            if (dataShare.data != false && typeof(dataShare.getData().currentLocation.lat) != "undefined") {
                $('#startResult').append('<div class="item" onclick="displayInfo(\'' + "Current Location" + '\',' + dataShare.getData().currentLocation.lat + ',' + dataShare.getData().currentLocation.lng + ',\'start\')">' + '<i class="ion-android-locate" style="float:right;font-size:25px"></i>' + "Current Location" + '</div>');
                for(var i=0;i<favourites.length;i++){
                    $('#startResult').append('<div class="item" onclick="displayInfo(\'' + favourites[i].name + '\',' + favourites[i].lat +',' + favourites[i].lng + ', \'start\',' + favourites[i].fid +')">' + '<i class="ion-ios-star" style="float:right;color:#ffba49;font-size:25px" onclick="deleteLocation(\''+ favourites[i].fid +'\',\'' + delURL +'\', this)"></i>' + favourites[i].name + '</div>');
                }
            } else {
                $cordovaGeolocation.getCurrentPosition({
                    timeout: 3000,
                    enableHighAccuracy: true
                }).then(function(position) {
                    $('#startResult').append('<div class="item" onclick="displayInfo(\'' + "Current Location" + '\',' + position.coords.latitude + ',' + position.coords.longitude + ',\'start\')">' + '<i class="ion-android-locate" style="float:right;font-size:25px"></i>' + "Current Location" + '</div>');
                    for(var i=0;i<favourites.length;i++){
                        $('#startResult').append('<div class="item" onclick="displayInfo(\'' + favourites[i].name + '\',' + favourites[i].lat +',' + favourites[i].lng + ', \'start\',' + favourites[i].fid +')">' + '<i class="ion-ios-star" style="float:right;color:#ffba49;font-size:25px" onclick="deleteLocation(\''+ favourites[i].fid +'\',\'' + delURL +'\', this)"></i>' + favourites[i].name + '</div>');
                    }
                }, function(err) {
                    console.log("Location not found");
                });
            }
        }
    });

    var hasEndFavourite = false;
    $('#endPoint').focus(function() {
        var endPoint = $('#endPoint').val();
        if(!hasEndFavourite && endPoint.length==0){
            hasEndFavourite = true;
            for(var i=0;i<favourites.length;i++){
                $('#endResult').append('<div class="item" onclick="displayInfo(\'' + favourites[i].name + '\',' + favourites[i].lat +',' + favourites[i].lng + ', \'end\',' + favourites[i].fid +')">' + '<i class="ion-ios-star" style="float:right;color:#ffba49;font-size:25px" onclick="deleteLocation(\''+ favourites[i].fid +'\',\'' + delURL +'\', this)"></i>' + favourites[i].name + '</div>');
            }
        }
    });


    /**
    * Populate Search Results for Start Point
    */

    $('#startPoint').keyup(function() {

        hasCurrentLocation = false;
        var input = $('#startPoint').val();
        //To add Home / Office for Advanced Navigation Module
        document.getElementById("startResult").innerHTML = "";
        if (input.length == 0) {
            hasCurrentLocation = true;
            if (dataShare.data != false && typeof(dataShare.getData().currentLocation.lat) != "undefined") {
                $('#startResult').append('<div class="item" onclick="displayInfo(\'' + "Current Location" + '\',' + dataShare.getData().currentLocation.lat + ',' + dataShare.getData().currentLocation.lng + ',\'start\')">' + '<i class="ion-android-locate" style="float:right;font-size:25px"></i>' + "Current Location" + '</div>');
                for(var i=0;i<favourites.length;i++){
                    $('#startResult').append('<div class="item" onclick="displayInfo(\'' + favourites[i].name + '\',' + favourites[i].lat +',' + favourites[i].lng + ', \'start\',' + favourites[i].fid +')">' + '<i class="ion-ios-star" style="float:right;color:#ffba49;font-size:25px" onclick="deleteLocation(\''+ favourites[i].fid +'\',\'' + delURL +'\', this)"></i>' + favourites[i].name + '</div>');
                }
            } else {
                $cordovaGeolocation.getCurrentPosition({
                    timeout: 3000,
                    enableHighAccuracy: true
                }).then(function(position) {
                    $('#startResult').append('<div class="item" onclick="displayInfo(\'' + "Current Location" + '\',' + position.coords.latitude + ',' + position.coords.longitude + ',\'start\')">' + '<i class="ion-android-locate" style="float:right;font-size:25px"></i>' + "Current Location" + '</div>');
                    for(var i=0;i<favourites.length;i++){
                        $('#startResult').append('<div class="item" onclick="displayInfo(\'' + favourites[i].name + '\',' + favourites[i].lat +',' + favourites[i].lng + ', \'start\',' + favourites[i].fid +')">' + '<i class="ion-ios-star" style="float:right;color:#ffba49;font-size:25px" onclick="deleteLocation(\''+ favourites[i].fid +'\',\'' + delURL +'\', this)"></i>' + favourites[i].name + '</div>');
                    }
                }, function(err) {
                    console.log("Location not found");
                });
            }
        } else {
            // $("#startCross").attr("style","margin-right:5px");
            var type = 'WGS84';
            var requestURL = 'http://www.onemap.sg/APIV2/services.svc/basicSearchV2?callback=?';
            $.getJSON(requestURL, {
                'token': token,
                'searchVal': input,
                'projSys': type,
            }, function(data) {
                //If data is length > 2 means there are multiple results
                if (data.SearchResults.length > 2) {
                    var toLoopTill = searchLimit;
                    if (data.SearchResults.length < 11) {
                        //if results were lesser than current searchLimit set
                        toLoopTill = data.SearchResults.length - 1;
                    }
                    for (var i = 1; i <= toLoopTill; i++) {
                        var searchVal = data.SearchResults[i].SEARCHVAL;
                        searchVal = searchVal.replace(new RegExp("'",'g'), "&#8217");
                        searchVal = searchVal.replace(new RegExp("&#X27;",'g'), "&#8217");
                        var lat = data.SearchResults[i].Y;
                        var lng = data.SearchResults[i].X;
                        if (searchVal != null) {
                            var url = CONSTANTS.API_URL;
                            var isFavourite = false;
                            for(var j=0;j<favourites.length;j++){
                                if(searchVal == favourites[j].name){
                                    $('#startResult').append('<div class="item" onclick="displayInfo(\'' + searchVal + '\',' + lat + ',' + lng + ',\'start\',' + favourites[j].fid + ')">' + '<i id="star'+ i +'" class="ion-ios-star" style="float:right;color:#ffba49;font-size:25px" onclick="favLocation(star'+ i + ',\'' + searchVal + '\',' + lat + ',' + lng + ',\'' + url + '\',' + favourites[j].fid + ')"></i>' + searchVal + '</div>');
                                    isFavourite = true;
                                    j = favourites.length;
                                }
                            }
                            if(!isFavourite){
                                $('#startResult').append('<div class="item" onclick="displayInfo(\'' + searchVal + '\',' + lat + ',' + lng + ',\'start\')">' + '<i id="star'+ i +'" class="ion-ios-star-outline" style="float:right;color:#ffba49;font-size:25px" onclick="favLocation(star'+ i + ',\'' + searchVal + '\',' + lat + ',' + lng + ',\'' + url + '\',\'blank\')"></i>' + searchVal + '</div>');
                            }
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
        hasEndFavourite = false;
        var input = $('#endPoint').val();
        document.getElementById("endResult").innerHTML = "";
        if(input.length == 0){
            hasEndFavourite = true;
            for(var i=0;i<favourites.length;i++){
                $('#endResult').append('<div class="item" onclick="displayInfo(\'' + favourites[i].name + '\',' + favourites[i].lat +',' + favourites[i].lng + ', \'end\',' + favourites[i].fid +')">' + '<i class="ion-ios-star" style="float:right;color:#ffba49;font-size:25px" onclick="deleteLocation(\''+ favourites[i].fid +'\',\'' + delURL +'\', this)"></i>' + favourites[i].name + '</div>');
            }
        } else {
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
                        searchVal = searchVal.replace(new RegExp("'",'g'), "&#8217");
                        searchVal = searchVal.replace(new RegExp("&#X27;",'g'), "&#8217");
                        var lat = data.SearchResults[i].Y;
                        var lng = data.SearchResults[i].X;
                        if (searchVal != null) {
                            var url = CONSTANTS.API_URL;
                            var isFavourite = false;
                            for(var j=0;j<favourites.length;j++){
                                if(searchVal == favourites[j].name){
                                    $('#endResult').append('<div class="item" onclick="displayInfo(\'' + searchVal + '\',' + lat + ',' + lng + ',\'end\',' + favourites[j].fid + ')">' + '<i id="star'+ i +'" class="ion-ios-star" style="float:right;color:#ffba49;font-size:25px" onclick="favLocation(star'+ i + ',\'' + searchVal + '\',' + lat + ',' + lng + ',\'' + url + '\',' + favourites[j].fid + ')"></i>' + searchVal + '</div>');
                                    isFavourite = true;
                                    j = favourites.length;
                                }
                            }
                            if(!isFavourite){
                                $('#endResult').append('<div class="item" onclick="displayInfo(\'' + searchVal + '\',' + lat + ',' + lng + ',\'end\')">' + '<i id="star'+ i +'" class="ion-ios-star-outline" style="float:right;color:#ffba49;font-size:25px" onclick="favLocation(star'+ i + ',\'' + searchVal + '\',' + lat + ',' + lng + ',\'' + url + '\',\'blank\')"></i>' + searchVal + '</div>');
                            }
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
        }
    });

    $scope.planRoute = function() {

        var startInput = document.getElementById("startPoint");
        var endInput = document.getElementById("endPoint");
        var startLatLng = startInput.getAttribute("data-latlng");
        var endLatLng = endInput.getAttribute("data-latlng");
        // var startFID = startInput.getAttribute("data-fid"); to get favourite ID
        // var endFID = endInput.getAttribute("data-fid");

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

var clickFavourite = false;
var favourites = [];

function displayInfo(searchVal, lat, lng, type, fid) {

    if(!clickFavourite){
        $('#' + type + 'Point').val(searchVal);
        $('#' + type + 'Point').attr('data-val', searchVal);
        $('#' + type + 'Point').attr('data-latlng', [lat, lng]);
        $('#' + type + 'Result').html("");
        if(typeof fid !== "undefined"){
            $('#' + type + 'Point').attr('data-fid', fid);
        }
        hasCurrentLocation = false;
    }
    clickFavourite = false;
}

function deleteLocation(fid, url, dom){
    clickFavourite = true;
    dom.parentNode.remove();
    $.ajax({
        type: "POST",
        dataType: 'json',
        contentType: 'application/json', // This is the money shot
        url: url,
        data: JSON.stringify({
            token: localStorage.getItem("token"),
            fid: fid
        }),
        success: function(data) {
            for(var i = 0; i < favourites.length; i++) {
                if(favourites[i].fid == fid) {
                    favourites.splice(i, 1);
                    break;
                }
            }
        }
    });
}

function favLocation(id, searchVal, lat, lng, url, fid){ //, lat, lng
    clickFavourite = true;
    if($(id).attr('class') == "ion-ios-star"){
        //Unfavourite
        var unfavURL = url + "cyclist/route/deleteLocation";
        if(fid == "blank"){
            fid = $(id).data("fid").fid;
        }
        $.ajax({
            type: "POST",
            dataType: 'json',
            contentType: 'application/json', // This is the money shot
            url: unfavURL,
            data: JSON.stringify({
                token: localStorage.getItem("token"),
                fid: fid
            }),
            success: function(data) {
                for(var i = 0; i < favourites.length; i++) {
                    if(favourites[i].fid == fid) {
                        favourites.splice(i, 1);
                        break;
                    }
                }
            }
        });
        $(id).attr('class', 'ion-ios-star-outline');
    }else{
        //Favourite
        var favURL = url + "cyclist/route/saveLocation";
        $.ajax({
            type: "POST",
            dataType: 'json',
            contentType: 'application/json',
            url: favURL,
            data: JSON.stringify({
                token: localStorage.getItem("token"),
                dateTimeStamp: new Date().getTime(),
                coordinates: {lat: lat, lng: lng},
                name: searchVal
            }),
            success: function(data) {
                favourites.push({
                    name: searchVal,
                    fid: data.fid
                });
                $(id).data("fid", {fid: data.fid});
            }
        });
        $(id).attr('class', 'ion-ios-star');
    }
}
