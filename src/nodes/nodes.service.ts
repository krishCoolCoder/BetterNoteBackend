import Nodes, { INodes } from './nodes.model';
import mongoose from 'mongoose';

export interface CreateNodesInput {
  nodes: any;
  edges: any;
  noteId: string;
}

export interface UpdateNodesInput {
  nodes?: any;
  edges?: any;
}

export class NodesService {
  // Create new nodes
  async createNodes(nodesData: CreateNodesInput): Promise<INodes> {
    try {
      if (!mongoose.Types.ObjectId.isValid(nodesData.noteId)) {
        throw new Error('Invalid noteId format');
      }

      const nodes = new Nodes({
        nodes: nodesData.nodes,
        edges: nodesData.edges,
        noteId: nodesData.noteId
      });

      const savedNodes = await nodes.save();
      return savedNodes;
    } catch (error) {
      throw error;
    }
  }

  // Get all nodes (sorted by createdAt: -1 for most recent first)
  async getAllNodes(noteId?: string): Promise<INodes[]> {
    try {
      let query: any = {};
      
      if (noteId) {
        if (!mongoose.Types.ObjectId.isValid(noteId)) {
          throw new Error('Invalid noteId format');
        }
        query.noteId = noteId;
      }

      const nodes = await Nodes.find(query)
        .populate('noteId', 'title note createdBy')
        .sort({ createdAt: -1 });

      return nodes;
    } catch (error) {
      throw error;
    }
  }

  // Get nodes by ID
  async getNodesById(nodesId: string): Promise<INodes | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(nodesId)) {
        throw new Error('Invalid nodes ID format');
      }

      const nodes = await Nodes.findById(nodesId)
        .populate('noteId', 'title note createdBy');

      return nodes;
    } catch (error) {
      throw error;
    }
  }

  // Get nodes by noteId (reference to notes)
  async getNodesByNoteId(noteId: string): Promise<INodes[]> {
    try {
      if (!mongoose.Types.ObjectId.isValid(noteId)) {
        throw new Error('Invalid noteId format');
      }

      const nodes = await Nodes.find({ noteId })
        .populate('noteId', 'title note createdBy')
        .sort({ createdAt: -1 });

      return nodes;
    } catch (error) {
      throw error;
    }
  }

  // Update nodes
  async updateNodes(nodesId: string, updateData: UpdateNodesInput): Promise<INodes | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(nodesId)) {
        throw new Error('Invalid nodes ID format');
      }

      const updatedNodes = await Nodes.findByIdAndUpdate(
        nodesId,
        updateData,
        { new: true, runValidators: true }
      ).populate('noteId', 'title note createdBy');

      return updatedNodes;
    } catch (error) {
      throw error;
    }
  }

  // Delete nodes
  async deleteNodes(nodesId: string): Promise<INodes | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(nodesId)) {
        throw new Error('Invalid nodes ID format');
      }

      const deletedNodes = await Nodes.findByIdAndDelete(nodesId);
      return deletedNodes;
    } catch (error) {
      throw error;
    }
  }

  // Delete nodes by noteId (when a note is deleted)
  async deleteNodesByNoteId(noteId: string): Promise<{ deletedCount: number }> {
    try {
      if (!mongoose.Types.ObjectId.isValid(noteId)) {
        throw new Error('Invalid noteId format');
      }

      const result = await Nodes.deleteMany({ noteId });
      return { deletedCount: result.deletedCount || 0 };
    } catch (error) {
      throw error;
    }
  }
}

export default new NodesService();
