
function Alert(props) {
    return (
        <div className={`alert ${props.showAlert ? "" : "hidden"}`}>
            <p className={`alert__text ${props.alertError ? "error-alert" : ""}`}>{props.alertText}</p>
        </div>
    )
}


export default Alert;