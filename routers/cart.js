const express = require('express');
const router = express.Router();
const CartItem = require('./../modules/CartItem');
const {getListData} = require('./address-book');

router.use((req, res, next)=>{
    // 判斷有沒有通過 jwt 驗證 (寫在 index.js 主程式)
    if(req.myAuth && req.myAuth.id){
        next();
    } else {
        res.json({success: false, error:'沒有 token 或者 token 不合法'});
    }
});

// 讀取列表(GET)
router.get('/', async(req, res)=>{
    res.json({info: 'ok'});
})

// 新增(POST)
router.post('/', async(req, res)=>{
    res.json(await CartItem.add(req.myAuth.id, req.body.product_sid, req.body.quantity));
})

// 修改(PUT)
router.put('/:id', async(req, res)=>{
    res.json(await CartItem.update(req.myAuth.id, req.body.product_sid, req.body.quantity));
})

// 刪除(DELETE)
router.delete('/:id', async(req, res)=>{
    res.json(await CartItem.remove(req.myAuth.id, req.body.product_sid));
})

// 清空(CLEAR)
router.delete('/', async(req, res)=>{
    res.json(await CartItem.clear(req.myAuth.id));
})


module.exports = router;