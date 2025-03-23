import dayjs from 'dayjs'

export const shortcuts = [
  {
    text: '近一周',
    value: () => {
      const startDate = dayjs().subtract(1, 'w').format('YYYY-MM-DD 00:00:00')
      const start = new Date(startDate)
      const end = new Date()
      return [start, end]
    }
  },
  {
    text: '近一月',
    value: () => {
      const end = new Date()
      const startDate = dayjs().subtract(1, 'M').format('YYYY-MM-DD 00:00:00')
      const start = new Date(startDate)
      return [start, end]
    }
  },
  {
    text: '近三月',
    value: () => {
      const end = new Date()
      const startDate = dayjs().subtract(3, 'M').format('YYYY-MM-DD 00:00:00')
      const start = new Date(startDate)
      return [start, end]
    }
  }
]
const preThreeMonth = dayjs().subtract(3, 'M').format('YYYY-MM-DD 00:00:00')
const now = dayjs().format('YYYY-MM-DD 23:59:59')
export const defalutTime = [preThreeMonth, now]