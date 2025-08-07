let mysql = require("mysql") //---import mysql module

//create connection object
let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "n3u3da!",
    database: "financial_db"
})

//connect to mysql
connection.connect((error)=>{
    if(error){
        console.log("connection failed");
        console.log(error); 
    }
    console.log("Successfully connected..!");

   
})
module.exports = connection; //---export connection object