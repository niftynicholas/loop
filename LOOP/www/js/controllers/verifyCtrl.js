angular.module('app.main.controllers')

.controller('verifyCtrl', function($scope, $state, $http, $ionicPopup, $ionicLoading, $timeout, $ionicModal) {
    $scope.input = {};

    $scope.show = function() {
        $ionicLoading.show({
            template: '<p>Verifying...</p><ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner>'
        });
    };

    $scope.showResend = function() {
        $ionicLoading.show({
            template: '<p>Resending...</p><ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner>'
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

        });
    };

    // Modal to Resend Verification code
    $ionicModal.fromTemplateUrl('resend.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function() {
        $scope.modal.show();
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });

    $scope.resend = function(form) {
        if (form.$valid) {
            $scope.showResend();
            $http({
                url: "https://sgcycling-sgloop.rhcloud.com/api/cyclist/account/resendVerificationEmail",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    email: $scope.input.email,
                }
            }).then(function successCallback(response) {
                $scope.hide();
                $scope.resendSuccess();
            }, function errorCallback(response) {
                $scope.hide();
                $scope.resendFail();
            });
        }
    }

    // Verification Success
    $scope.resendSuccess = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Resend Success',
            template: 'The new verification has been sent to your email.'
        });

        alertPopup.then(function(res) {
            $scope.closeModal();
        });
    };

    // Verification Failure
    $scope.resendFail = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Resend Failed',
            template: 'The email you entered has not been registered or the account is already verified.'
        });

        alertPopup.then(function(res) {

        });
    };


})
