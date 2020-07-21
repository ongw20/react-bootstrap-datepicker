import React, { FC, useState, useMemo } from 'react'
import {
  isSameMonth,
  isBefore,
  startOfMonth,
  isAfter,
  endOfMonth,
  addMonths,
  subMonths,
  format,
} from 'date-fns'
import {
  DateRangeCalendarProps,
  CalendarDay,
  genDateRangeCalendar,
  DateStatus,
} from './genDateRangeCalendar'
import './index.scss'

type Dates =
  | {
      startDate: number
      endDate?: number
    }
  | {
      startDate?: number
      endDate: number
    }

export type ChangeDate = (dates: Dates) => void

/**
 * Decide other date need to be cleared or not
 *
 * i.e.
 * if `startDate` is set to 2020-01-02,
 * when `endDate` is 2020-02-03,
 * but they need to be in a single calendar month,
 * then `endDate` will be cleared.
 */
export type IsValidDateRange = (dates: Dates) => boolean

type Props = {
  month: number
  calendarMonthPattern: string
  onChangeMonth: (month: number) => void
  onChangeDate: ChangeDate
  isValidDateRange?: IsValidDateRange
} & DateRangeCalendarProps

const SingleDateRangePickerCalendar: FC<Props> = ({
  month,
  startDate,
  endDate,
  maxDate,
  minDate,
  selectingDate,
  locale,
  calendarMonthPattern,
  onChangeMonth: changeMonth,
  onChangeDate: changeDate,
  isValidDateRange,
}) => {
  const [hoverDate, setHoverDate] = useState<number>()

  const prevDisabled = useMemo(
    () =>
      minDate &&
      (isSameMonth(month, minDate) || isBefore(month, startOfMonth(minDate))),
    [month, minDate]
  )
  const nextDisabled = useMemo(
    () =>
      maxDate &&
      (isSameMonth(month, maxDate) || isAfter(month, endOfMonth(maxDate))),
    [month, maxDate]
  )
  const calendar = useMemo(
    () =>
      genDateRangeCalendar(month, {
        startDate,
        endDate,
        minDate,
        maxDate,
        selectingDate,
        hoverDate,
        locale,
      }),
    [
      month,
      startDate,
      endDate,
      minDate,
      maxDate,
      selectingDate,
      hoverDate,
      locale,
    ]
  )

  const handleSelectDate = ({ status, date }: CalendarDay) => {
    if (status.includes(DateStatus.DISABLED)) return

    if (status.includes(DateStatus.PREV)) {
      changeMonth(subMonths(month, 1).getTime())
    } else if (status.includes(DateStatus.NEXT)) {
      changeMonth(addMonths(month, 1).getTime())
    }
    if (selectingDate === 'start') {
      if (
        !endDate ||
        isAfter(date, endDate) ||
        (isValidDateRange &&
          !isValidDateRange({
            startDate: date,
            endDate,
          }))
      ) {
        changeDate({
          startDate: date,
        })
      } else {
        changeDate({
          startDate: date,
          endDate,
        })
      }
    } else if (selectingDate === 'end') {
      if (
        !startDate ||
        isBefore(date, startDate) ||
        (isValidDateRange &&
          !isValidDateRange({
            startDate,
            endDate: date,
          }))
      ) {
        changeDate({
          endDate: date,
        })
      } else {
        changeDate({
          startDate,
          endDate: date,
        })
      }
    }
  }

  const handleMouseEnterDate = ({ status, date }: CalendarDay) => {
    if (status.includes(DateStatus.DISABLED)) return
    if (
      isValidDateRange &&
      ((startDate &&
        isAfter(date, startDate) &&
        !isValidDateRange({
          startDate,
          endDate: date,
        })) ||
        (endDate &&
          isBefore(date, endDate) &&
          !isValidDateRange({
            startDate: date,
            endDate,
          })))
    )
      return
    setHoverDate(date)
  }
  const handleMouseLeaveDate = () => {
    setHoverDate(undefined)
  }
  const handleToPrevMonth = () => {
    if (prevDisabled) return
    changeMonth(subMonths(month, 1).getTime())
  }
  const handleToNextMonth = () => {
    if (nextDisabled) return
    changeMonth(addMonths(month, 1).getTime())
  }

  const getDayValues = () => {
    const dayValues = []
    const weekStartsOn = locale.options?.weekStartsOn || 0
    for (let i = weekStartsOn; i < weekStartsOn + 7; i++) {
      dayValues.push(locale.localize?.day(i % 7, { width: 'short' }))
    }
    return dayValues
  }

  return (
    <div className="rb-single-date-range-picker-calendar">
      <table className="table table-borderless">
        <thead>
          <tr>
            <th
              className={`rb-prev-month ${prevDisabled ? 'rb-disabled' : ''}`}
              onClick={handleToPrevMonth}
            >
              &lt;
            </th>
            <th colSpan={5}>
              {format(month, calendarMonthPattern, { locale })}
            </th>
            <th
              className={`rb-next-month ${nextDisabled ? 'rb-disabled' : ''}`}
              onClick={handleToNextMonth}
            >
              &gt;
            </th>
          </tr>
          <tr>
            {getDayValues().map((dayValue) => (
              <th key={dayValue}>{dayValue}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendar.map((week, i) => (
            <tr key={i}>
              {week.map((day) => (
                <td
                  key={day.date}
                  className={day.status.join(' ')}
                  onClick={() => handleSelectDate(day)}
                  onMouseEnter={() => handleMouseEnterDate(day)}
                  onMouseLeave={handleMouseLeaveDate}
                >
                  {day.day}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default SingleDateRangePickerCalendar
