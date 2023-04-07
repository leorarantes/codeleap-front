import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./index.module.css";
import Modal from "../../components/Modal";
import UserContext from "../../contexts/UserContext";

function Home() {
    const navigate = useNavigate();
    
    // contexts
    const {setUser} = useContext(UserContext);

    // states
    const [userName, setUserName] = useState("");

    // handlers
    function handleSetUser() {
        setUser(userName);
        navigate("/posts");
    }

    function handleInputChange(e) {
        setUserName(e.target.value);
    }

    // render
    return (
        <div className={styles["container"]}>
            <Modal
                isOpen={true}
                width="28vw"
                height="fit-content"
                borderRadius="0.833333vw"
                padding="15px"
            >
                <div className={styles["auth-modal"]}>
                    <h1>Welcome to CodeLeap network!</h1>
                    <label htmlFor="auth-input">Please enter your username</label>
                    <input id="auth-input" type="text" onChange={handleInputChange} value={userName} />
                    <div>
                        <button
                            onClick={handleSetUser}
                            disabled={userName.length > 0 ? false : true}
                        >
                            Enter
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default Home;