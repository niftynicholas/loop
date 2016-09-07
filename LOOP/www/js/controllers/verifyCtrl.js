angular.module('app.main.controllers')

.controller('verifyCtrl', function($scope, $state, $http, $ionicPopup, $ionicLoading, $timeout) {
    $scope.show = function() {
        $ionicLoading.show({
            template: '<p>Verifying...</p><ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner>'
        });
    };

    $scope.hide = function() {
        $ionicLoading.hide();
    };

    $scope.init = function() {
        $scope.passcode = "";
    };


    $scope.add = function(value) {
        if ($scope.passcode.length < 4) {
            $scope.passcode = $scope.passcode + value;
            if ($scope.passcode.length == 4) {
                $timeout(function() {
                    console.log("The four digit code was entered");
                }, 500);
            }
        }
    };

    $scope.delete = function() {
        if ($scope.passcode.length > 0) {
            $scope.passcode = $scope.passcode.substring(0, $scope.passcode.length - 1);
        }
    };

    $scope.verify = function() {
        $scope.show();
        $http({
            url: "https://sgcycling-sgloop.rhcloud.com/api/cyclist/account/verify",
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                verificationCode: $scope.passcode
            }
        }).then(function successCallback(response) {
            $scope.hide();
            $scope.success();
        }, function errorCallback(response) {
            $scope.hide();
            $scope.fail();
        });
    };

    // Verification Success
    $scope.success = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Verification Success',
            template: 'You have successfully verified your account. You may proceed to login.'
        });

        alertPopup.then(function(res) {
            $state.go("login");
        });
    };

    // Verification Failure
    $scope.fail = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Verification Failed',
            template: 'You have entered an invalid verification code. Please check your email and try again.'
        });

        alertPopup.then(function(res) {
            console.log('Thank you for not eating my delicious ice cream cone');
        });
    };
})
