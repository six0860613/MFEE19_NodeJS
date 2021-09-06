const http = require('http');

const server = http.createServer((_req, _res)=>{
    _res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    _res.end(`<h1>Hello ABV, ${_req.url}</h1>`)
});

server.listen(3000);