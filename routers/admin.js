const express = require('express');
const router = express.Router();

router.get('/admin/:p1?/:p2?', (_req, _res)=>{
    _res.json({
        'Params': _req.params,
    });
});

module.exports = router;