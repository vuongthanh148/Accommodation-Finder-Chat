const route = require('express').Router();
const ChatBox = require('./models/Chatbox');
const jwt = require('jsonwebtoken');

// const verifyToken = (req, res, next) => {
// 	const { authorization } = req.headers
// 	if (!authorization) {
// 		return res.status(401).json({
// 			message: 'Auth failed',
// 		})
// 	}
// 	const token = authorization.split(' ')[1];
// 	const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
// 	req.data = decoded
// 	req.role = decoded.role
// 	next()
// }

route.post('/createChatbox', async (req, res, next) => {
    try {
        console.log(req.body);
        let role = req.body.role;
        let ownerId = '';
        let ownerName = '';
        let ownerAvatar = '';
        if (role === 'OWNER') {
            ownerId = req.body._id;
            ownerName = req.body.name;
            ownerAvatar = req.body.avatar;
        } else {
            ownerId = req.body._id;
            ownerName = req.body.name;
            ownerAvatar = req.body.avatar;
        }
        const chatboxExisted = await ChatBox.findOne({ ownerId: ownerId });
        if (chatboxExisted) {
            return res.status(200).json({
                message: 'chat box is already existed',
            });
        } else {
            const chatBox = new ChatBox({ ownerId, ownerName, ownerAvatar });
            await chatBox.save();
            return res.status(200).json({
                message: 'create chatbox successfully',
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'fail to create chatbox',
        });
    }
});

route.get('/:ownerId', async (req, res, next) => {
    try {
        const { ownerId } = req.params;
        console.log(ownerId);
        let chatboxes = [];

        chatboxes = await ChatBox.find({ ownerId: ownerId }).select(
            '_id ownerId ownerName ownerAvatar'
        );
        return res.status(200).json({
            count: chatboxes.length,
            chatboxes: chatboxes,

            message: 'get chatbox successfully',
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'fail to get chatboxes',
        });
    }
});

route.get('/', async (req, res, next) => {
    try {
        let chatboxes = [];

        chatboxes = await ChatBox.find().select('_id ownerId ownerName ownerAvatar ');
        return res.status(200).json({
            count: chatboxes.length,
            chatboxes: chatboxes,
            message: 'get chatbox successfully',
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'fail to get chatboxes',
        });
    }
});

route.get('/getChatBox/:chatboxId', async (req, res, next) => {
    try {
        const { chatboxId } = req.params;
        console.log(chatboxId);
        const chatbox = await ChatBox.findById(chatboxId);
        console.log(chatbox);
        res.status(200).json(chatbox);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'not found' });
    }
});

module.exports = route;
