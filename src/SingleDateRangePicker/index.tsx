import React, { FC } from 'react'
import { Locale } from 'date-fns'
import { enUS } from 'date-fns/locale'
import SingleDateRangePickerContent, {
  ChangeDateRange,
  IsValidDateRange,
} from './SingleDateRangePickerContent'

export { ChangeDateRange, IsValidDateRange }

type Props = {
  startDate?: string | Date
  endDate?: string | Date
  minDate?: string | Date
  maxDate?: string | Date
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
}) => {
  const startDate =
    startDateProp instanceof Date
      ? startDateProp.getTime()
      : typeof startDateProp === 'string'
      ? new Date(startDateProp).getTime()
      : startDateProp

  const endDate =
    endDateProp instanceof Date
      ? endDateProp.getTime()
      : typeof endDateProp === 'string'
      ? new Date(endDateProp).getTime()
      : endDateProp

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
      startDate={startDate}
      endDate={endDate}
      minDate={minDate}
      maxDate={maxDate}
      locale={locale || enUS}
      pattern={pattern || 'yyyy-MM-dd'}
      calendarMonthPattern={calendarMonthPattern || 'MMM yyyy'}
      onChangeDateRange={changeDateRange}
      isValidDateRange={isValidDateRange}
    />
  )
}

export default SingleDateRangePicker
