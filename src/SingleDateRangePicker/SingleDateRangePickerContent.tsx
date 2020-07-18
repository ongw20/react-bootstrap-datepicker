import React, {
  FC,
  useRef,
  useState,
  useCallback,
  useEffect,
  createRef,
  MutableRefObject,
} from 'react'
import { Locale, format, isBefore, isAfter } from 'date-fns'
import SingleDateRangePickerCalendar, {
  ChangeDate,
  IsValidDateRange,
} from './SingleDateRangePickerCalendar'
import './SingleDateRangePickerContent.scss'

export type ChangeDateRange = (dates: {
  startDate: number
  endDate: number
}) => void

export type DateRangeFnsRef = MutableRefObject<{
  clear: () => void
}>

export { IsValidDateRange }

type Props = {
  initialStartDate?: number
  initialEndDate?: number
  minDate?: number
  maxDate?: number
  locale: Locale
  pattern: string
  calendarMonthPattern: string
  onChangeDateRange: ChangeDateRange
  dateRangeFnsRef?: DateRangeFnsRef
  isValidDateRange?: IsValidDateRange
}

const SingleDateRangePickerContent: FC<Props> = ({
  initialStartDate,
  initialEndDate,
  minDate,
  maxDate,
  locale,
  pattern,
  calendarMonthPattern,
  onChangeDateRange: changeDateRange,
  dateRangeFnsRef,
  isValidDateRange,
}) => {
  const startDateRef = useRef<number | undefined>(initialStartDate)
  const endDateRef = useRef<number | undefined>(initialEndDate)

  const [startDate, setStartDate] = useState<number | undefined>(
    initialStartDate
  )
  const [endDate, setEndDate] = useState<number | undefined>(initialEndDate)

  const [show, setShow] = useState<boolean>(false)
  const [selectingDate, setSelectingDate] = useState<'start' | 'end' | 'none'>(
    'none'
  )
  const [calendarMonth, setCalendarMonth] = useState<number>()

  const clickedContainer = useRef<boolean>(false)

  const startDateInputRef = createRef<HTMLInputElement>()
  const endDateInputRef = createRef<HTMLInputElement>()

  useEffect(() => {
    if (dateRangeFnsRef) {
      dateRangeFnsRef.current = {
        clear: () => {
          setStartDate((startDateRef.current = undefined))
          setEndDate((endDateRef.current = undefined))
        },
      }
    }
  }, [dateRangeFnsRef])

  useEffect(() => {
    if (!show) {
      setStartDate(startDateRef.current)
      setEndDate(endDateRef.current)
    }
  }, [show])

  const close = useCallback(() => {
    setSelectingDate('none')
    setShow(false)
  }, [])

  useEffect(() => {
    const handleClose = () => {
      if (clickedContainer.current) {
        clickedContainer.current = false
      } else {
        close()
      }
    }
    window.addEventListener('click', handleClose)
    return () => window.removeEventListener('click', handleClose)
  }, [close])

  const getMonth = (date?: number) => {
    let month = date || new Date().getTime()
    if (minDate && isAfter(minDate, month)) {
      month = minDate
    }
    if (maxDate && isBefore(maxDate, month)) {
      month = maxDate
    }
    return month
  }

  const handleSelectStartDate = () => {
    setCalendarMonth(getMonth(startDate))
    setSelectingDate('start')
    setShow(true)
  }
  const handleSelectEndDate = () => {
    setCalendarMonth(getMonth(endDate))
    setSelectingDate('end')
    setShow(true)
  }

  const handleChangeMonth = (month: number) => {
    setCalendarMonth(month)
  }
  const handleChangeDate: ChangeDate = ({
    startDate: selectedStartDate,
    endDate: selectedEndDate,
  }) => {
    if (selectedStartDate && selectedEndDate) {
      startDateRef.current = selectedStartDate
      endDateRef.current = selectedEndDate
      close()
      changeDateRange({
        startDate: selectedStartDate,
        endDate: selectedEndDate,
      })
      return
    } else if (!selectedStartDate) {
      setSelectingDate('start')
      startDateInputRef.current?.focus()
    } else if (!selectedEndDate) {
      setSelectingDate('end')
      endDateInputRef.current?.focus()
    }
    setStartDate(selectedStartDate)
    setEndDate(selectedEndDate)
  }

  const handleChangeInput = () => undefined

  return (
    <div
      className="rb-single-date-range-picker-content"
      onClick={() => (clickedContainer.current = true)}
    >
      <div className="form-inline">
        <div
          className={`form-group ${
            selectingDate === 'start' ? 'rb-active' : ''
          }`}
        >
          <input
            className="form-control form-control-sm"
            type="text"
            ref={startDateInputRef}
            value={startDate ? format(startDate, pattern, { locale }) : ''}
            onChange={handleChangeInput}
            onMouseDown={handleSelectStartDate}
            placeholder="Start date"
            autoComplete="off"
          />
        </div>
        <div className="rb-date-range-picker-separator form-group">
          <label>~</label>
        </div>
        <div
          className={`form-group ${selectingDate === 'end' ? 'rb-active' : ''}`}
        >
          <input
            className="form-control form-control-sm"
            type="text"
            ref={endDateInputRef}
            value={endDate ? format(endDate, pattern, { locale }) : ''}
            onChange={handleChangeInput}
            onMouseDown={handleSelectEndDate}
            placeholder="End date"
            autoComplete="off"
          />
        </div>
      </div>
      {show && calendarMonth ? (
        <div className="rb-single-date-range-picker-panel">
          <SingleDateRangePickerCalendar
            month={calendarMonth}
            startDate={startDate}
            endDate={endDate}
            minDate={minDate}
            maxDate={maxDate}
            selectingDate={selectingDate}
            locale={locale}
            calendarMonthPattern={calendarMonthPattern}
            onChangeMonth={handleChangeMonth}
            onChangeDate={handleChangeDate}
            isValidDateRange={isValidDateRange}
          />
        </div>
      ) : null}
    </div>
  )
}

export default SingleDateRangePickerContent
