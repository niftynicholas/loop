angular.module('app.main.controllers')

.controller('signupCtrl', function($scope, $ionicLoading, $ionicPopup, $state, $http) {
    $scope.questions = [{
        question: "What was the last name of your primary three teacher?",
        id: 1
    }, {
        question: "What was the name of the boy/girl you had your second kiss with?",
        id: 2
    }, {
        question: "Where were you when you had your first alcoholic drink (or cigarette)?",
        id: 3
    }, {
        question: "What was the name of your second dog/cat/goldfish/etc?",
        id: 4
    }, {
        question: "Where were you when you had your first kiss?",
        id: 5
    }, {
        question: "When you were young, what did you want to be when you grew up?",
        id: 6
    }, {
        question: "Where were you New Year's 2000?",
        id: 7
    }, {
        question: "Who was your childhood hero?",
        id: 8
    }, {
        question: "Which phone number do you remember most from your childhood?",
        id: 9
    }];

    $scope.questions1 = $scope.questions.slice(0,3);
    $scope.questions2 = $scope.questions.slice(3,6);
    $scope.questions3 = $scope.questions.slice(6);

    $scope.input = {
        gender: "male",
    };

    $scope.selected1 = {
        question: $scope.questions[0].question
    }

    $scope.selected2 = {
        question: $scope.questions[3].question
    }

    $scope.selected3 = {
        question: $scope.questions[6].question
    }

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
            template: '<p>Loading...</p><ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner>'
        });
    };

    $scope.hide = function() {
        $ionicLoading.hide();
    };

    $scope.signup = function(form) {
        if (form.$valid) {
            $scope.show();
            $http({
                url: "https://sgcycling-sgloop.rhcloud.com/api/cyclist/account/signup",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    username: $scope.input.username,
                    password: $scope.input.password,
                    name: $scope.input.name,
                    email: $scope.input.email,
                    dateTimeStamp: new Date().getTime()
                }
            }).then(function successCallback(response) {
                $scope.hide();
                $state.go('verify');
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
