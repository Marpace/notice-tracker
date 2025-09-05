import {useEffect, useState} from "react";
import Alert from "./main/Alert";


function Header(props) {

    const [menuIsOpen, setMenuIsOpen] = useState(false)


    function handleMenuClick() {
        setMenuIsOpen(prev => prev === false ? true : false )
    }

    function handleMobileOptionClick(event) {
        const option = event.target.id;
        if(option === "pending" || option === "overdue") {
            props.setFilter(option);
        }
        if(option === "login") props.setShowLogin(true);
        if(option === "logout") props.userLogout();
        setMenuIsOpen(false);
    }
    

    return (
        <div className="header">
            <h1 className="header__heading">Discovery I&II</h1>
            <div className="desktop-username">
                <p className="desktop-username__name">{localStorage.getItem("name")}</p> 
                <p className="desktop-username__title">{localStorage.getItem("position")}</p>
            </div>
            <div className="header__menu-options">
                <p onClick={() => props.setFilter("pending")} className={`${props.filter === "pending" ? "header__menu-options--option-selected" : ""} header__menu-options--option`}>Pending Notices</p>
                <p onClick={() => props.setFilter("overdue")} className={`${props.filter === "overdue" ? "header__menu-options--option-selected" : ""} header__menu-options--option`}>Overdue Notices</p>
                <p className={`header__menu-options--option ${props.loggedIn ? "hidden" : ""}`} onClick={() => props.setShowLogin(true)}>Login</p>
                <p className={`header__menu-options--option ${props.loggedIn ? "" : "hidden"}`} onClick={() => props.userLogout()}>Logout</p>
            </div>
            <div onClick={handleMenuClick} className="header__menu-icon"> 
                <div className="menu-icon-line"></div>
                <div className="menu-icon-line"></div>
                <div className="menu-icon-line"></div>
            </div>

            {/* Only displayed on mobile */}
            <div className={`header__menu ${menuIsOpen ? "menu-open" : ""}`}>
                <div onClick={() => setMenuIsOpen(prev => prev === false ? true : false)} className="menu__close-btn">
                    <img src="./assets/icons/close-icon.svg"></img>
                </div>
                <div className="menu-options">
                    <p id="pending" onClick={(e) => handleMobileOptionClick(e)} className={`${props.filter === "pending" ? "menu-options__option-selected" : ""} menu-options__option`}>Pending Notices</p>
                    <p id="overdue" onClick={(e) => handleMobileOptionClick(e)} className={`${props.filter === "overdue" ? "menu-options__option-selected" : ""} menu-options__option`}>Overdue Notices</p>
                    <p id="login" className={`menu-options__option ${props.loggedIn ? "hidden" : ""}`} onClick={(e) => handleMobileOptionClick(e)}>Login</p>
                    <p id="logout" className={`menu-options__option ${props.loggedIn ? "" : "hidden"}`} onClick={(e) => handleMobileOptionClick(e)}>Logout</p>
                </div>
            </div>

            <Alert 
                showAlert={props.showAlert}
                setShowAlert={props.setShowAlert}
                alertText={props.alertText}
                alertError={props.alertError} 
            />
        </div>
    )
}

export default Header;