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
