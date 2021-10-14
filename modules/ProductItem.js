const db = require('./../modules/connect-mysql');

const tableName = 'products'; // 設定資料表名稱

class ProductItem{
    constructor(defaultObj = {}){
        this.data = defaultObj;
    }
    // 讀取&篩選
    static async findAll(){
        let option = {
            perPage: 5,
            page: 1,
        }
        const output = {
            perPage: option.perPage,
            page: option.page,
            totalRows: 0,
            totalPages: 0,
            rows: []
        }
        const total_sql = `SELECT COUNT(1) totalRows FROM ${tableName}`;
        const [total_result] = await db.query(total_sql);
        const totalRows = total_result[0].totalRows;

        if(totalRows > 0){
            const sql = `SELECT * FROM ${tableName} LIMIT ${(option.page - 1) * option.perPage}, ${option.perPage}`;
            const result = await db.query(sql);
            output.rows = result;
            output.totalRows = totalRows;
            output.totalPages = Math.ceil(totalRows / option.perPage)
        }
        return output;
    }


    // 讀取
    static async readOneItem(id){
        const sql = `SELECT * FROM ${tableName} WHERE sid=?`;
        const [result] = await db.query(sql, [id]);
        if(result && result.length===1){
            return new ProductItem(result[0]);
        }else{
            return null;
        }
    }
    // 基本功能
    toJSON(){
        return this.data;
    }
    toString(){
        return JSON.stringify(this.data, null, 4);
    }

    // 儲存變動
    async save(){
        if(this.data.sid){
            // 已經有primary key為修改
            const sid = this.data.sid;
            const data = {...this.data};
            delete data.sid; //將複製過的data物件中的sid刪除(避免出現覆蓋意外錯誤)
            const sql = `UPDATE ${tableName} SET ? WHERE sid=?`;
            const [r] = await db.query(sql, [data, sid]);
            return r;
        }else{
            // 沒有primary key為新增
            const sql = `INSERT INTO ${tableName} SET ?`;
            const [r] = await db.query(sql, [this.data]);
            return r;
        }
    }

    // 修改
    async edit(obj={}){
        for(let i in this.data){
            if(i==='sid') continue; //如果修改到primary key 直接跳出(不給修改)
            if(obj[i]){
                this.data[i] = obj[i];
            }
        }
        return await this.save();
    }

    // 刪除
    async remove(){
        const sql = `DELETE FROM ${tableName} WHERE sid=?`;
        const [r] = await db.query(sql, [this.data.sid]);
        return r;
    }

}

module.exports = ProductItem;