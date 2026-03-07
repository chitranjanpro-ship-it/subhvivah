import { Router } from 'express';
import * as chatController from '../controllers/chat.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/chats', chatController.createChat);
router.post('/messages', chatController.sendMessage);
router.get('/chats', chatController.getChats);
router.get('/messages/:chatId', chatController.getMessages);

export default router;
