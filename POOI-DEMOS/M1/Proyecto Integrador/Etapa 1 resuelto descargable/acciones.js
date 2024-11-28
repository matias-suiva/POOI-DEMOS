

function registrarse(){
    mostrarPantalla("registro");
}

function login(usuario, password){

    try{
        const usuarioActual = modelo.login(usuario, password);
        cuentaActual = modelo.obtenerCuentaPorCliente(usuarioActual.id);
        mostrarPantalla("cuenta");    
    } catch(excepcion){
        document.getElementById("login_mstError").innerHTML = excepcion;
    }
}

function volverAlLogin(){
    mostrarPantalla("login");
}

function registrarUsuario(nombre, correo, password, confirmPassword){
    try {
        let cliente = modelo.crearCliente(nombre, correo, password, confirmPassword);
        mostrarPantalla("login");
    } catch (excepcion) {
        document.getElementById("registro_msgError").innerHTML = excepcion;
    }
}

function prepararTransferencia(){

}

function requerirTransferencia(){
    mostrarPantalla("transferencia");
}

function requerirIngresarDinero(){
    mostrarPantalla("Ingreso-dinero");
}

function requerirCuenta(){
    mostrarPantalla("cuenta");
}

function requerirMovimientos(){
    mostrarPantalla("movimientos");
}

function ingresarDinero(monto, motivo){
    cuentaActual.depositar(monto, motivo);
    mostrarPantalla("cuenta");
}

function transferir(mailDestino, monto){
    try{
        modelo.transferir(cuentaActual.codigo, mailDestino, monto);
        mostrarPantalla("cuenta");
    }catch(exception){
        document.getElementById("transferencia_msgError").innerHTML = exception
    }
}

