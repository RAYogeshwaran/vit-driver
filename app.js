/* MB location
 lat location = {
    lat : 12.968457, 
    lng : 79.156030
 }
// p block end
/*let end = {
    lat : 12.974244, 
    lng : 79.164187
} */
// automatic location
function getLocation(){
    return new Promise((resolve, reject)=>{
        try{
            navigator.geolocation.getCurrentPosition(async (position) => {
                resolve({lat: position.coords.latitude, 
                    lng: position.coords.longitude})
              });
        } catch (error){
            reject(error);
        }
    })
}
let start = {
    lat : 12.973929,
    lng : 79.164211   
}
let end = {
    lat : 12.968457, 
    lng : 79.156030
}

var map;

async function initializeDefault () {
    start = await getLocation();
    //end.lat = start.lat + 0.0002;
    //end.lng = start.lng;
    console.log("initialized map to default")
    map = L.map('map', {
        layers: MQ.mapLayer(),
        center: [start.lat,start.lng],
        zoom: 12
    });
}

initializeDefault();
// default map layer



var taxiIcon = L.icon({
    iconUrl: 'img/bus.png',
    iconSize: [50, 50]
})
let coordinate;

    function runDirection(start, end) {
        
        console.log("called on form submit");
        // recreating new map layer after removal
        map = L.map('map', {
            layers: MQ.mapLayer(),
            center: [start.lat,start.lng],
            zoom: 12
        });
        
        
        
        var dir = MQ.routing.directions();

        dir.route({
            locations: [
                {latLng : start}, //start,
                {latLng : end}
            ]
        });
        dir.on('success', function (e) {
        //console.log(e.route.shape.shapePoints);
        coordinate = e;
        
        });


        CustomRouteLayer = MQ.Routing.RouteLayer.extend({
            createStartMarker: (location) => {
                var custom_icon;
                var marker;

                custom_icon = L.icon({
                    iconUrl: 'img/red.png',
                    iconSize: [20, 29],
                    iconAnchor: [10, 29],
                    popupAnchor: [0, -29]
                });
      //    console.log(location.latLng);
          
                marker = L.marker(location.latLng, {icon: custom_icon}).addTo(map);

                return marker;
            },

            createEndMarker: (location) => {
                var custom_icon;
                var marker;

                custom_icon = L.icon({
                    iconUrl: 'img/blue.png',
                    iconSize: [20, 29],
                    iconAnchor: [10, 29],
                    popupAnchor: [0, -29]
                });

                marker = L.marker(location.latLng, {icon: custom_icon}).addTo(map);

                return marker;
            }
        });
        //console.log(CustomRouteLayer);
        map.addLayer(new CustomRouteLayer({
            directions: dir,
            fitBounds: true
        })); 
      //  console.log(map);
    }

/*}

   else {
    console.log("geolocation not available");
}*/
    
   

// function that runs when form submitted
function submitForm(event) {
    event.preventDefault();

    // delete current map layer
    map.remove();
   
    // getting form data
   // start = document.getElementById("start").value;
    //end = document.getElementById("destination").value;

    // run directions function
    runDirection(start, end);
    //console.log(start,end);

    // reset form
    document.getElementById("form").reset();
}
//var marker = L.marker([start.lat,start.lng], {
 //   icon: taxiIcon}).addTo(map);
// asign the form to form variable
const form = document.getElementById('form');
const button = document.getElementById('startVehicle');
button.onclick = function () {
    var marker = L.marker([start.lat,start.lng], {
        icon: taxiIcon}).addTo(map);
          /*  coordinate.route.shape.shapePoints.forEach(function (coord, index) {
        console.log(coord)
                 setTimeout(function () {
                    //marker.setLatLng([coord.lat, coord.lng]);
                    marker.setLatLng([ coord.lat, coord.lng]);
                }, 100 * index) 
                
    }) */
    let lat = 0;
    let lng = 0;
    async function getLocation() {
        const req = await fetch('https://vit-map.herokuapp.com/api/receive')
        const data = await req.json()
        if (data.status === 'ok') {
            
            console.log(data)
                lat = data.lat;
                lng = data.lon;
            //setTimeout(function () {
                //marker.setLatLng([coord.lat, coord.lng]);
                marker.setLatLng([ lat, lng]);
            //}, 1000 * i) 
            //i=i+1;
         //  marker.setLatLng([lat,lng]);
        } else {
            alert(data.error);
        }
    } 
    setInterval(getLocation,5000); 


}
// call the submitForm() function when submitting the form
form.addEventListener('submit', submitForm);
/*setInterval(function () {
    marker.setLatLng([coordinate[0],coordinate[1]]);
}, 1000);*/

