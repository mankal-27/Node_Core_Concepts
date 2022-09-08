class DatabaseService {
    save(email, price, timestamp) {
        console.log(`Running query: INSERT INTO orders VALUES (email, price, creatd) Value
        (${email}, ${price}, ${timestamp})`);
    }
}

module.exports = DatabaseService