angular.module('app.directives', []);

app.directive('disallowSpaces', function() {
    return {
        restrict: 'A',

        link: function($scope, $element) {
            $element.bind('keydown', function(e) {
                if (e.which === 32) {
                    e.preventDefault();
                }
            });
        }
    }
});

app.directive('selectOnClick', ['$window', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('click', function () {
                if (!$window.getSelection().toString()) {
                    // Required for mobile Safari
                    this.setSelectionRange(0, this.value.length)
                }
            });
        }
    };
}]);

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
                    setAsLoading(false);
                    setAsAvailable(true);
                }, function errorCallback(response) {
                    setAsLoading(false);
                    setAsAvailable(false);
                });

                return value;
            })
        }
    }
}]);

// Passwords must have at least 8 characters and contain at least two of the following: uppercase letters, lowercase letters, numbers, and symbols.
app.directive('passwordStrength', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            // regex
            // var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
            var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
            // var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");

            function setAsChecking(bool) {
                ngModel.$setValidity('checking', !bool);
            }

            function setAsStrong(bool) {
                ngModel.$setValidity('strong', bool);
            }

            ngModel.$parsers.push(function(value) {
                if (!value || value.length == 0) return;

                setAsChecking(true);
                setAsStrong(false);

                if (strongRegex.test(value)) {
                    setAsChecking(false);
                    setAsStrong(true);
                } else {
                    setAsChecking(false);
                    setAsStrong(false);
                }

                return value;
            })
        }
    }
});
