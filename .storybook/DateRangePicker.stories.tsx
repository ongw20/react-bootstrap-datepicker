import React, { useRef } from 'react'
import DateRangePicker, { DateFns } from '../src/DateRangePicker'
import 'bootstrap/dist/css/bootstrap.min.css'

export const DateRangePickerBasic = () => {
  const handleChangeDateRange = ({ startDate, endDate }) => {
    console.log(startDate)
    console.log(endDate)
  }
  return <DateRangePicker onChangeDateRange={handleChangeDateRange} />
}

export const DateRangePickerWithConfig = () => {
  const dateFnsRef = useRef<DateFns>()

  const handleChangeDateRange = ({ startDate, endDate }) => {
    console.log(startDate)
    console.log(endDate)
  }
  const getDateFns = (dateFns) => {
    dateFnsRef.current = dateFns
  }
  const handleClearDateRange = () => {
    dateFnsRef.current.clearDateRange()
  }

  return (
    <div className="form-inline">
      <DateRangePicker
        initialStartDate="2020-05-15"
        initialEndDate="2020-07-02"
        initialMinDate="2020-05-06"
        initialMaxDate="2020-07-10"
        onChangeDateRange={handleChangeDateRange}
        getDateFns={getDateFns}
      />
      <div className="form-group px-2">
        <button
          className="btn btn-primary btn-sm"
          onClick={handleClearDateRange}
        >
          Clear
        </button>
      </div>
    </div>
  )
}

export default {
  title: 'Date Range Picker',
}
