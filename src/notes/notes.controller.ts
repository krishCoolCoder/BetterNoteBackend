import { Request, Response } from 'express';
import notesService, { CreateNoteInput, UpdateNoteInput, SearchNotesInput } from './notes.service';

export class NotesController {
  // Create a new note
  async createNote(req: Request, res: Response): Promise<void> {
    try {
      const { title, note, sharedTo, createdBy } = req.body;

      // Validation
      if (!title || !note || !createdBy) {
        res.status(400).json({
          success: false,
          message: 'Title, note content, and createdBy are required'
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

  // Get all notes for a user
  async getNotesForUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      if (!userId) {
        res.status(400).json({
          success: false,
          message: 'User ID is required'
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
      const { search } = req.query;
      const notes = await notesService.getAllNotes(search ? search as string : undefined);

      res.status(200).json({
        success: true,
        message: search ? 'Filtered notes retrieved successfully' : 'All notes retrieved successfully',
        data: notes,
        count: notes.length,
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
      const { id } = req.params;
      const { userId } = req.query;

      const note = await notesService.getNoteById(id, userId as string);

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
      const { id } = req.params;
      const { title, note, sharedTo, updatedBy } = req.body;

      if (!updatedBy) {
        res.status(400).json({
          success: false,
          message: 'updatedBy user ID is required'
        });
        return;
      }

      const updateData: UpdateNoteInput = {
        updatedBy
      };

      if (title) updateData.title = title;
      if (note) updateData.note = note;
      if (sharedTo !== undefined) updateData.sharedTo = sharedTo;

      const updatedNote = await notesService.updateNote(id, updateData, updatedBy);

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
      const { id } = req.params;
      const { userId } = req.body;

      if (!userId) {
        res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
        return;
      }

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
      const { query, userId, page, limit } = req.query;

      const searchParams: SearchNotesInput = {};

      if (query) searchParams.query = query as string;
      if (userId) searchParams.userId = userId as string;
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
      const { id } = req.params;
      const { emails, userId } = req.body;

      if (!emails || !Array.isArray(emails) || emails.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Emails array is required and must not be empty'
        });
        return;
      }

      if (!userId) {
        res.status(400).json({
          success: false,
          message: 'User ID is required'
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
      const { id } = req.params;
      const { emails, userId } = req.body;

      if (!emails || !Array.isArray(emails) || emails.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Emails array is required and must not be empty'
        });
        return;
      }

      if (!userId) {
        res.status(400).json({
          success: false,
          message: 'User ID is required'
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