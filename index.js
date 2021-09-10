require('dotenv').config(); //使用dotenv的套件去載入.env檔案

//建立web server
const express = require('express');
const session = require('express-session');
const multer = require('multer');
const moment = require('moment-timezone');
const MysqlStore = require('express-mysql-session')(session);
const upload = multer({dest: __dirname + '/tmp_uploads/'})
const fs = require('fs').promises;
const uploadImg = require('./modules/upload-images');
const db = require('./modules/connect-mysql');
const session_store = new MysqlStore({}, db);

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

//通用的middleware變數
app.use((_req, _res, next)=>{
    _res.locals.title = 'My Website';
    _res.locals.pageName = '';

    //定義可在ejs中使用的一些funciton
    _res.locals.dateToDateString = d => moment(d).format('YYYY-MM-DD');
    _res.locals.dateToDateTimeString = d => moment(d).format('YYYY-MM-DD HH:mm:ss');
    next();
});

//設定session的預設值
app.use(session({
    saveUninitialized: false, //強制把未初始化的session存回
    resave: false, //強制存回session空間，即便沒有變動
    secret: 'wbaigvno248g03u0gu-atu-21th34o9rgna', //隨便打的加密字串
    store: session_store,
    cookie:{
        maxAge: 1200000, //session存活時間，單位毫秒
    }
}));


//路由 start
app.get('/', (_req, _res)=>{
    // _res.send(`n<h2>Hello</h2>`); //send內容會自動視為html
    _res.render('home', {name: 'NetherCod'});
});

app.get('/json-sales', (_req, _res)=>{
    _res.locals.pageName = 'json-sales';
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


//檔案upload
app.post('/try-upload', upload.single('avatar'), async (_req, _res)=>{
    if(_req.file && _req.file.mimetype==='image/jpeg'){
        try{
             //上傳後的搬運，不經過tmp_uploads
            await fs.rename(_req.file.path, __dirname + '/public/img/'+ _req.file.originalname);
            return _res.json({success: true, filename: _req.file.originalname});
        } catch(error){
            return _res.json({success: false, error: '無法存檔'});
        }
    }else{
        // await fs.unlink(_req.file.path); //如果格式錯誤則不上傳至tmp_uploads
        _res.json({success: false, error: '格式非jpeg'});
    }
    
});

//使用multer模組上傳圖片
app.post('/try-upload2', uploadImg.single('avatar'), async (req, res)=>{
    res.json(req.file);
});

app.post('/try-upload3', uploadImg.array('photo', 10), async (req, res)=>{
    res.json(req.files);
});

//params可以直接記住/:的字串(:後的內容為key)，加上問號就可以為空，沒加直接訪問時會404 ex:/my-params1/edit/123
app.get('/my-params1/:action?/:id(\\d+)?', (_req, _res)=>{
    _res.json(_req.params);
});
app.get(/^\/m\/09\d{2}-?\d{3}-?\d{3}$/i, (_req, _res)=>{
    let u = _req.url.split('?')[0];
    u = u.slice(3);
    u = u.split('-').join('');
    _res.json({
        'url': _req.url,
        'mobile': u,
    });
});

//將路由的內容模組化
app.use(require(__dirname + '/routers/admin'));
app.use('/admin2', require(__dirname + '/routers/admin2'));
app.use('/address-book', require(__dirname + '/routers/address-book'));

//session
app.get('/try-sess', (_req, _res)=>{
    _req.session.myVar = _req.session.myVar || 0;
    _req.session.myVar++;

    _res.json(_req.session);
});

//moment-timezone
app.get('/try-moment', (_req, _res)=>{
    const fm = 'yyyy-MM-DD HH:mm:ss';
    
    _res.json({
        m1: moment().format(fm),
        m2: moment().tz('Asia/Tokyo').format(fm),
    });
});

//mysql
app.get('/try-db', async (_req, _res)=>{
    const [result] = await db.query("SELECT * FROM address_book WHERE `name` LIKE ?", ['%新%']);
    _res.json(result);
});

//路由 end
app.use( (_req, _res)=>{
    _res.status(404).send(`<h1>找不到頁面</h1>`);
});


let port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`NODE_ENV: ${process.env.NODE_ENV}`, new Date());
    console.log(`啟動埠號: ${port}`, new Date());
});
