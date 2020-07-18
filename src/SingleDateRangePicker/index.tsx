import React, { FC } from 'react'
import { Locale } from 'date-fns'
import { enUS } from 'date-fns/locale'
import SingleDateRangePickerContent, {
  ChangeDateRange,
  IsValidDateRange,
} from './SingleDateRangePickerContent'

export { ChangeDateRange, IsValidDateRange }

type Props = {
  startDate?: string | number | Date
  endDate?: string | number | Date
  minDate?: string | number | Date
  maxDate?: string | number | Date
  locale?: Locale
  pattern?: string
  calendarMonthPattern?: 'MMM yyyy' | 'yyyy MMM'
  onChangeDateRange: ChangeDateRange
  isValidDateRange?: IsValidDateRange
}

const SingleDateRangePicker: FC<Props> = ({
  startDate: startDateProp,
  endDate: endDateProp,
  minDate: minDateProp,
  maxDate: maxDateProp,
  locale,
  pattern,
  calendarMonthPattern,
  onChangeDateRange: changeDateRange,
  isValidDateRange,
  children,
}) => {
  const startDate = startDateProp
    ? new Date(startDateProp).getTime()
    : undefined

  const endDate = endDateProp ? new Date(endDateProp).getTime() : undefined

  const minDate = minDateProp ? new Date(minDateProp).getTime() : undefined

  const maxDate = maxDateProp ? new Date(maxDateProp).getTime() : undefined

  return (
    <SingleDateRangePickerContent
      startDate={startDate}
      endDate={endDate}
      minDate={minDate}
      maxDate={maxDate}
      locale={locale || enUS}
      pattern={pattern || 'PP'}
      calendarMonthPattern={calendarMonthPattern || 'MMM yyyy'}
      onChangeDateRange={changeDateRange}
      isValidDateRange={isValidDateRange}
    >
      {children}
    </SingleDateRangePickerContent>
  )
}

export default SingleDateRangePicker
