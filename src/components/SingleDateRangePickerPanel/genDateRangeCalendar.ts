import moment, { Moment } from 'moment'

export type DateRangePickerConfig = {
  startDate?: Moment
  endDate?: Moment
  minDate?: Moment
  maxDate?: Moment
  selectingDate: 'start' | 'end'
}

export enum DateStatus {
  TODAY = 'today',
  DISABLED = 'disabled',
  PREV = 'prev',
  NEXT = 'next',
  OUT_MONTH = 'out-month',
  START_DATE = 'start-date',
  END_DATE = 'end-date',
  IN_RANGE = 'in-range',
  HOVER_IN_RANGE = 'hover-in-range',
}

export type CalendarDay = {
  status: DateStatus[]
  date: Moment
  day: number
  key: string
}

export function genDateRangeCalendar(
  month: Moment,
  {
    startDate,
    endDate,
    minDate,
    maxDate,
    selectingDate,
    hoverDate,
  }: DateRangePickerConfig & { hoverDate?: Moment }
): CalendarDay[][] {
  const calendar = [[], [], [], [], [], []]
  const curMonthDays = month.daysInMonth()
  const curWeekday = moment(month).date(1).weekday()
  const lastMonth = moment(month).subtract(1, 'month')
  const lastMonthDays = lastMonth.daysInMonth()
  const nextMonth = moment(month).add(1, 'month')

  const dateStatus = (date: Moment, isOutOfMonth: boolean): DateStatus[] => {
    const dateStatus = []
    if (date.isSame(moment(), 'day')) {
      dateStatus.push(DateStatus.TODAY)
    }

    if (date.isBefore(minDate) || date.isAfter(maxDate)) {
      dateStatus.push(DateStatus.DISABLED)
      return dateStatus
    }

    if (isOutOfMonth) {
      dateStatus.push(DateStatus.OUT_MONTH)
    }

    if (date.isSame(startDate) && date.isSame(endDate)) {
      dateStatus.push(DateStatus.START_DATE, DateStatus.END_DATE)
    } else if (date.isSame(startDate)) {
      dateStatus.push(DateStatus.START_DATE)
    } else if (date.isSame(endDate)) {
      dateStatus.push(DateStatus.END_DATE)
    } else if (date.isBetween(startDate, endDate)) {
      dateStatus.push(DateStatus.IN_RANGE)
    }

    if (
      (selectingDate === 'start' && date.isBetween(hoverDate, endDate)) ||
      (selectingDate === 'end' && date.isBetween(startDate, hoverDate))
    ) {
      if (
        dateStatus.indexOf(DateStatus.START_DATE) === -1 &&
        dateStatus.indexOf(DateStatus.END_DATE) === -1
      ) {
        dateStatus.push(DateStatus.HOVER_IN_RANGE)
      }
    }
    return dateStatus
  }

  const getDay = (day: number): CalendarDay => {
    let date: Moment
    let status: DateStatus[]
    if (day <= lastMonthDays) {
      date = moment(lastMonth).date(day)
      status = [DateStatus.PREV, ...dateStatus(date, true)]
    } else if (day <= lastMonthDays + curMonthDays) {
      day -= lastMonthDays
      date = moment(month).date(day)
      status = dateStatus(date, false)
    } else {
      day = day - lastMonthDays - curMonthDays
      date = moment(nextMonth).date(day)
      status = [DateStatus.NEXT, ...dateStatus(date, true)]
    }
    return {
      status,
      date,
      day,
      key: date.format('YYYY-MM-DD'),
    }
  }

  for (let i = 0; i < 7; i++) {
    const day = lastMonthDays - curWeekday + i + 1
    for (let j = 0; j < 6; j++) {
      calendar[j][i] = getDay(day + j * 7)
    }
  }
  return calendar
}
