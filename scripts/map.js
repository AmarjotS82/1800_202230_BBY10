let map;

//changing later for when adding user icon

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                }
                console.log(pos)
                const marker = new google.maps.Marker({
                    label: "User",
                    position: pos,
                    map: map,
                    // icon: "./images/user_location_icon_small.png",
                    // scaledSize: {witdh: 10, height: 10}
                });
            })
    } else {
        console.log("Could not find user location.");
    }
}

//makes map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 49.25195530692527,
            lng: -123.00065754018182
        },
        zoom: 17,
        heading: 180,
        mapTypeId: 'roadmap',
        //turns off all icons given by google
        //clutters screen too much to keep
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
        //sets the bounds for the map panning
        restriction: {
            latLngBounds: {
                south: 49.249081968706776,
                west: -123.00430334751641,
                north: 49.25467044955779,
                east: -122.99341966307514
            }
        }

    });
    // will be used to get user location later
    getLocation();
    var infoBoxDiv = document.createElement('div');
    var infoBox = new makeInfoBox(infoBoxDiv, map);
    infoBoxDiv.index = 1;
    makeInfoBox(infoBoxDiv, map);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(infoBoxDiv);

//sets all the markers based on the given geopoint in the database
//note: marker is not displayed if no geopoint is given
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
//i genuinely dont know what this code does and why carly told me to add it.
//and i dont think she knows either
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
//makes a new marker
function addMarker(label, coords) {
    const marker = new google.maps.Marker({
        label: label,
        position: coords,
        map: map,
    });
}