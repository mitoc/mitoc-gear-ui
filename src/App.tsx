import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { useLoadCurrentUser, usePermissions } from "src/redux/auth";

import { refreshCsrfToken } from "src/apiClient/client";
import BaseLayout from "src/components/BaseLayout";
import { ApprovalsPage } from "src/pages/Approvals";
import { AddNewApproval } from "src/pages/Approvals/AddNewApproval";
import { GearInventoryPage } from "src/pages/Inventory/GearInventoryPage";
import { ApproveDeskCreditPage } from "src/pages/OfficeHours/ApproveDeskCreditPage";
import { MyOfficeHoursHistory } from "src/pages/OfficeHours/MyOfficeHoursHistory";
import { OfficeHoursHistory } from "src/pages/OfficeHours/OfficeHoursHistory";
import { RequestDeskCreditPage } from "src/pages/OfficeHours/RequestDeskCreditPage";
import { ChangePassword } from "src/pages/People/PersonProfile/PersonChangePassword";

import { AllGearPage, GearItemPage } from "./pages/Gear";
import { AddNewGear } from "./pages/Gear/AddNewGear";
import LoginPage from "./pages/LogIn";
import { RequestPasswordConfirm } from "./pages/LogIn/RequestPasswordConfirm";
import { RequestPasswordReset } from "./pages/LogIn/RequestPasswordReset";
import { OfficeHoursPage } from "./pages/OfficeHours";
import { PeoplePage, PersonPage } from "./pages/People";
import { AddNewPerson } from "./pages/People/AddNewPerson";

function App() {
  const { loggedIn, isLoading } = useLoadCurrentUser();
  const { pathname, search } = window.location;
  const { isApprover } = usePermissions();
  useEffect(() => {
    if (loggedIn) {
      // Pre-load CSRF token
      refreshCsrfToken();
    }
  }, [loggedIn]);

  return (
    <Router basename={import.meta.env.BASE_URL}>
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
          <Route exact path="/gear-inventory">
            <GearInventoryPage />
          </Route>
          <Route exact path="/approvals">
            <ApprovalsPage />
          </Route>
          {isApprover && (
            <Route exact path="/add-approval">
              <AddNewApproval />
            </Route>
          )}
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
