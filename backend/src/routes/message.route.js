import express from 'express';
import { recieveMessage, sendMessage } from '../controllers/message.controller.js';

const router = express.Router();

router.get('/send', sendMessage);
router.get('recieve', recieveMessage);

export default router;
