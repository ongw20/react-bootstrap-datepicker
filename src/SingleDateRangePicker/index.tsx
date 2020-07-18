import React, { FC } from 'react'
import { Locale } from 'date-fns'
import { enUS } from 'date-fns/locale'
import SingleDateRangePickerContent, {
  ChangeDateRange,
  DateRangeFnsRef,
  IsValidDateRange,
} from './SingleDateRangePickerContent'

export { ChangeDateRange, DateRangeFnsRef, IsValidDateRange }

type Props = {
  initialStartDate?: string | Date
  initialEndDate?: string | Date
  minDate?: string | Date
  maxDate?: string | Date
  locale?: Locale
  pattern?: string
  calendarMonthPattern?: 'MMM yyyy' | 'yyyy MMM'
  onChangeDateRange: ChangeDateRange
  dateRangeFnsRef?: DateRangeFnsRef
  isValidDateRange?: IsValidDateRange
}

const SingleDateRangePicker: FC<Props> = ({
  initialStartDate,
  initialEndDate,
  minDate: minDateProp,
  maxDate: maxDateProp,
  locale,
  pattern,
  calendarMonthPattern,
  onChangeDateRange: changeDateRange,
  dateRangeFnsRef,
  isValidDateRange,
}) => {
  const startDate =
    initialStartDate instanceof Date
      ? initialStartDate.getTime()
      : typeof initialStartDate === 'string'
      ? new Date(initialStartDate).getTime()
      : initialStartDate

  const endDate =
    initialEndDate instanceof Date
      ? initialEndDate.getTime()
      : typeof initialEndDate === 'string'
      ? new Date(initialEndDate).getTime()
      : initialEndDate

  const minDate =
    minDateProp instanceof Date
      ? minDateProp.getTime()
      : typeof minDateProp === 'string'
      ? new Date(minDateProp).getTime()
      : minDateProp

  const maxDate =
    maxDateProp instanceof Date
      ? maxDateProp.getTime()
      : typeof maxDateProp === 'string'
      ? new Date(maxDateProp).getTime()
      : maxDateProp

  return (
    <SingleDateRangePickerContent
      initialStartDate={startDate}
      initialEndDate={endDate}
      minDate={minDate}
      maxDate={maxDate}
      locale={locale || enUS}
      pattern={pattern || 'PP'}
      calendarMonthPattern={calendarMonthPattern || 'MMM yyyy'}
      onChangeDateRange={changeDateRange}
      dateRangeFnsRef={dateRangeFnsRef}
      isValidDateRange={isValidDateRange}
    />
  )
}

export default SingleDateRangePicker
