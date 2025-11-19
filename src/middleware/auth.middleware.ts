import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: 'Authorization header missing',
        error: 'No token provided'
      });
      return;
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access token missing',
        error: 'No token provided'
      });
      return;
    }

    // Verify JWT token
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      res.status(500).json({
        success: false,
        message: 'JWT secret not configured'
      });
      return;
    }

    // Decode and verify token
    const decoded = jwt.verify(token, jwtSecret) as {
      userId: string;
      emailId: string;
      userName: string;
    };

    // Set currentUser header with userId for downstream handlers
    req.headers['currentuser'] = decoded.userId;
    req.headers['currentemail'] = decoded.emailId;
    req.headers['currentusername'] = decoded.userName;

    // Continue to next middleware/route handler
    next();

  } catch (error: any) {
    // Handle different JWT errors
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        message: 'Token has expired',
        error: 'Please login again'
      });
      return;
    }

    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({
        success: false,
        message: 'Invalid token',
        error: 'Authentication failed'
      });
      return;
    }

    res.status(401).json({
      success: false,
      message: 'Authentication failed',
      error: error.message || 'Invalid token'
    });
  }
};

