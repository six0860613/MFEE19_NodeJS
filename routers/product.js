const express = require('express');
// const db = require('./../modules/connect-mysql');
const ProductItem = require('./../modules/ProductItem');
const router = express.Router();
const upload = require('./../modules/upload-images'); //為了引用multer方法

// 讀取列表(GET)
router.get('/', async(req, res)=>{
    res.json(await ProductItem.findAll());
})

// 讀取單筆(GET)
router.get('/:id', async(req, res)=>{
    const output = {
        success: false,
        data: null,
    }
    const r = await ProductItem.readOneItem(req.params.id);
    if(r){
        output.success = true;
        output.data = r;
    }
    res.json(output);
})

// 新增(POST)
router.post('/', async(req, res)=>{
    const p1 = new ProductItem(req.body);
    res.json(await p1.save());
})

// 修改(PUT)
router.put('/:id', async(req, res)=>{
    const output = {
        success: false,
        result: null,
    }
    const p1 = await ProductItem.readOneItem(req.params.id);
    if(p1){
        output.success = true;
        output.result = await p1.edit(req.body);
    }
    res.json(output);
})

// 刪除(DELETE)
router.delete('/:id', async(req, res)=>{
    const output = {
        success: false,
        result: null,
    }
    const p1 = await ProductItem.readOneItem(req.params.id);
    if(p1){
        output.success = true;
        output.result = res.json(await p1.remove());
    }
    res.json(output);
})


module.exports = router;