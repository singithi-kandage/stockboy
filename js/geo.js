/**
 * Mobile Web Development
 * Final Assignment
 *
 * File Name: geo.js
 *
 * Revision History:
 *       Brett Hall and Singithi Kandage, 2018-03-15 : Created
 */
var markers = [];
function loadProductsToMap(map){
    var options = [];

    function callback(tx,results){


        //iterate through each vendorProduct
        for(var i = 0; i < results.rows.length; i++){
            var vendorproduct = results.rows.item(i);

            //Get vendor location
            var lat = vendorproduct['latitude'];
            var lng = vendorproduct['longitude'];

            //Get image file for marker
            var img = vendorproduct['imageName'];

            //Create a marker for the product
            var markerOptions = {
                icon: "img/map-icons/" + img,
                map: map,
                position: {
                    lat: lat ,
                    lng: lng
                },
                id: vendorproduct['vendorProductId']
            };
            markers[i] = new google.maps.Marker(markerOptions);

            // Create info window for marker
            var infoWindow = new google.maps.InfoWindow({
                content: vendorproduct['vendor'] + " | "
                + vendorproduct['name'] + " | "
                + "$" + vendorproduct['price'] + "/" + vendorproduct['metricCode']
            });

            infoWindow.open(map,markers[i]);

        }
    }
    VendorProduct.selectAllProducts(options,callback);
}

function showMapView() {
    try {
        if (navigator.geolocation != null) {
            var options = {
                enableHighAccuracy: true,
                timeout: 60000,
                maximumAge: 0
            };

            function onSuccess(position) {
                var coordinates = position.coords;

                var lat = coordinates.latitude;
                var lng = coordinates.longitude;

                console.info("Lat: " + lat + " Lng: " + lng);

                var type = google.maps.MapTypeId.ROADMAP;

                var mapOptions = {
                    zoom: 12,
                    center: {
                        lat: lat,
                        lng: lng
                    },
                    mapTypeId: type
                };


                var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

                var markerOptions = {
                    position: {
                        lat: lat,
                        lng: lng
                    },
                    map: map,
                    title: "College"
                };
                var marker = new google.maps.Marker(markerOptions);

                loadProductsToMap(map);
            }

            function onFail(error) {
                var msg = "";

                try {
                    if (error) {
                        switch (error.code) {
                            case error.TIMEOUT:
                                msg = "TIMEOUT: " + error.message;
                                break;
                            case error.PERMISSION_DENIED:
                                msg = "PERMISSION_DENIED: " + error.message;
                                break;
                            case error.POSITION_UNAVAILABLE:
                                msg = "POSITION_UNAVAILABLE: " + error.message;
                                break;
                            default:
                                msg = "UNHANDLED MESSAGE CODE: (" + error.code + ") : " + error.message;
                                break;
                        }
                        console.error(msg);
                    }
                } catch (e) {
                    console.error("Exception (geolocationError): " + e);
                }
            }

            navigator.geolocation.getCurrentPosition(onSuccess, onFail, options);
        }
        else {
            console.error("HTML5 geolocation is not supported");
        }
    } catch (e) {
        console.error("Exception in showMap(): " + e);
    }
    $("#lstLocalProducts").hide();
    $("#map-canvas").show();
}

function showVendorMapView(){
    try {
        if (navigator.geolocation != null) {
            var options = {
                enableHighAccuracy: true,
                timeout: 60000,
                maximumAge: 0
            };

            function onSuccess(position) {
                var coordinates = position.coords;

                var lat = coordinates.latitude;
                var lng = coordinates.longitude;

                console.info("Lat: " + lat + " Lng: " + lng);

                var type = google.maps.MapTypeId.ROADMAP;

                var mapOptions = {
                    zoom: 12,
                    center: {
                        lat: lat,
                        lng: lng
                    },
                    mapTypeId: type
                };

                var map = new google.maps.Map(document.getElementById('my-map-canvas'), mapOptions);

                var markerOptions = {
                    position: {
                        lat: lat,
                        lng: lng
                    },
                    map: map,
                    title: "College"
                };


                var marker = new google.maps.Marker(markerOptions);

                loadProductsToMap(map);

            }

            function onFail(error) {
                var msg = "";

                try {
                    if (error) {
                        switch (error.code) {
                            case error.TIMEOUT:
                                msg = "TIMEOUT: " + error.message;
                                break;
                            case error.PERMISSION_DENIED:
                                msg = "PERMISSION_DENIED: " + error.message;
                                break;
                            case error.POSITION_UNAVAILABLE:
                                msg = "POSITION_UNAVAILABLE: " + error.message;
                                break;
                            default:
                                msg = "UNHANDLED MESSAGE CODE: (" + error.code + ") : " + error.message;
                                break;
                        }
                        console.error(msg);
                    }
                } catch (e) {
                    console.error("Exception (geolocationError): " + e);
                }
            }

            navigator.geolocation.getCurrentPosition(onSuccess, onFail, options);
        }
        else {
            console.error("HTML5 geolocation is not supported");
        }
    } catch (e) {
        console.error("Exception in showMap(): " + e);
    }
    $("#lstMyLocalProducts").hide();
    $("#my-map-canvas").show();
}