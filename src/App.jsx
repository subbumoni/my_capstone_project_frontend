import { Routes, Route, Link } from "react-router-dom";
import "./App.css";

import Signup from "./Signup";
import Login from "./Login";
import Finanse from "./Finanse";

export const App = () => {
  return (
    <div>
      <div>
        <Link to={"/"} />
        <Link to={"/login"} />
        <Link to={"/finanse"} />
      </div>
      <Routes>
        <Route Component={Signup} path="/" />
        <Route Component={Login} path="/login" />
        <Route Component={Finanse} path="/finanse" />
      </Routes>
    </div>
  );
};
