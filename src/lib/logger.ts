type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private shouldLog(level: LogLevel): boolean {
    if (process.env.NODE_ENV === 'production') {
      return level === 'error' || level === 'warn';
    }
    return true;
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`;
  }

  error(message: string, error?: Error, context?: LogContext): void {
    if (!this.shouldLog('error')) {
      return;
    }

    console.error(
      this.formatMessage('error', message, {
        ...context,
        error: error?.message,
        stack: error?.stack,
      })
    );
  }

  warn(message: string, context?: LogContext): void {
    if (!this.shouldLog('warn')) {
      return;
    }
    console.warn(this.formatMessage('warn', message, context));
  }

  info(message: string, context?: LogContext): void {
    if (!this.shouldLog('info')) {
      return;
    }
    // eslint-disable-next-line no-console
    console.info(this.formatMessage('info', message, context));
  }

  debug(message: string, context?: LogContext): void {
    if (!this.shouldLog('debug')) {
      return;
    }
    // eslint-disable-next-line no-console
    console.debug(this.formatMessage('debug', message, context));
  }
}

export const logger = new Logger();
