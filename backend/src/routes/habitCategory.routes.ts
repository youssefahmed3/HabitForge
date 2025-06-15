import express from 'express';
import { createNewHabitCategory, deleteHabitCategory, getAllHabitCategories, updateHabitCategory } from '../controllers/habitCategory.controller';

const router = express.Router();

router.get('/', getAllHabitCategories);
router.post('/', createNewHabitCategory);
router.put('/:id', updateHabitCategory);
router.delete('/:id', deleteHabitCategory);



export default router;