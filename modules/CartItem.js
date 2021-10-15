const db = require('./../modules/connect-mysql');

const tableName = 'cart'; // 設定資料表名稱

class CartItem{
    constructor(defaultObj = {}){
        this.data = defaultObj;
    }
    // 讀取購物車並呈現
    static async getList(member_sid){
        const sql = `SELECT c.*, p.bookname, p.price  FROM cart c
                        JOIN products p 
                        ON p.sid=c.product_sid
                    WHERE member_sid=? ORDER BY created_at`;
        const [r] = await db.query(sql, [member_sid]);
        return r;
    }


    // 以產品ID跟會員ID找對應產品
    static async findItem(member_sid, product_sid){
        const sql = `SELECT * FROM ${tableName} WHERE member_sid=? AND product_sid=?`;
        const [result] = await db.query(sql, [member_sid, product_sid]);
        if(result && result.length===1){
            return result[0];
        }else{
            return null;
        }
    }

    // 保存至購物車
    static async add(member_sid, product_sid, quantity){
        const output = {
            success: false,
            error: '',
        }
        // TODO: 三個參數都必須要有資料

        // 不要重複輸入資料
        if(await CartItem.findItem(member_sid, product_sid)){
            output.error = "資料重複了";
            return output;
        }

        const obj = {
            member_sid, product_sid, quantity
        };

        const sql = `INSERT INTO cart SET ?`;
        const [r] = await db.query(sql, [obj]);
        output.success = !!r.affectedRows ? true : false;
        output.cartList = await CartItem.getList(member_sid);
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

module.exports = CartItem;