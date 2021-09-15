const express = require('express');
const db = require('./../modules/connect-mysql');
const router = express.Router();
const upload = require('./../modules/upload-images'); //為了引用multer方法

async function getListData( _req, _res){
    const perPage = 5;
    let page = parseInt(_req.query.page) || 1; //有頁數時傳入頁數，沒有則為第一頁
    let keyword = _req.query.keyword || ''; //由其他地方發來的?keyword=
    keyword = keyword.trim();
    _res.locals.keyword = keyword;
    
    const output = {

    };

    let where = " WHERE 1 ";
    if(keyword){
        output.keyword = keyword;
        where += ` AND \`name\` LIKE ${ db.escape('%'+keyword+'%')} ` //mysql的跳脫(類似PHP的quote)
    }

    const total_sql = `SELECT COUNT(1) totalRows FROM \`address_book\` ${where}`; //算總筆數的SQL
    const [[{totalRows}]] = await db.query(total_sql); //資料庫的database使用SQL語法查詢
    output.totalRows = totalRows; //資料總筆數
    output.totalPages = Math.ceil(totalRows/perPage); //資料總頁數
    output.perPage = perPage;
    output.page = page;
    output.rows = [];

    //有資料筆數才處理
    if(totalRows > 0){
        if(page<1){
            output.redirect = '?page=1';
            // return _res.redirect('?page=1'); //回到第一頁
            return output;
        }
        if(page>output.totalPages){
            output.redirect = '?page=' + output.totalPages;
            // return _res.redirect('?page='+ output.totalPages);
            return output;
        }

        const sql = `SELECT * FROM \`address_book\` ${where} ORDER BY sid DESC LIMIT  ${(page-1) * perPage}, ${perPage}`;
        const [rows] = await db.query(sql);
        output.rows = rows;

    }
    return output;
}
router.getListData = getListData; //在router上使用一個與function相同的變數

router.get('/', (_req, _res)=>{
    _res.render('address-book/main');
});

//SELECT
router.get('/list', async (_req, _res)=>{
    _res.locals.pageName = 'address-book-list';
    
    const output = await getListData(_req, _res);
    if(output.redirect){
        return _res.redirect(output.redirect);
    }

    _res.render('address-book/list', output);
});


router.get('/api/list', async (_req, _res)=>{
    const output = await getListData(_req, _res);
    _res.json(output);
});


//刪除
router.delete('/delete/:sid([0-9]+)', async(_req, _res)=>{ 
    //[0-9]+ → 0-9必須為數值 +必須要有一個以上
    const sql = "DELETE FROM \`address_book\` WHERE sid=?"
    const [result] = await db.query(sql, _req.params.sid);
    console.log({result});
    _res.json(result);
});
//新增
router.route('/add')
    .get(async (_req, _res)=>{ 
        _res.locals.pageName = 'address-book-add';
        _res.render('address-book/add');
    })
    .post(upload.none(), async(_req, _res)=>{ 

        const output = {
            success: false,
        }

        //一般SQL寫法
        // const sql = "INSERT INTO `address_book`(" +
        //     "`name`, `email`, `mobile`, `birthday`, `address`, `created_at`) VALUES (?, ?, ?, ?, ?, NOW())";

        // const [result] = await db.query(sql, [
        //     _req.body.name,
        //     _req.body.email,
        //     _req.body.mobile,
        //     _req.body.birthday,
        //     _req.body.address,
        // ]);

        //mysql2提供的套件方法
        const input = {..._req.body, created_at: new Date()};
        const sql = "INSERT INTO `address_book` SET ?";
        let result = {};
        try{
            [result] = await db.query(sql, [input]);
        }catch(err){
            output.error = err.toString();
        }

        output.result = result;
        if(result.affectedRows && result.insertId){
            output.success = true;
        }
        /* result物件的內容
        result:
            affectedRows: 1
            fieldCount: 0
            info: ""
            insertId: 95
            serverStatus: 2
            warningStatus: 0
        */
        console.log({result});
        _res.json(output);
    });
//修改
router.route('/edit/:sid')
    .get(async (_req, _res)=>{
        const sql = "SELECT * FROM `address_book` WHERE sid=?";
        const [result] = await db.query(sql, [_req.params.sid]);

        if(result.length){
            _res.render('address-book/edit', {row: result[0]});
        }else{
            _res.redirect('/address-book/list')
        }
    })
    .post(async (_req, _res)=>{
        const output = {
            success: false,
            postData: _req.body,
        };

        const input = {..._req.body};
        const sql = "UPDATE `address_book` SET ? WHERE sid=?";
        let result = {};

        try{
            [result] = await db.query(sql, [input, _req.params.sid]);
        }catch(ex){
            output.error = ex.toString();
        }
        output.result = result;
        if(result.affectedRows===1){
            if(result.changedRows===1){
                output.success = true;
            }else{
                output.error = '資料未變更';
            }
        }
        _res.json(output);
    })
module.exports = router;