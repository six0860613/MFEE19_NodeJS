const db = require('./connect-mysql');

const tableName = 'message'; // 設定資料表名稱

class Message{
    constructor(defaultObj = {}){
        this.data = defaultObj;
    }
    // 讀取購物車並呈現
    static async getList(conversationID){
        const sql = `SELECT * FROM ${tableName} WHERE conversationID=?`;
        const [r] = await db.query(sql, [conversationID]);
        if(r && r.length!==0){
            return r;
        }else{
            return null;
        }
    }

    // 保存至購物車
    static async add(obj){
        const output = {
            success: false,
            error: '',
        }

        const input = {
            ...obj
        };

        const sql = `INSERT INTO ${tableName} SET ?`;
        const [r] = await db.query(sql, [input]);
        if(r.affectedRows!==0){
            const sql = `SELECT * FROM ${tableName} WHERE sid=?`;
            const [rs] = await db.query(sql, [r.insertId]);
            output.success = true;
            output.result = rs;
        }else{
            output.error = '新增失敗';
        }
        return output;
    }

    // 修改項目
    static async update(member_sid, product_sid, quantity){

    }

    // 刪除項目
    static async remove(member_sid, product_sid){
        const sql = `DELETE FROM ${tableName} WHERE member_sid=? AND product_sid=?`;
        const [r] = await db.query(sql, [member_sid, product_sid]);
        return r;
    }

    // 清空購物車
    static async clear(member_id){

    }
}

module.exports = Message;