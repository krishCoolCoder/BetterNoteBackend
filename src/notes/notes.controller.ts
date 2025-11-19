import { Request, Response } from 'express';
import notesService, { CreateNoteInput, UpdateNoteInput, SearchNotesInput } from './notes.service';

export class NotesController {
  // Create a new note
  async createNote(req: Request, res: Response): Promise<void> {
    try {
      const { title, note, sharedTo } = req.body;

      // Get userId from currentUser header (set by auth middleware)
      const createdBy = req.headers['currentuser'] as string;

      // Validation
      if (!title || !note) {
        res.status(400).json({
          success: false,
          message: 'Title and note content are required'
        });
        return;
      }

      if (!createdBy) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const noteData: CreateNoteInput = {
        title,
        note,
        sharedTo: sharedTo || [],
        createdBy
      };

      const newNote = await notesService.createNote(noteData);

      res.status(201).json({
        success: true,
        message: 'Note created successfully',
        data: newNote
      });
    } catch (error: any) {
      console.error('Error creating note:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Get all notes for authenticated user
  async getNotesForUser(req: Request, res: Response): Promise<void> {
    try {
      // Get userId from currentUser header (set by auth middleware)
      const userId = req.headers['currentuser'] as string;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const notes = await notesService.getAllNotesForUser(userId);

      res.status(200).json({
        success: true,
        message: 'Notes retrieved successfully',
        data: notes,
        count: notes.length
      });
    } catch (error: any) {
      console.error('Error fetching notes for user:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Get all notes (admin function)
  async getAllNotes(req: Request, res: Response): Promise<void> {
    try {
      // Get userId from currentUser header (set by auth middleware)
      const userId = req.headers['currentuser'] as string;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const { search } = req.query;
      // Get only notes created by the authenticated user
      const notes = await notesService.getAllNotesForUser(userId);
      
      // Apply search filter if provided
      const filteredNotes = search 
        ? notes.filter((note: any) => 
            note.title.toLowerCase().includes((search as string).toLowerCase()) ||
            note.note.toLowerCase().includes((search as string).toLowerCase())
          )
        : notes;

      res.status(200).json({
        success: true,
        message: search ? 'Filtered notes retrieved successfully' : 'All notes retrieved successfully',
        data: filteredNotes,
        count: filteredNotes.length,
        ...(search && { searchQuery: search })
      });
    } catch (error: any) {
      console.error('Error fetching all notes:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Get note by ID
  async getNoteById(req: Request, res: Response): Promise<void> {
    try {
      // Get userId from currentUser header (set by auth middleware)
      const userId = req.headers['currentuser'] as string;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const { id } = req.params;

      const note = await notesService.getNoteById(id, userId);

      if (!note) {
        res.status(404).json({
          success: false,
          message: 'Note not found or access denied'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Note retrieved successfully',
        data: note
      });
    } catch (error: any) {
      console.error('Error fetching note:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Update note
  async updateNote(req: Request, res: Response): Promise<void> {
    try {
      // Get userId from currentUser header (set by auth middleware)
      const userId = req.headers['currentuser'] as string;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const { id } = req.params;
      const { title, note, sharedTo } = req.body;

      const updateData: UpdateNoteInput = {
        updatedBy: userId
      };

      if (title) updateData.title = title;
      if (note) updateData.note = note;
      if (sharedTo !== undefined) updateData.sharedTo = sharedTo;

      const updatedNote = await notesService.updateNote(id, updateData, userId);

      if (!updatedNote) {
        res.status(404).json({
          success: false,
          message: 'Note not found or user does not have permission to update'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Note updated successfully',
        data: updatedNote
      });
    } catch (error: any) {
      console.error('Error updating note:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Delete note
  async deleteNote(req: Request, res: Response): Promise<void> {
    try {
      // Get userId from currentUser header (set by auth middleware)
      const userId = req.headers['currentuser'] as string;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const { id } = req.params;

      const deletedNote = await notesService.deleteNote(id, userId);

      if (!deletedNote) {
        res.status(404).json({
          success: false,
          message: 'Note not found or user does not have permission to delete'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Note deleted successfully',
        data: {
          _id: deletedNote._id,
          title: deletedNote.title
        }
      });
    } catch (error: any) {
      console.error('Error deleting note:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Search/Filter notes
  async searchNotes(req: Request, res: Response): Promise<void> {
    try {
      // Get userId from currentUser header (set by auth middleware)
      const userId = req.headers['currentuser'] as string;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const { query, page, limit } = req.query;

      const searchParams: SearchNotesInput = {
        userId // Always filter by authenticated user
      };

      if (query) searchParams.query = query as string;
      if (page) searchParams.page = parseInt(page as string);
      if (limit) searchParams.limit = parseInt(limit as string);

      const result = await notesService.searchNotes(searchParams);

      res.status(200).json({
        success: true,
        message: 'Notes search completed successfully',
        data: result.notes,
        pagination: {
          total: result.total,
          page: result.page,
          totalPages: result.totalPages,
          limit: searchParams.limit || 10
        }
      });
    } catch (error: any) {
      console.error('Error searching notes:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Share note
  async shareNote(req: Request, res: Response): Promise<void> {
    try {
      // Get userId from currentUser header (set by auth middleware)
      const userId = req.headers['currentuser'] as string;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const { id } = req.params;
      const { emails } = req.body;

      if (!emails || !Array.isArray(emails) || emails.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Emails array is required and must not be empty'
        });
        return;
      }

      const sharedNote = await notesService.shareNote(id, emails, userId);

      if (!sharedNote) {
        res.status(404).json({
          success: false,
          message: 'Note not found or user does not have permission to share'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Note shared successfully',
        data: sharedNote
      });
    } catch (error: any) {
      console.error('Error sharing note:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Unshare note
  async unshareNote(req: Request, res: Response): Promise<void> {
    try {
      // Get userId from currentUser header (set by auth middleware)
      const userId = req.headers['currentuser'] as string;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const { id } = req.params;
      const { emails } = req.body;

      if (!emails || !Array.isArray(emails) || emails.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Emails array is required and must not be empty'
        });
        return;
      }

      const unsharedNote = await notesService.unshareNote(id, emails, userId);

      if (!unsharedNote) {
        res.status(404).json({
          success: false,
          message: 'Note not found or user does not have permission to unshare'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Note unshared successfully',
        data: unsharedNote
      });
    } catch (error: any) {
      console.error('Error unsharing note:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }
}

export default new NotesController();