import {useState} from "react";

function Header(props) {

    const [menuIsOpen, setMenuIsOpen] = useState(false)

    function handleMenuClick() {
        setMenuIsOpen(prev => prev === false ? true : false )
    }

    return (
        <div className="header">
            <h1 className="header__heading">Discovery I&II</h1>
            <div className="desktop-username">
                <p className="desktop-username__name">Pablo Almonacid</p> 
                <p className="desktop-username__title">Assistant Manager</p>
            </div>
            <div className="menu-options">
                <p onClick={() => props.setShowPending(true)} className="menu-options__option">Pending notices</p>
                <p className="menu-options__option">Login</p>
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
        </div>
    )
}

export default Header;