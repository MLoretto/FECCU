//Crea los iconos para el usuario y los banos
const iconBano = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M5.5 22v-7.5H4V9c0-1.1.9-2 2-2h3c1.1 0 2 .9 2 2v5.5H9.5V22h-4zM18 22v-6h3l-2.54-7.63C18.18 7.55 17.42 7 16.56 7h-.12c-.86 0-1.63.55-1.9 1.37L12 16h3v6h3zM7.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm9 0c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2z"/></svg>';
const iconUserSGV = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="72" height="72" viewBox="0 0 24 24"><defs><path id="a" fill="#8a2be2" d="M0 0h24v24H0V0z"/></defs><clipPath id="b"><use xlink:href="#a" overflow="visible"/></clipPath><path clip-path="url(#b)" fill="#8a2be2" d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 2c1.1 0 2 .9 2 2 0 1.11-.9 2-2 2s-2-.89-2-2c0-1.1.9-2 2-2zm0 10c-1.67 0-3.14-.85-4-2.15.02-1.32 2.67-2.05 4-2.05s3.98.73 4 2.05c-.86 1.3-2.33 2.15-4 2.15z"/></svg>';


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





//Opciones para la captura del GPS
optionsGPS = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
   };
//por si hay algun error al capturar la posicion GPS   
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


//Actualiza el mapa con la posicion actual cada 1 segundo.
function updaeteLocation(position) {
    map.setCenter({lat:position.coords.latitude, lng:position.coords.longitude});//centra el mapa en la posicion del usuario
    markerUser.setPosition({lat:position.coords.latitude, lng:position.coords.longitude});//centra la marca en la posicion del usuario
    radioAccion.setCenter({lat:position.coords.latitude, lng:position.coords.longitude});//centra el circulo en la posicion del usuario
 
    console.log(position);
 
/* 
   let datos = `
   <p>lat  :${position.coords.latitude}</p>
   <p>log  :${position.coords.longitude}</p>
   <p>Acu  :${position.coords.accuracy == null ? 0 : position.coords.accuracy}</p>
   <p>speed:${position.coords.speed === null ? 0 : position.coords.speed}</p>
   `;
   console.log(datos);
    document.getElementById("data").innerHTML = datos;
*/
 }

 function showRoute(ecoFound){

    let routingParameters = {
      // el modo de ir por la ruta:
      'mode': 'fastest;pedestrian',//'fastest;car',
      // punto de inicio de la ruta:
      'waypoint0': 'geo!' + markerUser.getPosition().lat + ',' + markerUser.getPosition().lng,
      // punto final de la ruta:
      'waypoint1': 'geo!' + ecoFound.position.lat + ',' + ecoFound.position.lng,
      'representation': 'display'
    };
   
    var onResult = function (result) {
      var route,
          routeShape,
          startPoint,
          endPoint,
          linestring;
      if (result.response.route) {
          // Pick the first route from the response:
          route = result.response.route[0];
          // Pick the route's shape:
          routeShape = route.shape;
   
          // Create a linestring to use as a point source for the route line
          linestring = new H.geo.LineString();
   
          // Push all the points in the shape into the linestring:
          routeShape.forEach(function (point) {
              var parts = point.split(',');
              linestring.pushLatLngAlt(parts[0], parts[1]);
          });
   
          var routeLine = new H.map.Polyline(linestring, {
              style: { strokeColor: 'green', lineWidth: 5 }
          });
         // Add the route polyline and the two markers to the map:
          map.addObjects([routeLine]);
          // Set the map's viewport to make the whole route visible:
          map.setViewBounds(routeLine.getBounds());
          watchId = navigator.geolocation.watchPosition(updaeteLocation, errorLocation, optionsGPS);
      }
    };
   
    var router = platform.getRoutingService();
   
    // Call calculateRoute() with the routing parameters,
    // the callback and an error callback function (called if a
    // communication error occurs):
    router.calculateRoute(routingParameters, onResult,
        function (error) {
            console.log(error.message);
        });
   
   
   }