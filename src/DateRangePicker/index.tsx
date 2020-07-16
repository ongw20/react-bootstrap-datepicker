import React, { FC, useState, useRef, createRef, useEffect, memo } from 'react'
import moment, { Moment } from 'moment'
import { defaultLocale, Locale, LocaleProvider } from '../locale'
import { voidHandler } from '../utils'
import SingleDateRangePickerPanel from '../components/SingleDateRangePickerPanel'
import './index.scss'

export type DateFns = {
  clearDateRange: () => void
}

interface Props {
  initialStartDate?: string | Moment
  initialEndDate?: string | Moment
  initialMinDate?: string | Moment
  initialMaxDate?: string | Moment
  locale?: Partial<Locale>
  onChangeDateRange: (dates: { startDate: string; endDate: string }) => void
  getDateFns?: (fns: DateFns) => void
}

const DateRangePicker: FC<Props> = ({
  initialStartDate,
  initialEndDate,
  initialMinDate,
  initialMaxDate,
  locale,
  onChangeDateRange,
  getDateFns,
}) => {
  const clickedContainer = useRef<boolean>(false)

  const startDateRef = useRef<Moment>(
    initialStartDate ? moment(initialStartDate) : null
  )
  const endDateRef = useRef<Moment>(
    initialEndDate ? moment(initialEndDate) : null
  )
  const [startDate, setStartDate] = useState<Moment>(startDateRef.current)
  const [endDate, setEndDate] = useState<Moment>(endDateRef.current)

  const [minDate, setMinDate] = useState<Moment>(
    initialMinDate ? moment(initialMinDate) : null
  )
  const [maxDate, setMaxDate] = useState<Moment>(
    initialMaxDate ? moment(initialMaxDate) : null
  )
  const [dateLocale, setDateLocale] = useState<Locale>(null)

  useEffect(() => {
    setDateLocale({
      ...defaultLocale,
      ...locale,
    })
  }, [locale])

  const [show, setShow] = useState<boolean>(false)
  const [selectingDate, setSelectingDate] = useState<'start' | 'end'>(null)
  const [calendarMonth, setCalendarMonth] = useState<Moment>(null)

  const startDateInputRef = createRef<HTMLInputElement>()
  const endDateInputRef = createRef<HTMLInputElement>()

  useEffect(() => {
    getDateFns &&
      getDateFns({
        clearDateRange: () => {
          setStartDate((startDateRef.current = null))
          setEndDate((endDateRef.current = null))
        },
      })
  }, [getDateFns, setStartDate, setEndDate])

  useEffect(() => {
    if (show) {
      if (
        startDate &&
        endDate &&
        (startDate !== startDateRef.current || endDate !== endDateRef.current)
      ) {
        setShow(false)
        setSelectingDate(null)
        startDateRef.current = startDate
        endDateRef.current = endDate
        onChangeDateRange({
          startDate: startDate.format('YYYY-MM-DD'),
          endDate: endDate.format('YYYY-MM-DD'),
        })
      }
    } else if (!startDate || !endDate) {
      setStartDate(startDateRef.current)
      setEndDate(endDateRef.current)
    }
  }, [
    show,
    startDate,
    endDate,
    setShow,
    setStartDate,
    setEndDate,
    onChangeDateRange,
  ])

  useEffect(() => {
    const hide = () => {
      if (clickedContainer.current) {
        clickedContainer.current = false
      } else {
        setShow(false)
        setSelectingDate(null)
      }
    }
    window.addEventListener('click', hide)
    return () => window.removeEventListener('click', hide)
  }, [setShow])

  const handleClickStartDateInput = () => {
    setCalendarMonth(startDate || moment())
    setSelectingDate('start')
    setShow(true)
  }
  const handleClickEndDateInput = () => {
    setCalendarMonth(endDate || moment())
    setSelectingDate('end')
    setShow(true)
  }
  const handleChangeMonth = (month) => {
    setCalendarMonth(month)
  }
  const handleChangeDate = (dates) => {
    if (dates.startDate === null) {
      setStartDate(null)
      setSelectingDate('start')
      startDateInputRef.current.focus()
    } else if (dates.startDate) {
      setStartDate(dates.startDate)
      setSelectingDate('end')
      if (!endDate) {
        endDateInputRef.current.focus()
      }
    }
    if (dates.endDate === null) {
      setEndDate(null)
      setSelectingDate('end')
      endDateInputRef.current.focus()
    } else if (dates.endDate) {
      setEndDate(dates.endDate)
      setSelectingDate('start')
      if (!startDate) {
        startDateInputRef.current.focus()
      }
    }
  }
  if (!dateLocale) return null

  return (
    <div
      className="rb-date-range-picker-container"
      onClick={() => (clickedContainer.current = true)}
    >
      <div className="form-inline">
        <div
          className={`form-group ${
            selectingDate === 'start' ? 'rb-current' : ''
          }`}
        >
          <input
            className="form-control form-control-sm"
            value={startDate ? startDate.format(dateLocale.pattern) : ''}
            onChange={voidHandler}
            onClick={handleClickStartDateInput}
            ref={startDateInputRef}
            placeholder="Start date"
            autoComplete="off"
          />
        </div>
        <div className="rb-date-range-picker-separator form-group">
          <label>~</label>
        </div>
        <div
          className={`form-group ${
            selectingDate === 'end' ? 'rb-current' : ''
          }`}
        >
          <input
            className="form-control form-control-sm"
            value={endDate ? endDate.format(dateLocale.pattern) : ''}
            onChange={voidHandler}
            onClick={handleClickEndDateInput}
            ref={endDateInputRef}
            placeholder="End date"
            autoComplete="off"
          />
        </div>
      </div>
      {show ? (
        <div className="rb-date-range-picker">
          <div className="rb-calendar">
            <SingleDateRangePickerPanel
              month={calendarMonth}
              onChangeMonth={handleChangeMonth}
              startDate={startDate}
              endDate={endDate}
              minDate={minDate}
              maxDate={maxDate}
              selectingDate={selectingDate}
              onChangeDate={handleChangeDate}
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default memo(DateRangePicker)
