const environment = process.env.NODE_ENV
const isProduction = environment === 'production'

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  gray: '\x1b[90m',
}

const getLevelColor = (level: string) => {
  switch (level.toLowerCase()) {
    case 'error':
      return colors.red
    case 'warn':
      return colors.yellow
    case 'info':
      return colors.blue
    case 'debug':
      return colors.green
    default:
      return colors.gray
  }
}

const formatTimestamp = () => {
  return new Date().toISOString().replace('T', ' ').substring(0, 19)
}

const formatLog = (level: string, message: string, data?: unknown) => {
  const timestamp = formatTimestamp()
  const levelUpper = level.toUpperCase().padEnd(4)

  if (isProduction) {
    const logData = {
      timestamp,
      level: levelUpper.trim(),
      message,
      ...(data && typeof data === 'object' && data !== null ? { data } : {}),
    }
    console.log(JSON.stringify(logData))
  } else {
    const color = getLevelColor(level)
    const prefix = `${color}[${levelUpper}]${colors.reset} ${colors.gray}${timestamp}${colors.reset}`

    if (data) {
      console.log(`${prefix} ${message}`, data)
    } else {
      console.log(`${prefix} ${message}`)
    }
  }
}

export const logger = {
  debug: (data: unknown, message: string = '') => {
    if (!isProduction) {
      formatLog('debug', message, data)
    }
  },
  info: (data: unknown, message: string = '') => {
    formatLog('info', message, data)
  },
  warn: (data: unknown, message: string = '') => {
    formatLog('warn', message, data)
  },
  error: (data: unknown, message: string = '') => {
    formatLog('error', message, data)
  },
}
