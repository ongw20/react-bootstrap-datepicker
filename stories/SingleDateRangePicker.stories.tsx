import React, { useState, useRef } from 'react'
import { subDays, addDays, subMonths, addMonths, format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import {
  SingleDateRangePicker,
  ChangeSingleDateRange,
  SingleDateRangeFnsRef,
} from '../src'
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
    minDate: subMonths(today, 2),
    maxDate: addMonths(today, 1),
  })

  const dateRangeFnsRef: SingleDateRangeFnsRef = useRef()

  const handleChangeDateRange = ({ startDate, endDate }) => {
    console.log(`start - ${format(startDate, 'PP')}`)
    console.log(`end - ${format(endDate, 'PP')}`)
  }

  const handleClearDateRange = () => {
    dateRangeFnsRef.current.clear()
  }

  const handleChangeMinMaxDate = () => {
    setDateOptions({
      minDate: subMonths(today, 1),
      maxDate: addMonths(today, 2),
    })
  }

  return (
    <div className="form-inline">
      <SingleDateRangePicker
        initialStartDate={subDays(today, 5)}
        initialEndDate={addDays(today, 6)}
        minDate={dateOptions.minDate}
        maxDate={dateOptions.maxDate}
        onChangeDateRange={handleChangeDateRange}
        dateRangeFnsRef={dateRangeFnsRef}
      />
      <div className="form-group px-2">
        <button
          className="btn btn-primary btn-sm"
          onClick={handleClearDateRange}
        >
          Clear
        </button>
      </div>
      <div className="form-group px-2">
        <button
          className="btn btn-primary btn-sm"
          onClick={handleChangeMinMaxDate}
        >
          Change Min/Max Date
        </button>
      </div>
    </div>
  )
}

export default {
  title: 'Date Range Picker',
}
