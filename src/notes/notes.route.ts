import { Router } from 'express';
import notesController from './notes.controller';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// All notes routes require authentication
router.use(authMiddleware);

// Create a new note
router.post('/', notesController.createNote.bind(notesController));

// Search/Filter notes (for authenticated user only)
router.get('/search', notesController.searchNotes.bind(notesController));

// Get all notes (for authenticated user only)
router.get('/all', notesController.getAllNotes.bind(notesController));

// Get notes for authenticated user
router.get('/user/:userId', notesController.getNotesForUser.bind(notesController));

// Get note by ID (for authenticated user only)
router.get('/:id', notesController.getNoteById.bind(notesController));

// Update note (authenticated user must own the note)
router.put('/:id', notesController.updateNote.bind(notesController));

// Delete note (authenticated user must own the note)
router.delete('/:id', notesController.deleteNote.bind(notesController));

// Share note (authenticated user must own the note)
router.post('/:id/share', notesController.shareNote.bind(notesController));

// Unshare note (authenticated user must own the note)
router.post('/:id/unshare', notesController.unshareNote.bind(notesController));

export default router;