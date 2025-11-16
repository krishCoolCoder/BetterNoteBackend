import { Router } from 'express';
import auditController from './audit.controller';

const router = Router();

// Get all audit logs with pagination
router.get('/', auditController.getAllAuditLogs.bind(auditController));

// Get audit logs by route
router.get('/route/:route', auditController.getAuditLogsByRoute.bind(auditController));

// Get audit logs by status code
router.get('/status/:statusCode', auditController.getAuditLogsByStatusCode.bind(auditController));

// Get audit logs by date range
router.get('/date-range', auditController.getAuditLogsByDateRange.bind(auditController));

// Delete old audit logs
router.delete('/cleanup', auditController.deleteOldLogs.bind(auditController));

export default router;

