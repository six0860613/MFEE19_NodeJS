require('dotenv').config(); //使用dotenv的套件去載入.env檔案

const http = require('http');
const fs = require('fs');

const server = http.createServer((_req, _res)=>{
    _res.writeHead(200, {
        'Content-Type': 'text/html',
    });
    _res.end(`<h1>PORT LOAD : ${process.env.PORT}</h1>`)
});
console.log(`PORT:${process.env.PORT}`);
server.listen(process.env.PORT);