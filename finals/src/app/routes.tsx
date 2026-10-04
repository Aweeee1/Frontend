import { createBrowserRouter } from "react-router";
import AppShell from "@/components/AppShell";
import LandingPage from "@/pages/LandingPage";
import { BrowseDrivesPage, DriveDetailPage, MatchingPage } from "@/pages/DrivesPages";
import { DonationTrackingPage, MyDonationsPage, NewDonationPage, PickupRequestsPage } from "@/pages/DonorPages";
import { CollectionCentersPage, CollectorDashboardPage, DriveFormPage, ManageDrivesPage } from "@/pages/CollectorPages";
import { NotFoundPage, SignInPage } from "@/pages/AuthPages";

export const router = createBrowserRouter([
  { path: "/", Component: LandingPage },
  {
    Component: AppShell,
    children: [
      { path: "drives", Component: BrowseDrivesPage },
      { path: "drives/:driveId", Component: DriveDetailPage },
      { path: "match", Component: MatchingPage },
      { path: "donations/new", Component: NewDonationPage },
      { path: "donations", Component: MyDonationsPage },
      { path: "donations/:donationId", Component: DonationTrackingPage },
      { path: "pickups", Component: PickupRequestsPage },
      { path: "centers", Component: CollectionCentersPage },
      { path: "collector", Component: CollectorDashboardPage },
      { path: "collector/drives", Component: ManageDrivesPage },
      { path: "collector/drives/new", Component: DriveFormPage },
      { path: "signin", Component: SignInPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);
