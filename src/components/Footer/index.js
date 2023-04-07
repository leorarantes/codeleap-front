import React from "react";
import styles from "./index.module.css";

function Footer({mainRef, pageNumber, setPageNumber}) {
    function handleChangePageNumber(e) {
        let elementName = "";
        if(e.target.tagName !== "DIV") elementName = e.target.parentNode.getAttribute("name");
        else elementName = e.target.getAttribute("name");

        if(elementName === "next-page") setPageNumber(pageNumber+1);
        else setPageNumber(pageNumber-1);

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        });
    }

    return (
        <footer className={styles["container"]}>
            <div name="previous-page" className={styles[pageNumber === 1 ? "hidden" : null]} onClick={handleChangePageNumber}>
                <ion-icon name="arrow-back-outline"></ion-icon>
                <h1>Previous</h1>
            </div>
            <div name="next-page" onClick={handleChangePageNumber}>
                <h1>Next</h1>
                <ion-icon name="arrow-forward-outline"></ion-icon>
            </div>
        </footer>
    );
}

export default Footer;