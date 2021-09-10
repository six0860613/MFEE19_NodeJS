const express = require('express');
const db = require('./../modules/connect-mysql');
const router = express.Router();


router.get('/', (_req, _res)=>{
    _res.render('address-book/main');
});

router.get('/list', async (_req, _res)=>{
    _res.locals.pageName = 'address-book-list';
    const perPage = 5;
    let page = parseInt(_req.query.page) || 1; //有頁數時傳入頁數，沒有則為第一頁
    
    const output = {

    };

    const total_sql = "SELECT COUNT(1) totalRows FROM `address_book`"; //算總筆數的SQL
    const [[{totalRows}]] = await db.query(total_sql); //資料庫的database使用SQL語法查詢
    output.totalRows = totalRows; //資料總筆數
    output.totalPages = Math.ceil(totalRows/perPage); //資料總頁數
    output.perPage = perPage;
    output.page = page;
    output.rows = [];

    //有資料筆數才處理
    if(totalRows > 0){
        if(page<1){
            return _res.redirect('?page=1'); //回到第一頁
        }
        if(page>output.totalPages){
            return _res.redirect('?page='+ output.totalPages);
        }

        const sql = `SELECT * FROM \`address_book\` LIMIT ${(page-1) * perPage}, ${perPage}`;
        const [rows] = await db.query(sql);
        output.rows = rows;

    }

    // _res.json(output);
    _res.render('address-book/list', output);
});

module.exports = router;