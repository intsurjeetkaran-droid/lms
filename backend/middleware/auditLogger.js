import AuditLog from '../models/AuditLog.js';

export const logAction = (action, entity) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    
    res.send = async function(data) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          await AuditLog.create({
            userId: req.user?._id,
            action,
            entity,
            entityId: req.params.id || req.body._id,
            changes: req.body,
            ipAddress: req.ip
          });
        } catch (error) {
          console.error('Audit log error:', error);
        }
      }
      originalSend.call(this, data);
    };
    
    next();
  };
};
