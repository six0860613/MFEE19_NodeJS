const express = require('express');
const router = express.Router();

router.get('/:p3?/:p4?', (_req, _res)=>{
    _res.json({
        'Params': _req.params,
        'URL': _req.url,
        'baseURL': _req.baseUrl,
        'originalURL': _req.originalUrl,
    });
});

module.exports = router;