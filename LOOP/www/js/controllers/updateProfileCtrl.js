angular.module('app.main.controllers')

.controller('updateProfileCtrl', function($scope, $ionicLoading, $state, $http, $ionicPopup, CONSTANTS, shareUsername, sharePassword, securityQnsData, shareToken) {
    $scope.show = function() {
        $ionicLoading.show({
            template: '<p>Loading...</p><ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner>'
        });
    };

    $scope.hide = function() {
        $ionicLoading.hide();
    };

    $scope.questions = securityQnsData.getData();
    $scope.questions1 = $scope.questions.slice(0, 3);
    $scope.questions2 = $scope.questions.slice(3, 6);
    $scope.questions3 = $scope.questions.slice(6);

    $scope.input = {};

    $scope.selected1 = $scope.questions[0];
    $scope.selected2 = $scope.questions[3];
    $scope.selected3 = $scope.questions[6];

    $scope.update = function(form) {
        if (form.$valid) {
            // update

            // sgcycling-ywk93/api/cyclist/account/existingUsersUpdateQuestions
            // token
            // gender
            // dateOfBirth
            // securityQuestions[{answer:<ans>, no:<no>}]
            $scope.show();
            $http({
                url: CONSTANTS.API_URL + "cyclist/account/existingUsersUpdateQuestions",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    token: shareToken.getData(),
                    gender: $scope.input.gender,
                    dateOfBirth: new Date($scope.input.birthDate).getTime(),
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
                $ionicLoading.show({
                    template: '<p>Logging In...</p><ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner>'
                });
                var appleVersion = "";
                var androidVersion = "";
                console.log("Running on " + ionic.Platform.platform());
                var isIOS = ionic.Platform.isIOS();
                var isAndroid = ionic.Platform.isAndroid();
                var isWebView = ionic.Platform.isWebView();

                if (isIOS) {
                    appleVersion = CONSTANTS.VERSION;
                } else if (isAndroid) {
                    androidVersion = CONSTANTS.VERSION;
                } else {
                    androidVersion = CONSTANTS.VERSION;
                }
                $http({
                    url: CONSTANTS.API_URL + "cyclist/account/login",
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: {
                        appleVersion: appleVersion,
                        androidVersion: androidVersion,
                        username: shareUsername.getData(),
                        password: sharePassword.getData()
                    }
                }).then(function successCallback(response) {
                        localStorage.setItem("login_state", "true");
                        localStorage.setItem("avatar", response.data.user.avatar);
                        localStorage.setItem("avgCalories", response.data.user.avgCalories);
                        localStorage.setItem("dateOfBirth", response.data.user.dateOfBirth);
                        localStorage.setItem("gender", response.data.user.gender);
                        localStorage.setItem("height", response.data.user.height);
                        localStorage.setItem("numActivities", response.data.user.numActivities);
                        localStorage.setItem("token", response.data.user.token);
                        localStorage.setItem("totalCalories", response.data.user.totalCalories);
                        localStorage.setItem("username", response.data.user.username);
                        localStorage.setItem("weight", response.data.user.weight);
                        localStorage.setItem("popularRoutes", JSON.stringify(response.data.popularRoutes));
                        localStorage.setItem("bookmarkedRoutes", JSON.stringify(response.data.bookmarkedRoutes));
                        localStorage.setItem("userRoutes", JSON.stringify(response.data.userRoutes));
                        localStorage.setItem("geotagCategories", JSON.stringify(response.data.geotagCategories));
                        $ionicLoading.hide();
                        $state.go('tabsController.home');
                    },
                    function errorCallback(response) {
                        $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                            title: 'Login Failed',
                            template: 'Sorry. Something went wrong with the server. Please try again later.'
                        });

                        alertPopup.then(function(res) {

                        });
                    });
            }, function errorCallback(response) {
                $scope.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'Opps!',
                    template: 'Something went wrong with the server. Please try again later.'
                });

                alertPopup.then(function(res) {

                });
            });
        }
    }
})
