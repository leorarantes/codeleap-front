import React from "react";
import styles from "./index.module.css";

function Modal(props) {
    const { width, height, padding, borderRadius, isOpen } = props;

    return (
        <div className={styles["background"]} style={isOpen ? null : {display: "none"}}>
            <div className={styles["container"]} style={{padding, borderRadius, width, height}}>
                {props.children}
            </div>
        </div>
    );
}

export default Modal;