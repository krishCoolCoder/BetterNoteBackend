import { Request, Response } from 'express';
import nodesService, { CreateNodesInput, UpdateNodesInput } from './nodes.service';

export class NodesController {
  // Create new nodes
  async createNodes(req: Request, res: Response): Promise<void> {
    try {
      const { nodes, edges, noteId } = req.body;

      // Validation
      if (!nodes || !edges || !noteId) {
        res.status(400).json({
          success: false,
          message: 'Nodes, edges, and noteId are required'
        });
        return;
      }

      const nodesData: CreateNodesInput = {
        nodes,
        edges,
        noteId
      };

      const newNodes = await nodesService.createNodes(nodesData);

      res.status(201).json({
        success: true,
        message: 'Nodes created successfully',
        data: newNodes
      });
    } catch (error: any) {
      console.error('Error creating nodes:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Get all nodes (sorted by createdAt: -1)
  async getAllNodes(req: Request, res: Response): Promise<void> {
    try {
      const { noteId } = req.query;
      const nodes = await nodesService.getAllNodes(noteId as string);

      res.status(200).json({
        success: true,
        message: noteId ? 'Nodes filtered by noteId retrieved successfully' : 'Nodes retrieved successfully',
        data: nodes,
        count: nodes.length,
        ...(noteId && { filter: { noteId } })
      });
    } catch (error: any) {
      console.error('Error fetching all nodes:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Get nodes by ID
  async getNodesById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const nodes = await nodesService.getNodesById(id);

      if (!nodes) {
        res.status(404).json({
          success: false,
          message: 'Nodes not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Nodes retrieved successfully',
        data: nodes
      });
    } catch (error: any) {
      console.error('Error fetching nodes:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Get nodes by noteId (reference to notes)
  async getNodesByNoteId(req: Request, res: Response): Promise<void> {
    try {
      const { noteId } = req.params;

      const nodes = await nodesService.getNodesByNoteId(noteId);

      res.status(200).json({
        success: true,
        message: 'Nodes retrieved successfully',
        data: nodes,
        count: nodes.length
      });
    } catch (error: any) {
      console.error('Error fetching nodes by noteId:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Update nodes
  async updateNodes(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { nodes, edges } = req.body;

      const updateData: UpdateNodesInput = {};

      if (nodes !== undefined) updateData.nodes = nodes;
      if (edges !== undefined) updateData.edges = edges;

      // Check if there's anything to update
      if (Object.keys(updateData).length === 0) {
        res.status(400).json({
          success: false,
          message: 'At least one field (nodes or edges) is required for update'
        });
        return;
      }

      const updatedNodes = await nodesService.updateNodes(id, updateData);

      if (!updatedNodes) {
        res.status(404).json({
          success: false,
          message: 'Nodes not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Nodes updated successfully',
        data: updatedNodes
      });
    } catch (error: any) {
      console.error('Error updating nodes:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Delete nodes
  async deleteNodes(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const deletedNodes = await nodesService.deleteNodes(id);

      if (!deletedNodes) {
        res.status(404).json({
          success: false,
          message: 'Nodes not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Nodes deleted successfully',
        data: {
          _id: deletedNodes._id,
          noteId: deletedNodes.noteId
        }
      });
    } catch (error: any) {
      console.error('Error deleting nodes:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Delete nodes by noteId (utility endpoint)
  async deleteNodesByNoteId(req: Request, res: Response): Promise<void> {
    try {
      const { noteId } = req.params;

      const result = await nodesService.deleteNodesByNoteId(noteId);

      res.status(200).json({
        success: true,
        message: `${result.deletedCount} nodes deleted successfully`,
        data: {
          noteId,
          deletedCount: result.deletedCount
        }
      });
    } catch (error: any) {
      console.error('Error deleting nodes by noteId:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }
}

export default new NodesController();
