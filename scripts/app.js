var myApp = angular.module('myApp',['ui.router']);

myApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    
    $urlRouterProvider.otherwise('/');
    
    $stateProvider
        
        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/',
            templateUrl: 'partials/partial-home.html',
            controller: function ($scope, $stateParams, $rootScope) {
            	$rootScope.countySelected = false;
            	$rootScope.showNav= false;
            }  
        })

        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('tiles', {
            url: '/tiles',
            templateUrl: 'partials/partial-tiles.html',
            controller: function ($scope, $stateParams, $rootScope) {
            	$rootScope.countySelected = false;
            	$rootScope.showNav= true;
            }       
        })

        .state('aerial', {
            url: '/aerial:aerialID',
            templateUrl: 'partials/partial-view.html',
            controller: function ($scope, $stateParams, $rootScope) {
            	$rootScope.showNav= true;
            	$rootScope.countySelected = true;
            	$scope.id = $stateParams.aerialID;
            	$rootScope.zoomAmount = 1;
            	slider = new juxtapose.JXSlider('.aerial',
				    [
				        {
				            src: 'http://localhost:8080/images/0'+$stateParams.aerialID+'_archive.png',
				            label: '1941',
				            magnified: 'http://localhost:8080/images/0'+$stateParams.aerialID+'_archive.png'
				        },
				        {
				            src: 'http://localhost:8080/images/0'+$stateParams.aerialID+'_recent.png',
				            label: '2016',
				            magnified: 'http://localhost:8080/images/0'+$stateParams.aerialID+'_recent.png'
				        }
				    ],
				    {
				        animate: true,
				        showLabels: true,
				        showCredits: true,
				        startingPosition: "50%",
				        makeResponsive: true
				    });


            	setTimeout(function(){
            		$("#thumb").panzoom({
            			contain: 'invert',
            			 minScale: 1,
            			 $zoomIn: $('#zoom-in'),
  						$zoomOut: $('#zoom-out'),
  						transition: false
            		});

            		$("#thumbRecent").panzoom({
            			contain: 'invert',
            			 minScale: 1,
            			 $zoomIn: $('#zoom-in'),
  						$zoomOut: $('#zoom-out'),
  						transition: false
            		});

            		var afterImage = $("#thumbRecent");
            		var zoomAmountBefore = 1;
            		var zoomAmountAfter = 1;
            		var imageOverageBefore;
            		var imageOverageAfter;

            		//width < height
            		// if($("#thumb").width() < $(window).width()){
            		// 	$('.aerial').css({'width': '100%'});
            		// };

            		$("#thumb").on('panzoomzoom', function(e, panzoom, scale, opts) {
					    setTimeout(function(){
					    	zoomAmountBefore = $("#thumb").css('transform').split(",")[3];	
					    },500);
					    
					    $rootScope.zoomAmount = $("#thumb").css('transform').split(",")[3];
					    $rootScope.$apply();
					});

					$("#thumbRecent").on('panzoomzoom', function(e, panzoom, scale, opts) {

					    setTimeout(function(){

					    	zoomAmountAfter = $("#thumbRecent").css('transform').split(",")[3];	
					    	$rootScope.zoomAmount = $("#thumb").css('transform').split(",")[3];
					    	$rootScope.$apply();

					    // 	if(zoomAmountAfter <= 1.3){
					    // 	$("#thumbRecent").css({
	    				// 		'transform': 'matrix('+ zoomAmountBefore +', 0, 0, '+ zoomAmountBefore +', 0 , 0)'
	  						// });	
	  						// $("#thumb").css({
	    				// 		'transform': 'matrix('+ zoomAmountBefore +', 0, 0, '+ zoomAmountBefore +', 0 , 0)'
	  						// });	
					    // 	}
					    },100);
					});


            		$("#thumb").on('panzoompan', function(e, panzoom, x, y, afterImage) {
            			imageOverageBefore = $(window).width() - $("#thumb").width();
            			var panAmount = map_range(x, 0, $(window).width() - $("#thumb").width(), 0, 100);
            			$rootScope.$broadcast('panning', {pan:panAmount});
            			if(imageOverageBefore / 2 <= x){
						    $("#thumbRecent").css({
	    						'transform': 'matrix('+ zoomAmountBefore +', 0, 0, '+ zoomAmountBefore +', '+ x +', '+ y +')'
	  						});
						}else{
							$("#thumb").css({
	    						'transform': 'matrix('+ zoomAmountBefore +', 0, 0, '+ zoomAmountBefore +', '+ imageOverageBefore / 2 +', '+ y +')'
	  						});
						}
					});

					$("#thumbRecent").on('panzoompan', function(e, panzoom, x, y, afterImage) {
						imageOverageAfter = $(window).width() - $("#thumbRecent").width();						
						    var panAmount = map_range(x, 0, $(window).width() - $("#thumb").width(), 0, 100);
            				$rootScope.$broadcast('panning', {pan:panAmount});
	  						if(imageOverageAfter / 2 < x){
	  							$("#thumb").css({
	    							'transform': 'matrix('+ zoomAmountAfter +', 0, 0, '+ zoomAmountAfter +', '+ x +', '+ y +')'
	  							});
							}else{
								$("#thumbRecent").css({
	    							'transform': 'matrix('+ zoomAmountAfter +', 0, 0, '+ zoomAmountAfter +', '+ imageOverageAfter/2 +', '+ y +')'
	  							});
							}
					});

					var percentageToIncrease = $(window).height() / $('.aerial').height();
					$('.aerial').css({
						height: $('.aerial').height() * percentageToIncrease,
						width: $('.aerial').width() * percentageToIncrease
					});	

					var overExtended = (($('.aerial').width() - $(window).width()) / 2) * -1;

					$('.aerial').css({
						'transform': 'matrix(1, 0, 0, 1, '+ overExtended +', 0)'
					});



            	}, 1000);






setTimeout(function(){
var a = function(p) {
	var windowWidth = $(window).width();
	var windowHeight = $(window).height();
	var imageWidth;
	var imageHeight;
	var differenceWidth, differenceHeight;
	var x, y;
	setTimeout(function(){
	imageWidth = $('#thumb').width();
	imageHeight = $('#thumb').height();
	differenceWidth = windowWidth / imageWidth;
	differenceHeight = imageWidth / windowWidth;
	}, 500);

	var dimensions = 70;
	p.setup = function(){

	  var canvas = p.createCanvas(dimensions, dimensions);
	  x = (windowWidth - p.width) / 2;
	  y = (windowHeight - p.height) / 2;


	  // Move the canvas so it's inside our <div id="sketch-holder">.
	  canvas.parent('sketch-holder');
	}
	var panAmount = 0;
	p.draw = function() {
	  var aspectRatioWindow = calculateAspectRatioFit(windowWidth, windowHeight, dimensions * .9, dimensions * .9);
	  var aspectRatioImage = calculateAspectRatioFit(imageWidth, imageHeight, (dimensions * .9), dimensions * .9);


	  p.translate(dimensions/2 - aspectRatioWindow.width /2,dimensions/2 - aspectRatioWindow.height/2);	
	  p.background(255, 255, 255, 150);
	  p.stroke(0);
	  p.fill(255);
	  p.rect(0, 0, aspectRatioWindow.width, aspectRatioWindow.height);
	  p.noStroke();
	  p.fill(109,205,211);

	  // (aspectRatioWindow.width - (aspectRatioImage.width * differenceWidth)) / 2
	  
	  $rootScope.$on('panning', function(e, data){
	  	panAmount = data.pan;
	  });
	  var amountToPan = p.map(panAmount, 0, 100, 0, aspectRatioWindow.width - (aspectRatioImage.width * differenceWidth));

	  p.rect(amountToPan + 1, 1, (aspectRatioImage.width * differenceWidth) * .99, (aspectRatioImage.height * differenceHeight) -1);
	}

	function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {

	    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

	    return { width: srcWidth*ratio, height: srcHeight*ratio };
	 }
	};

		var myp5 = new p5(a);

}, 500);


				

        	}
        });

        
});

myApp.controller('MainController', function($scope) {
  $scope.greeting = 'Hola!';
});

myApp.directive('tile', function(){
	function link(scope, element, attrs){
		console.log(attrs.image);
		slider = new juxtapose.JXSlider('.' + attrs.class,
		    [
		        {
		            src: 'images/0'+attrs.image+'_archive.jpg'
		        },
		        {
		            src: 'images/0'+attrs.image+'_recent.jpg'
		        }
		    ],
		    {
		        animate: true,
		        showLabels: true,
		        showCredits: true,
		        startingPosition: "50%",
		        makeResponsive: true
		    });

		element.click(function(e){
			e.preventDefault();
			console.log(this);
		})

	}
	return {
    	link: link
  	};
});


myApp.directive('disabledZoom', function($rootScope){
	return {
		link: function(scope, element, attrs){
			$rootScope.$watch('zoomAmount', function(newValue,oldValue){
				console.log(newValue, oldValue);
				if(attrs.disabledZoom == 'out' && newValue <= 1 || attrs.disabledZoom == 'out' && newValue == undefined){
					$(element).attr('disabled', true);
				}else{
					$(element).attr('disabled', false);
				}
			}, true);

		}
	};	
	
});

function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}






