class Account {
    constructor(code, clientId, initialBalance = 0) {
        this.code = code;
        this.clientId = clientId;
        this.balance = initialBalance;
    }

    deposit(amount) {
        this.balance += amount;
    }

    withdraw(amount) {
        if (amount > this.balance) {
            throw new Error("Insufficient funds.");
        }
        this.balance -= amount;
    }
}
