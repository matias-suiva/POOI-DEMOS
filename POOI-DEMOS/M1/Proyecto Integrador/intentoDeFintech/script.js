// Cargar clientes desde localStorage
function loadClients() {
    const storedClients = localStorage.getItem("clients");
    return storedClients ? JSON.parse(storedClients) : [];
}

// Guardar clientes en localStorage
function saveClients() {
    localStorage.setItem("clients", JSON.stringify(clients));
}

// Verificar si hay un usuario logueado
function loadSession() {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        showAppScreen();
    } else {
        showLoginScreen();
    }
}

// Registrar un nuevo cliente
function register(event) {
    event.preventDefault();

    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const firstName = document.getElementById("register-firstName").value;
    const lastName = document.getElementById("register-lastName").value;

    // Check if user already exists
    const existingUser = clients.find(client => client.email === email);
    const registerMessage = document.getElementById("register-message");

    if (existingUser) {
        registerMessage.className = "message error";
        registerMessage.textContent = "Email already registered.";
        return;
    }

    const id = clients.length + 1;
    const newClient = new Client(id, firstName, lastName, "", email, password);
    clients.push(newClient);
    saveClients(); // Save to localStorage

    registerMessage.className = "message success";
    registerMessage.textContent = "Registration successful! Please log in.";
    setTimeout(() => {
        showLoginScreen();
    }, 1000);
}

// Iniciar sesión
function login(event) {
    event.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const user = clients.find(client => client.email === email && client.password === password);
    const messageElement = document.getElementById("login-message");

    if (user) {
        currentUser = user;
        localStorage.setItem("currentUser", JSON.stringify(currentUser)); // Save session
        messageElement.className = "message success";
        messageElement.textContent = "Login successful!";
        setTimeout(() => {
            showAppScreen();
        }, 1000);
    } else {
        messageElement.className = "message error";
        messageElement.textContent = "Invalid email or password.";
    }
}

// Salir de la sesión
function logout() {
    currentUser = null;
    localStorage.removeItem("currentUser");
    showLoginScreen();
}

// Mostrar pantalla de registro
function showRegisterScreen() {
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("register-screen").style.display = "block";
}

// Mostrar pantalla de inicio de sesión
function showLoginScreen() {
    document.getElementById("login-screen").style.display = "flex";
    document.getElementById("register-screen").style.display = "none";
    document.getElementById("app-screen").style.display = "none";
}

// Mostrar pantalla principal
function showAppScreen() {
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("app-screen").style.display = "block";
    loadClients(); // Load clients from localStorage when the app screen is shown
}

// Mostrar clientes (solo para usuarios logueados)
function showClients() {
    if (!currentUser) {
        alert("You must be logged in to view this section.");
        return;
    }

    const app = document.getElementById("app");
    app.innerHTML = `
        <h2>Clients</h2>
        <ul>
            ${clients.map(client => `<li>${client.firstName} ${client.lastName} (DNI: ${client.dni})</li>`).join("")}
        </ul>
        <form onsubmit="addClient(event)">
            <h3>Add New Client</h3>
            <input type="text" id="firstName" placeholder="First Name" required />
            <input type="text" id="lastName" placeholder="Last Name" required />
            <input type="text" id="dni" placeholder="DNI" required />
            <input type="email" id="email" placeholder="Email" required />
            <input type="password" id="password" placeholder="Password" required />
            <button type="submit">Add Client</button>
        </form>
    `;
}

// Agregar un cliente (dummy para prueba)
function addClient(event) {
    event.preventDefault();
    const id = clients.length + 1;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const dni = document.getElementById("dni").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    clients.push(new Client(id, firstName, lastName, dni, email, password));
    saveClients(); // Guardamos los clientes en localStorage
    showClients();
}

// Mostrar cuentas (solo para usuarios logueados)
function showAccounts() {
    if (!currentUser) {
        alert("You must be logged in to view this section.");
        return;
    }

    const app = document.getElementById("app");
    app.innerHTML = `
        <h2>Accounts</h2>
        <ul>
            ${accounts.map(account => `<li>Account: ${account.code}, Balance: $${account.balance}</li>`).join("")}
        </ul>
        <form onsubmit="addAccount(event)">
            <h3>Add New Account</h3>
            <select id="clientId" required>
                <option value="">Select Client</option>
                ${clients.map(client => `<option value="${client.id}">${client.firstName} ${client.lastName}</option>`).join("")}
            </select>
            <input type="text" id="code" placeholder="Account Code" required />
            <input type="number" id="initialBalance" placeholder="Initial Balance" required />
            <button type="submit">Add Account</button>
        </form>
    `;
}

// Agregar una nueva cuenta
function addAccount(event) {
    event.preventDefault();
    const clientId = parseInt(document.getElementById("clientId").value);
    const code = document.getElementById("code").value;
    const initialBalance = parseFloat(document.getElementById("initialBalance").value);

    accounts.push(new Account(code, clientId, initialBalance));
    showAccounts();
}

// Mostrar transacciones (solo para usuarios logueados)
function showMovements() {
    if (!currentUser) {
        alert("You must be logged in to view this section.");
        return;
    }

    const app = document.getElementById("app");
    app.innerHTML = `
        <h2>Movements</h2>
        <ul>
            ${movements.map(move => `<li>${move.type} $${move.amount} on ${move.date}</li>`).join("")}
        </ul>
        <form onsubmit="addMovement(event)">
            <h3>Add New Movement</h3>
            <select id="accountId" required>
                <option value="">Select Account</option>
                ${accounts.map(account => `<option value="${account.code}">Account: ${account.code}</option>`).join("")}
            </select>
            <select id="type" required>
                <option value="">Select Type</option>
                <option value="deposit">Deposit</option>
                <option value="withdraw">Withdraw</option>
            </select>
            <input type="number" id="amount" placeholder="Amount" required />
            <button type="submit">Add Movement</button>
        </form>
    `;
}

// Agregar un nuevo movimiento
function addMovement(event) {
    event.preventDefault();
    const accountId = document.getElementById("accountId").value;
    const type = document.getElementById("type").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const date = new Date().toLocaleString();

    const account = accounts.find(acc => acc.code === accountId);
    if (type === "withdraw" && amount > account.balance) {
        alert("Insufficient funds!");
        return;
    }

    type === "deposit" ? account.deposit(amount) : account.withdraw(amount);

    movements.push(new Movement(type, amount, date, accountId));
    showMovements();
}

// Inicialización
let clients = loadClients(); // Load clients from localStorage
let accounts = [];
let movements = [];
let currentUser = null;
loadSession(); // Check if user is logged in and show appropriate screen
