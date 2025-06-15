import express from 'express';
import { createNewHabitEntry, deleteHabitEntryById, getHabitEntries, toggleHabitEntry } from '../controllers/habitEntry.controller';
import requireAuth from '../middleware/requireAuth';

const router = express.Router();

/*
 GET /habit-entries?habitId=habit-123&range=week 
 GET /habit-entries?habitId=habit-123&start=2025-06-01&end=2025-06-14
*/
router.get('/', requireAuth, getHabitEntries)

// POST /habit-entries ⇒ create entry (check-in)
router.post('/', requireAuth, createNewHabitEntry)

// PUT /habit-entries/toggle ⇒ Edit entry (toggle complete)
router.put('/toggle', requireAuth, toggleHabitEntry)

// DELETE /habit-entries/:id ⇒ DELETE Entry
router.delete('/:id', requireAuth, deleteHabitEntryById)


export default router;