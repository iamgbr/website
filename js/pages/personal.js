// Init Map
var map;
var gl;
var mySwiper;
var token = 'pk.eyJ1IjoiaWFtZ2JyIiwiYSI6ImNpa3ZnYjdxZTAwZzd1NG0zZGxleXhpcGoifQ.lSpuXQ7aEs0o-yHF1cyfTg';

var markerDict = {};
// Init Swiper
$(document).ready(function () {
	// Initialize map
	map = L.map('map-body').setView([ 13.745512, 100.538242], 14);

	// Load MapBox
	gl = L.mapboxGL({
	    accessToken: token,
	    style: 'mapbox://styles/mapbox/streets-v8'
	}).addTo(map);

	//initialize swiper when document ready  
	mySwiper = new Swiper ('.swiper-container', {
		// Optional parameters
		// Disable preloading of all images
		preloadImages: true,
		// Enable lazy loading
		lazyLoading: true,
		// Pagination params
		slidesPerView: 3,
		pagination: '.swiper-pagination',
        paginationClickable: true,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        spaceBetween: 30,
        keyboardControl: true,
        mousewheelControl: true,
        breakpoints: {
            1280: {
                slidesPerView: 2,
                spaceBetween: 30
            },
            640: {
                slidesPerView: 1,
                spaceBetween: 20
            }
        }
	});

	// Agoda
	markerDict.agoda = createMarker([13.745512, 100.538242])
	    .bindPopup('<p class="popup-p">Currently, I\'m working here!</p><img src="./img/logo-agoda.png"></img>')
	    .addTo(map)
	    .openPopup();

	// Condo
	markerDict.condo = createMarker([13.720627, 100.458521])
	    .bindPopup('<p>Condo</p>')
	    .addTo(map);

	// Koh Mak
	markerDict.kohmak = createMarker([11.820686, 102.479291])
	    .bindPopup('<p>Koh Mak</p>')
	    .addTo(map);

	 // LuangPraBang
	markerDict.luangprabang = createMarker([19.892330, 102.135790])
	    .bindPopup('<p>LuangPraBang</p>')
	    .addTo(map);

	    // MuseumSiam
	markerDict.museumsiam = createMarker([13.7442683,100.493963])
	    .bindPopup('<p>Museum Siam</p>')
	    .addTo(map);

	    // Koh Samed
	markerDict.samed = createMarker([12.554088, 101.449753])
	    .bindPopup('<p>Koh Samed</p>')
	    .addTo(map);

	$('.slide-condo a.btn').click(function(){
	    moveMapTo('condo');
	});
	$('.slide-kohmak a.btn').click(function(){
	    moveMapTo('kohmak');
	});
	$('.slide-luangprabang a.btn').click(function(){
	    moveMapTo('luangprabang');
	});
	$('.slide-museumsiam a.btn').click(function(){
	    moveMapTo('museumsiam');
	});
	$('.slide-samed a.btn').click(function(){
	    moveMapTo('samed');
	});

    $('[data-toggle="tooltip"]').tooltip(); 
     $('#menu-toggle').addClass('animated bounceInDown');
});

var createMarker = function(pos){
	var myIcon = L.icon({
	    iconUrl: './img/marker-icon.png',
	    iconRetinaUrl: './img/marker-icon-2x.png',
	    shadowUrl: './img/marker-shadow.png',
	    iconAnchor: [13, 41],
	    iconSize: [25, 41],
	    popupAnchor: [0, -37],
	});
	var bounceDuration = (Math.random() * 300) + 400;
	return L.marker(pos,{
		icon: myIcon,
		bounceOnAdd: true,
		bounceOnAddOptions: {duration: bounceDuration, height: 100}, 
	});
};

var moveMapTo = function(placeName) {
	if (markerDict[placeName]) {
		var mkr = markerDict[placeName];
		map.setView(mkr.getLatLng(), 14);
		var bounceDuration = (Math.random() * 300) + 400;
		mkr.bounce({
			duration: bounceDuration, 
			height: 100
			}, function() {
			mkr.openPopup();
		});
	}
};