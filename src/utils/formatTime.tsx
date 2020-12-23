import dayjs from 'dayjs'

export const formatTime = (time?: string | number | Date | dayjs.Dayjs, template = 'YYYY-MM-DD HH:mm:ss') => dayjs(time).format(template)
