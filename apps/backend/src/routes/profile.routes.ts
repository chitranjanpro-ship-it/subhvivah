import { Router } from 'express';
import * as profileController from '../controllers/profile.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/search', profileController.searchProfiles);
router.get('/:id', profileController.getProfile);
router.post('/', authenticate, profileController.createProfile);
router.put('/:id', authenticate, profileController.updateProfile);

export default router;
