import React, { FC, useState, useEffect, memo } from 'react'
import moment, { Moment } from 'moment'
import {
  DateRangePickerConfig,
  CalendarDay,
  genDateRangeCalendar,
  DateStatus,
} from './genDateRangeCalendar'
import './index.scss'

type Props = {
  month?: Moment
  onChangeMonth: (month: Moment) => void
  onChangeDate: (dates: {
    startDate?: Moment | null
    endDate?: Moment | null
  }) => void
} & DateRangePickerConfig

const SingleDateRangePickerPanel: FC<Props> = ({
  month,
  onChangeMonth,
  selectingDate,
  onChangeDate,
  startDate,
  endDate,
  maxDate,
  minDate,
}) => {
  const [calendar, setCalendar] = useState<CalendarDay[][]>(null)
  const [hoverDate, setHoverDate] = useState<Moment>(null)

  const prevDisabled = month.isSameOrBefore(minDate, 'month')
  const nextDisabled = month.isSameOrAfter(maxDate, 'month')

  useEffect(() => {
    setCalendar(
      genDateRangeCalendar(month || moment(), {
        startDate,
        endDate,
        minDate,
        maxDate,
        selectingDate,
        hoverDate,
      })
    )
  }, [month, startDate, endDate, minDate, maxDate, hoverDate])

  const handleClickDate = (day) => {
    if (day.status.indexOf(DateStatus.DISABLED) > -1) return
    if (day.status.indexOf(DateStatus.PREV) > -1) {
      onChangeMonth(moment(month).subtract(1, 'month'))
    } else if (day.status.indexOf(DateStatus.NEXT) > -1) {
      onChangeMonth(moment(month).add(1, 'month'))
    }
    if (selectingDate === 'start') {
      if (!endDate || day.date.isSameOrBefore(endDate)) {
        onChangeDate({
          startDate: day.date,
        })
      } else {
        onChangeDate({
          startDate: day.date,
          endDate: null,
        })
      }
    } else if (selectingDate === 'end') {
      if (!startDate || day.date.isSameOrAfter(startDate)) {
        onChangeDate({
          endDate: day.date,
        })
      } else {
        onChangeDate({
          startDate: null,
          endDate: day.date,
        })
      }
    }
  }
  const handleMouseEnterDate = (day) => {
    if (day.status.indexOf(DateStatus.DISABLED) > -1) {
      return
    }
    setHoverDate(day.date)
  }
  const handleMouseLeaveDate = () => {
    setHoverDate(null)
  }
  const handleClickPrev = () => {
    if (prevDisabled) return
    onChangeMonth(moment(month).subtract(1, 'month'))
  }
  const handleClickNext = () => {
    if (nextDisabled) return
    onChangeMonth(moment(month).add(1, 'month'))
  }
  return calendar ? (
    <div className="rb-date-picker-panel-container">
      <table className="rb-date-picker-panel table table-borderless">
        <thead>
          <tr>
            <th
              className={`prev ${prevDisabled ? 'disabled' : ''}`}
              onClick={handleClickPrev}
            >
              &lt;
            </th>
            <th colSpan={5}>{month.format('MMM, YYYY')}</th>
            <th
              className={`next ${nextDisabled ? 'disabled' : ''}`}
              onClick={handleClickNext}
            >
              &gt;
            </th>
          </tr>
          <tr>
            <th>Su</th>
            <th>Mo</th>
            <th>Tu</th>
            <th>We</th>
            <th>Th</th>
            <th>Fr</th>
            <th>Sa</th>
          </tr>
        </thead>
        <tbody>
          {calendar.map((rowDays, i) => (
            <tr key={i}>
              {rowDays.map((day) => (
                <td
                  key={day.key}
                  className={day.status.join(' ')}
                  onClick={() => handleClickDate(day)}
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
  ) : null
}

export default memo(SingleDateRangePickerPanel)
