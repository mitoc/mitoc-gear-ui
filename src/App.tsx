import { lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { refreshCsrfToken } from "src/apiClient/client";
import BaseLayout from "src/components/BaseLayout";
import { useLoadCurrentUser, usePermissions } from "src/redux/auth";

import LoginPage from "./pages/LogIn";
import { PeoplePage, PersonPage } from "./pages/People";

const ApprovalsPage = lazy(() => import("./pages/Approvals/ApprovalsPage"));
const AddNewApproval = lazy(() => import("./pages/Approvals/AddNewApproval"));
const GearInventoryPage = lazy(
  () => import("./pages/Inventory/GearInventoryPage"),
);
const ApproveDeskCreditPage = lazy(
  () => import("./pages/OfficeHours/ApproveDeskCreditPage"),
);
const MyOfficeHoursHistory = lazy(
  () => import("./pages/OfficeHours/MyOfficeHoursHistory"),
);
const OfficeHoursHistory = lazy(
  () => import("./pages/OfficeHours/OfficeHoursHistory"),
);
const RequestDeskCreditPage = lazy(
  () => import("./pages/OfficeHours/RequestDeskCreditPage"),
);
const ChangePassword = lazy(
  () => import("./pages/People/PersonProfile/PersonChangePassword"),
);
const AllGearPage = lazy(() => import("./pages/Gear/AllGearPage"));
const GearItemPage = lazy(() => import("./pages/Gear/GearItemPage"));
const AddNewGear = lazy(() => import("./pages/Gear/AddNewGear"));
const RequestPasswordConfirm = lazy(
  () => import("./pages/LogIn/RequestPasswordConfirm"),
);
const RequestPasswordReset = lazy(
  () => import("./pages/LogIn/RequestPasswordReset"),
);
const OfficeHoursPage = lazy(
  () => import("./pages/OfficeHours/OfficeHoursPage"),
);
const AddNewPerson = lazy(() => import("./pages/People/AddNewPerson"));

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
          <Suspense>
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
          </Suspense>
        </BaseLayout>
      </Router>
    );
  }

  return (
    <Router basename="/">
      <BaseLayout>
        <Suspense>
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
            <Route
              path="/volunteer-history"
              element={<MyOfficeHoursHistory />}
            />

            <Route path="/" element={<Navigate to="/people" replace />} />
            <Route path="*" element={<Navigate to="/people" replace />} />
          </Routes>
        </Suspense>
      </BaseLayout>
    </Router>
  );
}

export default App;
