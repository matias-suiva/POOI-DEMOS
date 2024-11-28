class Movement {
    constructor(type, amount, date, accountId) {
        this.type = type; // "deposit" or "withdraw"
        this.amount = amount;
        this.date = date;
        this.accountId = accountId;
    }
}
