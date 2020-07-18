import React, { useState } from 'react'
import { subDays, addDays, subMonths, addMonths, format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { SingleDateRangePicker, ChangeSingleDateRange } from '../src'
import 'bootstrap/dist/css/bootstrap.min.css'

export const DateRangePickerBasic = () => {
  const handleChangeDateRange: ChangeSingleDateRange = ({
    startDate,
    endDate,
  }) => {
    console.log(`start - ${format(startDate, 'PP')}`)
    console.log(`end - ${format(endDate, 'PP')}`)
  }
  return (
    <SingleDateRangePicker
      locale={zhCN}
      calendarMonthPattern="yyyy MMM"
      onChangeDateRange={handleChangeDateRange}
    />
  )
}

export const DateRangePickerWithConfig = () => {
  const today = new Date()

  const [dateOptions, setDateOptions] = useState({
    startDate: subDays(today, 5),
    endDate: addDays(today, 6),
    minDate: subMonths(today, 2),
    maxDate: addMonths(today, 1),
  })

  const handleChangeDateRange = ({ startDate, endDate }) => {
    setDateOptions({
      ...dateOptions,
      startDate,
      endDate,
    })
    if (startDate && endDate) {
      console.log(`start - ${format(startDate, 'PP')}`)
      console.log(`end - ${format(endDate, 'PP')}`)
    }
  }

  const handleClearDateRange = () => {
    setDateOptions({
      ...dateOptions,
      startDate: undefined,
      endDate: undefined,
    })
  }

  return (
    <div className="form-inline">
      <SingleDateRangePicker
        startDate={dateOptions.startDate}
        endDate={dateOptions.endDate}
        minDate={dateOptions.minDate}
        maxDate={dateOptions.maxDate}
        onChangeDateRange={handleChangeDateRange}
      >
        <div className="form-group px-2">
          <button
            className="btn btn-primary btn-sm"
            onClick={handleClearDateRange}
          >
            Clear
          </button>
        </div>
      </SingleDateRangePicker>
    </div>
  )
}

export default {
  title: 'Date Range Picker',
}
