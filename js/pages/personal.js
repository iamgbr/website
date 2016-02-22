// Init Map
mapboxgl.accessToken = 'pk.eyJ1IjoiaWFtZ2JyIiwiYSI6ImNpa3ZnYjdxZTAwZzd1NG0zZGxleXhpcGoifQ.lSpuXQ7aEs0o-yHF1cyfTg';
var map = new mapboxgl.Map({
    container: 'map-body', // container id
    style: 'mapbox://styles/mapbox/streets-v8', //stylesheet location
    center: [100.538242, 13.745512], // starting position
    zoom: 14 // starting zoom
});

// Init Swiper
$(document).ready(function () {
	//initialize swiper when document ready  
	var mySwiper = new Swiper ('.gallery-slider', {
		// Optional parameters
		// Disable preloading of all images
		preloadImages: false,
		// Enable lazy loading
		lazyLoading: true
	});
});