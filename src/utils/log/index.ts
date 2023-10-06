import { pino } from 'pino'

const timestamp = () => {
  const iso8601 = new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
  })
  return iso8601.format(new Date()).replaceAll('/', '-')
}

export const logger = pino({
  enabled: process.env.NODE_ENV !== 'test',
  timestamp: () => `,"timestamp":"${timestamp()}"`,
  formatters: {
    level: (label) => {
      return { level: label }
    },
    bindings: () => {
      return {}
    },
  },
})
