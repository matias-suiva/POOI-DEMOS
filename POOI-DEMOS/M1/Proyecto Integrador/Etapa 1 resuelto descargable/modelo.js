class Cliente {
    constructor(id, nombre, email, password, confirmPassword) {
        if (!this.validarNombre(nombre)) throw new Error('Nombre inválido');
        if (!this.validarEmail(email)) throw new Error('Email inválido');
        if (!this.validarPassword(password)) throw new Error('Password inválido');

        this.id = id; // Identificador único
        this.nombre = nombre;
        this.email = email;
        this.password = password;
    }

    // Validar el nombre
    validarNombre(nombre) {
        return typeof nombre === 'string' && nombre.trim().length > 0;
    }

    // Validar el correo electrónico
    validarEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validar la contraseña
    validarPassword(password) {
        return typeof password === 'string' && password.length >= 6;
    }
}

class Movimiento {
    constructor(tipo, monto, fecha, motivo) {
        this.tipo = tipo; // 'Depósito' o 'Retiro'
        this.monto = monto;
        this.fecha = fecha;
        this.motivo = motivo;
    }
}


class Cuenta {
    constructor(codigo, cliente, saldoInicial = 0) {
        this.codigo = codigo; // Código único
        this.cliente = cliente; // Referencia al objeto Cliente
        this.saldo = saldoInicial;
        this.movimientos = []; // Lista de movimientos
    }

    // Método para depositar dinero
    depositar(monto, motivo) {
        this.saldo += monto;
        this.registrarMovimiento('Depósito', monto, motivo);
    }



    // Método para retirar dinero
    retirar(monto, motivo) {
        if (monto > this.saldo) {
            throw new Error('Saldo insuficiente');
        }
        this.saldo -= monto;
        this.registrarMovimiento('Retiro', monto, motivo);
    }

    // Método para registrar un movimiento
    registrarMovimiento(tipo, monto, motivo) {
        const movimiento = new Movimiento(tipo, monto, new Date(), motivo);
        this.movimientos.push(movimiento);
    }

    // Método para consultar el saldo
    consultarSaldo() {
        return this.saldo;
    }
}

class Fintech {
    constructor() {
        this.clientes = new Map(); // Almacenar clientes usando un Map para búsquedas rápidas
        this.cuentas = new Map();  // Almacenar cuentas usando un Map para búsquedas rápidas
        this.clienteIdCounter = 1; // Contador para generar IDs únicos
        this.cuentaCodigoCounter = 1; // Contador para generar códigos únicos
        this.cuentaActual = null;
    }

    // Método para crear un nuevo cliente
    crearCliente(nombre, email, password, confirmPassword) {
        // Verificar si ya existe un cliente con el mismo email
        for (let cliente of this.clientes.values()) {
            if (cliente.email === email) {
                throw new Error(`Ya existe un cliente con el correo electrónico ${email}.`);
            }
        }

        // Crear el nuevo cliente
        const id = this.clienteIdCounter++;
        const nuevoCliente = new Cliente(id, nombre, email, password, confirmPassword);
        this.clientes.set(id, nuevoCliente);

        // Crear una cuenta asociada al nuevo cliente usando crearCuenta
        const nuevaCuenta = this.crearCuenta(id);

        return nuevoCliente;
    }

    // Método para crear una nueva cuenta
    crearCuenta(clienteId, saldoInicial = 0) {
        const cliente = this.clientes.get(clienteId);
        if (!cliente) {
            throw new Error(`Cliente con ID ${clienteId} no encontrado.`);
        }
        const codigo = `ACC${this.cuentaCodigoCounter++}`;
        const nuevaCuenta = new Cuenta(codigo, cliente, saldoInicial);
        this.cuentas.set(codigo, nuevaCuenta);
        return nuevaCuenta;
    }

    // Método para realizar un depósito
    depositar(codigoCuenta, monto) {
        const cuenta = this.cuentas.get(codigoCuenta);
        if (!cuenta) {
            throw new Error(`Cuenta con código ${codigoCuenta} no encontrada.`);
        }
        cuenta.depositar(monto);
    }

    // Método para realizar un retiro
    retirar(codigoCuenta, monto) {
        const cuenta = this.cuentas.get(codigoCuenta);
        if (!cuenta) {
            throw new Error(`Cuenta con código ${codigoCuenta} no encontrada.`);
        }
        cuenta.retirar(monto);
    }

    // Método para consultar el saldo de una cuenta
    consultarSaldo(codigoCuenta) {
        const cuenta = this.cuentas.get(codigoCuenta);
        if (!cuenta) {
            throw new Error(`Cuenta con código ${codigoCuenta} no encontrada.`);
        }
        return cuenta.consultarSaldo();
    }

    // Método para obtener el historial de movimientos de una cuenta
    obtenerMovimientos(codigoCuenta) {
        const cuenta = this.cuentas.get(codigoCuenta);
        if (!cuenta) {
            throw new Error(`Cuenta con código ${codigoCuenta} no encontrada.`);
        }
        return cuenta.movimientos;
    }

    login(email, password) {
        for (let cliente of this.clientes.values()) {
            if (cliente.email === email && cliente.password === password) {
                this.cuentaActual = this.obtenerCuentaPorCliente(cliente.id);
                return cliente; // Devuelve el objeto Cliente si las credenciales son correctas
            }
        }
        throw new Error('Correo electrónico o contraseña incorrectos.');
    }

    obtenerCuentaPorCliente(clienteId) {
        for (let cuenta of this.cuentas.values()) {
            if (cuenta.cliente.id === clienteId) {
                return cuenta; // Devuelve el objeto Cuenta si se encuentra una cuenta asociada al cliente
            }
        }
        throw new Error(`No se encontró ninguna cuenta para el cliente con ID ${clienteId}.`);
    }

    transferir(codigoCuentaOrigen, emailDestino, monto, motivo) {
        const cuentaOrigen = this.cuentas.get(codigoCuentaOrigen);
        if (!cuentaOrigen) {
            throw new Error(`Cuenta origen con código ${codigoCuentaOrigen} no encontrada.`);
        }
    
        let cuentaDestino = null;
        for (let cliente of this.clientes.values()) {
            if (cliente.email === emailDestino) {
                cuentaDestino = this.obtenerCuentaPorCliente(cliente.id);
                break;
            }
        }
    
        if (!cuentaDestino) {
            throw new Error(`No se encontró ninguna cuenta asociada al correo ${emailDestino}.`);
        }
    
        if (cuentaOrigen.saldo < monto) {
            throw new Error('Saldo insuficiente en la cuenta origen.');
        }
    
        cuentaOrigen.retirar(monto, `Transferencia a ${cuentaDestino.codigo}: ${motivo}`);
        cuentaDestino.depositar(monto, `Transferencia de ${codigoCuentaOrigen}: ${motivo}`);
    }
}

let modelo = new Fintech();
let clienteDemo = modelo.crearCliente("Juan", "esteban.calabria@gmail.com","12345678","12345678");
//modelo.crearCuenta(clienteDemo.id, 0);

let clienteDemo2 = modelo.crearCliente("Pedro", "pedro@gmail.com","12345678","12345678");
//pedrmodelo.crearCuenta(clienteDemo2.id, 0);

//let usuarioActual = null;
let cuentaActual = null;

window.modelo = modelo;