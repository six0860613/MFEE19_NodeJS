const jwt = require('jsonwebtoken');

const skey = 'jfowefjoaiwgnv24t53425';
(async()=>{
    const token = await jwt.sign({name: 'David'}, skey);
    console.log(token);
    const token1 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiRGF2aWQiLCJpYXQiOjE2MzE2ODU2NjB9.QJTT1I99A6nHq-21l4o-dZvBvLH9K0fu9n21XHhA4tg';
    const decode = await jwt.verify(token1, skey);
    console.log(decode);
})();