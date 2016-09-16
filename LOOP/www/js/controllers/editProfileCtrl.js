angular.module('app.main.controllers')

.controller('editProfileCtrl', function($scope, $state, $ionicHistory, $http, $timeout, $ionicPopup) {
    $scope.input = new Object();
    $scope.input.dateOfBirth = new Date(parseInt(localStorage.getItem("dateOfBirth")));
    $scope.genders = [{
        name: "Male",
        id: 1
    }, {
        name: "Female",
        id: 2
    }];
    if (localStorage.getItem("gender") === "Male") {
        $scope.input.gender = $scope.genders[0];
    } else {
        $scope.input.gender = $scope.genders[1];
    }
    $scope.input.name = localStorage.getItem("name");
    $scope.input.height = parseFloat(localStorage.getItem("height"));
    $scope.input.weight = parseFloat(localStorage.getItem("weight"));

    // $scope.numberPickerObject = {
    //     inputValue: 0, //Optional
    //     minValue: -9007199254740991,
    //     maxValue: 9007199254740991,
    //     precision: 3, //Optional
    //     decimalStep: 0.25, //Optional
    //     format: "DECIMAL", //Optional - "WHOLE" or "DECIMAL"
    //     titleLabel: 'Number Picker', //Optional
    //     setLabel: 'Set', //Optional
    //     closeLabel: 'Close', //Optional
    //     setButtonType: 'button-positive', //Optional
    //     closeButtonType: 'button-stable', //Optional
    //     callback: function(val) { //Mandatory
    //         console.log(val);
    //     }
    // };


    $scope.save = function() {
        if (parseFloat($scope.input.height) == 0 || parseFloat($scope.input.weight) == 0) {
            $scope.showAlert();
        } else {
            localStorage.setItem("name", $scope.input.name);
            localStorage.setItem("gender", $scope.input.gender.name);
            localStorage.setItem("dateOfBirth", new Date($scope.input.dateOfBirth).getTime());
            localStorage.setItem("height", $scope.input.height);
            localStorage.setItem("weight", $scope.input.weight);
            $http({
                url: "https://sgcycling-sgloop.rhcloud.com/api/cyclist/account/updateAccountDetails",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    token: localStorage.getItem("token"),
                    name: $scope.input.name,
                    gender: $scope.input.gender.name,
                    dateOfBirth: new Date($scope.input.dateOfBirth).getTime(),
                    height: $scope.input.height,
                    weight: $scope.input.weight,
                    dateTimeStamp: new Date().getTime()
                }
            }).then(function successCallback(response) {
                $state.go('tabsController.profile');
            }, function errorCallback(response) {
                alert("Error Updating Account Details");
                alert(JSON.stringify(response));
            });
        }
    }

    $scope.showAlert = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Opps!',
            template: 'We do not accept zero value for height/weight.'
        });
    };
})
