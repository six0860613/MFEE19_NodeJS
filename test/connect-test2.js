const db = require('./../modules/connect-mysql');

db.query("SELECT * FROM address_book LIMIT 5")
    .then(([result])=>{ //只能用一個值，但由於查詢的result會是兩個值，故用array包起來
        console.log(result);
        process.exit();
    })
    .catch(err=>{
        console.log(err);
    });