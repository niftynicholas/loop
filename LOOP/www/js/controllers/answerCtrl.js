angular.module('app.main.controllers')

.controller('answerCtrl', function($scope, $ionicLoading, $state, $http, $ionicPopup, dataShare, shareUsername, CONSTANTS) {
    $scope.input = {};
    $scope.questions = dataShare.getData();

    $scope.show = function() {
        $ionicLoading.show({
            template: '<p>Verifying...</p><ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner>'
        });
    };

    $scope.hide = function() {
        $ionicLoading.hide();
    };

    $scope.answer = function(form) {
            if (form.$valid) {
                $scope.show();
                $http({
                    url: CONSTANTS.API_URL + "cyclist/account/authenticateSecurityQuestions",
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: {
                        username: shareUsername.getData(),
                        securityQuestions: [{
                            no: $scope.questions[0].no,
                            answer: $scope.input.ans1
                        }, {
                            no: $scope.questions[1].no,
                            answer: $scope.input.ans2
                        }, {
                            no: $scope.questions[2].no,
                            answer: $scope.input.ans3
                        }]
                    }
                }).then(function successCallback(response) {
                    $scope.hide();
                    dataShare.sendData(response.data.token);
                    $state.go("resetPassword");
                }, function errorCallback(response) {
                    $scope.hide();
                    var alertPopup = $ionicPopup.alert({
                        title: 'Incorrect Answer(s)',
                        template: 'You have entered one or more incorrect answers. Please try again.'
                    });

                    alertPopup.then(function(res) {

                    });
                });
            }
        }
})
