//Nombre Alumno: Alejandro Cruz Álvarez Carranza
function datosFormulario(){
    localStorage.clear();
    const correcto=true;
    
    //Acceso a los elementos del formulario através de DOM
    const nombre=document.getElementById("nombre").value;
    const apellido=document.getElementById("apellido").value;
    const ciudad=document.getElementById("ciudad").value;
    const edad=document.getElementById("edad").value;

    //Guardado de datos localmente
    localStorage.setItem("edad",edad);
    
    //uso de Expresión Regular para validar inputs
    const condicion = /^[A-Z]+$/i;
    if(condicion.test(nombre)){
        localStorage.setItem("nombre",nombre);
    }else{
        alert("nombre contiene caracteres diferentes de letras");
        correcto=false;
    }

    if(condicion.test(apellido)){
        localStorage.setItem("apellido",apellido);
    }else{
        alert("apellido contiene caracteres diferentes de letras");
        correcto=false;
    }

    if(condicion.test(ciudad)){
        localStorage.setItem("ciudad",ciudad);
    }else{
        alert("ciudad contiene caracteres diferentes de letras");
        correcto=false;
    }
    //Uso de un WebService de meteorología para ver el estado climático de una ciudad
    fetch('https://api.openweathermap.org/data/2.5/weather?q='+ciudad+'&appid=49ff3ba6cc4efeba773aa970e6d32091&units=metric&lang=es')
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(() => {alert("La ciudad que ingresó no existe o esta muy mal escrita");correcto=false});

    
    if(correcto){
        alert("Envío de Datos Correctamente");
        window.location="pagina2.html";
    }
}
//Uso de Clases JavaScript
class climaCiudad{
    //Atributos o Propiedades de la Clase
    #_nombreCiudad='';
    #_temperaturaActual=0;
    #_estadoClima='';
    #_pais='';
    #_id=-1;

    //Constructor de la Clase
    constructor(ciudad,id){
        fetch('https://api.openweathermap.org/data/2.5/weather?q='+ciudad+'&lang=es&appid=49ff3ba6cc4efeba773aa970e6d32091&units=metric')
        .then(response => response.json())
        .then(data => {
            
            const {main,name,sys,weather}=data;
            this.ingresarValores(name,main.temp,sys.country,weather[0]["description"],id);
            const body = document.getElementsByTagName("body")[0];
            const grupo = document.getElementById("grupo");
            const tarjeta = document.createElement("div");
            tarjeta.setAttribute("id","clima"+id);
            tarjeta.setAttribute("class","d-flex card");
            tarjeta.setAttribute("style","width:18rem");
            tarjeta.innerHTML = '<div class="card-body"><h5 class="card-title"><div class="input-group mb-3"><input type="text" class="form-control" id="inpClima'+id+'" value="'+name+'" aria-label="Recipients username" aria-describedby="basic-addon2"><div class="input-group-append"><span class="input-group-text" id="basic-addon2">'+sys.country+'</span> </div> </div></h5><h6 class="card-subtitle mb-2 text-muted">'+main.temp+'°</h6><p class="card-text">'+weather[0]["description"]+'</p><button class="btn btn-primary" onclick="control.actualizarCiudad('+id+')">Actualizar</button> <button class="btn btn-primary" onclick="control.eliminarCiudad('+id+')">Eliminar</button></div>';
            grupo.appendChild(tarjeta);
            body.appendChild(grupo);
        })
        .catch(() => {alert("La ciudad que ingresó no existe o esta muy mal escrita")});
            this.id=id    
    }

