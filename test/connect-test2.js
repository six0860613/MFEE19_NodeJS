const db = require('./../modules/connect-mysql');

db.query("SELECT * FROM address_book LIMIT 5")
    .then(([result])=>{
        console.log(result);
        process.exit();
    })
    .catch(err=>{
        console.log(err);
    });