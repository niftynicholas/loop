angular.module('app.main.controllers')

.controller('signupCtrl', function($scope, $ionicLoading, $ionicPopup, $state, $http, CONSTANTS, securityQnsData) {
    $scope.availabilityAPI = CONSTANTS.API_URL + "cyclist/account/checkUsernameAvailability";
    $scope.questions = securityQnsData.getData();
    $scope.questions1 = $scope.questions.slice(0, 3);
    $scope.questions2 = $scope.questions.slice(3, 6);
    $scope.questions3 = $scope.questions.slice(6);

    $scope.input = {
        gender: "Male",
    };

    $scope.selected1 = $scope.questions[0];
    $scope.selected2 = $scope.questions[3];
    $scope.selected3 = $scope.questions[6];

    $scope.type = "password";

    $scope.toggleVisibility = function() {
        if ($scope.type == "password") {
            $scope.type = "text";
        } else if ($scope.type == "text") {
            $scope.type = "password";
        }
    }

    $scope.show = function() {
        $ionicLoading.show({
            template: '<p>Signing Up...</p><ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner>'
        });
    };

    $scope.hide = function() {
        $ionicLoading.hide();
    };

    $scope.signup = function(form) {
        if (form.$valid) {
            $scope.show();
            $http({
                url: CONSTANTS.API_URL + "cyclist/account/signup",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    username: $scope.input.username,
                    password: $scope.input.password,
                    gender: $scope.input.gender,
                    dateOfBirth: new Date($scope.input.birthDate).getTime(),
                    dateTimeStamp: new Date().getTime(),
                    securityQuestions: [{
                        no: $scope.selected1.no,
                        answer: $scope.input.ans1
                    }, {
                        no: $scope.selected2.no,
                        answer: $scope.input.ans2
                    }, {
                        no: $scope.selected3.no,
                        answer: $scope.input.ans3
                    }]
                }
            }).then(function successCallback(response) {
                $scope.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'Sign Up Successful',
                    template: 'You may now proceed to login'
                });

                alertPopup.then(function(res) {
                    $state.go('login');
                });
            }, function errorCallback(response) {
                $scope.hide();
                $scope.showAlert();
            });
        }
    }

    // Invalid Sign Up Details
    $scope.showAlert = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Sign Up Failed',
            template: 'You have provided invalid details. Please try again.'
        });

        alertPopup.then(function(res) {

        });
    };
})
