angular.module('website', ['ngAnimate', 'ngTouch', 'ui.router']).config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state("gallery", {
        url: '/gallery',
        templateUrl: 'gallery.html'

    }).state("upload", {
        url: '/upload',
        templateUrl: 'upload.html'
    })

    $urlRouterProvider.otherwise('/gallery')
})

.controller('MainCtrl', function($scope,$interval,$http) {
    $http.get('/getImage').then(function(response) {
        $scope.slides =[]

        for( img in response.data){
            var obj = {
                image:'images/'+ response.data[img].filename,
                description:response.data[img].uploadDate
            }
            $scope.slides.push(obj);
        }
            // $scope.slides  = response.data;
            console.log("heello here")
            console.log($scope.slides );
        })
    // $scope.slides =[{
    //         image: 'images/img00.jpg',
    //         description: 'Image 00'
    //     }]
        // $scope.slides = [{
        //     image: 'images/img00.jpg',
        //     description: 'Image 00'
        // }, {
        //     image: 'images/img01.jpg',
        //     description: 'Image 01'
        // }, {
        //     image: 'images/img02.jpg',
        //     description: 'Image 02'
        // }, {
        //     image: 'images/img03.jpg',
        //     description: 'Image 03'
        // }, {
        //     image: 'images/img04.jpg',
        //     description: 'Image 04'
        // }];

        $interval(function() {
            $scope.nextSlide();
        },10000)
        $scope.direction = 'left';
        $scope.currentIndex = 0;

        $scope.setCurrentSlideIndex = function(index) {
            $scope.direction = (index > $scope.currentIndex) ? 'left' : 'right';
            $scope.currentIndex = index;
        };

        $scope.isCurrentSlideIndex = function(index) {
            return $scope.currentIndex === index;
        };

        $scope.prevSlide = function() {
            $scope.direction = 'left';
            $scope.currentIndex = ($scope.currentIndex < $scope.slides.length - 1) ? ++$scope.currentIndex : 0;
        };

        $scope.nextSlide = function() {
            $scope.direction = 'right';
            $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.slides.length - 1;
        };
    })
    .animation('.slide-animation', function() {
        return {
            beforeAddClass: function(element, className, done) {
                var scope = element.scope();

                if (className == 'ng-hide') {
                    var finishPoint = element.parent().width();
                    if (scope.direction !== 'right') {
                        finishPoint = -finishPoint;
                    }
                    TweenMax.to(element, 0.5, {
                        left: finishPoint,
                        onComplete: done
                    });
                } else {
                    done();
                }
            },
            removeClass: function(element, className, done) {
                var scope = element.scope();

                if (className == 'ng-hide') {
                    element.removeClass('ng-hide');

                    var startPoint = element.parent().width();
                    if (scope.direction === 'right') {
                        startPoint = -startPoint;
                    }

                    TweenMax.fromTo(element, 0.5, {
                        left: startPoint
                    }, {
                        left: 0,
                        onComplete: done
                    });
                } else {
                    done();
                }
            }
        };
    });