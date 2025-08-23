import { supabase } from './supabase';

export interface AuditLogData {
  action: string;
  description: string;
  resourceType?: string;
  resourceId?: string;
  status?: 'success' | 'failure' | 'warning';
  severity?: 'info' | 'warning' | 'error' | 'critical';
  metadata?: Record<string, any>;
}

class AuditLogger {
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async getClientInfo() {
    const userAgent = navigator.userAgent;
    const deviceInfo = {
      browser: this.getBrowserInfo(),
      os: this.getOSInfo(),
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth
      },
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language
    };

    // Get IP address (this would need a service in production)
    let ipAddress = null;
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      ipAddress = data.ip;
    } catch (error) {
      console.warn('Could not fetch IP address:', error);
    }

    return {
      userAgent,
      deviceInfo,
      ipAddress
    };
  }

  private getBrowserInfo(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  private getOSInfo(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac OS')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  async log(data: AuditLogData): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const clientInfo = await this.getClientInfo();

      const { error } = await supabase.rpc('log_audit_event', {
        p_user_id: user?.id || null,
        p_action: data.action,
        p_description: data.description,
        p_resource_type: data.resourceType || null,
        p_resource_id: data.resourceId || null,
        p_ip_address: clientInfo.ipAddress,
        p_user_agent: clientInfo.userAgent,
        p_device_info: clientInfo.deviceInfo,
        p_status: data.status || 'success',
        p_severity: data.severity || 'info',
        p_metadata: data.metadata || null,
        p_session_id: this.sessionId
      });

      if (error) {
        console.error('Failed to log audit event:', error);
      }
    } catch (error) {
      console.error('Audit logging error:', error);
    }
  }

  // Convenience methods for common actions
  async logLogin(success: boolean, metadata?: Record<string, any>): Promise<void> {
    await this.log({
      action: 'login',
      description: success ? 'User logged in successfully' : 'User login failed',
      status: success ? 'success' : 'failure',
      severity: success ? 'info' : 'warning',
      metadata
    });
  }

  async logLogout(): Promise<void> {
    await this.log({
      action: 'logout',
      description: 'User logged out',
      severity: 'info'
    });
  }

  async logUserCreation(userId: string, userEmail: string): Promise<void> {
    await this.log({
      action: 'create_user',
      description: `New user created: ${userEmail}`,
      resourceType: 'user',
      resourceId: userId,
      severity: 'info',
      metadata: { email: userEmail }
    });
  }

  async logRoleChange(userId: string, oldRole: string, newRole: string): Promise<void> {
    await this.log({
      action: 'update_role',
      description: `User role changed from ${oldRole} to ${newRole}`,
      resourceType: 'user',
      resourceId: userId,
      severity: 'warning',
      metadata: { oldRole, newRole }
    });
  }

  async logSettingChange(settingKey: string, oldValue: any, newValue: any): Promise<void> {
    await this.log({
      action: 'update_setting',
      description: `System setting '${settingKey}' changed`,
      resourceType: 'setting',
      resourceId: settingKey,
      severity: 'info',
      metadata: { settingKey, oldValue, newValue }
    });
  }

  async logNotificationCreation(notificationId: string, title: string): Promise<void> {
    await this.log({
      action: 'create_notification',
      description: `Notification created: ${title}`,
      resourceType: 'notification',
      resourceId: notificationId,
      severity: 'info',
      metadata: { title }
    });
  }

  async logDataExport(exportType: string, recordCount: number): Promise<void> {
    await this.log({
      action: 'export_data',
      description: `Data exported: ${exportType} (${recordCount} records)`,
      severity: 'info',
      metadata: { exportType, recordCount }
    });
  }

  async logSecurityEvent(eventType: string, description: string, severity: 'warning' | 'error' | 'critical' = 'warning'): Promise<void> {
    await this.log({
      action: 'security_event',
      description,
      severity,
      metadata: { eventType }
    });
  }

  async logSystemError(error: Error, context?: string): Promise<void> {
    await this.log({
      action: 'system_error',
      description: `System error: ${error.message}`,
      status: 'failure',
      severity: 'error',
      metadata: {
        errorMessage: error.message,
        errorStack: error.stack,
        context
      }
    });
  }
}

// Export singleton instance
export const auditLogger = new AuditLogger();
