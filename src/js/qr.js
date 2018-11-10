const scanner = new Instascan.Scanner({
    video: document.getElementById('webcam')
  });
  /*
  let ecoPlaces = [
      {id:'0125630', position: {lat: -33.4189, lng: -70.6422}, decripcion : "Punto Eco-Go Laboratoria", distancia: 0},
      {id:'1896548', position: {lat: -33.4188, lng: -70.6424}, decripcion : "Punto Eco-Go Star", distancia: 0},
      {id:'2589635', position: {lat: -33.4180, lng: -70.6433}, decripcion : "Punto Eco-Go Golden", distancia: 0},
      {id:'3070586', position: {lat: -33.4194, lng: -70.6405}, decripcion : "Punto Eco-Go Silver", distancia: 0},
      {id:'4478514', position: {lat: -33.4170, lng: -70.6405}, decripcion : "Punto Eco-Go Platinum", distancia: 0},
      {id:'5896541', position: {lat: -33.4184, lng: -70.6396}, decripcion : "Punto Eco-Go Diamond", distancia: 0}
  ];
*/
  let posActual;
  let BanosArray = [
    {id:'1234567890', "nombre":"Eco Baños", "direccion":"Estado 149-197, Santiago, Región Metropolitana","lat":-33.441125, "lng":-70.649226},//-33.441125, -70.649226
    {id:'1234567890', "nombre":"Eco Baños subterraneo", "direccion":"Paseo Ahumada 360, Santiago, Región Metropolitana","lat":-33.438974 , "lng":-70.651071},//-33.438974, -70.651071
    {id:'1234567890', "nombre":"Baños Publicos", "direccion":"Chacabuco, Maipú, Región Metropolitana","lat":-33.508946, "lng":-70.756036}//-33.508946, -70.756036


];

  let id= localStorage.getItem("selectId");
  let banoFound = BanosArray.find(function(ecoMarker) {
    return ecoMarker.id === id;
  });


  
  scanner.addListener('scan', content => {
      let ecoFound = BanosArray.find(function(ecoMarker) {
          return ecoMarker.id === content;
      });
      console.log(content);
      console.log(ecoFound);
      if(ecoFound === undefined){
          alert('UPS!!! Ese código QR no es de un Punto Eco-Go!!!');
      }else{
          if(content === localStorage.getItem("selectId")){
              localStorage.setItem("selectQR",content);
              window.location = "../html/autorizado.html";//pagina despues de encontrar codigo
          }else{
              alert('UPS!!! Ese código QR no es valido!!!');
          }
      }
  
  });
  Instascan.Camera.getCameras().then( cameras => {
      if(cameras.length > 0){
          for (let index = 0; index < cameras.length; index++) {
              console.log(cameras[index]);
          }  
          scanner.start(cameras[0]);
     }
  });



  function showPanel(index, data){

    const fileContainer = document.getElementById("fileContainer");
    fileContainer.innerHTML = "";
    let fila = `
        <div class="row p-3">
            <div class="card col-12 p-0">
                <div class="card-header">
                    <h5 class="d-inline float-left m-0 p-1">${data[index].nombre}</h5>
                    <a href="#" onclick='gotoQR()' class="btn bg-info d-inline float-right rounded-circle text-white">IR</a>
                </div>
                <div class="card-body h-25">
                    <div class="d-inline-block align-top" style="height: 100px;">
                        <img class="img-fluid rounded mh-100"  style="width: 100px; height: 100px;" src="../img/Banio.jpg" class="rounded float-left" alt="">
                    </div>
                    <div class="d-inline-block ml-3">
                        <h6 class="card-title">Dirección</h6>
                        <p id="direccion" class="card-text">${data[index].direccion}</p>
                        <p id="distancia" class="card-text">Distancia ${getKilometros(data[index].lat,data[index].lng)} km</p>
                    </div>
                </div>
            </div>
        </div>`;
    fileContainer.innerHTML += fila;
  }