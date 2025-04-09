import "./sass/main.css"
import Header from "./components/Header";
import MonthSection from "./components/MonthSection";
import { useEffect, useState } from "react";
import Main from "./components/Main";
import Login from "./components/auth/LoginModal";
import Alert from "./components/main/Alert";


function App() {

    // const base_url = "https://notice-tracker-25c8406a0d3d.herokuapp.com";
    const base_url = "http://localhost:8080";

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentDay, setCurrentDay] = useState(new Date().getDate());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear().toString())
  const [currentScreen, setCurrentScreen] = useState("month");
  const [prevScreen, setPrevScreen] = useState("");
  const [filter, setFilter] = useState("day");
  const [showLogin, setShowLogin] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loggedUserName, setLoggedUserName] = useState("");
  const [loggedUserPosition, setLoggedUserPosition] = useState("");
  const [alertText, setAlertText] = useState("Notice Saved");
  const [showAlert, setShowAlert] = useState(false);
  const [alertError, setAlertError] = useState(false);

  useEffect(() => {
    const screenWidth = window.screen.width;
    if(screenWidth > 1279) {
      setCurrentScreen("desktop")
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token');
    const expiryDate = localStorage.getItem('expiryDate');
    if (!token) {
      return;
    }
    if (new Date(expiryDate) <= new Date()) {
      userLogout();
      return;
    }
    const remainingMilliseconds = new Date(expiryDate).getTime() - new Date().getTime();
    setLoggedIn(true);
    setAutoLogout(remainingMilliseconds);
  }, []);

  function userLogout() { 
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("expiryDate");
    localStorage.removeItem("name");
    localStorage.removeItem("position");
    setLoggedUserName("");
    setLoggedUserPosition("");
    setLoggedIn(false);
    // setToken(null);
  }

  function setAutoLogout(milliseconds) {
    setTimeout(() => {
      userLogout();
    }, milliseconds);
  };


  return (
    <div className="app">
      <Header 
        setFilter={setFilter}
        filter={filter}
        setShowLogin={setShowLogin}
        loggedUserName={loggedUserName}
        loggedUserPosition={loggedUserPosition}
        loggedIn={loggedIn}
        userLogout={userLogout}
        showAlert={showAlert}
        alertText={alertText}
        alertError={alertError} 
      />
      <MonthSection 
        currentScreen={currentScreen}
        setCurrentScreen={setCurrentScreen}  
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
        currentDay={currentDay}
        setPrevScreen={setPrevScreen}
      />
      <Main 
        currentScreen={currentScreen}
        setCurrentScreen={setCurrentScreen}
        currentMonth={currentMonth}
        currentDay={currentDay}
        setCurrentDay={setCurrentDay}
        prevScreen={prevScreen}
        setPrevScreen={setPrevScreen} 
        setCurrentMonth={setCurrentMonth}
        currentYear={currentYear}
        setCurrentYear={setCurrentYear}
        filter={filter}
        setFilter={setFilter}
        setShowLogin={setShowLogin}
        base_url={base_url}
        loggedIn={loggedIn}
        setAlertText={setAlertText}
        setShowAlert={setShowAlert}
        setAlertError={setAlertError}
      />
      <Login 
        showLogin={showLogin}
        setShowLogin={setShowLogin}
        setLoggedIn={setLoggedIn}
        setLoadingLogin={setLoadingLogin}
        loadingLogin={loadingLogin}
        base_url={base_url}
        setLoggedUserName={setLoggedUserName}
        setLoggedUserPosition={setLoggedUserPosition}
        userLogout={userLogout}
        setAutoLogout={setAutoLogout}
        setAlertText={setAlertText}
        setShowAlert={setShowAlert}
        setAlertError={setAlertError}
      />
      
    </div>
  );
}

export default App;
