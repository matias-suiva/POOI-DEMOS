function mostrarDatos(){
    
    try{
       if (cuentaActual){
           if(document.getElementById("cuenta_msgUsuario")){
                document.getElementById("cuenta_msgUsuario").innerHTML = cuentaActual.cliente.nombre;
                document.getElementById("cuenta_msgBalance").innerHTML = "$ " + cuentaActual.saldo;
           }

           if (document.getElementById("listaMovimientos")){
                document.getElementById("movimientos_msgSaldo").innerHTML = "$ " + cuentaActual.saldo;
                document.getElementById("listaMovimientos").innerHTML = '';
                
                for (let movimiento of cuentaActual.movimientos){
                    document.getElementById("listaMovimientos").innerHTML +=
                    `<div class="bg-green-100 border-l-4 ${movimiento.tipo=='Retiro' ? "border-red-500" : "border-green-500"} p-4 rounded-lg">
                        <div class="flex justify-between items-center">
                            <div>
                                <p class="font-semibold">Fecha: <span class="font-normal">${movimiento.fecha.toISOString().split('T')[0]}</span></p>
                                <p class="font-semibold">Detalle: <span class="font-normal">${movimiento.motivo}</span></p>
                            </div>
                            <p class="text-green-700 font-bold text-lg">+ ${movimiento.monto}</p>
                        </div>
                    </div>`
                }
           }
        }
    }catch(err){

    }
}

function mostrarPantalla(pantalla) {
    fetch(pantalla + ".html")
        .then(respuesta => respuesta.text())
        .then(texto => {
            document.getElementById("root").innerHTML = texto;
            mostrarDatos();
        })
}
