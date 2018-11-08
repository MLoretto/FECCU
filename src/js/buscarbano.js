//Crea los iconos para el usuario y los banos
const iconBano = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path  fill="#4394F0" d="M5.5 22v-7.5H4V9c0-1.1.9-2 2-2h3c1.1 0 2 .9 2 2v5.5H9.5V22h-4zM18 22v-6h3l-2.54-7.63C18.18 7.55 17.42 7 16.56 7h-.12c-.86 0-1.63.55-1.9 1.37L12 16h3v6h3zM7.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm9 0c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2z"/></svg>';
const iconUserSGV = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64" viewBox="0 0 24 24"><defs><path id="a" fill="#8a2be2" d="M0 0h24v24H0V0z"/></defs><clipPath id="b"><use xlink:href="#a" overflow="visible"/></clipPath><path clip-path="url(#b)" fill="#8a2be2" d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 2c1.1 0 2 .9 2 2 0 1.11-.9 2-2 2s-2-.89-2-2c0-1.1.9-2 2-2zm0 10c-1.67 0-3.14-.85-4-2.15.02-1.32 2.67-2.05 4-2.05s3.98.73 4 2.05c-.86 1.3-2.33 2.15-4 2.15z"/></svg>';

let posActual;
let BanosArray = [
    {"nombre":"Eco Baños", "direccion":"Estado 149-197, Santiago, Región Metropolitana","lat":-33.441125, "lng":-70.649226},//-33.441125, -70.649226
    {"nombre":"Eco Baños subterraneo", "direccion":"Paseo Ahumada 360, Santiago, Región Metropolitana","lat":-33.438974 , "lng":-70.651071},//-33.438974, -70.651071
    {"nombre":"Baños Publicos", "direccion":"Chacabuco, Maipú, Región Metropolitana","lat":-33.508946, "lng":-70.756036}//-33.508946, -70.756036
];

let primeraLectura = false;


//Paso 1: inicializar la plataforma
platform = new H.service.Platform({
    'app_id': 'xp2LMzBFCMvdU9TNRRjY',
    'app_code': 'w1p60cUN3oTM8VhpR1B0ww',
    useHTTPS: true
 });

let pixelRatio = window.devicePixelRatio || 1;
let defaultLayers = platform.createDefaultLayers({
 tileSize: pixelRatio === 1 ? 256 : 512,
 ppi: pixelRatio === 1 ? undefined : 320
});

//Paso 2: inicializar el mapa, pre configurando un lugar y zoom
let map = new H.Map(document.getElementById('mapContainer'),
 defaultLayers.normal.map,{
 center: {lat: -33.4189088, lng: -70.6422443},
 zoom: 16,
 pixelRatio: pixelRatio
});

//Paso 3: hacer el mapa interactivo
// MapEvents obtener eventos del sistema
// Behavior implementa el pan/zoom 
let behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// crea la interfaces de usuario por defecto en el mapa 
let ui = H.ui.UI.createDefault(map, defaultLayers);

let iconoUser = new H.map.Icon(iconUserSGV);
var banoIcon = new H.map.Icon(iconBano);

//Paso 4:Icono de usuario
//crea una marca con la posicion indicada
let markerUser = new H.map.Marker({ lat: -33.4189088, lng: -70.6422443 }, { icon: iconoUser });
map.addObject(markerUser);

let radioAccion = new H.map.Circle(
    // Centro del circulo
    { lat: -33.4189088, lng: -70.6422443 },
    // radio del circulo en metros
    250,
    {
      style: {
        strokeColor: 'rgba(55, 85, 170, 0)', // color de la orilla del circulo
        lineWidth: 0, //ancho de la orilla
        fillColor: 'rgba(255,255,191, 0.4)'  // color de fondo del circulo
      }
    }
  );
map.addObject(radioAccion);

optionsGPS = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
   };
function errorLocation(error){
    console.log(error);
}

console.log("Inicia Navegador");
if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(function (location) {
        updaeteLocation(location);
    },errorLocation, optionsGPS);
    watchId = navigator.geolocation.watchPosition(updaeteLocation, errorLocation, optionsGPS);
} else {
    console.log('Geolocation API not supported.');
}


