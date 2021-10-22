import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import { useLoadCurrentUser } from "./features/auth";
import LoginPage from "./pages/LogIn";
import PeoplePage from "./pages/People";

import "./App.css";

function App() {
  const { loggedIn, isLoading } = useLoadCurrentUser();

  return (
    <Router>
      <Switch>
        <Route path="/login">
          <LoginPage />
        </Route>
        {!isLoading && !loggedIn && <Redirect to="/login" />}
        {!isLoading && loggedIn && <Redirect to="/people" />}
        <Route path="/people">
          <PeoplePage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
