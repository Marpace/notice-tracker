import Alert from "./main/Alert";
import Calendar from "./main/Calendar";
import DayNotices from "./main/DayNotices";
import MonthNotices from "./main/MonthNotices";
import NewItem from "./main/NewItem";
import { useEffect, useState } from "react";
import { calendar } from "../Data";

function Main(props) {

    
    // const base_url = "https://notice-tracker-25c8406a0d3d.herokuapp.com";
    const base_url = "http://localhost:8080";

    const [editedNotice, setEditedNotice] = useState(null);
    const [addNoticeDesktop, setAddNoticeDesktop] = useState(false);
    const [noticeData, setNoticeData] = useState([]);
    const [alertText, setAlertText] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [alertError, setAlertError] = useState(false);


    useEffect(() => {
        getNotices();
    },[])

    //sets reminder for next notice
    useEffect(() => {
        let reminderTimeout;
        if(noticeData.length > 0) {
            const noticesThisMonth = noticeData.filter(item => item.month === calendar[props.currentMonth].month && Number(item.year) === props.currentYear).sort((a, b) => a.day - b.day)
            const nextScheduledNotice = noticesThisMonth.find(item => item.day >= props.currentDay)
            const timeout = (new Date(`${nextScheduledNotice.noticeDate} 13:00:00`).getTime() - new Date().getTime())
    
            if(nextScheduledNotice && !nextScheduledNotice.completed && timeout > 0) { 
                reminderTimeout = setTimeout(() => {
                    Notification.requestPermission().then(perm => {
                        if(perm === "granted") { 
                            const notification = new Notification("Notice reminder!", {
                                body: nextScheduledNotice.title, 
                                requireInteraction: true, 
                                icon: "./assets/icons/alert-icon.svg"
                            })
                        }
                    })
                }, timeout);
            }
        }
        return () => clearTimeout(reminderTimeout)
    },[noticeData])
 
    function getNotices() {
        fetch(`${base_url}/get-notices`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(res => {
            setNoticeData(res.data);
         })
        .catch(err => console.log(err))
    }

    switch (props.currentScreen) {
        case "desktop":    
            return (  
                <div className="desktop-main">
                    <DayNotices 
                        currentScreen={props.currentScreen}
                        setCurrentScreen={props.setCurrentScreen} 
                        currentDay={props.currentDay}
                        currentMonth={props.currentMonth}
                        currentYear={props.currentYear}
                        setCurrentDay={props.setCurrentDay}
                        setPrevScreen={props.setPrevScreen}
                        setEditedNotice={setEditedNotice}
                        setAddNoticeDesktop={setAddNoticeDesktop}
                        addNoticeDesktop={addNoticeDesktop}
                        noticeData={noticeData}
                        base_url={base_url}
                        getNotices={getNotices}
                        filter={props.filter}
                    />
                    <NewItem 
                        prevScreen={props.prevScreen}
                        setCurrentScreen={props.setCurrentScreen}
                        editedNotice={editedNotice}
                        setEditedNotice={setEditedNotice}
                        addNoticeDesktop={addNoticeDesktop}
                        setAddNoticeDesktop={setAddNoticeDesktop}
                        currentScreen={props.currentScreen}
                        currentMonth={props.currentMonth}
                        currentDay={props.currentDay}
                        currentYear={props.currentYear}
                        base_url={base_url}
                        getNotices={getNotices}
                        setAlertText={setAlertText}
                        setShowAlert={setShowAlert}
                        setAlertError={setAlertError}
                    />
                    <Calendar 
                        currentScreen={props.currentScreen}
                        currentMonth={props.currentMonth}
                        setCurrentMonth={props.setCurrentMonth}
                        currentYear={props.currentYear}
                        setCurrentDay={props.setCurrentDay}
                        currentDay={props.currentDay}
                        setAddNoticeDesktop={setAddNoticeDesktop}
                        noticeData={noticeData}
                        setFilter={props.setFilter}
                    />
                    <Alert 
                        showAlert={showAlert}
                        alertText={alertText}
                        alertError={alertError} 
                    />
                </div>
            )
                    
        case "day" :
            return (
                <DayNotices 
                    currentScreen={props.currentScreen}
                    setCurrentScreen={props.setCurrentScreen} 
                    currentDay={props.currentDay}
                    currentMonth={props.currentMonth}
                    currentYear={props.currentYear}
                    setCurrentDay={props.setCurrentDay}
                    setPrevScreen={props.setPrevScreen}
                    setEditedNotice={setEditedNotice}
                    setAddNoticeDesktop={setAddNoticeDesktop}
                    addNoticeDesktop={addNoticeDesktop}
                    noticeData={noticeData}
                    base_url={base_url}
                    getNotices={getNotices}
                    filter={props.filter}
                />
            )    
        case "month": 
            return (
                <MonthNotices 
                    currentScreen={props.currentScreen}
                    setCurrentScreen={props.setCurrentScreen}
                    currentMonth={props.currentMonth}
                    setCurrentDay={props.setCurrentDay}
                    setPrevScreen={props.setPrevScreen}
                    noticeData={noticeData}
                />
            )
        case "new-item": 
            return (
                <NewItem 
                    prevScreen={props.prevScreen}
                    setCurrentScreen={props.setCurrentScreen}
                    editedNotice={editedNotice}
                    setEditedNotice={setEditedNotice}
                    currentScreen={props.currentScreen}
                    currentMonth={props.currentMonth}
                    currentDay={props.currentDay}
                    currentYear={props.currentYear}
                    base_url={base_url}
                    getNotices={getNotices}
                    setAlertText={setAlertText}
                    setShowAlert={setShowAlert}
                    setAlertError={setAlertError}
                />
            )
        default:
            break;
    }
    
}

export default Main;