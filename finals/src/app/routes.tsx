import { createBrowserRouter, Link, useRouteError } from "react-router";
import AppShell from "@/components/AppShell";
import ProtectedRoute from "@/auth/ProtectedRoute";
import LandingPage from "@/pages/LandingPage";
import { BrowseDrivesPage, DriveDetailPage, MatchingPage } from "@/pages/DrivesPages";
import { DonationTrackingPage, MyDonationsPage, NewDonationPage } from "@/pages/DonorPages";
import { CollectionCentersPage, CollectorDashboardPage, DriveFormPage, ManageDrivesPage } from "@/pages/CollectorPages";
import { NotFoundPage, SignInPage, SignUpPage } from "@/pages/AuthPages";
import { AdminDashboardPage, AdminUsersPage, AdminDrivesPage, AdminDriveFormPage, AdminDonationsPage } from "@/pages/AdminPages";

function RouteError() {
  const error = useRouteError();
  return (
    <main className="grid min-h-screen place-items-center bg-[#F5F4EF] px-5 text-center text-[#34418E]">
      <div>
        <h1 className="text-4xl font-bold">Something went wrong</h1>
        <p className="mt-3 text-[#6B7C8F]">{error instanceof Error ? error.message : "An unexpected error occurred."}</p>
        <Link to="/" className="mt-6 inline-block rounded-full bg-[#34418E] px-5 py-3 font-bold text-white">Back to home</Link>
      </div>
    </main>
  );
}

export const router = createBrowserRouter([
  { path: "/", Component: LandingPage, ErrorBoundary: RouteError },
  { path: "/signin", Component: SignInPage },
  { path: "/signup", Component: SignUpPage },
  {
    Component: AppShell,
    ErrorBoundary: RouteError,
    children: [
      // Public
      { path: "drives", Component: BrowseDrivesPage },
      { path: "drives/:driveId", Component: DriveDetailPage },
      { path: "match", Component: MatchingPage },
      { path: "centers", Component: CollectionCentersPage },

      // Signed-in users
      {
        element: <ProtectedRoute />,
        children: [
          { path: "donations/new", Component: NewDonationPage },
          { path: "donations", Component: MyDonationsPage },
          { path: "donations/:donationId", Component: DonationTrackingPage },
        ],
      },

      // Admin only
      {
        element: <ProtectedRoute role="admin" />,
        children: [
          { path: "admin", Component: AdminDashboardPage },
          { path: "admin/users", Component: AdminUsersPage },
          { path: "admin/drives", Component: AdminDrivesPage },
          { path: "admin/drives/new", Component: AdminDriveFormPage },
          { path: "admin/drives/:driveId/edit", Component: AdminDriveFormPage },
          { path: "admin/donations", Component: AdminDonationsPage },
        ],
      },

      // Collectors only
      {
        element: <ProtectedRoute role="collector" />,
        children: [
          { path: "collector", Component: CollectorDashboardPage },
          { path: "collector/drives", Component: ManageDrivesPage },
          { path: "collector/drives/new", Component: DriveFormPage },
        ],
      },

      { path: "*", Component: NotFoundPage },
    ],
  },
]);
