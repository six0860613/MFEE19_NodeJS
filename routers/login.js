const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./../modules/connect-mysql');
const upload = require('./../modules/upload-images');
const router = express.Router();

const { getListData } = require('./address-book');

//SOT
const client = require('soundoftext-js');
router.get('/sound-of-text', (_req, _res) => {
    _res.locals.pageName = 'sound-of-text';
    _res.render('sound-of-text');
});
router.post('/sound-of-text', async (_req, _res)=>{
    const [word] = Object.keys(_req.body);
    
    await client.sounds.request({ text: word, voice: 'en-US' })
    .then(response => {
        _res.json(response);
    })
    .catch(e => {
        console.log(e);
    });
});


//登入
router.get('/login', (_req, _res)=>{
    _res.locals.pageName = 'login';
    _res.render('login');
});
router.post('/login', async (_req, _res)=>{

    const [rs] = await db.query("SELECT * FROM members WHERE `email`=?", [_req.body.email]);

    if(!rs.length){
        // 帳號有誤
        return _res.json({success: false});
    }

    const success = await bcrypt.compare(_req.body.password, rs[0].password);
    if(success){
        const {id, email, nickname} = rs[0];
        _req.session.member = {id, email, nickname};
    }

    _res.json({success});
});


//註冊
router.get('/register', (_req, _res) => {
    _res.locals.pageName = 'register';
    _res.render('register');
});
router.post('/register', async (_req, _res) => {
    const output = {
        success: false,
        postData: _req.body,
        error: '',
    };
    const hash = await bcrypt.hash(_req.body.password, 10);
    const sql = "INSERT INTO `members`(`email`, `password`, `mobile`, `birthday`, `nickname`, `create_at`) VALUES (?, ?, ?, ?, ?, NOW())";
    let result;
    try {
        [result] = await db.query(sql, [
            _req.body.email,
            hash,
            _req.body.mobile,
            _req.body.birthday,
            _req.body.nickname,
        ]);
        if(result.affectedRows===1){
            output.success = true;
        }else{
            output.error = '新增會員失敗';
        }
    } catch (error) {
        console.log(error);
        output.error = 'Email已被使用過';
    }

    _res.json(output);
});

//帳號是否重複的即時確認
router.get('/account-check', async (_req, _res)=>{
    const sql = "SELECT 1 FROM members WHERE `email`=?";
    const [rs] = await db.query(sql, [_req.query.email ]);
    _res.json({used: !!rs.length });
});

//登出
router.get('/logout', (_req, _res) => {
    delete _req.session.member;
    _res.redirect('/');
});



router.post('/login-jwt', async (_req, _res)=>{

    const output = {
        success: false,
        token: null,
    };

    const [rs] = await db.query("SELECT * FROM members WHERE `email`=?", [_req.body.email]);

    if(!rs.length){
        return _res.json(output);
    }

    const success = await bcrypt.compare(_req.body.password, rs[0].password);
    if(success){
        const {id, email, nickname} = rs[0];
        // _req.session.member = {id, email, nickname};
        output.token = await jwt.sign({id, email, nickname}, process.env.JWT_SECRET);
        output.success = true;
        output.member = {id, email, nickname};
    }

    _res.json(output);
});

router.get('/get-data-jwt', async (_req, _res)=>{
    const output={
        success: false,
        data: null,
    };

    //jwt驗證 在middleware就先跑過驗證得到myAuth物件
    if(_req.myAuth && _req.myAuth.id){
        output.member = _req.myAuth;
        output.success = true;
        output.data = await getListData(_req, _res);
    }else{
        output.error = 'token為空或token有誤';
    }
    
    _res.json(output);
});


module.exports = router;