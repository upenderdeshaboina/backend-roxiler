const express = require('express');
const {open} = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require('path');
const axios = require('axios');

const dbPath = path.join(__dirname, "transactions.db");
const thirdPartyUrl = "https://s3.amazonaws.com/roxiler.com/product_transaction.json";



const initializeDatabase = async () => {
    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    })

    await db.run(`
        CREATE TABLE IF NOT EXISTS Transactions(
            id INTEGER PRIMARY KEY,
            title TEXT,
            description TEXT,
            price REAL,
            dateOfSale TEXT,
            issold BOOLEAN,
            category TEXT

        )
    
    `)

    const response = await axios.get(thirdPartyUrl);
    const transactionData =  response.data;

    const insertQuery = `
        INSERT INTO Transactions (title, description, price, dateOfSale, issold, category)
        VALUES (?, ?, ?, ?, ?, ?)
    
    `;
    const preparingData = await db.prepare(insertQuery);
    for (let x of transactionData){
        await preparingData.run(x.title, x.description, x.price, x.dateOfSale, x.sold, x.category)
    }

    return db

};



module.exports = {initializeDatabase};