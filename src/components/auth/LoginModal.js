import { useState } from "react";

function Login(props) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showError, setShowError] = useState(false);

    function userLogin(username, password) {
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
          localStorage.setItem('username', data.username);
          const remainingMilliseconds = 28800000; //8 hours
          const expiryDate = new Date(new Date().getTime() + remainingMilliseconds);
          localStorage.setItem('expiryDate', expiryDate.toISOString());
          setAutoLogout(remainingMilliseconds);
          props.setLoggedUserName(data.name)
          props.setLoggedUserPosition(data.position)
          props.setLoadingLogin(false);
        })
        .catch(err => {
          console.log(err);
          setShowError(true);
          props.setLoadingLogin(false);
        });
      } 

      function userLogout() { 
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("expiryDate");
        localStorage.removeItem('username');
        props.setLoggedIn(false);
        // setToken(null);
      }
    
      function setAutoLogout(milliseconds) {
        setTimeout(() => {
          userLogout();
        }, milliseconds);
      };

    return (
        <div className={`login-modal ${props.showLogin ? "" : "hidden"}`}>
            <div className="login-modal__body">
                <p className="login-modal__body-title">LOGIN</p>
                <p className={`error-message ${showError ? "" : "hidden"}`}>Please check username or password</p>
                <div className="login-modal__body-inputs">
                    <div className="login-modal__body-inputs-group" onChange={(e) => setUsername(e.target.value)} value={username}>
                        <input type="text" className="login-input"></input>
                        <label className="login-input-label">Username</label>
                    </div>
                    <div className="login-modal__body-inputs-group" onChange={(e) => setPassword(e.target.value)} value={password}>
                        <input type="text" className="login-input"></input>
                        <label className="login-input-label">Password</label>
                    </div>
                </div>
                <div className="login-modal__body-buttons">
                    <button className="login-btn" onClick={() => userLogin(username, password)}>Login</button>
                    <button className="login-btn" onClick={() => props.setShowLogin(false)}>Cancel</button>
                </div>
                <p className="forgot-password">Forgot password</p>
            </div>
        </div>
    )
}


export default Login; 
