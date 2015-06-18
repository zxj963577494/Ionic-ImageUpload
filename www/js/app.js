// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ngCordova'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })
    .controller('TestsCtrl', ['$scope', '$ionicSlideBoxDelegate', '$ionicLoading','$cordovaCamera', function ($scope, $ionicSlideBoxDelegate, $ionicLoading,$cordovaCamera) {
        $scope.images = [
            'http://b.zol-img.com.cn/sjbizhi/images/8/750x530/1423205139299.jpg',
            'http://b.zol-img.com.cn/sjbizhi/images/8/750x530/1423205136134.jpg',
            'http://b.zol-img.com.cn/sjbizhi/images/8/750x530/1423205133173.jpg',
            'http://b.zol-img.com.cn/sjbizhi/images/8/750x530/1423205130655.jpg'
        ];

        // 使用相机拍照获取图片
        $scope.takePicture = function () {
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URL,
                sourceType: Camera.PictureSourceType.CAMERA/*,
                targetWidth: 600, //图片上传宽度
                targetHeight: 450 //图片上传高度*/
            };
            $cordovaCamera.getPicture(options).then(function (imageURI) {
                window.resolveLocalFileSystemURI(imageURI, function (fileEntry) {
                    $scope.picData = fileEntry.nativeURL;
                    $scope.ftLoad = true;
                });
            }, function (error) {
                $ionicLoading.show({template: 'Errore di caricamento...', duration: 3000});
            });
        };

        // 从图库中选择图片
        $scope.selectPicture = function () {
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY/*,
                targetWidth: 600, //图片上传宽度
                targetHeight: 450 //图片上传高度*/
            };

            $cordovaCamera.getPicture(options).then(
                function (imageURI) {
                    window.resolveLocalFileSystemURI(imageURI, function (fileEntry) {
                        $scope.picData = fileEntry.nativeURL;
                        $scope.ftLoad = true;
                    });
                },
                function (err) {
                    $ionicLoading.show({template: 'Errore di caricamento...', duration: 3000})
                }
            );
        };

        // 上传图片
        $scope.uploadPicture = function () {
            var fileURL = $scope.picData;
            var options = new FileUploadOptions();
            options.fileKey = "fileAddPic";
            options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
            options.mimeType = "image/jpeg";
            options.chunkedMode = false;
            var uri = encodeURI("http://api.fangshijie.cn/api/Common/ImgUpload");
            var ft = new FileTransfer();

            ft.upload(fileURL, uri, onSuccess, onFail, options);

            ft.onprogress = onProgress;
        }

        // 上传进度
        function onProgress(progressEvent) {
            if (progressEvent.lengthComputable) {
                var uploadProgress = (progressEvent.loaded / progressEvent.total) * 100;
                $ionicLoading.show({
                    template: "已经上传：" + Math.floor(uploadProgress) + "%"
                });
                if (uploadProgress > 99) {
                    $ionicLoading.hide();
                }
            } else {
                $ionicLoading.hide();
            }
        };

        // 上传失败
        function onFail(message) {
            if (message.indexOf('cancelled') < 0) {
                alert('出錯了：' + message);
            }
        }

        // 上传成功
        function onSuccess(msg) {
            /* msg.response是服务端返回的值，需要将字符串转为对象
            msg={"response":"{\"ReturnUrl"\:\"http://xxx.com/upload/modified.jpg\",\"Success\":true,\"Message\":\"上传成功\"}","responseCode:":200,"objectsId":"","bytesSent":16497}
            */
            var response = JSON.parse(msg.response);
            if (msg.responseCode == "200") {
                if (response.Success) {
                    $ionicLoading.show({
                        template: response.Message,
                        duration: 800
                    });
                    $scope.images.unshift(response.ReturnUrl);
                    $ionicSlideBoxDelegate.$getByHandle("theSlider").update();
                } else {
                    $ionicLoading.show({
                        template: response.Message,
                        duration: 1000
                    });
                }
            } else {
                $ionicLoading.show({
                    template: "通讯失败，上传失败",
                    duration: 1000
                });
            }
        }
    }]);