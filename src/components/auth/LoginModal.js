import { useState } from "react";

function Login(props) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const [showError, setShowError] = useState(false);
    const [showPasswordReset, setShowPasswordReset] = useState(false);

    function userLogin(event) {
        if(props.loadingLogin) return;
        if(event && event.key !== "Enter" && event.type !== "click") return;
        props.setLoadingLogin(true);
        fetch(`${props.base_url}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }, 
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(res => {
          return res.json()
        })
        .then(data => {
          props.setLoggedIn(true);
        //   setToken(data.token);
          setShowError(false)
          localStorage.setItem('token', data.token);
          localStorage.setItem('userId', data.userId); 
          localStorage.setItem('name', data.name);
          localStorage.setItem('position', data.position);
          const remainingMilliseconds = 28800000; //8 hours
          const expiryDate = new Date(new Date().getTime() + remainingMilliseconds);
          localStorage.setItem('expiryDate', expiryDate.toISOString());
          props.setAutoLogout(remainingMilliseconds);
          props.setLoggedUserName(data.name)
          props.setLoggedUserPosition(data.position)
          props.setLoadingLogin(false);
            setShowPasswordReset(false);
            setUsername("");
            setPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
            setShowError(false);
          if(data.firstLogin) setShowPasswordReset(true);
          else props.setShowLogin(false);

        })
        .catch(err => {
          console.log(err);
          setShowError(true);
          props.setLoadingLogin(false);
        });
      } 
     
      function resetPassword() {
        if(props.loadingLogin) return;
        if(newPassword !== confirmNewPassword) {
            setShowError(true);
            return;
        }
        props.setLoadingLogin(true);
        fetch(`${props.base_url}/reset-password`, {
            method: "POST",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json"
            }, 
            body: JSON.stringify({
                userId: localStorage.getItem("userId"),
                newPassword: newPassword
            })
        })
        .then(res => {
            return res.json();
        })
        .then(res => {
            props.setShowLogin(false);
            props.setAlertText(res.message)
            if(res.status === 500) props.setAlertError(true);
        })
        .then(() => {
            props.setShowAlert(true);
        })
        .catch(err => {
            console.log(err)
        });
      }

      function handleCancel() {
        props.setShowLogin(false);
        setShowPasswordReset(false);
        setUsername("");
        setPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setShowError(false);
      }


    return (
        <div className={`login-modal ${props.showLogin ? "" : "hidden"}`}>
            <div className="login-modal__body">
                <div>
                    <p className="login-modal__body-title">NOTICE TRACKER</p>
                    <p className="login-modal__body-title">{showPasswordReset ? "PASSWORD RESET REQUIRED" : "LOGIN"}</p>
                </div>
                <p className={`error-message ${showError ? "" : "hidden"}`}>{showPasswordReset ? "Passwords do not match!" : "Please check username or password"}</p>
                <div className="login-modal__body-inputs">
                    {/* This shows when resetting password  */}
                    <div className={showPasswordReset ? "" : "hidden"}>
                        <div className="login-modal__body-inputs-group" >
                            <input type="password" className="login-input" onKeyDown={(e) => userLogin(e)} onChange={(e) => setNewPassword(e.target.value)} value={newPassword}></input>
                            <label className="login-input-label">New password</label>
                        </div>
                        <div className="login-modal__body-inputs-group" >
                            <input type="password" className="login-input" onKeyDown={(e) => userLogin(e)} onChange={(e) => setConfirmNewPassword(e.target.value)} value={confirmNewPassword}></input>
                            <label className="login-input-label">Confirm new password</label>
                        </div>
                    </div>
                    <div className={showPasswordReset ? "hidden" : ""}>
                        <div className="login-modal__body-inputs-group" >
                            <input type="text" className="login-input" onKeyDown={(e) => userLogin(e)} onChange={(e) => setUsername(e.target.value)} value={username}></input>
                            <label className="login-input-label">Username</label>
                        </div>
                        <div className="login-modal__body-inputs-group" >
                            <input type="password" className="login-input" onKeyDown={(e) => userLogin(e)} onChange={(e) => setPassword(e.target.value)} value={password}></input>
                            <label className="login-input-label">Password</label>
                        </div>
                    </div>
                </div>
                <div className={`login-modal__body-buttons ${showPasswordReset ? "" : "hidden"}`}>
                    <button className={`login-btn`} onClick={() => resetPassword()}>
                        {props.loadingLogin ? "" : "Submit"}
                        <span className={`loading-login ${props.loadingLogin ? "" : "hidden"}`}></span>
                    </button>
                    <button className="login-btn" onClick={() => handleCancel()}>Cancel</button>
                </div>
                <div className={`login-modal__body-buttons ${showPasswordReset ? "hidden" : ""}`}>
                    <button className={`login-btn`} onClick={(e) => userLogin(e)}>
                        {props.loadingLogin ? "" : "Login"}
                        <span className={`loading-login ${props.loadingLogin ? "" : "hidden"}`}></span>
                    </button>
                    <button className="login-btn" onClick={() => handleCancel()}>Cancel</button>
                </div>
                <p className="forgot-password">Forgot password</p>
            </div>
        </div>
    )
}


export default Login; 
