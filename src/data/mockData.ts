export type Drive = {
  id: string;
  title: string;
  organization: string;
  location: string;
  category: string;
  raised: number;
  goal: number;
  urgent?: boolean;
  remaining: string;
};

export const driveData: Drive[] = [
  { id: "drv-001", title: "Flood Relief for 200 Families", organization: "Community Table PH", location: "Marikina City", category: "Emergency", raised: 72000, goal: 100000, urgent: true, remaining: "Rice, water, canned goods, blankets" },
  { id: "drv-002", title: "Back-to-School Kits for Public Students", organization: "Open Door Learning", location: "Davao City", category: "Education", raised: 682, goal: 900, remaining: "218 school kits" },
  { id: "drv-003", title: "Barangay First Aid Stations", organization: "Care Within Reach", location: "Cebu City", category: "Medical", raised: 318, goal: 500, remaining: "182 first-aid kits" },
  { id: "drv-004", title: "Meals for 500 Low-Income Families", organization: "Community Table", location: "Quezon City", category: "Food", raised: 184200, goal: 250000, remaining: "₱65,800" },
  { id: "drv-005", title: "Home Kits for Fire-Affected Families", organization: "Home Again Network", location: "Pasig City", category: "Household", raised: 84, goal: 140, remaining: "56 home kits" },
  { id: "drv-006", title: "Dignity Kits for Women and Girls", organization: "Her Safe Place", location: "Marikina City", category: "Hygiene", raised: 445, goal: 700, remaining: "255 hygiene kits" },
];

export const donationData = [
  { id: "DON-2026-00125", drive: "Flood Relief for 200 Families", type: "Food", method: "Pickup", status: "Approved", date: "Sep 18, 2026" },
  { id: "DON-2026-00108", drive: "Back-to-School Kits for Public Students", type: "Education", method: "Drop-off", status: "Received", date: "Sep 12, 2026" },
  { id: "DON-2026-00091", drive: "Barangay First Aid Stations", type: "Medical", method: "Collection center", status: "Pending", date: "Sep 8, 2026" },
];
