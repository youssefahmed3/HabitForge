import express from 'express';
import { globalStats } from '../controllers/stats.controller';
import requireAuth from '../middleware/requireAuth';

const router = express.Router();

router.get('/overview', requireAuth, globalStats); 




export default router;