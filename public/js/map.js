
	// TO MAKE THE MAP APPEAR YOU MUST
	// ADD YOUR ACCESS TOKEN FROM
	// https://account.mapbox.com
    
    console.log(mapToken);
	mapboxgl.accessToken = mapToken
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: coordinate.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });

    const marker = new mapboxgl.Marker({color : "red"})
        .setLngLat(coordinate.geometry.coordinates)
        .setPopup(new mapboxgl.Popup({offset: 25})
        .setHTML(`<h4>${ coordinate.location }</h4><p> Exact location provided after booking </p>`))
        .addTo(map);