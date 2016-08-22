angular.module('app.main.controllers')

.controller('profileCtrl', function($scope, $state, $timeout, $ionicLoading, $ionicHistory, $window, $cordovaCamera, $cordovaFile, $ionicActionSheet, $cordovaImagePicker, $ionicPlatform) {
    //console.log("reading height and weight in the profile page");
    //console.log("height is now " + localStorage.getItem("height"));
    $scope.height = parseFloat(localStorage.getItem("height"));
    if (isNaN($scope.height)) {
        $scope.height = 0;
    }
    $scope.weight = parseFloat(localStorage.getItem("weight"));
    if (isNaN($scope.weight)) {
        $scope.weight = 0;
    }
    $scope.name = localStorage.getItem("name");

    $scope.logOut = function() {
        $ionicLoading.show({
            template: '<p>Logging Out...</p><ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner>'
        });
        localStorage.setItem('loggin_state', 'false');

        $timeout(function() {
            $window.localStorage.clear();
            $ionicLoading.hide();
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();
            $ionicHistory.nextViewOptions({
                disableBack: true,
                historyRoot: true
            });
            $state.go('login');
        }, 30);
    }

    // This is to display the action sheet
    $scope.show = function() {
        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
            buttons: [{
                text: 'Take A Photo'
            }, {
                text: 'Choose From Gallery'
            }],
            titleText: 'Upload profile photo',
            cancelText: 'Cancel',
            cancel: function() {
                console.log("User tapped on cancel.")
            },
            buttonClicked: function(index) {
                console.log(index);
                if (index == 0) {
                    $scope.addImage();
                } else if (index == 1) {
                    $scope.upload();
                }
                return true;
            }
        });
    };


    // This is to upload by taking photo
    // https://devdactic.com/how-to-capture-and-store-images-with-ionic/
    $scope.images = [];

    $scope.addImage = function() {
        // 2
        var options = {
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA, // Camera.PictureSourceType.PHOTOLIBRARY
            allowEdit: false,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
        };

        // 3
        $cordovaCamera.getPicture(options).then(function(imageData) {

            // 4
            onImageSuccess(imageData);

            function onImageSuccess(fileURI) {
                createFileEntry(fileURI);
            }

            function createFileEntry(fileURI) {
                window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
            }

            // 5
            function copyFile(fileEntry) {
                var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
                var newName = makeid() + name;

                window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
                        fileEntry.copyTo(
                            fileSystem2,
                            newName,
                            onCopySuccess,
                            fail
                        );
                    },
                    fail);
            }

            // 6
            function onCopySuccess(entry) {
                $scope.$apply(function() {
                    $scope.images.push(entry.nativeURL);
                });
            }

            function fail(error) {
                console.log("fail: " + error.code);
            }

            function makeid() {
                var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                for (var i = 0; i < 5; i++) {
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                return text;
            }

        }, function(err) {
            console.log(err);
        });
    }

    $scope.urlForImage = function(imageName) {
        var name = imageName.substr(imageName.lastIndexOf('/') + 1);
        var trueOrigin = cordova.file.dataDirectory + name;
        return trueOrigin;
    }

    // This is to upload from Gallery
    $scope.collection = {
        selectedImage: ''
    };

    $ionicPlatform.ready(function() {

        $scope.upload = function() {
            // Image picker will load images according to these settings
            var options = {
                maximumImagesCount: 1, // Max number of selected images, I'm using only one for this example
                width: 800,
                height: 800,
                quality: 80 // Higher is better
            };

            $cordovaImagePicker.getPictures(options).then(function(results) {
                // Loop through acquired images
                for (var i = 0; i < results.length; i++) {
                    $scope.collection.selectedImage = results[i]; // We loading only one image so we can use it like this

                    window.plugins.Base64.encodeFile($scope.collection.selectedImage, function(base64) { // Encode URI to Base64 needed for contacts plugin
                        $scope.collection.selectedImage = base64;
                        $scope.$apply(function() {
                            $scope.images.push($scope.collection.selectedImage);
                        });
                    });
                }
            }, function(error) {
                console.log('Error: ' + JSON.stringify(error)); // In case of error
            });
        };

    });
})
