import { useEffect, useState } from "react";
import { calendar } from "../../Data";

function DayBar(props) {

    const [days, setDays] = useState([]);

    useEffect(() => {
        setDays(prev => {
            const arr = [];
            for(let i = 0; i < calendar[props.currentMonth].numberOfDays; i++){
                arr.push('');
            }
            return arr;
        })
    }, [props.currentMonth])

    
    return (
        <div className={`day-bar ${props.currentScreen === "desktop" ? "hidden" : ""}`}>
            {days.map((day, index) => (
                <span onClick={() => props.setCurrentDay(index)} className={`day-bar__day ${props.currentDay === index ? "chosen-day" : ""}`} key={index}>{index + 1}</span>
            ))}
        </div>
    )
}

export default DayBar;