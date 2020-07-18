import {
  Locale,
  getDay,
  getDaysInMonth,
  subMonths,
  addMonths,
  isToday,
  isBefore,
  isAfter,
  isSameDay,
  isWithinInterval,
  setDate,
  startOfMonth,
} from 'date-fns'

export type DateRangeCalendarProps = {
  startDate?: number
  endDate?: number
  minDate?: number
  maxDate?: number
  selectingDate: 'start' | 'end' | 'none'
  locale: Locale
}

export const enum DateStatus {
  TODAY = 'rb-today',
  DISABLED = 'rb-disabled',
  PREV = 'rb-prev',
  NEXT = 'rb-next',
  OFF_MONTH = 'rb-off-month',
  START_DATE = 'rb-start-date',
  END_DATE = 'rb-end-date',
  IN_RANGE = 'rb-in-range',
  HOVER_IN_RANGE = 'rb-hover-in-range',
}

export type CalendarDay = {
  status: DateStatus[]
  date: number
  day: number
}

export function genDateRangeCalendar(
  month: number,
  {
    startDate,
    endDate,
    minDate,
    maxDate,
    selectingDate,
    hoverDate,
    locale,
  }: DateRangeCalendarProps & { hoverDate?: number }
): CalendarDay[][] {
  const calendar: CalendarDay[][] = [[], [], [], [], [], []]
  const curMonthDays = getDaysInMonth(month)
  const curWeekday = getDay(startOfMonth(month))
  const lastMonth = subMonths(month, 1)
  const lastMonthDays = getDaysInMonth(lastMonth)
  const nextMonth = addMonths(month, 1)

  const getDateStatus = (date: Date, isOffMonth: boolean): DateStatus[] => {
    const status = []
    if (isToday(date)) {
      status.push(DateStatus.TODAY)
    }

    if (isOffMonth) {
      status.push(DateStatus.OFF_MONTH)
    }

    if (
      (minDate && isBefore(date, minDate)) ||
      (maxDate && isAfter(date, maxDate))
    ) {
      status.push(DateStatus.DISABLED)
      return status
    }

    if (startDate && isSameDay(date, startDate)) {
      status.push(DateStatus.START_DATE)
    }
    if (endDate && isSameDay(date, endDate)) {
      status.push(DateStatus.END_DATE)
    }
    if (
      startDate &&
      endDate &&
      startDate < endDate &&
      isWithinInterval(date, {
        start: startDate,
        end: endDate,
      })
    ) {
      status.push(DateStatus.IN_RANGE)
    }

    if (hoverDate) {
      if (
        (selectingDate === 'start' &&
          endDate &&
          hoverDate < endDate &&
          isWithinInterval(date, {
            start: hoverDate,
            end: endDate,
          })) ||
        (selectingDate === 'end' &&
          startDate &&
          startDate < hoverDate &&
          isWithinInterval(date, {
            start: startDate,
            end: hoverDate,
          }))
      ) {
        if (
          !status.includes(DateStatus.START_DATE) &&
          !status.includes(DateStatus.END_DATE)
        ) {
          status.push(DateStatus.HOVER_IN_RANGE)
        }
      }
    }

    return status
  }

  const getCalendarDay = (
    day: number /* nth of month, not Date*/
  ): CalendarDay => {
    let date: Date
    let status: DateStatus[]
    if (day <= lastMonthDays) {
      date = setDate(lastMonth, day)
      status = [DateStatus.PREV, ...getDateStatus(date, true)]
    } else if (day <= lastMonthDays + curMonthDays) {
      day -= lastMonthDays
      date = setDate(month, day)
      status = getDateStatus(date, false)
    } else {
      day = day - lastMonthDays - curMonthDays
      date = setDate(nextMonth, day)
      status = [DateStatus.NEXT, ...getDateStatus(date, true)]
    }
    return {
      status,
      date: date.getTime(),
      day,
    }
  }

  for (let i = 0; i < 7; i++) {
    const weekStartsOn = locale.options?.weekStartsOn || 0
    const day = lastMonthDays - curWeekday + i + 1 + weekStartsOn
    for (let j = 0; j < 6; j++) {
      calendar[j][i] = getCalendarDay(day + j * 7)
    }
  }
  return calendar
}
