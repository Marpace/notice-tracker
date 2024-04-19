import Alert from "./main/Alert";
import Calendar from "./main/Calendar";
import DayNotices from "./main/DayNotices";
import MonthNotices from "./main/MonthNotices";
import NewItem from "./main/NewItem";
import { useEffect, useState } from "react";

function Main(props) {

    
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
                        setAddNoticeDesktop={setAddNoticeDesktop}
                        noticeData={noticeData}
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
                />
            )
        default:
            break;
    }
    
}

export default Main;