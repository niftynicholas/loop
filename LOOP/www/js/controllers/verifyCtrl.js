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
            url: "https://sgcycling-sgloop.rhcloud.com/api/cyclist/account/verify2",
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                verificationCode: $scope.passcode
            }
        }).then(function successCallback(response) {
            $scope.hide();
            $scope.success(response);
        }, function errorCallback(response) {
            $scope.hide();
            $scope.fail();
        });
    };

    // Verification Success
    $scope.success = function(response) {
        var alertPopup = $ionicPopup.alert({
            title: 'Verification Success',
            template: 'You have successfully verified your account. We will log you in now.'
        });

        alertPopup.then(function(res) {
            $ionicLoading.show({
                template: '<p>Logging In...</p><ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner>'
            });
            localStorage.setItem("login_state", "true");
            localStorage.setItem("token", response.data.user.token);
            localStorage.setItem("dateOfBirth", response.data.user.dateOfBirth);
            localStorage.setItem("email", response.data.user.email);
            localStorage.setItem("height", response.data.user.height);
            localStorage.setItem("name", response.data.user.name);
            localStorage.setItem("username", response.data.user.username);
            localStorage.setItem("weight", response.data.user.weight);
            localStorage.setItem("gender", response.data.user.gender);
            localStorage.setItem("uid", response.data.user.uid);
            localStorage.setItem("numActivities", response.data.user.numActivities);
            localStorage.setItem("totalCalories", response.data.user.totalCalories);
            localStorage.setItem("avgCalories", response.data.user.avgCalories);
            localStorage.setItem("popularRoutes", JSON.stringify(response.data.popularRoutes));
            localStorage.setItem("bookmarkedRoutes", JSON.stringify(response.data.bookmarkedRoutes));
            localStorage.setItem("userRoutes", JSON.stringify(response.data.userRoutes));
            localStorage.setItem("profilePictures", JSON.stringify(response.data.profilePictures));
            $scope.hide();
            $state.go('tabsController.home');
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
