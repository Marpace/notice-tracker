import "./sass/main.css"
import Header from "./components/Header";
import MonthSection from "./components/MonthSection";
import { useEffect, useState } from "react";
import Main from "./components/Main";


function App() {


  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentDay, setCurrentDay] = useState(new Date().getDate());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [currentScreen, setCurrentScreen] = useState("month");
  const [prevScreen, setPrevScreen] = useState("");
  const [filter, setFilter] = useState("day")

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
      />
    </div>
  );
}

export default App;
