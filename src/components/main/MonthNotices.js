import { calendar } from "../../Data";
import { useState, useEffect } from "react";

function MonthNotices(props) {

    const [days, setDays] = useState([]);

    useEffect(() => {
        setDays(prev => {
            const arr = [];
            for(let i = 1; i < calendar[props.currentMonth].numberOfDays; i++){
                const noticeArr = [];
                props.noticeData.map(notice => {
                    if(notice.month === calendar[props.currentMonth].month) {
                        if(notice.day === i) {
                            noticeArr.push(notice);
                        }
                    }
                })
                arr.push(noticeArr);
            }
            return arr;
        })
    }, [props.currentMonth])

    function getOrdinal(n) {
        let ord = 'th';
      
        if (n % 10 === 1 && n % 100 !== 11)
        {
          ord = 'st';
        }
        else if (n % 10 === 2 && n % 100 !== 12)
        {
          ord = 'nd';
        }
        else if (n % 10 === 3 && n % 100 !== 13)
        {
          ord = 'rd';
        }
      
        return `${n}${ord}`;
      }

    function handlePlusIconClick(index) {
        if(!props.loggedIn) props.setShowLogin(true);
        else {
            console.log(index)
            props.setCurrentDay(index)
            props.setCurrentScreen("new-item")
            props.setPrevScreen("month")
        }
    }

    function handleItemClick(index, e) {
        if(e.target.className.includes("plus-icon")) return;
        props.setCurrentDay(index);
        props.setCurrentScreen("day");
    }

    return (
        <div className="month-notices">
            {days.map((day, index) => (
                <div onClick={(e) => handleItemClick(index, e)} key={index} className="month-notices__item">
                    <div className="month-notices__item-date">{`${getOrdinal(index + 1)}`}</div>
                    <div className="month-notices__item-text">
                        <ul>
                            {day.map((notice, dayIndex) => (
                                <li key={dayIndex}>{notice.title}</li>
                            ))}
                        </ul>
                    </div>
                    <img onClick={() => handlePlusIconClick(index + 1)} className="month-notices__item-plus-icon" src="./assets/icons/plus-icon-dark.svg"></img>
                </div>
            ))}
        </div>
    )
}

export default MonthNotices;