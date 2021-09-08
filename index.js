require('dotenv').config(); //使用dotenv的套件去載入.env檔案

//建立web server
const express = require('express');
const app = express();

//設定樣板
app.set('view engine', 'ejs');

//在進入路由前就設定body-parser，先進行解析
app.use(express.urlencoded({extended: false})); //urlencoded解析
app.use(express.json()); //json解析
//設定靜態內容的資料夾
app.use('/',express.static(__dirname + '/public'));
// app.use('/jquery', express.static('node_modules/jquery/dist')); 可以引用node_modules
// app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));

//設定路由 start
app.get('/', (_req, _res)=>{
    // _res.send(`n<h2>Hello</h2>`); //send內容會自動視為html
    _res.render('home', {name: 'NetherCod'});
});

app.get('/json-sales', (_req, _res)=>{
    const sales = require('./data/sales.json');
    // console.log(sales);
    // _res.json(sales);
    _res.render('json-sales',{sales});
});

app.get('/try-qs', (_req, _res)=>{
    _res.json(_req.query); //把網址中?後的get資料傳遞包成query物件
});

//設定POST的打包方式與POST傳遞 (利用body-parser處理)
// const urlencodedParser = express.urlencoded({extended: false});
// const jsonParser = express.json();
// app.post('/try-post', [urlencodedParser, jsonParser], (_req, _res)=>{
//     _res.json(_req.body); //發出的request會放在body物件內，所以response轉換的標的就是req.body
// });
app.post('/try-post', (_req, _res)=>{
    _res.json(_req.body); //發出的request會放在body物件內，所以response轉換的標的就是req.body
});


//form的發送
app.get('/try-post-form', (_req, _res)=>{
    _res.render('try-post-form');
});

app.post('/try-post-form', (_req, _res)=>{
    _res.render('try-post-form', _req.body);
});

//等待中要做的事
app.get('/pending', (_req, _res)=>{
    
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
