const log = (level: string, message: string, context?: any) => {
  console.log(JSON.stringify({ timestamp: new Date().toUTCString(), level, message, context }));
};

export default {
  debug: (message, context?) => log('debug', message, context),
  info: (message, context?) => log('info', message, context),
  warning: (message, context?) => log('warning', message, context),
  error: (message, context?) => log('error', message, context),
};
