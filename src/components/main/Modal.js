function Modal(props) {

    function deleteNotice() {
        props.setModalIsOpen(false);
        props.deleteItem();
        props.getNotices();
    }

    return (
        <div className={`modal ${props.modalIsOpen ? "" : "hidden"}`}>
            <div className="modal__body">
                <p className="modal__body-text">Delete Notice?</p>
                <div className="modal__body-buttons">
                    <button onClick={deleteNotice} className="modal-btn">Delete</button>
                    <button onClick={() => props.setModalIsOpen(false)} className="modal-btn">Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default Modal;   