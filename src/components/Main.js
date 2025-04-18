import Alert from "./main/Alert";
import Calendar from "./main/Calendar";
import DayNotices from "./main/DayNotices";
import MonthNotices from "./main/MonthNotices";
import NewItem from "./main/NewItem";
import { useEffect, useState } from "react";
import { calendar } from "../Data";

function Main(props) {

    
  

    const [editedNotice, setEditedNotice] = useState(null);
    const [addNoticeDesktop, setAddNoticeDesktop] = useState(false);
    const [noticeData, setNoticeData] = useState([]);
    const [loadingNotices, setLoadingNotices] = useState(true);


    useEffect(() => {
        getNotices();
    },[])

    //sets reminder for next notice
    useEffect(() => {
        let reminderTimeout;
        if(noticeData.length > 0) {
            const noticesThisMonth = noticeData.filter(item => item.month === calendar[props.currentMonth].month && item.year === props.currentYear).sort((a, b) => a.day - b.day)
            const nextScheduledNotice = noticesThisMonth.find(item => item.day >= props.currentDay)
            if(nextScheduledNotice) {
                const timeout = (new Date(`${nextScheduledNotice.noticeDate}`).getTime() - new Date().getTime())
                if(!nextScheduledNotice.completed && timeout > 0) { 
                    console.log(timeout)
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
            console.log("test")
        }
        return () => clearTimeout(reminderTimeout)
    },[noticeData])
 
    function getNotices() {
        fetch(`${props.base_url}/get-notices`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(res => {
            setNoticeData(res.data);
            setLoadingNotices(false);
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
                        base_url={props.base_url}
                        getNotices={getNotices}
                        filter={props.filter}
                        setShowLogin={props.setShowLogin}
                        loggedIn={props.loggedIn}
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
                        base_url={props.base_url}
                        getNotices={getNotices}
                        setAlertText={props.setAlertText}
                        setShowAlert={props.setShowAlert}
                        setAlertError={props.setAlertError}
                    />
                    <Calendar 
                        currentScreen={props.currentScreen}
                        currentMonth={props.currentMonth}
                        setCurrentMonth={props.setCurrentMonth}
                        currentYear={props.currentYear}
                        setCurrentYear={props.setCurrentYear}
                        setCurrentDay={props.setCurrentDay}
                        currentDay={props.currentDay}
                        setAddNoticeDesktop={setAddNoticeDesktop}
                        noticeData={noticeData}
                        setFilter={props.setFilter}
                        loadingNotices={loadingNotices}
                        setShowLogin={props.setShowLogin}
                        loggedIn={props.loggedIn}
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
                    base_url={props.base_url}
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
                    base_url={props.base_url}
                    getNotices={getNotices}
                    setAlertText={props.setAlertText}
                    setShowAlert={props.setShowAlert}
                    setAlertError={props.setAlertError}
                />
            )
        default:
            break;
    }
    
}

export default Main;