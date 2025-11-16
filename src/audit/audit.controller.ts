import { Request, Response } from 'express';
import auditService from './audit.service';

export class AuditController {
  // Get all audit logs with pagination
  async getAllAuditLogs(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

      const { logs, total } = await auditService.getAllAuditLogs(page, limit);

      res.status(200).json({
        success: true,
        message: 'Audit logs retrieved successfully',
        data: {
          logs,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error: any) {
      console.error('Error fetching audit logs:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Get audit logs by route
  async getAuditLogsByRoute(req: Request, res: Response): Promise<void> {
    try {
      const { route } = req.params;

      if (!route) {
        res.status(400).json({
          success: false,
          message: 'Route parameter is required'
        });
        return;
      }

      const logs = await auditService.getAuditLogsByRoute(route);

      res.status(200).json({
        success: true,
        message: 'Audit logs retrieved successfully',
        data: logs
      });
    } catch (error: any) {
      console.error('Error fetching audit logs by route:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Get audit logs by status code
  async getAuditLogsByStatusCode(req: Request, res: Response): Promise<void> {
    try {
      const { statusCode } = req.params;

      if (!statusCode) {
        res.status(400).json({
          success: false,
          message: 'Status code parameter is required'
        });
        return;
      }

      const logs = await auditService.getAuditLogsByStatusCode(parseInt(statusCode));

      res.status(200).json({
        success: true,
        message: 'Audit logs retrieved successfully',
        data: logs
      });
    } catch (error: any) {
      console.error('Error fetching audit logs by status code:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Get audit logs by date range
  async getAuditLogsByDateRange(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        res.status(400).json({
          success: false,
          message: 'startDate and endDate query parameters are required'
        });
        return;
      }

      const start = new Date(startDate as string);
      const end = new Date(endDate as string);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        res.status(400).json({
          success: false,
          message: 'Invalid date format. Use ISO 8601 format (e.g., 2025-01-01)'
        });
        return;
      }

      const logs = await auditService.getAuditLogsByDateRange(start, end);

      res.status(200).json({
        success: true,
        message: 'Audit logs retrieved successfully',
        data: logs
      });
    } catch (error: any) {
      console.error('Error fetching audit logs by date range:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Delete old audit logs
  async deleteOldLogs(req: Request, res: Response): Promise<void> {
    try {
      const { daysOld } = req.body;

      if (!daysOld || typeof daysOld !== 'number') {
        res.status(400).json({
          success: false,
          message: 'daysOld field is required and must be a number'
        });
        return;
      }

      const deletedCount = await auditService.deleteOldLogs(daysOld);

      res.status(200).json({
        success: true,
        message: `Successfully deleted ${deletedCount} old audit logs`,
        data: {
          deletedCount,
          daysOld
        }
      });
    } catch (error: any) {
      console.error('Error deleting old audit logs:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }
}

export default new AuditController();

