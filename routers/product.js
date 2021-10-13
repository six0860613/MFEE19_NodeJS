const express = require('express');
// const db = require('./../modules/connect-mysql');
const ProductItem = require('./../modules/ProductItem');
const router = express.Router();
const upload = require('./../modules/upload-images'); //為了引用multer方法

// 讀取列表(GET)
router.get('/', async(req, res)=>{

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

})

// 修改(PUT)
router.put('/:id', async(req, res)=>{

})

// 刪除(DELETE)
router.delete('/:id', async(req, res)=>{

})


module.exports = router;