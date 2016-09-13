angular.module('app.directives', []);

app.directive('recordAvailabilityValidator', ['$http', function($http) {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            var apiUrl = attrs.recordAvailabilityValidator;

            function setAsLoading(bool) {
                ngModel.$setValidity('recordLoading', !bool);
            }

            function setAsAvailable(bool) {
                ngModel.$setValidity('recordAvailable', bool);
            }

            ngModel.$parsers.push(function(value) {
                if (!value || value.length == 0) return;

                setAsLoading(true);
                setAsAvailable(false);

                // $http.get(apiUrl, {
                //         v: value
                //     })
                //     .success(function() {
                //         setAsLoading(false);
                //         setAsAvailable(true);
                //     })
                //     .error(function() {
                //         setAsLoading(false);
                //         setAsAvailable(false);
                //     });

                $http({
                    url: apiUrl,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: {
                        value: value
                    }
                }).then(function successCallback(response) {
                    console.log(response.data);
                    setAsLoading(false);
                    setAsAvailable(true);
                }, function errorCallback(response) {
                    console.log(response.data);
                    setAsLoading(false);
                    setAsAvailable(false);
                });

                return value;
            })
        }
    }
}]);

app.directive('uiShowPassword', [
    function() {
        return {
            restrict: 'A',
            scope: true,
            link: function(scope, elem, attrs) {
                var btnShowPass = angular.element('<a class="button button-clear"><i class="ion-eye"></i></a>'),
                    elemType = elem.attr('type');

                // this hack is needed because Ionic prevents browser click event
                // from elements inside label with input
                btnShowPass.on('mousedown', function(evt) {
                    (elem.attr('type') === elemType) ?
                    elem.attr('type', 'text'): elem.attr('type', elemType);
                    btnShowPass.toggleClass('button-positive');
                    //prevent input field focus
                    evt.stopPropagation();
                });

                btnShowPass.on('touchend', function(evt) {
                    var syntheticClick = new Event('mousedown');
                    evt.currentTarget.dispatchEvent(syntheticClick);

                    //stop to block ionic default event
                    evt.stopPropagation();
                });

                if (elem.attr('type') === 'password') {
                    elem.after(btnShowPass);
                }
            }
        };
    }
]);
