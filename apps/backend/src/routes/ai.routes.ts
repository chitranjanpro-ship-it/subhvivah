import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import multer from 'multer';
import { parseBiodata } from '../controllers/ai.controller';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/parse-biodata', upload.single('biodata'), parseBiodata);

export default router;
