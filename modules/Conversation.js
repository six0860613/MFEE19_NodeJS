const e = require('express');
const db = require('./connect-mysql');

const tableName = 'conversation'; // 設定資料表名稱

class Conversation{
    constructor(defaultObj = {}){
        this.data = defaultObj;
    }
    static async getList(memberID){
        // sender預設為學生 receiver預設為老師
        const sql = `SELECT * FROM ${tableName} WHERE senderID=?`;
        const [sender] = await db.query(sql, [memberID]);
        const sql2 = `SELECT * FROM ${tableName} WHERE receiverID=?`;
        const [receiver] = await db.query(sql2, [memberID]);
        if(sender && sender.length!==0){
            return sender;
        }else if(receiver && receiver.length!==0){
            return receiver;
        }else{
            return null;
        }
    }


    // 以產品ID跟會員ID找對應產品
    static async findItem(senderID, receiverID){
        const sql = `SELECT * FROM ${tableName} WHERE senderID=? AND receiverID=?`;
        const [result1] = await db.query(sql, [senderID, receiverID]);
        const sql2 = `SELECT * FROM ${tableName} WHERE senderID=? AND receiverID=?`;
        const [result2] = await db.query(sql2, [receiverID, senderID]);
        if(result1 && result1.length===1){
            return result1[0];
        }else if (result2 && result2.length===1){
            return result2[0];
        }else{
            return null;
        }
    }

    // 保存至購物車
    static async add(senderID, receiverID){
        const output = {
            success: false,
            error: '',
            result: '',
        }
        // 不要重複輸入資料
        if(await Conversation.findItem(senderID, receiverID)){
            output.error = "已存在此對話";
            return output;
        }

        const sql = `INSERT INTO ${tableName} (\`senderID\`, \`receiverID\`) VALUES (?,?)`;
        const [r] = await db.query(sql, [senderID, receiverID]);
        if(r.affectedRows===1){
            output.success = true;
            output.result = r;
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

module.exports = Conversation;