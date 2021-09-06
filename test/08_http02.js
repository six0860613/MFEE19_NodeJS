const http = require('http');
const fs = require('fs');

const server = http.createServer((_req, _res)=>{
    _res.writeHead(200, {
        'Content-Type': 'text/html',
    });

    fs.writeFile(
        'header.txt',
        JSON.stringify(_req.headers, null, 2),
        _error =>{
            if(_error){
                _res.end(`<h1>FAILED, ${_error}</h1>`);
            }else{
                _res.end(`<h1>SUCCESS</h1>`)
            }
        }
    );
});

server.listen(3000);