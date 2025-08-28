import { Router } from 'express';
import nodesController from './nodes.controller';

const router = Router();

// Create new nodes
router.post('/', nodesController.createNodes.bind(nodesController));

// Get all nodes (sorted by createdAt: -1)
router.get('/', nodesController.getAllNodes.bind(nodesController));

// Get nodes by noteId (reference to notes)
router.get('/note/:noteId', nodesController.getNodesByNoteId.bind(nodesController));

// Get nodes by ID
router.get('/:id', nodesController.getNodesById.bind(nodesController));

// Update nodes
router.put('/:id', nodesController.updateNodes.bind(nodesController));

// Delete nodes
router.delete('/:id', nodesController.deleteNodes.bind(nodesController));

// Delete nodes by noteId (utility endpoint)
router.delete('/note/:noteId', nodesController.deleteNodesByNoteId.bind(nodesController));

export default router;
