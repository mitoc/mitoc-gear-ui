import { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import { useAppDispatch } from "./app/hooks";
import { checkLoggedIn } from "./features/auth/authSlice";

import LoginPage from "./pages/LogIn";
import PeoplePage from "./pages/People";

import "./App.css";

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(checkLoggedIn());
  }, []);

  return (
    <Router>
      <Switch>
        <Route path="/login">
          <LoginPage />
        </Route>
        <Route path="/people">
          <PeoplePage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
