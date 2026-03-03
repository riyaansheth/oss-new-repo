import { Router } from 'express';
import { analyzeRepo } from '../controllers/analyzeController.js';

const router = Router();
router.post('/analyze', analyzeRepo);

export default router;
