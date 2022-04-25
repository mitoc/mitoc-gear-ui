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
import { AddNewGear } from "./pages/Gear/AddNewGear";
import { AddNewPerson } from "./pages/People/AddNewPerson";
import { RequestPasswordReset } from "./pages/LogIn/RequestPasswordReset";
import { RequestPasswordConfirm } from "./pages/LogIn/RequestPasswordConfirm";

function App() {
  const { loggedIn, isLoading } = useLoadCurrentUser();

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <BaseLayout>
        <Switch>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route exact path="/reset-password/request/">
            <RequestPasswordReset />
          </Route>
          <Route exact path="/reset-password/confirm/">
            <RequestPasswordConfirm />
          </Route>
          {!isLoading && !loggedIn && <Redirect to="/login" />}
          <Route exact path="/people">
            <PeoplePage />
          </Route>
          <Route path="/people/:personId">
            <PersonPage />
          </Route>
          <Route exact path="/add-person">
            <AddNewPerson />
          </Route>
          <Route exact path="/add-gear">
            <AddNewGear />
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
          <Route path="*">
            <Redirect to="/people" />
          </Route>
        </Switch>
      </BaseLayout>
    </Router>
  );
}

export default App;
