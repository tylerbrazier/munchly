const logger = {

  log: function(level, message) {
    if (!message) {
      message = level || ''
      level = 'info'
    }
    switch(level) {
      case 'error':
        console.error(level+':', message)
        break
      case 'warn':
        console.warn(level+':', message)
        break
      default:
        console.log(level+':', message)
    }
  },

  error: function(message) {
    this.log('error', message)
  },

  info: function(message) {
    this.log('info', message)
  },

  warn: function(message) {
    this.log('warn', message)
  },
}

module.exports = logger
