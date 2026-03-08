import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate, authorize(['ADMIN', 'SUB_ADMIN']));

router.get('/users', adminController.getUsers);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

router.get('/verification-requests', adminController.getVerificationRequests);
router.put('/verify-profile/:id', adminController.verifyProfile);
router.get('/stats', adminController.getStats);

// Team Management
router.get('/team', adminController.getTeam);
router.post('/team', adminController.createTeamMember);
router.put('/team/:id', adminController.updateTeamMember);
router.delete('/team/:id', adminController.deleteTeamMember);

// Tasks
router.get('/tasks', adminController.getTasks);
router.post('/tasks', adminController.createTask);
router.put('/tasks/:id', adminController.updateTask);

export default router;
