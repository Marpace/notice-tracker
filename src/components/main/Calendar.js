import { calendar } from "../../Data";
import { useEffect, useState } from "react";


function Calendar(props) {



    const days = ["Sun", "Mon","Tue","Wed", "Thu","Fri", "Sat"];
    const [selectedMonth, setSelectedMonth] = useState(props.currentMonth);
    const [calendarDays, setCalendarDays] = useState([]);
    const [screenWidth, setScreenWidth] = useState(null);
    const [calendarChanged, setCalendarChanged] = useState(false);

    useEffect(() => {
        setScreenWidth(window.screen.width)
    }, [])

    //this sets the calendar days for the current/selected month 
    useEffect(() => {
        // gets the starting day of the week for the current or selected month
        const startingDay = new Date(`${props.currentMonth + 1} 1, ${props.currentYear}`).getDay()
        if(calendarChanged) props.setCurrentDay(0);

        setCalendarDays(prev => {
            const arr = [];
            let dateNumber = 1;
            for(let i = 0; i < 6; i++) {
                const row = [];
                for(let n = 0; n < 7; n++) {
                    let cell = {selected: false, date: dateNumber, disabled: false}
                    //for the first row, checking on which day of the week to start the dates
                    if(i === 0) {
                        if(n < startingDay) {
                            cell = {disabled: true}
                            dateNumber--;
                        } 
                        else if(n === startingDay && calendarChanged) {
                            cell = {selected: true, date: dateNumber, disabled: false}
                        } 
                        else {
                            cell = {selected: false, date: dateNumber, disabled: false}
                        }
                    } 
                    // for the 5th and 6th rows, checking on which day of the 
                    //week to end the dates based on number of days of the current/selected month
                    if(i === 4 || i === 5) {
                        if(dateNumber > calendar[props.currentMonth].numberOfDays) {
                            cell = {disabled: true};
                        } else {
                            cell = {selected: false, date: dateNumber}
                        }
                    } 

                    //when page loads this selects the actual current date on the calendar
                    const today = new Date();
                    if(dateNumber === today.getDate() 
                    && props.currentMonth === today.getMonth()
                    && !calendarChanged) {
                        cell = {selected: true, date: dateNumber, disabled: false}
                    }

                    let numberOfNotices = 0

                    props.noticeData.forEach(notice => {
                        if(notice.month === calendar[props.currentMonth].month 
                        && notice.day === dateNumber) {
                            numberOfNotices++
                        }
                    })
                    cell = {
                        ...cell,
                        numberOfNotices: numberOfNotices
                    }
                    row.push(cell)
                    dateNumber++;
                }
                arr.push(row);
            } 
            return arr;
        })
    }, [props.currentMonth, props.noticeData])


    function chooseMonth(index) {
        props.setCurrentMonth(index);
        setSelectedMonth(index);
        setCalendarChanged(true);
    }

    function handleCellClick(rowIndex, dayIndex, date, disabled) {
        if(disabled) return;
        // setCalendarChanged(true);
        setCalendarDays(prev => {
            const copy = [...prev];
            copy.forEach(row => {
                row.forEach(cell => {
                    cell.selected = false;
                })
            })
            copy[rowIndex][dayIndex].selected = true;
            return copy;
        })
        props.setCurrentDay(date - 1)
    }

    function handlePlusIconClick(date) {
        props.setAddNoticeDesktop(true);
        props.setCurrentDay(date - 1)
        setCalendarChanged(true);
    }

    return (
        <div className={`calendar ${props.currentScreen === "day" ? "hidden" : ""}`}>
            <div className="calendar__months">
                {calendar.map((month, index) => (
                    <span onClick={() => chooseMonth(index)} className={`calendar__months-item ${selectedMonth === index ? "selected-month" : ""}`} key={index}>{screenWidth < 1600 ? month.shortMonth : month.month}</span>
                ))}
            </div>
            <div className="calendar__days">
                {days.map((day, index) => (
                    <span key={index} className="calendar__days-item">{day}</span>
                ))}
            </div>
            <div className="calendar__grid">
                <div className="calendar-cells">
                    {calendarDays.map((row, rowIndex) => (
                        <div key={rowIndex} className="calendar-cells__row">
                            {row.map((day, dayIndex) => (
                                <div onClick={(e) => handleCellClick(rowIndex, dayIndex, day.date, day.disabled)} key={dayIndex} className={`row-cell ${day.disabled ? "disabled-cell" : ""} ${day.selected ? "selected-cell" : ""}`}>
                                    <div className="cell-date">{day.date}</div>
                                    <img onClick={() => handlePlusIconClick(day.date)} className="cell-plus-icon" src="./assets/icons/cell-plus-icon.svg"></img>
                                    <p className="cell-number-of-notices">{`${day.numberOfNotices > 0 ? `${day.numberOfNotices > 1 ? `• ${day.numberOfNotices} Notices` : "• 1 Notice"}` : ""}`}</p>
                                </div>
                            ))}
                            <div className="row-divider"></div>
                        </div>
                    ))}
                </div>
                <img className="calendar__grid-outline" src="./assets/calendar-grid.svg"></img>
            </div>
        </div> 
    )
}


export default Calendar;