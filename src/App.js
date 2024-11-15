import "./sass/main.css"
import Header from "./components/Header";
import MonthSection from "./components/MonthSection";
import { useEffect, useState } from "react";
import Main from "./components/Main";
import Login from "./components/auth/LoginModal";


function App() {

    // const base_url = "https://notice-tracker-25c8406a0d3d.herokuapp.com";
    const base_url = "http://localhost:8080";

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentDay, setCurrentDay] = useState(new Date().getDate());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [currentScreen, setCurrentScreen] = useState("month");
  const [prevScreen, setPrevScreen] = useState("");
  const [filter, setFilter] = useState("day");
  const [showLogin, setShowLogin] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loggedUserName, setLoggedUserName] = useState("");
  const [loggedUserPosition, setLoggedUserPosition] = useState("");

  useEffect(() => {
    const screenWidth = window.screen.width;
    if(screenWidth > 1279) {
      setCurrentScreen("desktop")
    }
  }, [])


  return (
    <div className="app">
      <Header 
        setFilter={setFilter}
        filter={filter}
        setShowLogin={setShowLogin}
        loggedUserName={loggedUserName}
        loggedUserPosition={loggedUserPosition}
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
        filter={filter}
        setFilter={setFilter}
        setShowLogin={setShowLogin}
        base_url={base_url}
        loggedIn={loggedIn}
      />
      <Login 
        showLogin={showLogin}
        setShowLogin={setShowLogin}
        setLoggedIn={setLoggedIn}
        setLoadingLogin={setLoadingLogin}
        base_url={base_url}
        setLoggedUserName={setLoggedUserName}
        setLoggedUserPosition={setLoggedUserPosition}
      />
    </div>
  );
}

export default App;
