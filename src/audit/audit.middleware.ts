import { Request, Response, NextFunction } from 'express';
import auditService from './audit.service';

// Extend Express Request to store original body
interface AuditRequest extends Request {
  originalBody?: any;
}

export const auditMiddleware = (req: AuditRequest, res: Response, next: NextFunction) => {
  // Skip audit for health check and root endpoints
  if (req.path === '/health' || req.path === '/' || req.path === '/favicon.ico') {
    return next();
  }

  // Capture request data
  const apiRoute = req.originalUrl || req.url;
  const apiMethod = req.method;
  const apiRequestBody = req.body || {};
  const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
  const userAgent = req.get('user-agent') || 'unknown';

  // Store original json method
  const originalJson = res.json.bind(res);
  
  // Override res.json to capture response
  res.json = function(body: any) {
    // Capture response data
    const apiResponse = body;
    const statusCode = res.statusCode;

    // Log to database asynchronously (don't wait for it)
    setImmediate(() => {
      auditService.createAuditLog({
        apiRoute,
        apiMethod,
        apiRequestBody,
        apiResponse,
        statusCode,
        ipAddress,
        userAgent
      }).catch(error => {
        console.error('Failed to create audit log:', error);
      });
    });

    // Call original json method
    return originalJson(body);
  };

  next();
};