function updaeteLocation(position) {
    map.setCenter({lat:position.coords.latitude, lng:position.coords.longitude});//centra el mapa en la posicion del usuario
    markerUser.setPosition({lat:position.coords.latitude, lng:position.coords.longitude});//centra la marca en la posicion del usuario
    radioAccion.setCenter({lat:position.coords.latitude, lng:position.coords.longitude});//centra el circulo en la posicion del usuario
    posActual = {lat:position.coords.latitude, lng:position.coords.longitude};
    console.log(position);
    if(!primeraLectura){
        primeraLectura = true;
        crearListado(BanosArray);
    }
 }

 function ruta(newPos){
    removeAllObject();
    activarRuta(posActual, newPos);
}

 function activarRuta(posInicial, posFinal) {
    console.log('waypoint0 : geo!' + posInicial.lat + ', ' + posInicial.lng);
    console.log('waypoint1 : geo!' + posFinal.lat + ', ' + posFinal.lng);

    var routingParameters = {
        'mode': 'fastest;pedestrian',//'fastest;car',
        'waypoint0': 'geo!' + posInicial.lat + ',' + posInicial.lng,
        'waypoint1': 'geo!' + posFinal.lat + ',' + posFinal.lng,
        'representation': 'display'
    };

    var onResult = function (result) {
        var route,
            routeShape,
            startPoint,
            endPoint,
            linestring;
        if (result.response.route) {
            route = result.response.route[0];
            routeShape = route.shape;
            linestring = new H.geo.LineString();

            routeShape.forEach(function (point) {
                var parts = point.split(',');
                linestring.pushLatLngAlt(parts[0], parts[1]);
            });
            startPoint = route.waypoint[0].mappedPosition;
            endPoint = route.waypoint[1].mappedPosition;

            var routeLine = new H.map.Polyline(linestring, {
                style: { strokeColor: 'green', lineWidth: 5 } //Color linea ruta
            });
            var startMarker = new H.map.Marker({
                lat: startPoint.latitude,
                lng: startPoint.longitude
            });

            let positionFinal = {
                lat: endPoint.latitude,
                lng: endPoint.longitude
            };


            var endMarker = new H.map.Marker(positionFinal, { icon: banoIcon });
            map.addObjects([routeLine, startMarker, endMarker]);
            map.setViewBounds(routeLine.getBounds());
        }
    };

    var router = platform.getRoutingService();
    router.calculateRoute(routingParameters, onResult,
        function (error) {
            alert(error.message);
        });
}

function removeAllObject(){
    for (object of map.getObjects()){
     if (object!=markerUser){
         map.removeObject(object);
        }
     }
 }

 function crearListado(arrayData){
    const fileContainer = document.getElementById("fileContainer");
    fileContainer.innerHTML = "";
    for (let i = 0 ; i < arrayData.length;i++){
        let markerBano = new H.map.Marker({ lat: arrayData[i].lat, lng: arrayData[i].lng }, { icon: banoIcon });
        map.addObject(markerBano);
        
        let fila = `
        <div class="row p-3">
            <div class="card col-12 p-0">
                <div class="card-header">
                    <h5 class="d-inline float-left m-0 p-1">${arrayData[i].nombre}</h5>
                    <a href="#" onclick='ruta({"lat":"${arrayData[i].lat}", "lng":"${arrayData[i].lng}"})' class="btn bg-info d-inline float-right rounded-circle text-white">IR</a>
                </div>
                <div class="card-body h-25">
                    <div class="d-inline-block align-top" style="height: 100px;">
                        <img class="img-fluid rounded mh-100"  style="width: 100px; height: 100px;" src="../img/Banio.jpg" class="rounded float-left" alt="">
                    </div>
                    <div class="d-inline-block ml-3">
                        <h6 class="card-title">Dirección</h6>
                        <p id="direccion" class="card-text">${arrayData[i].direccion}</p>
                        <p id="distancia" class="card-text">Distancia ${getKilometros(arrayData[i].lat,arrayData[i].lng )} km</p>
                    </div>
                </div>
            </div>
        </div>`;
        fileContainer.innerHTML += fila;
    } 
}

function getKilometros (lat2,lon2){
    let lat1 = posActual.lat;
    let lon1 = posActual.lng;

    rad = function(x) {return x*Math.PI/180;}
    var R = 6378.137; //Radio de la tierra en km
    var dLat = rad( lat2 - lat1 );
    var dLong = rad( lon2 - lon1 );
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong/2) * Math.sin(dLong/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d.toFixed(3); //Retorna tres decimales
}