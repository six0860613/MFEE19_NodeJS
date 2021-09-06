const fs = require('fs');

const data ={
    name: 'David',
    age: 25,
};

fs.writeFile(
    __dirname + '/data.json',  //__dirname取得writeFile.js的資料夾位址後，產生在裡面
    JSON.stringify(data, null, 2), 
    _error=>{
        if(_error){
            console.log('無法寫入檔案', _error);
            process.exit;
        }
        console.log('寫入成功');
    }
);