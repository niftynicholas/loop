angular.module('app.main.controllers')

.controller('editProfileCtrl', function($scope, $state, $ionicHistory, $http, $timeout, $ionicPopup, $ionicModal, CONSTANTS, $ionicLoading) {
    $scope.show = function() {
        $ionicLoading.show({
            template: '<p>Saving...</p><ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner>'
        });
    };

    $scope.hide = function() {
        $ionicLoading.hide();
    };

    $scope.input = {};
    $scope.input.height = parseFloat(localStorage.getItem("height")).toFixed(2);
    $scope.input.weight = parseFloat(localStorage.getItem("weight")).toFixed(2);
    var selectedIndex = localStorage.getItem("avatar");
    $scope.imgSrc = "../img/avatars/" + localStorage.getItem("avatar") + ".png";

    $scope.images = [];

    $scope.loadImages = function() {
        for (var i = 1; i <= 18; i++) {
            $scope.images.push({
                id: i,
                src: "../img/avatars/" + i + ".png"
            });
        }
    }

    $scope.select = function(index) {
        $scope.imgSrc = "../img/avatars/" + index + ".png";
        selectedIndex = index;
        $scope.closeModal();
    }

    $scope.save = function() {
        if (parseFloat($scope.input.height) == 0 || parseFloat($scope.input.weight) == 0) {
            $scope.showAlert();
        } else {
            $scope.show();
            $http({
                url: CONSTANTS.API_URL + "cyclist/account/updateAccountDetails",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    avatar: selectedIndex,
                    token: localStorage.getItem("token"),
                    height: $scope.input.height,
                    weight:  $scope.input.weight
                }
            }).then(function successCallback(response) {
                $scope.hide();
                localStorage.setItem("avatar", selectedIndex);
                localStorage.setItem("height", $scope.input.height);
                localStorage.setItem("weight", $scope.input.weight);
                $state.go("tabsController.profile");
            }, function errorCallback(response) {
                $scope.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'Opps!',
                    template: 'We are unable to edit your account details now. Please try again later.'
                });
            });
        }
    }

    $scope.showAlert = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Opps!',
            template: 'We do not accept zero value for height/weight.'
        });
    };

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
