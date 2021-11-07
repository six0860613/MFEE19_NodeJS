const express = require('express');
const router = express.Router();
const Conversation = require('../modules/Conversation');

// new conversation
// 新增(POST)
router.post('/', async(req, res)=>{
    res.json(await Conversation.add(req.body.senderID, req.body.receiverID));
})
// get conversation

router.get('/:memberID', async (req, res)=>{
    res.json(await Conversation.getList(req.params.memberID));
})
module.exports = router;