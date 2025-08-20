import Note, { INote } from './note.model';
import mongoose from 'mongoose';

export interface CreateNoteInput {
  title: string;
  note: string;
  sharedTo?: string[];
  createdBy: string;
}

export interface UpdateNoteInput {
  title?: string;
  note?: string;
  sharedTo?: string[];
  updatedBy: string;
}

export interface SearchNotesInput {
  query?: string;
  userId?: string;
  page?: number;
  limit?: number;
}

export class NotesService {
  // Create a new note
  async createNote(noteData: CreateNoteInput): Promise<INote> {
    try {
      if (!mongoose.Types.ObjectId.isValid(noteData.createdBy)) {
        throw new Error('Invalid createdBy user ID format');
      }

      const note = new Note({
        title: noteData.title,
        note: noteData.note,
        sharedTo: noteData.sharedTo || [],
        createdBy: noteData.createdBy,
        updatedBy: noteData.createdBy // Initially same as createdBy
      });

      const savedNote = await note.save();
      return savedNote;
    } catch (error) {
      throw error;
    }
  }

  // Get all notes for a user (created by user or shared with user)
  async getAllNotesForUser(userId: string): Promise<INote[]> {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID format');
      }

      // Get user's email to check shared notes
      const User = mongoose.model('User');
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const notes = await Note.find({
        $or: [
          { createdBy: userId },
          { sharedTo: { $in: [user.emailId] } }
        ]
      })
      .populate('createdBy', 'userName emailId')
      .populate('updatedBy', 'userName emailId')
      .sort({ updatedAt: -1 });

      return notes;
    } catch (error) {
      throw error;
    }
  }

  // Get all notes (admin function)
  async getAllNotes(): Promise<INote[]> {
    try {
      const notes = await Note.find({})
        .populate('createdBy', 'userName emailId')
        .populate('updatedBy', 'userName emailId')
        .sort({ updatedAt: -1 });

      return notes;
    } catch (error) {
      throw error;
    }
  }

  // Get note by ID
  async getNoteById(noteId: string, userId?: string): Promise<INote | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(noteId)) {
        throw new Error('Invalid note ID format');
      }

      let query: any = { _id: noteId };

      // If userId provided, ensure user has access to the note
      if (userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          throw new Error('Invalid user ID format');
        }

        const User = mongoose.model('User');
        const user = await User.findById(userId);
        if (!user) {
          throw new Error('User not found');
        }

        query = {
          _id: noteId,
          $or: [
            { createdBy: userId },
            { sharedTo: { $in: [user.emailId] } }
          ]
        };
      }

      const note = await Note.findOne(query)
        .populate('createdBy', 'userName emailId')
        .populate('updatedBy', 'userName emailId');

      return note;
    } catch (error) {
      throw error;
    }
  }

  // Update note
  async updateNote(noteId: string, updateData: UpdateNoteInput, userId: string): Promise<INote | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(noteId)) {
        throw new Error('Invalid note ID format');
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID format');
      }

      // Check if user has permission to update (only creator can update)
      const existingNote = await Note.findOne({ _id: noteId, createdBy: userId });
      if (!existingNote) {
        throw new Error('Note not found or user does not have permission to update');
      }

      const updatedNote = await Note.findOneAndUpdate(
        { _id: noteId, createdBy: userId },
        {
          ...updateData,
          updatedBy: userId,
          updatedAt: new Date()
        },
        { new: true, runValidators: true }
      )
      .populate('createdBy', 'userName emailId')
      .populate('updatedBy', 'userName emailId');

      return updatedNote;
    } catch (error) {
      throw error;
    }
  }

  // Delete note
  async deleteNote(noteId: string, userId: string): Promise<INote | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(noteId)) {
        throw new Error('Invalid note ID format');
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID format');
      }

      // Only creator can delete the note
      const deletedNote = await Note.findOneAndDelete({ _id: noteId, createdBy: userId });
      return deletedNote;
    } catch (error) {
      throw error;
    }
  }

  // Search/Filter notes
  async searchNotes(searchParams: SearchNotesInput): Promise<{ notes: INote[], total: number, page: number, totalPages: number }> {
    try {
      const { query, userId, page = 1, limit = 10 } = searchParams;
      const skip = (page - 1) * limit;

      let searchQuery: any = {};

      // If userId provided, filter by user's notes
      if (userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          throw new Error('Invalid user ID format');
        }

        const User = mongoose.model('User');
        const user = await User.findById(userId);
        if (!user) {
          throw new Error('User not found');
        }

        searchQuery.$or = [
          { createdBy: userId },
          { sharedTo: { $in: [user.emailId] } }
        ];
      }

      // Add text search if query provided
      if (query && query.trim()) {
        const textSearchQuery = {
          $or: [
            { title: { $regex: query.trim(), $options: 'i' } },
            { note: { $regex: query.trim(), $options: 'i' } }
          ]
        };

        if (searchQuery.$or) {
          searchQuery = {
            $and: [
              { $or: searchQuery.$or },
              textSearchQuery
            ]
          };
        } else {
          searchQuery = textSearchQuery;
        }
      }

      const [notes, total] = await Promise.all([
        Note.find(searchQuery)
          .populate('createdBy', 'userName emailId')
          .populate('updatedBy', 'userName emailId')
          .sort({ updatedAt: -1 })
          .skip(skip)
          .limit(limit),
        Note.countDocuments(searchQuery)
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        notes,
        total,
        page,
        totalPages
      };
    } catch (error) {
      throw error;
    }
  }

  // Share note with users
  async shareNote(noteId: string, emails: string[], userId: string): Promise<INote | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(noteId)) {
        throw new Error('Invalid note ID format');
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID format');
      }

      // Only creator can share the note
      const updatedNote = await Note.findOneAndUpdate(
        { _id: noteId, createdBy: userId },
        {
          $addToSet: { sharedTo: { $each: emails } },
          updatedBy: userId,
          updatedAt: new Date()
        },
        { new: true, runValidators: true }
      )
      .populate('createdBy', 'userName emailId')
      .populate('updatedBy', 'userName emailId');

      return updatedNote;
    } catch (error) {
      throw error;
    }
  }

  // Unshare note from users
  async unshareNote(noteId: string, emails: string[], userId: string): Promise<INote | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(noteId)) {
        throw new Error('Invalid note ID format');
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID format');
      }

      // Only creator can unshare the note
      const updatedNote = await Note.findOneAndUpdate(
        { _id: noteId, createdBy: userId },
        {
          $pull: { sharedTo: { $in: emails } },
          updatedBy: userId,
          updatedAt: new Date()
        },
        { new: true, runValidators: true }
      )
      .populate('createdBy', 'userName emailId')
      .populate('updatedBy', 'userName emailId');

      return updatedNote;
    } catch (error) {
      throw error;
    }
  }
}

export default new NotesService();