require('dotenv').config(); //使用dotenv的套件去載入.env檔案

//建立web server
const express = require('express');
const app = express();

//設定靜態內容的資料夾
app.use(express.static(__dirname + '/public')); 

//設定路由 start
app.get('/', (_req, _res)=>{
    _res.send(`<h2>Hello</h2>`); //send內容會自動視為html
});

//設定路由 end
app.use( (_req, _res)=>{
    _res.status(404).send(`<h1>找不到頁面</h1>`);
});


let port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`NODE_ENV: ${process.env.NODE_ENV}`, new Date());
    console.log(`啟動埠號: ${port}`, new Date());
});
