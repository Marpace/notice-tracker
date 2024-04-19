import { useEffect, useState } from "react";
import { calendar } from "../../Data";

function NewItem(props) {

    const months = calendar.map(item => item.month)

   const [descriptionValue, setDescriptionValue] = useState("");
   const [monthValue, setMonthValue] = useState(calendar[props.currentMonth].month)
   const [dayValue, setDayValue] = useState(props.currentDay + 1)
   const [yearValue, setYearValue] = useState(props.currentYear)
   const [guardsValue, setGuardsValue] = useState("");
   const [notesValue, setNotesValue] = useState("");

   const [monthMenuOpen, setMonthMenuOpen] = useState(false)
   const [dayMenuOpen, setDayMenuOpen] = useState(false)
   const [yearMenuOpen, setYearMenuOpen] = useState(false)

    const [dayOptions, setDayOptions] = useState(() => createDaysArray(calendar[props.currentMonth].month))
    const [yearOptions, setYearOptions] = useState([
        props.currentYear, props.currentYear + 1, props.currentYear + 2
    ])


   const [validateDescription, setValidateDescription] = useState(false); 
   const [validateDate, setValidateDate] = useState(false); 
   const [dateLabel, setDateLabel] = useState("Event date")

    useEffect(() => {
        setDayValue(props.currentDay + 1)
        setMonthValue(calendar[props.currentMonth].month)
    }, [props.currentDay, props.currentMonth])

    //If editing an existing notice
   useEffect(() => {
    if(props.editedNotice) {
        const date = props.editedNotice.scheduledDate;
        const month = date.split(" ")[0];
        const day = date.slice((date.indexOf(" ") + 1), (date.indexOf(",")));

        console.log(date)
        console.log(day)
        createDaysArray(month);
        setMonthValue(month)
        setDayValue(day)
        setDescriptionValue(props.editedNotice.title);
        setGuardsValue(props.editedNotice.numberOfGuards);
    }
   }, [props.editedNotice])

    function handleCancel() {
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
        if(validateDate || validateDescription) return; 
        if(descriptionValue === "") {
            setValidateDescription(true);
            return;
        }
        props.setShowAlert(false);
        props.setAlertError(false);
        const dateValue = `${monthValue} ${dayValue}, ${yearValue}`
        fetch(`${props.base_url}/save-notice`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                month: calendar[props.currentMonth].month,
                day: props.currentDay + 1,
                title: descriptionValue,
                scheduledDate: dateValue,
                numberOfGuards: guardsValue,
                completed: false,
                menuIsOpen: false,
                notes: notesValue,
                showNotes: false,
                noticeId: props.editedNotice ? props.editedNotice._id : null
            })
        })
        .then(res => {
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
        handleCancel();
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
        if(field.includes("option")) {
            if(field.includes("month")) setMonthMenuOpen(false)
            if(field.includes("day")) setDayMenuOpen(false)
            if(field.includes("year")) setYearMenuOpen(false)            
        } else {
            if(field.includes("month")) setMonthMenuOpen(prev => prev ? false : true)
            if(field.includes("day")) setDayMenuOpen(prev => prev ? false : true)
            if(field.includes("year")) setYearMenuOpen(prev => prev ? false : true)
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
    }

    //validates date values
    useEffect(() => {
        setValidateDate(false)
        setDateLabel("Event date");
        const chosenDate = new Date(`${monthValue} ${dayValue}, ${yearValue}`);
        const currentDate = new Date(`${calendar[props.currentMonth].month} ${props.currentDay + 1}, ${props.currentYear}`)
        if(chosenDate < currentDate) {
            setDateLabel("Event date cannot be earlier than notice date");
            setValidateDate(true);
        }
    }, [monthValue, dayValue])

    return (
        <div className={`new-item ${props.currentScreen === "desktop" && !props.addNoticeDesktop ? "hidden" : ""}`}>
            <p className="new-item__title">{`${props.editedNotice ? "" : `${props.currentScreen === "desktop" ? `New notice to be sent on ${calendar[props.currentMonth].month} ${props.currentDay + 1}, ${props.currentYear}` : "New notice"}`}`}</p>
            <form className="new-item__form"> 
                <div className="new-item__form-group">
                    <input 
                        type="text" 
                        required
                        className={`form-input ${validateDescription ? "field-required" : ""}`} 
                        value={descriptionValue} 
                        onChange={(e) => setDescriptionValue(e.target.value)}>
                    </input>
                    <label className="form-label">Event description</label>
                </div>
                <div className="new-item__form-group date-group">
                    <div className={`month-selection date-field ${validateDate ? "field-required" : ""}`} onClick={e => toggleMenu(e)}>
                        <p className="month-value">{monthValue}</p>
                        <div className={`date-field__drop-down ${monthMenuOpen ? "" : "hidden"}`}>
                            {months.map((month, index) => (
                                <span 
                                    key={index}
                                    onClick={e => handleOptionClick(e)}
                                    className={`month-option date-field__drop-down-option ${monthValue === month ? "selected-option" : ""}`}>
                                {month}</span>
                            ))}
                        </div>
                        <img className="drop-down-icon" src="./assets/icons/arrow-icon.svg"></img>
                    </div>
                    <div className={`day-selection date-field ${validateDate ? "field-required" : ""}`} onClick={e => toggleMenu(e)}>
                        <p className="day-value">{dayValue}</p>
                        <div className={`date-field__drop-down ${dayMenuOpen ? "" : "hidden"}`}>
                            {dayOptions.map((month, index) => (
                                <span 
                                    key={index}
                                    onClick={e => handleOptionClick(e)}
                                    className="date-field__drop-down-option day-option">
                                {month}</span>
                            ))}
                        </div>
                        <img className="drop-down-icon" src="./assets/icons/arrow-icon.svg"></img>
                    </div>
                    <div className={`year-selection date-field ${validateDate ? "field-required" : ""}`} onClick={e => toggleMenu(e)}>
                        <p className="year-value">{yearValue}</p>
                        <div className={`date-field__drop-down ${yearMenuOpen ? "" : "hidden"}`}>
                            {yearOptions.map((month, index) => (
                                <span 
                                    key={index} 
                                    onClick={e => handleOptionClick(e)}
                                    className="date-field__drop-down-option year-option">
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
            <div className="new-item__buttons">
                <button type="submit" onClick={saveNotice} className="save-btn">save</button>
                <button onClick={handleCancel} className="cancel-btn">cancel</button>
            </div>
            </form>
        </div>
    )
}

export default NewItem;