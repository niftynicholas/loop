angular.module('app.main.controllers')

.controller('profileCtrl', function($scope, $state, $timeout, $ionicLoading, $ionicHistory, $window, $http, $ionicModal, CONSTANTS, $http) {
    $scope.show = function() {
        $ionicLoading.show({
            template: '<p>Changing...</p><ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner>'
        });
    };

    $scope.hide = function() {
        $ionicLoading.hide();
    };

    $scope.weight = parseFloat(localStorage.getItem("weight")).toFixed(2);
    $scope.height = parseFloat(localStorage.getItem("height")).toFixed(2);
    $scope.totalCalories = parseFloat(localStorage.getItem("totalCalories"));
    $scope.numActivities = parseInt(localStorage.getItem("numActivities"));
    $scope.username = localStorage.getItem("username");
    $scope.profilePicture = 'img/avatars/' + localStorage.getItem("avatar") + ".png";

    $scope.logOut = function() {
        $ionicLoading.show({
            template: '<p>Logging Out...</p><ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner>'
        });

        $timeout(function() {
            localStorage.setItem('login_state', 'false');
            localStorage.clear();
            $window.localStorage.clear();
            $ionicLoading.hide();
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();
            $ionicHistory.nextViewOptions({
                disableBack: true,
                historyRoot: true
            });
            $state.go('landing');
        }, 2000);
    }

    $scope.images = [];

    $scope.loadImages = function() {
        for (var i = 1; i <= 18; i++) {
            $scope.images.push({
                id: i,
                src: "img/avatars/" + i + ".png"
            });
        }
    }

    $scope.select = function(index) {
        $scope.show();
        $http({
            url: CONSTANTS.API_URL + "cyclist/account/updateAccountDetails",
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                avatar: index,
                token: localStorage.getItem("token"),
                height: localStorage.getItem("height"),
                weight: localStorage.getItem("weight")
            }
        }).then(function successCallback(response) {

            $http({
                url: CONSTANTS.API_URL + "cyclist/route/getPopularRoutes",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    token: localStorage.getItem("token")
                }
            }).then(function successCallback(response) {
                    localStorage.setItem("popularRoutes", JSON.stringify(response.data.popularRoutes));
                    $http({
                        url: CONSTANTS.API_URL + "cyclist/route/getUserRoutes",
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: {
                            token: localStorage.getItem("token")
                        }
                    }).then(function successCallback(response) {
                            localStorage.setItem("userRoutes", JSON.stringify(response.data.userRoutes));
                            $http({
                                url: CONSTANTS.API_URL + "cyclist/route/getBookmarkedRoutes",
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                data: {
                                    token: localStorage.getItem("token")
                                }
                            }).then(function successCallback(response) {
                                    localStorage.setItem("bookmarkedRoutes", JSON.stringify(response.data.bookmarkedRoutes));
                                    $scope.closeModal();
                                    $scope.profilePicture = "img/avatars/" + index + ".png";
                                    localStorage.setItem("avatar", index);
                                    $scope.hide();
                                },
                                function errorCallback(response) {
                                    $scope.hide();
                                    var alertPopup = $ionicPopup.alert({
                                        title: 'Opps!',
                                        template: 'The server is currently busy. Please try again later. Sorry for any inconvenience caused.'
                                    });
                                });
                        },
                        function errorCallback(response) {
                            $scope.hide();
                            var alertPopup = $ionicPopup.alert({
                                title: 'Opps!',
                                template: 'The server is currently busy. Please try again later. Sorry for any inconvenience caused.'
                            });
                        });
                },
                function errorCallback(response) {
                    $scope.hide();
                    var alertPopup = $ionicPopup.alert({
                        title: 'Opps!',
                        template: 'The server is currently busy. Please try again later. Sorry for any inconvenience caused.'
                    });
                });
        }, function errorCallback(response) {
            var alertPopup = $ionicPopup.alert({
                title: 'Opps!',
                template: 'The server is currently busy. Please try again later. Sorry for any inconvenience caused.'
            });
        });
    }

    $ionicModal.fromTemplateUrl('my-modal.html', {
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
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
        // Execute action
    });
})
