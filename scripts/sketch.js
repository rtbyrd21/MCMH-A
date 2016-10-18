

myApp.controller('SketchController', function($scope, $rootScope, $timeout) {

 //  var a = function(p) {
	// var windowWidth = $(window).width();
	// var windowHeight = $(window).height();
	// var imageWidth;
	// var imageHeight;
	// var differenceWidth, differenceHeight;
	// var x, y;
	// setTimeout(function(){
	// imageWidth = $('#thumb').width();
	// imageHeight = $('#thumb').height();
	// differenceWidth = windowWidth / imageWidth;
	// differenceHeight = imageWidth / windowWidth;
	// }, 500);

	// var dimensions = 70;
	// p.setup = function(){

	//   var canvas = p.createCanvas(dimensions, dimensions);
	//   x = (windowWidth - p.width) / 2;
	//   y = (windowHeight - p.height) / 2;


	//   // Move the canvas so it's inside our <div id="sketch-holder">.
	//   canvas.parent('sketch-holder');
	// }
	// var panAmount = 0;
	// p.draw = function() {
	//   var aspectRatioWindow = calculateAspectRatioFit(windowWidth, windowHeight, dimensions * .9, dimensions * .9);
	//   var aspectRatioImage = calculateAspectRatioFit(imageWidth, imageHeight, (dimensions * .9), dimensions * .9);


	//   p.translate(dimensions/2 - aspectRatioWindow.width /2,dimensions/2 - aspectRatioWindow.height/2);	
	//   p.background(255, 255, 255, 150);
	//   p.stroke(0);
	//   p.fill(255);
	//   p.rect(0, 0, aspectRatioWindow.width, aspectRatioWindow.height);
	//   p.noStroke();
	//   p.fill(109,205,211);

	//   // (aspectRatioWindow.width - (aspectRatioImage.width * differenceWidth)) / 2
	  
	//   $rootScope.$on('panning', function(e, data){
	//   	panAmount = data.pan;
	//   });
	//   var amountToPan = p.map(panAmount, 0, 100, 0, aspectRatioWindow.width - (aspectRatioImage.width * differenceWidth));

	//   p.rect(amountToPan + 1, 1, (aspectRatioImage.width * differenceWidth) * .99, (aspectRatioImage.height * differenceHeight) -1);
	// }

	// function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {

	//     var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

	//     return { width: srcWidth*ratio, height: srcHeight*ratio };
	//  }
	// };

	// // $timeout(function(){
	// 	var myp5 = new p5(a);
	// // }, 1200)
	 

});