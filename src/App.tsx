import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

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
import { useLoadCurrentUser, usePermissions } from "src/redux/auth";

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

  if (isLoading) {
    return null;
  }

  const publicRoutes = (
    <>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/reset-password/request"
        element={<RequestPasswordReset />}
      />
      <Route
        path="/reset-password/confirm"
        element={<RequestPasswordConfirm />}
      />
    </>
  );

  // If not logged in and not loading, redirect to login
  if (!isLoading && !loggedIn) {
    return (
      <Router basename="/">
        <BaseLayout>
          <Routes>
            {publicRoutes}
            <Route
              path="*"
              element={
                <Navigate
                  to={{
                    pathname: "/login",
                    search: `redirectTo=${encodeURIComponent(
                      pathname + search,
                    )}`,
                  }}
                  replace
                />
              }
            />
          </Routes>
        </BaseLayout>
      </Router>
    );
  }

  return (
    <Router basename="/">
      <BaseLayout>
        <Routes>
          {publicRoutes}

          <Route path="/change-password" element={<ChangePassword />} />

          <Route path="/people" element={<PeoplePage />} />
          <Route path="/people/:personId" element={<PersonPage />} />
          <Route path="/add-person" element={<AddNewPerson />} />

          <Route path="/add-gear" element={<AddNewGear />} />
          <Route path="/gear" element={<AllGearPage />} />
          <Route path="/gear/:gearId" element={<GearItemPage />} />

          <Route path="/office-hours" element={<OfficeHoursPage />} />
          <Route path="/gear-inventory" element={<GearInventoryPage />} />
          <Route path="/approvals" element={<ApprovalsPage />} />

          {isApprover && (
            <Route path="/add-approval" element={<AddNewApproval />} />
          )}

          <Route
            path="/request-desk-credit"
            element={<RequestDeskCreditPage />}
          />
          <Route
            path="/approve-desk-credit"
            element={<ApproveDeskCreditPage />}
          />
          <Route
            path="/office-hours-history"
            element={<OfficeHoursHistory />}
          />
          <Route path="/volunteer-history" element={<MyOfficeHoursHistory />} />

          <Route path="/" element={<Navigate to="/people" replace />} />
          <Route path="*" element={<Navigate to="/people" replace />} />
        </Routes>
      </BaseLayout>
    </Router>
  );
}

export default App;
