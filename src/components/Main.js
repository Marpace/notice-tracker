import Alert from "./main/Alert";
import Calendar from "./main/Calendar";
import DayNotices from "./main/DayNotices";
import MonthNotices from "./main/MonthNotices";
import NewItem from "./main/NewItem";
import { useEffect, useState } from "react";
import { calendar } from "../Data";

import { ensurePushSubscription } from "../utils/push";
import { convertDate } from "../utils/convertDate";

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
        setReminders();
    },[noticeData])

    useEffect(() => {
        (async () => {
            try {
            const res = await fetch(`${props.base_url}/push/public-key`);
            const { publicKey } = await res.json();
            await ensurePushSubscription({ publicKey, apiBase: props.base_url });
            } catch (e) { console.log('Push subscription failed', e); }
        })();
    }, []);


    function setReminders() {
        let reminderTimeout;
        const now = new Date().getTime();
        //check if notices have been loaded
        if(noticeData.length > 0) {
            const noticesThisMonth = noticeData.filter(item => item.month === calendar[props.currentMonth].month && item.year === props.currentYear).sort((a, b) => a.day - b.day)
            const nextScheduledNotice = noticesThisMonth.find(item => {
                return item.day >= props.currentDay && new Date(convertDate(item.noticeDate)).getTime() > now
        })
        console.log(nextScheduledNotice)
            //check if there is saved reminder in the future
            if(nextScheduledNotice) {
                const timeout = (new Date(`${convertDate(nextScheduledNotice.noticeDate)}`).getTime() - new Date().getTime())
                //check if the next reminder has not been marked as completed
                if(!nextScheduledNotice.completed && timeout > 0) { 
                    reminderTimeout = setTimeout(() => {
                        Notification.requestPermission().then(perm => {
                            if(perm === "granted") { 
                                const notification = new Notification("Notice reminder!", {
                                    body: nextScheduledNotice.title, 
                                    requireInteraction: true, 
                                    icon: "./assets/icons/alert-icon.svg"
                                })
                            }
                            setReminders();
                        })
                    }, timeout);
                }
            }
        }
        return () => clearTimeout(reminderTimeout)
    }
 
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
                    loggedIn={props.loggedIn}
                    setShowLogin={props.setShowLogin}
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