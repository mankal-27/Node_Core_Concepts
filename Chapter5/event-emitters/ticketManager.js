const EventEmitter = require("events");

class TicketManager extends EventEmitter {
    constructor(supply) {
        super();
        this.supply = supply;
    }

    buy(email, price){
        if(this.supply > 0){
            this.supply--;
            this.emit("buy", email, price, Date.now());
        }
        
        this.emit("error", new Error("There are no more ticket left to purchase"));
    }
}

module.exports = TicketManager