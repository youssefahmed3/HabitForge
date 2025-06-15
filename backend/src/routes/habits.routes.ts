import express from 'express';
import { createNewHabit, deleteHabit, getAllHabits, getHabitStats, updateHabit } from '../controllers/habits.controller';
import requireAuth from '../middleware/requireAuth';


const router = express.Router();


router.get('/', requireAuth, getAllHabits);
router.post('/', requireAuth, createNewHabit);
router.get('/:id/stats', requireAuth, getHabitStats);
router.put('/:id', requireAuth, updateHabit);
router.delete('/:id', requireAuth, deleteHabit);



export default router;
