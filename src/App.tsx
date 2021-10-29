import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import BaseLayout from "components/BaseLayout";

import { useLoadCurrentUser } from "./features/auth";
import LoginPage from "./pages/LogIn";
import PeoplePage from "./pages/People";

import "./App.css";

function App() {
  const { loggedIn, isLoading } = useLoadCurrentUser();

  return (
    <Router>
      <BaseLayout>
        <Switch>
          <Route path="/login">
            <LoginPage />
          </Route>
          {!isLoading && !loggedIn && <Redirect to="/login" />}
          <Route path="/people">
            <PeoplePage />
          </Route>
          <Route exact path="/">
            {!isLoading && loggedIn && <Redirect to="/people" />}
          </Route>
        </Switch>
      </BaseLayout>
    </Router>
  );
}

export default App;
