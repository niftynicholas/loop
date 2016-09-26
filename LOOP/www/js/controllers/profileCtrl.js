angular.module('app.main.controllers')

.controller('profileCtrl', function($scope, $state, $timeout, $ionicLoading, $ionicHistory, $window, $cordovaCamera, $cordovaFile, $ionicActionSheet, $cordovaImagePicker, $ionicPlatform, $ionicModal, $jrCrop, $http) {
    $scope.height = Math.round(parseFloat(localStorage.getItem("height")));
    $scope.totalCalories = parseFloat(localStorage.getItem("totalCalories"));
    $scope.numActivities = parseInt(localStorage.getItem("numActivities"));

    if (isNaN($scope.height)) {
        $scope.height = 0;
    }
    $scope.weight = parseFloat(localStorage.getItem("weight")).toFixed(2);
    if (isNaN($scope.weight)) {
        $scope.weight = 0;
    }

    $scope.name = localStorage.getItem("name");
    $scope.uid = localStorage.getItem("uid");
    $scope.profilePictures = JSON.parse(localStorage.getItem("profilePictures"));
    $scope.profilePicture = $scope.profilePictures[$scope.uid];

    if ($scope.profilePicture == "null") {
        $scope.profilePicture = 'img/profile-placeholder.gif';
    }

    $scope.logOut = function() {
        $ionicLoading.show({
            template: '<p>Logging Out...</p><ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner>'
        });

        $timeout(function() {
            localStorage.setItem('loggin_state', 'false');
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

    // This is to display the action sheet
    $scope.show = function() {
        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
            buttons: [{
                text: 'Take A Photo'
            }, {
                text: 'Choose From Gallery'
            }],
            titleText: 'Upload Profile Photo',
            cancelText: 'Cancel',
            cancel: function() {},
            buttonClicked: function(index) {
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
        var options = {
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA, // Camera.PictureSourceType.PHOTOLIBRARY
            allowEdit: false,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
            correctOrientation: true,
            saveToPhotoAlbum: true,
            targetWidth: 800,
            targetHeight: 800,
            quality: 50
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {
            onImageSuccess(imageData);

            function onImageSuccess(fileURI) {
                createFileEntry(fileURI);
            }

            function createFileEntry(fileURI) {
                window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
            }

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

            function onCopySuccess(entry) {
                $scope.$apply(function() {
                    // $scope.images = [];
                    // $scope.images.push(entry.nativeURL);
                    // $scope.crop($scope.images[0]);
                    $scope.crop(entry.nativeURL);
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

    // This is to upload from Gallery
    $scope.collection = {
        selectedImage: ''
    };

    $ionicPlatform.ready(function() {

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
                    quality: 50 // Higher is better
                };

                $cordovaImagePicker.getPictures(options).then(function(results) {
                    for (var i = 0; i < results.length; i++) {
                        var imageData = results[i];
                    }

                    onImageSuccess(imageData);

                    function onImageSuccess(fileURI) {
                        createFileEntry(fileURI);
                    }

                    function createFileEntry(fileURI) {
                        window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
                    }

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

                    function onCopySuccess(entry) {
                        $scope.$apply(function() {
                            $scope.crop(entry.nativeURL);
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
            };
        });
    });

    // For cropping
    $scope.crop = function(image) {
        $jrCrop.crop({
            url: image,
            width: 160,
            height: 160,
            circle: true
        }).then(function(canvas) {
            dataURL = canvas.toDataURL("image/jpeg", 0.5);

            profilePhoto = document.createElement('img');
            profilePhoto.src = dataURL;
            localStorage.setItem("profilePicture", dataURL);
            $scope.profilePicture = dataURL;

            // Style your image here
            profilePhoto.style.width = '100px';
            profilePhoto.style.height = '100px';
            profilePhoto.style.borderRadius = '100%';

            // After you are done styling it, append it to the BODY element
            var element;
            element = document.getElementById("profilephoto");
            if (element) {
                element.innerHTML = "";
            }
            document.querySelector('.cropped-photo').appendChild(profilePhoto);

            $scope.profilePictures[$scope.uid] = $scope.profilePicture;
            localStorage.setItem("profilePictures", $scope.profilePictures);

            $http({
                url: "https://sgcycling-sgloop.rhcloud.com/api/cyclist/account/uploadProfilePicture",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    image: dataURL,
                    token: localStorage.getItem("token")
                }
            }).then(function successCallback(response) {

            }, function errorCallback(response) {});
        }, function() {
            // User canceled or couldn't load image.
        });
    };

    // For displaying the image
    $scope.urlForImage = function(imageName) {
        var name = imageName.substr(imageName.lastIndexOf('/') + 1);
        var trueOrigin = cordova.file.dataDirectory + name;
        return trueOrigin;
    }
})
