import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import BaseLayout from "components/BaseLayout";

import { useLoadCurrentUser } from "./features/auth";
import LoginPage from "./pages/LogIn";
import { PeoplePage, PersonPage } from "./pages/People";
import { AllGearPage, GearItemPage } from "./pages/Gear";

import "./App.css";

function App() {
  const { loggedIn, isLoading } = useLoadCurrentUser();

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <BaseLayout>
        <Switch>
          <Route path="/login">
            <LoginPage />
          </Route>
          {!isLoading && !loggedIn && <Redirect to="/login" />}
          <Route exact path="/people">
            <PeoplePage />
          </Route>
          <Route path="/people/:personId">
            <PersonPage />
          </Route>
          <Route exact path="/gear">
            <AllGearPage />
          </Route>
          <Route path="/gear/:gearId">
            <GearItemPage />
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
