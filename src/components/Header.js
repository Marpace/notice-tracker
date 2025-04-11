import {useEffect, useState} from "react";
import Alert from "./main/Alert";


function Header(props) {

    const [menuIsOpen, setMenuIsOpen] = useState(false)


    function handleMenuClick() {
        setMenuIsOpen(prev => prev === false ? true : false )
    }
    

    return (
        <div className="header">
            <h1 className="header__heading">Discovery I&II</h1>
            <div className="desktop-username">
                <p className="desktop-username__name">{localStorage.getItem("name")}</p> 
                <p className="desktop-username__title">{localStorage.getItem("position")}</p>
            </div>
            <div className="menu-options">
                <p onClick={() => props.setFilter("pending")} className={`${props.filter === "pending" ? "menu-options__option-selected" : ""} menu-options__option`}>Pending Notices</p>
                <p onClick={() => props.setFilter("overdue")} className={`${props.filter === "overdue" ? "menu-options__option-selected" : ""} menu-options__option`}>Overdue Notices</p>
                <p className={`menu-options__option ${props.loggedIn ? "hidden" : ""}`} onClick={() => props.setShowLogin(true)}>Login</p>
                <p className={`menu-options__option ${props.loggedIn ? "" : "hidden"}`} onClick={() => props.userLogout()}>Logout</p>
            </div>
            <div onClick={handleMenuClick} className="header__menu-icon"> 
                <div className="menu-icon-line"></div>
                <div className="menu-icon-line"></div>
                <div className="menu-icon-line"></div>
            </div>
            <div style={{right: `${menuIsOpen ? "0" : "-100%"}`}} className="menu">
                <div onClick={() => setMenuIsOpen(prev => prev === false ? true : false)} className="menu__close-btn">
                    <img src="./assets/icons/close-icon.svg"></img>
                </div>
            </div>
            <Alert 
                showAlert={props.showAlert}
                alertText={props.alertText}
                alertError={props.alertError} 
            />
        </div>
    )
}

export default Header;