import { useEffect, useState } from "react";
import { calendar, hours, minutes } from "../../Data";

function NewItem(props) {

    const months = calendar.map(item => item.month)

   const [descriptionValue, setDescriptionValue] = useState("");
   const [monthValue, setMonthValue] = useState(calendar[props.currentMonth].month)
   const [dayValue, setDayValue] = useState(props.currentDay + 1)
   const [yearValue, setYearValue] = useState(props.currentYear)
   const [guardsValue, setGuardsValue] = useState(0);
   const [notesValue, setNotesValue] = useState("");
   const [hourValue, setHourValue] = useState("11");
   const [minuteValue, setMinuteValue] = useState("00");
   const [ampmValue, setAmpmValue] = useState("AM");

   const [monthMenuOpen, setMonthMenuOpen] = useState(false)
   const [dayMenuOpen, setDayMenuOpen] = useState(false)
   const [yearMenuOpen, setYearMenuOpen] = useState(false)
   const [reminderHourMenuOpen, setReminderHourMenuOpen] = useState(false)
   const [reminderMinuteMenuOpen, setReminderMinuteMenuOpen] = useState(false)
   const [reminderAmpmMenuOpen, setReminderAmpmMenuOpen] = useState(false)

    const [dayOptions, setDayOptions] = useState(() => createDaysArray(calendar[props.currentMonth].month))
    const [yearOptions, setYearOptions] = useState([
        props.currentYear, Number(props.currentYear) + 1, Number(props.currentYear) + 2
    ])


   const [validateDescription, setValidateDescription] = useState(false); 
   const [validateDate, setValidateDate] = useState(false); 
   const [dateLabel, setDateLabel] = useState("Event date")

    const [noticeToEdit, setNoticeToEdit] = useState(null);

    useEffect(() => {
        setDayValue(props.currentDay)
        setMonthValue(calendar[props.currentMonth].month)
    }, [props.currentDay, props.currentMonth])

    //If editing an existing notice
   useEffect(() => {
    if(props.editedNotice) {
        setNoticeToEdit(props.editedNotice)
        const date = props.editedNotice.eventDate;
        const month = date.split(" ")[0];
        const day = date.slice((date.indexOf(" ") + 1), (date.indexOf(",")));

        createDaysArray(month);
        setMonthValue(month)
        setDayValue(day)
        setDescriptionValue(props.editedNotice.title);
        setGuardsValue(props.editedNotice.numberOfGuards === null ? 0 : props.editedNotice.numberOfGuards);
        setNotesValue(() => props.editedNotice.notes ? props.editedNotice.notes : "")
    }
   }, [props.editedNotice])

    function handleCancel(e) {
        e.preventDefault();
        if(props.currentScreen === "desktop") {
            props.setAddNoticeDesktop(false);
            setDescriptionValue("")
            setGuardsValue("")
            setNotesValue("")
        } else {
            props.setCurrentScreen(props.prevScreen);
        }
        props.setEditedNotice(null)
        setValidateDate(false);
        setValidateDescription(false);
    }

    function saveNotice(e) {
        e.preventDefault()
        if(descriptionValue === "") {
            setValidateDescription(true);
            return;
        } 
        if(validateDate) return; 

        const dateValue = `${monthValue} ${dayValue}, ${yearValue}`
        let noticeChanged = false;
        if(noticeToEdit && noticeToEdit.wasEdited === false){
            if(
                descriptionValue === noticeToEdit.title &&
                dateValue === noticeToEdit.eventDate &&
                guardsValue === noticeToEdit.numberOfGuards && 
                notesValue === noticeToEdit.notes &&
                `${hourValue}:${minuteValue}:00` === noticeToEdit.reminderTime
            ) {
                    noticeChanged = false;
                    return;
            }
        } 


        props.setShowAlert(false);
        props.setAlertError(false);

        const localDate = new Date(`${calendar[props.currentMonth].month} ${props.currentDay} ${props.currentYear} ${hourValue}:${minuteValue}`)
        fetch(`${props.base_url}/save-notice`, {
            method: "POST",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                year: props.currentYear,
                month: calendar[props.currentMonth].month,
                day: props.currentDay,
                noticeDate: localDate,
                reminderTime: `${hourValue}:${minuteValue}`,
                title: descriptionValue,
                eventDate: dateValue,
                numberOfGuards: guardsValue,
                completed: false,
                menuIsOpen: false,
                notes: notesValue, 
                showNotes: false,
                createdBy: localStorage.getItem("name"),
                wasEdited: noticeChanged,
                noticeId: props.editedNotice ? props.editedNotice._id : null,
                userId: localStorage.getItem("userId")
            })
        })
        .then(res => {
            console.log("Notice created")
            if(res.status === 201) props.getNotices();
            if(res.status === 500) props.setAlertError(true);
            return res.json()
        })
        .then(res => {
            props.setAlertText(res.message);
            setValidateDate(false);
            setValidateDescription(false);
        })
        .then(() => props.setShowAlert(true))
        .catch(err => {
            props.setShowAlert(true)
            props.setAlertError(true)
            props.setAlertText("Notice could not be saved, please try again")
            console.log(err)
        });
        handleCancel(e);
    }

    function createDaysArray(month) {
        const arr = [];
        for(let i = 1; i < calendar[months.indexOf(month)].numberOfDays + 1; i++) {
            arr.push(i);
        }
        return arr;
    }

    function toggleMenu(e) {
        const field = e.target.className; 
        console.log(field)
        if(field.includes("option")) {
            if(field.includes("month")) setMonthMenuOpen(false)
            if(field.includes("day")) setDayMenuOpen(false)
            if(field.includes("year")) setYearMenuOpen(false)            
            if(field.includes("hour")) setReminderHourMenuOpen(false)            
            if(field.includes("minute")) setReminderMinuteMenuOpen(false)            
            if(field.includes("ampm")) setReminderAmpmMenuOpen(false)            
        } else {
            if(field.includes("month")) setMonthMenuOpen(prev => prev ? false : true)
            if(field.includes("day")) setDayMenuOpen(prev => prev ? false : true)
            if(field.includes("year")) setYearMenuOpen(prev => prev ? false : true)            
            if(field.includes("hour")) setReminderHourMenuOpen(prev => prev ? false : true)            
            if(field.includes("minute")) setReminderMinuteMenuOpen(prev => prev ? false : true)
            if(field.includes("ampm")) setReminderAmpmMenuOpen(prev => prev ? false : true)
        }

    }

    function handleOptionClick(e) {
        const option = e.target.className;
        const value = e.target.innerHTML;
        if(option.includes("month")) {
            setMonthValue(value);
            setMonthMenuOpen(false);
            setDayOptions(createDaysArray(value));
        }
        if(option.includes("day")) {
            setDayValue(value);
            setDayMenuOpen(false);
        }
        if(option.includes("year")) {
            setYearValue(value);
            setYearMenuOpen(false);
        }
        if(option.includes("hour")) {
            setHourValue(value);
            setReminderHourMenuOpen(false);
        }
        if(option.includes("minute")) {
            setMinuteValue(value);
            setReminderMinuteMenuOpen(false);
        }
        if(option.includes("ampm")) {
            setAmpmValue(value);
            setReminderAmpmMenuOpen(false);
        }
    }

    //validates date values
    useEffect(() => {
        setValidateDate(false)
        setDateLabel("Event date");
        const chosenDate = new Date(`${monthValue} ${dayValue}, ${yearValue}`);
        const currentDate = new Date(`${calendar[props.currentMonth].month} ${props.currentDay}, ${props.currentYear}`)
        if(chosenDate < currentDate) {
            setDateLabel("Event date cannot be earlier than notice date");
            setValidateDate(true);
        }
    }, [monthValue, dayValue])

    return (
        <div className={`new-item ${props.currentScreen === "desktop" && !props.addNoticeDesktop ? "hidden" : ""}`}>
            <p className="new-item__title">{`${props.editedNotice ? "" : `${props.currentScreen === "desktop" ? `New notice to be sent on ${calendar[props.currentMonth].month} ${props.currentDay}, ${props.currentYear}` : "New notice"}`}`}</p>
            <form className="new-item__form"> 
                <div className="new-item__form-group">
                    <input 
                        type="text" 
                        className={`form-input ${validateDescription ? "field-required" : ""}`} 
                        value={descriptionValue} 
                        onChange={(e) => setDescriptionValue(e.target.value)}>
                    </input>
                    <label className="form-label">Event description</label>
                </div>
                <div className="new-item__form-group date-group">
                    <div className={`month-selection dropdown-field month-dropdown ${validateDate ? "field-required" : ""}`} onClick={e => toggleMenu(e)}>
                        <p className="month-value">{monthValue}</p>
                        <div className={`dropdown-field__drop-down ${monthMenuOpen ? "" : "hidden"}`}>
                            {months.map((month, index) => (
                                <span 
                                    key={index}
                                    onClick={e => handleOptionClick(e)}
                                    className={`month-option dropdown-field__drop-down-option ${monthValue === month ? "selected-option" : ""}`}>
                                {month}</span>
                            ))}
                        </div>
                        <img className="drop-down-icon" src="./assets/icons/arrow-icon.svg"></img>
                    </div>
                    <div className={`day-selection dropdown-field ${validateDate ? "field-required" : ""}`} onClick={e => toggleMenu(e)}>
                        <p className="day-value">{dayValue}</p>
                        <div className={`dropdown-field__drop-down ${dayMenuOpen ? "" : "hidden"}`}>
                            {dayOptions.map((month, index) => (
                                <span 
                                    key={index}
                                    onClick={e => handleOptionClick(e)}
                                    className="dropdown-field__drop-down-option day-option">
                                {month}</span>
                            ))}
                        </div>
                        <img className="drop-down-icon" src="./assets/icons/arrow-icon.svg"></img>
                    </div>
                    <div className={`year-selection dropdown-field ${validateDate ? "field-required" : ""}`} onClick={e => toggleMenu(e)}>
                        <p className="year-value">{yearValue}</p>
                        <div className={`dropdown-field__drop-down ${yearMenuOpen ? "" : "hidden"}`}>
                            {yearOptions.map((month, index) => (
                                <span 
                                    key={index} 
                                    onClick={e => handleOptionClick(e)}
                                    className="dropdown-field__drop-down-option year-option">
                                {month}</span>
                            ))}
                        </div>
                        <img className="drop-down-icon" src="./assets/icons/arrow-icon.svg"></img>
                    </div>
                    <label className="form-label date-label">{dateLabel}</label> 
                </div>
                <div className="new-item__form-group">
                    <input type="number" className="form-input number-input" value={guardsValue} onChange={e => setGuardsValue(e.target.value)}></input>
                    <label className="form-label">Guards required</label>
                </div>
                <div className="new-item__form-group">
                    <textarea className="form-input" value={notesValue} onChange={e => setNotesValue(e.target.value)}></textarea>
                    <label className="form-label">Notes</label>
                </div>
                <div className="new-item__form-group reminder-time">
                    <label className="reminder-time__label">Remind me at</label>
                    <div className={`reminder-time__hour dropdown-field`} onClick={e => toggleMenu(e)}>
                        <p className="reminder-time__hour-value">{hourValue}</p>
                        <div className={`dropdown-field__drop-down ${reminderHourMenuOpen ? "" : "hidden"}`}>
                            {hours.map((hour, index) => (
                                <span 
                                    key={index} 
                                    onClick={e => handleOptionClick(e)}
                                    className="dropdown-field__drop-down-option hour">
                                {hour}</span>
                            ))}
                        </div>
                    </div>
                    <span>:</span>
                    <div className={`reminder-time__minute dropdown-field`} onClick={e => toggleMenu(e)}>
                        <p className="reminder-time__minute-value">{minuteValue}</p>
                        <div className={`dropdown-field__drop-down ${reminderMinuteMenuOpen ? "" : "hidden"}`}>
                            {minutes.map((minute, index) => (
                                <span 
                                    key={index} 
                                    onClick={e => handleOptionClick(e)}
                                    className="dropdown-field__drop-down-option minute">
                                {minute}</span>
                            ))}
                        </div>
                    </div>
                    
                </div>
            <div className="new-item__buttons">
                <button type="submit" onClick={saveNotice} className="save-btn">save</button>
                <button onClick={handleCancel} className="cancel-btn">cancel</button>
            </div>
            </form>
        </div>
    )
}

export default NewItem;