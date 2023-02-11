import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import BaseLayout from "components/BaseLayout";

import { useLoadCurrentUser } from "./redux/auth";
import LoginPage from "./pages/LogIn";
import { PeoplePage, PersonPage } from "./pages/People";
import { AllGearPage, GearItemPage } from "./pages/Gear";
import { OfficeHoursPage } from "./pages/OfficeHours";
import { AddNewGear } from "./pages/Gear/AddNewGear";
import { AddNewPerson } from "./pages/People/AddNewPerson";
import { RequestPasswordReset } from "./pages/LogIn/RequestPasswordReset";
import { RequestPasswordConfirm } from "./pages/LogIn/RequestPasswordConfirm";
import { ChangePassword } from "pages/People/PersonProfile/PersonChangePassword";
import { RequestDeskCreditPage } from "pages/OfficeHours/RequestDeskCreditPage";
import { ApproveDeskCreditPage } from "pages/OfficeHours/ApproveDeskCreditPage";
import { OfficeHoursHistory } from "pages/OfficeHours/OfficeHoursHistory";
import { MyOfficeHoursHistory } from "pages/OfficeHours/MyOfficeHoursHistory";
import { ApprovalsPage } from "pages/Approvals";

function App() {
  const { loggedIn, isLoading } = useLoadCurrentUser();
  const { pathname, search } = window.location;
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
          <Route exact path="/change-password/">
            <ChangePassword />
          </Route>
          {!isLoading && !loggedIn && (
            <Redirect
              to={{
                pathname: "/login",
                search: `redirectTo=${encodeURIComponent(pathname + search)}`,
              }}
            />
          )}
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
          <Route exact path="/office-hours">
            <OfficeHoursPage />
          </Route>
          <Route exact path="/approvals">
            <ApprovalsPage />
          </Route>
          {loggedIn && (
            <Route exact path="/request-desk-credit">
              <RequestDeskCreditPage />
            </Route>
          )}
          {loggedIn && (
            <Route exact path="/approve-desk-credit">
              <ApproveDeskCreditPage />
            </Route>
          )}
          {loggedIn && (
            <Route exact path="/office-hours-history">
              <OfficeHoursHistory />
            </Route>
          )}
          {loggedIn && (
            <Route exact path="/volunteer-history">
              <MyOfficeHoursHistory />
            </Route>
          )}
          <Route exact path="/">
            <Redirect to="/people" />
          </Route>
          {loggedIn && (
            <Route path="*">
              <Redirect to="/people" />
            </Route>
          )}
        </Switch>
      </BaseLayout>
    </Router>
  );
}

export default App;