    //Getters y Setters de la clase
    get nombreCiudad(){return this.#_nombreCiudad;}
    set nombreCiudad(nombre){fetch('https://api.openweathermap.org/data/2.5/weather?q='+nombre+'&lang=es&appid=49ff3ba6cc4efeba773aa970e6d32091&units=metric')
    //Conversion de elemento JSON a objeto JavaScript
    .then(response => response.json())
    .then(data => {
        
        const {main,name,sys,weather}=data;
        this.ingresarValores(name,main.temp,sys.country,weather[0]["description"],this.#_id);
        
        const body = document.getElementsByTagName("body")[0];
        const tarjeta = document.getElementById("clima"+this.id);
        tarjeta.innerHTML = '<div class="card-body"><h5 class="card-title"><div class="input-group mb-3"><input type="text" class="form-control" id="inpClima'+this.id+'" value="'+name+'" aria-label="Recipients username" aria-describedby="basic-addon2"><div class="input-group-append"><span class="input-group-text" id="basic-addon2">'+sys.country+'</span> </div> </div></h5><h6 class="card-subtitle mb-2 text-muted">'+main.temp+'°</h6><p class="card-text">'+weather[0]["description"]+'</p><button class="btn btn-primary" onclick="control.actualizarCiudad('+this.id+')">Actualizar</button><button class="btn btn-primary" onclick="control.eliminarCiudad('+this.id+')">Eliminar</button></div>';
        const grupo = document.getElementById("grupo");
        grupo.appendChild(tarjeta);
        body.appendChild(grupo);
        
    })
    .catch(() => {alert("La ciudad que ingresó no existe o esta muy mal escrita")});
    }

    get temperaturaActual(){return this.#_temperaturaActual;}
    set temperaturaActual(temperatura){this.#_temperaturaActual=temperatura}

    get estadoClima(){return this.#_estadoClima;}
    set estadoClima(estado){this.#_estadoClima=estado}

    get pais(){return this.#_pais;}
    set pais(nombrePais){this.#_pais=nombrePais}

    get id(){return this.#_id}
    set id(nid){this.#_id=nid}

    //Funcion para hacer funcionar la clase con el fetch (Es posible mejorarlo y tambien crear un solo metodo para el webservice, pero por cuestiones de tiempo lo deje así)
    ingresarValores(nomC,tempC,paisC,estadoC,idC){
        this.#_nombreCiudad=nomC;
        this.#_temperaturaActual=tempC;
        this.#_pais=paisC;
        this.#_estadoClima=estadoC;
        this.#_id=idC;
    }

}

//Clase que controla el sistema de estado del clima
class controlCiudades{
    //se crea un array de objetos, donde se guardaran las diferentes ciudades que requisite el usuario
    ciudades = new Array();
    constructor(nomciudad){
        const id = 0;
        this.ciudades.push(new climaCiudad(nomciudad,id));
    }
    
    //metodo para insertar ciudades e imprimir en pagina
    insertarCiudad(){
        const id = this.ciudades.length;
        const nomCiudad = document.getElementById("nombreCiudad").value;
        this.ciudades.push(new climaCiudad(nomCiudad,id));
    }

    //metodo para actualizar el valor con los inputs generados con JS
    actualizarCiudad(id){
        const nuevaCiudad=document.getElementById("inpClima"+id).value;
        this.ciudades[id].nombreCiudad=nuevaCiudad;
    }

    //metodo para eliminar la información indicada del estado del clima
    eliminarCiudad(id){
        const ciudadhtml=document.getElementById("clima"+id);
        ciudadhtml.parentNode.removeChild(ciudadhtml);
        this.ciudades[id].id = -1;
    }

    //Metodo donde se crea un objeto en JS para convertirlo a JSON
    convertirJson(){
        const arrayCiudades = new Array();
        for(var i=0;i<this.ciudades.length;i++){
            if(this.ciudades[i].id != -1){
                const nombreCiudad = this.ciudades[i].nombreCiudad;
                const paisCiudad = this.ciudades[i].pais;
                const temperaturaCiudad = this.ciudades[i].temperaturaActual;
                const descripcionCiudad = this.ciudades[i].estadoClima;
                arrayCiudades.push({nombreCiudad,paisCiudad,temperaturaCiudad,descripcionCiudad});
            }
        }
        console.log(arrayCiudades);
        const obj = {
            nombreUsuario : localStorage.getItem("nombre"),
            apellidoUsuario : localStorage.getItem("apellido"),
            edadUsuario : localStorage.getItem("edad"),
            ciudadesGuardadas:arrayCiudades
        }
        //Conversión de Objeto JavaScript a JSON
        const str = JSON.stringify(obj);
        //Se guarda el JSON obtenido en el LocalStorage para ser visualizado en otra pagina
        localStorage.setItem("cadenaJson",str);
        console.log(localStorage.getItem("cadenaJson"));
        window.location="pagina3.html";
    }
}