let map;

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    // lat: position.coords.latitude,
                    // lng: position.coords.longitude,
                    lat: 49.25195530692527,
                    lng: -123.00065754018182
                }
                map.setCenter(pos);
            })
    } else {
        console.log("Could not find user location.");
    }
}

function initMap() {
    // var bounds = new google.maps.LatLngBounds ([
    //     {lat: 49.249081968706776, 
    //     lng: -123.00430334751641}, 
    //     {lat: 49.25467044955779, 
    //     lng: -122.99341966307514}
    //     ]);
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 0, lng: 0,
        },
        zoom: 17,
        mapTypeId: 'roadmap',
        styles: [{
            featureType: 'poi',
            stylers: [{
                visibility: 'off'
            }]
        }],
        disableDoubleClickZoom: true,
        streetViewControl: false,
        disableDefaultUI: false,
        fullscreenControl: false,
        restriction: {
            latLngBounds: {
                south: 49.249081968706776,
                west: -123.00430334751641,
                north: 49.25467044955779,
                east: -122.99341966307514
            }
        }

    });
    getLocation();
    var infoBoxDiv = document.createElement('div');
    var infoBox = new makeInfoBox(infoBoxDiv, map);
    infoBoxDiv.index = 1;
    makeInfoBox(infoBoxDiv, map);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(infoBoxDiv);


    db.collection("vendors").get()
        .then(allVendors => {
            allVendors.forEach(doc => {
                if (doc.data().location != null) {
                    var geopoint = doc.data().location;
                    var vendorName = doc.data().name;
                    var vendorLat = geopoint.latitude;
                    var vendorLng = geopoint.longitude;
                    var latLng = {
                        lat: vendorLat,
                        lng: vendorLng
                    };
                    addMarker(vendorName, latLng);
                    console.log("Location marker made")
                } else {
                    console.log("No location found!")
                }

            })

        })
}

function makeInfoBox(controlDiv, map) {
    var controlUI = document.createElement('div');
    controlUI.style.boxShadow = 'rgba(0,0,0,0.298039) 0px 1px 4 px -1px';
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #ffff';
    controlUI.style.borderRadius = '2px';
    controlUI.style.marginBottom = '22px';
    controlUI.style.marginTop = '10px';
    controlUI.style.textAlign = 'center';
    controlDiv.appendChild(controlUI);

}

function addMarker(label, coords) {
    const marker = new google.maps.Marker({
        label: label,
        position: coords,
        map: map,
    });
}