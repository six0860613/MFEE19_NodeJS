require('dotenv').config(); //使用dotenv的套件去載入.env檔案

//建立web server
const express = require('express');
const app = express();

//設定樣板
app.set('view engine', 'ejs');

//設定靜態內容的資料夾
app.use('/',express.static(__dirname + '/public'));
// app.use('/jquery', express.static('node_modules/jquery/dist'));
// app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));

//設定路由 start
app.get('/', (_req, _res)=>{
    // _res.send(`n<h2>Hello</h2>`); //send內容會自動視為html
    _res.render('home', {name: 'NetherCod'});
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
