const db = require('./../modules/connect-mysql');

const tableName = 'products'; // 設定資料表名稱

class ProductItem{
    static async readOneItem(id){
        const sql = `SELECT * FROM ${tableName} WHERE sid=?`;
        const [result] = await db.query(sql, [id]);
        if(result && result.length===1){
            return result[0];
        }else{
            return null;
        }
    }
}

module.exports = ProductItem;