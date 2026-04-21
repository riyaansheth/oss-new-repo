import { Router } from 'express';
import { analyzeRepo } from '../controllers/analyzeController.js';

const router = Router();
router.post('/analyze', analyzeRepo);
router.post('/insights/groq', analyzeRepo); // Alias for full analysis with Groq

export default router;
