import { useEffect, useState } from "react";
import { calendar } from "../Data";





function MonthSection(props) {
    
    const [months, setMonths] = useState([])
    const [showMonthSelection, setShowMonthSelection] = useState(false);



    useEffect(() => {
        const arr = [];
        calendar.forEach(month => {
            arr.push(month.month);
        })
        setMonths(arr)
    }, [])

    function chooseMonth(index) {
        setShowMonthSelection(false);
        props.setCurrentMonth(index);
    }

    function getOrdinal(n) {
        let ord = 'th';
        const num = n + 1;
      
        if (num % 10 === 1 && num % 100 !== 11)
        {
          ord = 'st';
        }
        else if (num % 10 === 2 && num % 100 !== 12)
        {
          ord = 'nd';
        }
        else if (num % 10 === 3 && num % 100 !== 13)
        {
          ord = 'rd';
        }
      
        return `${num}${ord}`;
      }

      function handlePlusIconClick() {
        props.setCurrentScreen("new-item")
        props.setPrevScreen("day")
      }

    return (
        <div className={`month-section`} style={{marginRight: `${props.currentScreen === "day" ? "40px" : ""}`}}>
            <div className="month-container">
                <p className="month">{`${calendar[props.currentMonth].month} ${props.currentScreen === "new-item" ? getOrdinal(props.currentDay) : ""}`}</p>
                <img className={`${props.currentScreen === "new-item" ? "hidden" : ""}`} onClick={() => setShowMonthSelection(prev => prev === true ? false : true)} src="/assets/icons/arrow-icon.svg"></img>
                <div className={`month-selection ${showMonthSelection ? "" : "hidden"}`}>
                    {months.map((month, index) => (
                        <p onClick={() => chooseMonth(index)} key={index} className={`month-selection__item ${months[props.currentMonth] === month ? "selected-month" : ""}`}>{month}</p>
                    ))}
                </div>
            </div>
            <div className="month-section__options">
                <p 
                    className={`day-option ${props.currentScreen === "new-item" ? "hidden" : ""}`} 
                    onClick={() => props.setCurrentScreen("day")}
                    style={{fontWeight: `${props.currentScreen === "day" ? "900" : ""}`}}
                    >Day</p>
                <p 
                    className={`month-option ${props.currentScreen === "new-item" ? "hidden" : ""}`} 
                    onClick={() => props.setCurrentScreen("month")}
                    style={{fontWeight: `${props.currentScreen === "month" ? "900" : ""}`}}
                    >Month</p>
                <div onClick={handlePlusIconClick} className={`add-item-btn ${props.currentScreen === "new-item" || props.currentScreen === "month" ? "hidden" : ""}`}>
                    <div className="add-item-btn__line"></div>
                    <div className="add-item-btn__line"></div>
                </div>
            </div>
        </div>
    )
}


export default MonthSection;