import Audit, { IAudit } from './audit.model';

export interface CreateAuditLogInput {
  apiRoute: string;
  apiMethod: string;
  apiRequestBody?: any;
  apiResponse?: any;
  statusCode: number;
  ipAddress?: string;
  userAgent?: string;
}

export class AuditService {
  // Create a new audit log entry
  async createAuditLog(logData: CreateAuditLogInput): Promise<IAudit | null> {
    try {
      const auditLog = new Audit({
        apiRoute: logData.apiRoute,
        apiMethod: logData.apiMethod,
        apiRequestBody: logData.apiRequestBody || {},
        apiResponse: logData.apiResponse || {},
        statusCode: logData.statusCode,
        ipAddress: logData.ipAddress,
        userAgent: logData.userAgent,
        timestamp: new Date()
      });

      const savedLog = await auditLog.save();
      return savedLog;
    } catch (error: any) {
      console.error('❌ Error creating audit log:', error);
      // Don't throw error - we don't want audit logging to break the API
      return null;
    }
  }

  // Get all audit logs with pagination
  async getAllAuditLogs(page: number = 1, limit: number = 50): Promise<{ logs: IAudit[], total: number }> {
    try {
      const skip = (page - 1) * limit;
      const logs = await Audit.find({})
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit);
      
      const total = await Audit.countDocuments();
      
      return { logs, total };
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      throw error;
    }
  }

  // Get audit logs by route
  async getAuditLogsByRoute(route: string): Promise<IAudit[]> {
    try {
      const logs = await Audit.find({ apiRoute: new RegExp(route, 'i') })
        .sort({ timestamp: -1 })
        .limit(100);
      return logs;
    } catch (error) {
      console.error('Error fetching audit logs by route:', error);
      throw error;
    }
  }

  // Get audit logs by status code
  async getAuditLogsByStatusCode(statusCode: number): Promise<IAudit[]> {
    try {
      const logs = await Audit.find({ statusCode })
        .sort({ timestamp: -1 })
        .limit(100);
      return logs;
    } catch (error) {
      console.error('Error fetching audit logs by status code:', error);
      throw error;
    }
  }

  // Get audit logs within a date range
  async getAuditLogsByDateRange(startDate: Date, endDate: Date): Promise<IAudit[]> {
    try {
      const logs = await Audit.find({
        timestamp: {
          $gte: startDate,
          $lte: endDate
        }
      }).sort({ timestamp: -1 });
      return logs;
    } catch (error) {
      console.error('Error fetching audit logs by date range:', error);
      throw error;
    }
  }

  // Delete old audit logs (older than specified days)
  async deleteOldLogs(daysOld: number): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const result = await Audit.deleteMany({
        timestamp: { $lt: cutoffDate }
      });

      return result.deletedCount || 0;
    } catch (error) {
      console.error('Error deleting old audit logs:', error);
      throw error;
    }
  }
}

export default new AuditService();

