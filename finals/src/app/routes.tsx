import { createBrowserRouter } from "react-router";
import AppShell from "@/components/AppShell";
import ProtectedRoute from "@/auth/ProtectedRoute";
import LandingPage from "@/pages/LandingPage";
import { BrowseDrivesPage, DriveDetailPage, MatchingPage } from "@/pages/DrivesPages";
import { DonationTrackingPage, MyDonationsPage, NewDonationPage, PickupRequestsPage } from "@/pages/DonorPages";
import { CollectionCentersPage, CollectorDashboardPage, DriveFormPage, ManageDrivesPage } from "@/pages/CollectorPages";
import { NotFoundPage, SignInPage, SignUpPage } from "@/pages/AuthPages";

export const router = createBrowserRouter([
  { path: "/", Component: LandingPage },
  { path: "/signin", Component: SignInPage },
  { path: "/signup", Component: SignUpPage },
  {
    Component: AppShell,
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
          { path: "pickups", Component: PickupRequestsPage },
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
