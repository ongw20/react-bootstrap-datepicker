import React from 'react'
import { zhCN } from 'date-fns/locale'
import SingleDateRangePicker, {
  ChangeDateRange,
} from '../src/SingleDateRangePicker'
import 'bootstrap/dist/css/bootstrap.min.css'

export const DateRangePickerBasic = () => {
  const handleChangeDateRange: ChangeDateRange = ({ startDate, endDate }) => {
    console.log(startDate)
    console.log(endDate)
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
  const handleChangeDateRange = ({ startDate, endDate }) => {
    console.log(startDate)
    console.log(endDate)
  }

  return (
    <div className="form-inline">
      <SingleDateRangePicker
        startDate="2020-05-15"
        endDate="2020-07-02"
        minDate="2020-05-06"
        maxDate="2020-07-10"
        onChangeDateRange={handleChangeDateRange}
      />
      <div className="form-group px-2">
        <button className="btn btn-primary btn-sm">Clear</button>
      </div>
    </div>
  )
}

export default {
  title: 'Date Range Picker',
}
