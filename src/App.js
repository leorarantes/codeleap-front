import {useState} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Posts from "./pages/Posts";
import UserContext from "./contexts/UserContext";

function App() {
    const [user, setUser] = useState(null);
    return (
        <UserContext.Provider value={{ user, setUser }}>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/posts' element={<Posts />} />
                </Routes>
            </BrowserRouter>
        </UserContext.Provider>
    );
}

export default App;