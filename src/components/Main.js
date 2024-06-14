import Alert from "./main/Alert";
import Calendar from "./main/Calendar";
import DayNotices from "./main/DayNotices";
import MonthNotices from "./main/MonthNotices";
import NewItem from "./main/NewItem";
import { useEffect, useState } from "react";
import { calendar } from "../Data";

function Main(props) {

    
    const base_url = "https://notice-tracker-25c8406a0d3d.herokuapp.com";
    // const base_url = "http://localhost:8080";

    const [editedNotice, setEditedNotice] = useState(null);
    const [addNoticeDesktop, setAddNoticeDesktop] = useState(false);
    const [noticeData, setNoticeData] = useState([]);
    const [alertText, setAlertText] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [alertError, setAlertError] = useState(false);


    useEffect(() => {
        getNotices();
        
    },[])

    useEffect(() => {
        if(noticeData.length > 0) {
            setReminder(noticeData);
        }
    })

    function setReminder(notices) {
        const todayDate = new Date().getDate()
        const noticesThisMonth = notices.filter(item => item.month === calendar[props.currentMonth].month).sort((a, b) => a.day - b.day)
        const nextScheduledNotice = noticesThisMonth.find(item => item.day >= todayDate)

        const reminderDate = new Date()

        // Notification.requestPermission().then(prem => {
        //     if(prem === "granted") {
        //         const notification = new Notification("reminder", {
        //             body: "this is a test"
        //         })
        //     }
        // })

    }
 
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
                        showPending={props.showPending}
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
                        setShowPending={props.setShowPending}
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
                    showPending={props.showPending}
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