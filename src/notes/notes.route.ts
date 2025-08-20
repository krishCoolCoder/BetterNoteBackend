import { Router } from 'express';
import notesController from './notes.controller';

const router = Router();

// Create a new note
router.post('/', notesController.createNote.bind(notesController));

// Search/Filter notes
router.get('/search', notesController.searchNotes.bind(notesController));

// Get all notes (admin)
router.get('/all', notesController.getAllNotes.bind(notesController));

// Get notes for a specific user
router.get('/user/:userId', notesController.getNotesForUser.bind(notesController));

// Get note by ID
router.get('/:id', notesController.getNoteById.bind(notesController));

// Update note
router.put('/:id', notesController.updateNote.bind(notesController));

// Delete note
router.delete('/:id', notesController.deleteNote.bind(notesController));

// Share note
router.post('/:id/share', notesController.shareNote.bind(notesController));

// Unshare note
router.post('/:id/unshare', notesController.unshareNote.bind(notesController));

export default router;