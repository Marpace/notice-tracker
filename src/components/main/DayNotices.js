import { useEffect, useState } from "react";
import { calendar } from "../../Data";
import DayBar from "./DayBar";
import Modal from "./Modal";


function DailyNotices(props) {


    const [notices, setNotices] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentNoticeId, setCurrentNoticeId] = useState(null);
    const [noticesHeader, setNoticesHeader] = useState("");
    const [allCompleted, setAllCompleted] = useState(false);


    useEffect(() => {
        setNotices(() => {
            const arr = [];
            if(props.filter === "pending") {
                props.noticeData.map( notice => {
                    const noticeDate = new Date(notice.noticeDate)
                    const today = new Date();
                    if(today < noticeDate && !notice.completed) {
                        notice.menuIsOpen = false;
                        arr.push(notice)
                    }
                })
            } else if (props.filter === "overdue") {
                props.noticeData.map( notice => {
                    const noticeDate = new Date(`${notice.noticeDate} 23:59:59`)
                    const today = new Date();
                    if(today > noticeDate && !notice.completed) {
                        notice.menuIsOpen = false;
                        arr.push(notice)
                    }
                })
            } else {
                props.noticeData.map(notice => {
                    if(notice.month === calendar[props.currentMonth].month){
                        if(notice.day === (props.currentDay)) {
                            notice.menuIsOpen = false;
                            arr.push(notice);
                        }
                    }
                })
            }
            return arr;
        })
    }, [props.noticeData, props.currentDay, props.currentMonth, props.filter]) 

    useEffect(() => {
        setNoticesHeader(() => {
            let header; 

            if(notices.length <= 0) {
                if(props.filter === "overdue") header = "Notices are up to date"
                else {
                    header = `No notices scheduled for ${props.currentMonth === new Date().getMonth() && props.currentDay === new Date().getDate() 
                    ? "today" 
                    : `${calendar[props.currentMonth].month} ${props.currentDay}, ${props.currentYear}`}`
                }
            }
            else {
                if(props.filter === "pending") {
                    header = "Pending notices";
                    return header;
                } 
                if (props.filter === "overdue") {
                    header = "Overdue notices";
                    return header;
                }
                header = `Notices to be sent ${props.currentMonth === new Date().getMonth() && props.currentDay === new Date().getDate() 
                    ? "today:" 
                    : `on ${calendar[props.currentMonth].month} ${props.currentDay}, ${props.currentYear}`}`
            }
            return header;
        })
    }, [notices, props.filter])

    function toggleMenu(index) {
        setNotices(prev => {
            const copy = [...prev];
            if(copy[index]) {
                copy[index].menuIsOpen = copy[index].menuIsOpen === false ? true : false;
            }
            return copy;
        })   
    }
 
    function openModal(e) {
        setModalIsOpen(true)
        setCurrentNoticeId(e.target.id)
    }

    function deleteItem() { 
        fetch(`${props.base_url}/delete-notice`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({noticeId: currentNoticeId})
        })
        .then((res) => {
            console.log("Item deleted")
            props.getNotices()
        })
        .catch(err => console.log(err));
    }

    function markAsCompleted(noticeId, index) {
        if(index) toggleMenu(index);
        fetch(`${props.base_url}/change-completed-status`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({noticeId: noticeId})
        })
        .then(res => {
            console.log(res.status)
            props.getNotices()
        })
        .catch(err => console.log(err));
    }
 
    function handleEditClick(e, notice) {
        if(props.currentScreen === "desktop"){
            props.setAddNoticeDesktop(true)
        } else {
            props.setPrevScreen(props.currentScreen);
            props.setCurrentScreen("new-item");
        }
        props.setEditedNotice(notice);

        const index = Number(e.target.id);
        setNotices(prev => {
            const copy = [...prev]; 
            copy[index].menuIsOpen = false; 
            return copy;
        })
    }

    function toggleNotes(index) {
        setNotices(prev => {
            const copy = [...prev];
            copy[index].showNotes = copy[index].showNotes ? false : true;
            return copy;
        })
    }

    function markAllAsCompleted() {
        notices.forEach(notice => {
            markAsCompleted(notice._id)
        })
        setAllCompleted(prev => prev === true ? false : true)
    }
    

    return (
        <div className={`day-notices ${props.currentScreen === "desktop" && props.addNoticeDesktop ? "hidden" : ""}`}>
            <div className="day-notices__header">
                <p className={`day-notices__header-title`}>{noticesHeader}</p>
                <img 
                    title="Mark all as completed"
                    onClick={markAllAsCompleted} 
                    className={`day-notices__header-icon ${props.filter === "overdue" && notices.length > 0 ? "" : "hidden"}`} 
                    src={`./assets/icons/${allCompleted ? "checkmark-icon" : "complete-all-icon"}.svg`}></img>
            </div>
            {notices.map((notice, index) => (
                <div key={index} className="day-notices__item" style={{marginRight: `${props.currentScreen === "day" ? "40px" : ""}`}}>
                    <p className="notice-title">{notice.title}</p>
                    <p className="notice-scheduled-date">{`Scheduled for ${notice.eventDate}`}</p>
                    <p className={`guards-required`}>{`${notice.numberOfGuards <= 0 ? "No escort guards required" : `${notice.numberOfGuards === 1 ? "Requires 1 escort guard" : `Requires ${notice.numberOfGuards} escort guards`}`}` }</p>
                    <img className={`completed ${notice.completed ? "" : "hidden"}`} src="./assets/icons/checkmark-icon.svg"></img>
                    <div onClick={() => toggleNotes(index)} className="show-notes">
                        <p className="show-notes__btn">{notice.notes ? "Show notes" : ""}</p>
                        <p className={`show-notes__notes ${notice.showNotes ? "" : "hidden"}`}>{notice.notes}</p>
                    </div>
                    
                    <div onClick={() => toggleMenu(index)} className={`notice-menu-btn`}>
                        <span id={index} className="dot"></span>
                        <span id={index} className="dot"></span>
                        <span id={index} className="dot"></span>
                    </div>
                    <div className={`notice-menu ${notice.menuIsOpen ? "show-flex" : ""}`}>
                        <p id={notice._id} onClick={openModal} className="notice-menu-option">Delete</p>
                        <p id={index} onClick={(e) => handleEditClick(e, notice)} className="notice-menu-option">Edit</p>
                        <p id={notice._id} onClick={(e) => markAsCompleted(e.target.id, index )} className="notice-menu-option">{notice.completed ? "Mark as pending" : "Mark as completed"}</p>
                    </div>
                </div>
            ))}
            <DayBar 
                currentMonth={props.currentMonth}
                currentScreen={props.currentScreen}     
                currentDay={props.currentDay}
                setCurrentDay={props.setCurrentDay}
            />
            <Modal 
                modalIsOpen={modalIsOpen}
                setModalIsOpen={setModalIsOpen}
                deleteItem={deleteItem}
                getNotices={props.getNotices}
            />
        </div>
    )
    
}

export default DailyNotices;