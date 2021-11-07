const express = require('express');
const router = express.Router();
const Message = require('../modules/Message');

// add
router.post('/', async(req, res)=>{
    res.json(await Message.add(req.body));
})

// get 
router.get('/:conversationID', async (req, res)=>{
    res.json(await Message.getList(req.params.conversationID));
})
module.exports = router;