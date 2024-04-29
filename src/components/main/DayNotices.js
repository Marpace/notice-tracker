import { useEffect, useState } from "react";
import { calendar } from "../../Data";
import DayBar from "./DayBar";
import Modal from "./Modal";


function DailyNotices(props) {


    const [notices, setNotices] = useState([])
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentNoticeId, setCurrentNoticeId] = useState(null);
 
    useEffect(() => {
        setNotices(() => {
            const arr = [];
            props.noticeData.map(notice => {
                if(notice.month === calendar[props.currentMonth].month){
                    if(notice.day === (props.currentDay + 1)) {
                        notice.menuIsOpen = false;
                        arr.push(notice);
                    }
                }
            })
            return arr;
        })
    }, [props.noticeData, props.currentDay, props.currentMonth]) 

    function toggleMenu(e) {
        const index = Number(e.target.id)
        console.log(e.target)
        setNotices(prev => {
            const copy = [...prev];
            copy[index].menuIsOpen = copy[index].menuIsOpen === false ? true : false;
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
        .catch(err => console.log(err));
    }

    function markAsCompleted(e) {
        toggleMenu(e) 
        const index = Number(e.target.id);
        setNotices(prev => {
            const copy = [...prev]; 
            copy[index].completed = copy[index].completed ? false : true;
            return copy;
        })
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
    

    return (
        <div className={`day-notices ${props.currentScreen === "desktop" && props.addNoticeDesktop ? "hidden" : ""}`}>
            <p className={`day-notices__desktop`}>{
                `${notices.length <= 0 
                    ? `No notices scheduled for ${props.currentMonth === new Date().getMonth() && props.currentDay + 1 === new Date().getDate() 
                        ? "today" 
                        : `${calendar[props.currentMonth].month} ${props.currentDay + 1}, ${props.currentYear}`} `
                    : `Notices to be sent ${props.currentMonth === new Date().getMonth() && props.currentDay + 1 === new Date().getDate() 
                        ? "today:" 
                        : `on ${calendar[props.currentMonth].month} ${props.currentDay + 1}, ${props.currentYear}`}`}`  
            }</p>
            {notices.map((notice, index) => (
                <div key={index} className="day-notices__item" style={{marginRight: `${props.currentScreen === "day" ? "40px" : ""}`}}>
                    <p className="notice-title">{notice.title}</p>
                    <p className="notice-scheduled-date">{`Scheduled for ${notice.scheduledDate}`}</p>
                    <p className={`guards-required`}>{`${notice.numberOfGuards <= 0 ? "No escort guards required" : `${notice.numberOfGuards === 1 ? "Requires 1 escort guard" : `Requires ${notice.numberOfGuards} escort guards`}`}` }</p>
                    <img className={`completed ${notice.completed ? "" : "hidden"}`} src="./assets/icons/checkmark-icon.svg"></img>
                    <div onClick={() => toggleNotes(index)} className="show-notes">
                        <p className="show-notes__btn">{notice.notes ? "Show notes" : ""}</p>
                        <p className={`show-notes__notes ${notice.showNotes ? "" : "hidden"}`}>{notice.notes}</p>
                    </div>
                    
                    <div id={index} onClick={toggleMenu} className={`notice-menu-btn`}>
                        <span id={index} className="dot"></span>
                        <span id={index} className="dot"></span>
                        <span id={index} className="dot"></span>
                    </div>
                    <div className={`notice-menu ${notice.menuIsOpen ? "show-flex" : ""}`}>
                        <p id={notice._id} onClick={openModal} className="notice-menu-option">Delete</p>
                        <p id={index} onClick={(e) => handleEditClick(e, notice)} className="notice-menu-option">Edit</p>
                        <p id={index} onClick={markAsCompleted} className="notice-menu-option">{notice.completed ? "Mark as pending" : "Mark as completed"}</p>
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