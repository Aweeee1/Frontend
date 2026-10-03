import { useEffect, useMemo, useState } from "react";

const photo =
  "https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=85&w=1400";

type IconName =
  | "heart"
  | "arrow"
  | "money"
  | "shirt"
  | "food"
  | "box"
  | "shield"
  | "check"
  | "users"
  | "map"
  | "upload"
  | "close"
  | "menu"
  | "medical"
  | "book"
  | "home"
  | "hygiene"
  | "alert"
  | "clock"
  | "phone"
  | "qr"
  | "truck";

type PsgcLocation = {
  code: string;
  name: string;
};

function Icon({ name, className = "size-5" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, React.ReactNode> = {
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    money: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7 9h.01M17 15h.01" /><circle cx="12" cy="12" r="2.5" /></>,
    shirt: <path d="M8.5 4 5 5.5 2.5 9 6 11v9h12v-9l3.5-2L19 5.5 15.5 4A4 4 0 0 1 12 6a4 4 0 0 1-3.5-2Z" />,
    food: <><path d="M6 2v8M3 2v5a3 3 0 0 0 6 0V2M6 10v12M17 2v20M17 2c3 2 4 7 0 10" /></>,
    box: <><path d="m21 8-9-5-9 5 9 5 9-5Z" /><path d="m3 8 9 5 9-5v9l-9 5-9-5Z" /><path d="M12 13v9" /></>,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />,
    check: <path d="m5 12 4 4L19 6" />,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z" /><path d="M9 3v15M15 6v15" /></>,
    upload: <><path d="M12 16V4M7 9l5-5 5 5" /><path d="M20 15v5H4v-5" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    medical: <><path d="M9 3h6v5h5v6h-5v5H9v-5H4V8h5Z" /><path d="M10 3V1h4v2" /></>,
    book: <><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H11v17H6.5A2.5 2.5 0 0 0 4 21.5Z" /><path d="M20 4.5A2.5 2.5 0 0 0 17.5 2H13v17h4.5a2.5 2.5 0 0 1 2.5 2.5Z" /></>,
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v11h14V10M9 21v-7h6v7" /></>,
    hygiene: <><path d="M8 3h8M10 3v4h4V3M9 7h6l2 3v11H7V10Z" /><path d="M10 13h4M12 11v4" /></>,
    alert: <><path d="M10.3 3.7 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.4 1.8.6 2.8.7a2 2 0 0 1 1.8 2.1Z" />,
    qr: <><rect x="3" y="3" width="6" height="6" /><rect x="15" y="3" width="6" height="6" /><rect x="3" y="15" width="6" height="6" /><path d="M15 15h2v2h-2zM19 15h2v6h-2M15 19h2v2h-2" /></>,
    truck: <><path d="M3 6h11v11H3Z" /><path d="M14 10h4l3 3v4h-7Z" /><circle cx="7" cy="19" r="2" /><circle cx="18" cy="19" r="2" /></>,
  };
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

const categories = [
  { name: "Money", icon: "money" as IconName, note: "Secure financial gifts", color: "bg-[#ECEEF7] text-[#34418E]" },
  { name: "Clothing", icon: "shirt" as IconName, note: "New or gently used", color: "bg-[#FFF3C4] text-[#765A0A]" },
  { name: "Food", icon: "food" as IconName, note: "Meals and pantry goods", color: "bg-[#FFF3C4] text-[#765A0A]" },
  { name: "Essentials", icon: "box" as IconName, note: "Supplies that matter", color: "bg-[#ECEEF7] text-[#34418E]" },
  { name: "Medical", icon: "medical" as IconName, note: "Care and health supplies", color: "bg-[#E9ECF6] text-[#34418E]" },
  { name: "Education", icon: "book" as IconName, note: "Tools for learning", color: "bg-[#ECEEF7] text-[#34418E]" },
  { name: "Hygiene", icon: "hygiene" as IconName, note: "Personal care kits", color: "bg-[#FFF3C4] text-[#765A0A]" },
  { name: "Household", icon: "home" as IconName, note: "Furniture and home goods", color: "bg-[#FCE9A6] text-[#765A0A]" },
];

const drives = [
  {
    id: 1,
    category: "Food",
    title: "Meals for 500 Low-Income Families",
    org: "Community Table",
    location: "Quezon City, Metro Manila",
    raised: 184200,
    goal: 250000,
    supporters: 218,
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=900&h=620",
    tag: "Food",
    unit: undefined,
  },
  {
    id: 2,
    category: "Clothing",
    title: "Monsoon-Ready Kits for Mountain Families",
    org: "Shelter Collective",
    location: "Baguio City, Benguet",
    raised: 740,
    goal: 1000,
    supporters: 96,
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=900&h=620",
    tag: "Clothing",
    unit: "rain kits",
  },
  {
    id: 3,
    category: "Money",
    title: "Rebuild Homes After Typhoons",
    org: "Hands Together",
    location: "Tacloban City, Leyte",
    raised: 426800,
    goal: 600000,
    supporters: 381,
    image: "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=900&h=620",
    tag: "Emergency",
    unit: undefined,
  },
  {
    id: 4,
    category: "Medical",
    title: "Barangay First Aid Stations",
    org: "Care Within Reach",
    location: "Cebu City, Cebu",
    raised: 318,
    goal: 500,
    supporters: 74,
    image: "https://images.unsplash.com/photo-1644726270363-e746b37b482b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=900&h=620",
    tag: "Medical",
    unit: "kits",
  },
  {
    id: 5,
    category: "Education",
    title: "Back-to-School Kits for Public Students",
    org: "Open Door Learning",
    location: "Davao City, Davao del Sur",
    raised: 682,
    goal: 900,
    supporters: 143,
    image: "https://images.unsplash.com/photo-1710093072215-65070f9cf93e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=900&h=620",
    tag: "Education",
    unit: "backpacks",
  },
  {
    id: 6,
    category: "Hygiene",
    title: "Dignity Kits for Women and Girls",
    org: "Her Safe Place",
    location: "Marikina City, Metro Manila",
    raised: 445,
    goal: 700,
    supporters: 109,
    image: "https://images.unsplash.com/photo-1707504212217-f2ede27da954?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=900&h=620",
    tag: "Hygiene",
    unit: "kits",
  },
  {
    id: 7,
    category: "Household",
    title: "Home Kits for Fire-Affected Families",
    org: "Home Again Network",
    location: "Pasig City, Metro Manila",
    raised: 84,
    goal: 140,
    supporters: 52,
    image: "https://images.unsplash.com/photo-1643321610692-719deb378a33?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=900&h=620",
    tag: "Household",
    unit: "items",
  },
  {
    id: 8,
    category: "Essentials",
    title: "Evacuation Kits for Displaced Families",
    org: "New Neighbors Alliance",
    location: "Cagayan de Oro, Misamis Oriental",
    raised: 226,
    goal: 350,
    supporters: 88,
    image: "https://images.unsplash.com/photo-1652148439208-3e73641d0725?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=900&h=620",
    tag: "Essentials",
    unit: "kits",
  },
];

const matchRecommendations: Record<string, string[]> = {
  "School supplies": ["Back-to-School Kits for Public Students", "Evacuation Kits for Displaced Families"],
  Food: ["Meals for 500 Low-Income Families", "Rebuild Homes After Typhoons"],
  Clothing: ["Monsoon-Ready Kits for Mountain Families", "Evacuation Kits for Displaced Families"],
  "Medical supplies": ["Barangay First Aid Stations", "Dignity Kits for Women and Girls"],
  "Household goods": ["Home Kits for Fire-Affected Families", "Rebuild Homes After Typhoons"],
};

const collectionCenters = [
  {
    name: "DAMAYAN Hub — Marikina City",
    address: "42 Bayanihan Street, Marikina City",
    hours: "8:00 AM–5:00 PM, Monday–Saturday",
    phone: "+63 917 555 0142",
    accepts: "Clothes, food, hygiene kits, and school supplies",
  },
  {
    name: "Bayanihan Center — Pasig City",
    address: "18 Kapitbahay Road, Pasig City",
    hours: "9:00 AM–6:00 PM, Monday–Friday",
    phone: "+63 918 555 0188",
    accepts: "Food, blankets, household goods, and medical supplies",
  },
  {
    name: "DAMAYAN Relief Point — Quezon City",
    address: "75 Malasakit Avenue, Quezon City",
    hours: "8:00 AM–4:00 PM, Daily",
    phone: "+63 919 555 0126",
    accepts: "Food, water, clothing, and emergency supplies",
  },
];

const fallbackNcrCities: PsgcLocation[] = [
  { code: "137404000", name: "City of Makati" },
  { code: "137402000", name: "City of Manila" },
  { code: "137401000", name: "City of Mandaluyong" },
  { code: "137403000", name: "City of Marikina" },
  { code: "137405000", name: "City of Muntinlupa" },
  { code: "137406000", name: "City of Navotas" },
  { code: "137407000", name: "City of Parañaque" },
  { code: "137408000", name: "Pasay City" },
  { code: "137409000", name: "City of Pasig" },
  { code: "137410000", name: "Quezon City" },
  { code: "137411000", name: "City of San Juan" },
  { code: "137412000", name: "City of Taguig" },
];

const fallbackProvinces: PsgcLocation[] = [
  { code: "130000000", name: "National Capital Region (NCR)" },
  { code: "041000000", name: "Batangas" },
  { code: "012800000", name: "Ilocos Norte" },
  { code: "043400000", name: "Laguna" },
  { code: "045600000", name: "Quezon" },
  { code: "072200000", name: "Cebu" },
  { code: "112400000", name: "Davao del Sur" },
];

function App() {
  const [filter, setFilter] = useState("All drives");
  const [donationOpen, setDonationOpen] = useState(false);
  const [selectedDrive, setSelectedDrive] = useState("Philippines Priority Needs Fund");
  const [submitted, setSubmitted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup" | null>(null);
  const [signedIn, setSignedIn] = useState(false);
  const [signupRole, setSignupRole] = useState<"donor" | "collector">("donor");
  const [collectorApplicationSent, setCollectorApplicationSent] = useState(false);
  const [matchType, setMatchType] = useState("School supplies");
  const [donationMethod, setDonationMethod] = useState<"pickup" | "dropoff" | "center">("pickup");
  const [selectedCenter, setSelectedCenter] = useState(collectionCenters[0].name);
  const [provinces, setProvinces] = useState<PsgcLocation[]>([]);
  const [cities, setCities] = useState<PsgcLocation[]>([]);
  const [barangays, setBarangays] = useState<PsgcLocation[]>([]);
  const [selectedProvinceCode, setSelectedProvinceCode] = useState("");
  const [selectedCityCode, setSelectedCityCode] = useState("");
  const [selectedBarangayCode, setSelectedBarangayCode] = useState("");
  const [provincesLoading, setProvincesLoading] = useState(true);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [barangaysLoading, setBarangaysLoading] = useState(false);

  const visibleDrives = useMemo(
    () => filter === "All drives" ? drives : drives.filter((drive) => drive.category === filter),
    [filter],
  );
  const activeCenter = collectionCenters.find((center) => center.name === selectedCenter) ?? collectionCenters[0];

  useEffect(() => {
    let active = true;
    fetch("https://psgc.gitlab.io/api/provinces/")
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load locations");
        return response.json() as Promise<PsgcLocation[]>;
      })
      .then((data) => {
        if (active) {
          setProvinces([
            { code: "130000000", name: "National Capital Region (NCR)" },
            ...data,
          ].sort((a, b) => a.name.localeCompare(b.name)));
        }
      })
      .catch(() => {
        if (active) setProvinces(fallbackProvinces);
      })
      .finally(() => {
        if (active) setProvincesLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedProvinceCode) {
      setCities([]);
      setSelectedCityCode("");
      setBarangays([]);
      setSelectedBarangayCode("");
      return;
    }
    let active = true;
    setCitiesLoading(true);
    setSelectedCityCode("");
    setCities([]);
    setBarangays([]);
    setSelectedBarangayCode("");
    const endpoint = selectedProvinceCode === "130000000"
      ? "https://psgc.gitlab.io/api/regions/130000000/cities-municipalities/"
      : `https://psgc.gitlab.io/api/provinces/${selectedProvinceCode}/cities-municipalities/`;
    fetch(endpoint)
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load cities");
        return response.json() as Promise<PsgcLocation[]>;
      })
      .then((data) => {
        if (active) setCities(data.sort((a, b) => a.name.localeCompare(b.name)));
      })
      .catch(() => {
        if (active) setCities(selectedProvinceCode === "130000000" ? fallbackNcrCities : []);
      })
      .finally(() => {
        if (active) setCitiesLoading(false);
      });
    return () => {
      active = false;
    };
  }, [selectedProvinceCode]);

  useEffect(() => {
    if (!selectedCityCode) {
      setBarangays([]);
      setSelectedBarangayCode("");
      return;
    }
    let active = true;
    setBarangaysLoading(true);
    setSelectedBarangayCode("");
    fetch(`https://psgc.gitlab.io/api/cities-municipalities/${selectedCityCode}/barangays/`)
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load barangays");
        return response.json() as Promise<PsgcLocation[]>;
      })
      .then((data) => {
        if (active) setBarangays(data.sort((a, b) => a.name.localeCompare(b.name)));
      })
      .catch(() => {
        if (active) setBarangays([]);
      })
      .finally(() => {
        if (active) setBarangaysLoading(false);
      });
    return () => {
      active = false;
    };
  }, [selectedCityCode]);

  function startDonation(drive?: string) {
    setSelectedDrive(drive ?? "Philippines Priority Needs Fund");
    setSubmitted(false);
    setDonationOpen(true);
  }

  function openAuth(mode: "signin" | "signup") {
    setAuthMode(mode);
    if (mode === "signup") {
      setCollectorApplicationSent(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F4EF] text-[#34418E]">
      <header className="sticky top-0 z-40 border-b border-[#34418E]/20 bg-[#F2C94C]/95 text-[#34418E] backdrop-blur-xl">
        <div className="mx-auto grid h-20 max-w-7xl grid-cols-[1fr_auto] items-center px-5 md:grid-cols-[1fr_1.5fr_1fr] lg:px-8">
          <button className="justify-self-start" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="DAMAYAN home">
            <span className="text-xl font-bold tracking-[0.2em] text-[#26336F]">DAMAYAN</span>
          </button>
          <nav className="hidden items-center justify-center gap-7 text-xs font-semibold uppercase tracking-[0.12em] md:flex">
            <a href="#drives" className="group flex items-center gap-2 text-[#26336F] transition hover:text-[#34418E]"><span className="text-[#34418E]/60">01</span> Explore drives</a>
            <a href="#how" className="group flex items-center gap-2 text-[#26336F] transition hover:text-[#34418E]"><span className="text-[#34418E]/60">02</span> How it works</a>
            <a href="#organizations" className="group flex items-center gap-2 text-[#26336F] transition hover:text-[#34418E]"><span className="text-[#34418E]/60">03</span> For organizations</a>
          </nav>
          <div className="hidden items-center justify-end gap-2 md:flex">
            <button onClick={() => signedIn ? setSignedIn(false) : openAuth("signin")} className="px-3 py-3 text-sm font-semibold text-[#26336F] transition hover:text-[#34418E]">{signedIn ? "Sign out" : "Sign in"}</button>
            <button onClick={() => startDonation()} className="rounded-full bg-[#34418E] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#293675]">Make a donation</button>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="grid size-11 place-items-center rounded-full border border-[#34418E]/25 md:hidden" aria-label="Toggle menu">
            <Icon name={mobileOpen ? "close" : "menu"} />
          </button>
        </div>
        {mobileOpen && (
          <nav className="border-t border-[#34418E]/15 bg-[#F2C94C] px-5 py-5 md:hidden">
            <a href="#drives" className="flex items-center gap-3 border-b border-[#34418E]/15 py-4 font-medium"><span className="text-[#34418E]/60">01</span> Explore drives</a>
            <a href="#how" className="flex items-center gap-3 border-b border-[#34418E]/15 py-4 font-medium"><span className="text-[#34418E]/60">02</span> How it works</a>
            <a href="#organizations" className="flex items-center gap-3 py-4 font-medium"><span className="text-[#34418E]/60">03</span> For collectors</a>
            <button onClick={() => { signedIn ? setSignedIn(false) : openAuth("signin"); setMobileOpen(false); }} className="mt-4 w-full rounded-full border border-[#34418E]/25 px-5 py-3.5 font-semibold">{signedIn ? "Sign out" : "Sign in"}</button>
            <button onClick={() => startDonation()} className="mt-3 w-full rounded-full bg-[#34418E] px-5 py-3.5 font-bold text-white">Make a donation</button>
          </nav>
        )}
      </header>

      <section className="relative overflow-hidden bg-[#34418E] text-white">
        <div className="pointer-events-none absolute -right-8 top-10 hidden font-serif text-[13rem] italic leading-none text-white/[.035] lg:block">D</div>
        <div className="mx-auto grid max-w-7xl gap-14 px-5 pb-0 pt-14 lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:px-8 lg:pt-20">
          <div className="relative z-10 pb-14 lg:pb-24">
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.18em] text-[#F2C94C]">
              <span className="h-px w-12 bg-[#F2C94C]" />
              Every gift, clearly accounted for
            </div>
            <h1 className="mt-8 max-w-3xl text-5xl font-bold leading-[.92] tracking-[-0.055em] sm:text-7xl lg:text-[5.6rem]">
              Give what you can.
              <span className="mt-2 block font-serif font-normal italic text-[#F2C94C]">Change what you see.</span>
            </h1>
            <p className="mt-8 max-w-lg text-lg leading-8 text-white/65">
              A trusted place for people and organizations to give money, food, clothing, and essentials to verified community drives.
            </p>
            <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <button onClick={() => startDonation()} className="group inline-flex items-center gap-4 rounded-full bg-[#F2C94C] py-2 pl-7 pr-2 font-bold text-[#34418E] transition hover:bg-[#F8DC7A]">
                Start giving
                <span className="grid size-11 place-items-center rounded-full bg-[#34418E] text-white"><Icon name="arrow" className="size-5 transition group-hover:translate-x-1" /></span>
              </button>
              <a href="#drives" className="border-b border-white/35 pb-1 text-sm font-semibold text-white/80 transition hover:border-[#F2C94C] hover:text-[#F2C94C]">Explore active drives</a>
            </div>
          </div>

          <div className="relative self-end lg:pl-8">
            <div className="absolute -left-2 top-24 z-20 hidden w-40 border border-[#34418E] bg-[#F2C94C] p-5 text-[#34418E] shadow-xl sm:block">
              <p className="text-4xl font-bold tracking-tight">98%</p>
              <p className="mt-1 text-xs font-bold uppercase leading-5 tracking-wider">reaches the cause</p>
            </div>
            <div className="relative ml-auto aspect-[4/5] max-w-lg overflow-hidden rounded-t-[14rem] border-x-[10px] border-t-[10px] border-[#F2C94C] bg-[#26336F]">
              <img src={photo} alt="Volunteers sorting food donations for their community" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#26336F]/75 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-9">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#F2C94C]">Community pulse · this month</p>
                <div className="mt-3 flex items-end justify-between gap-4">
                  <p className="text-3xl font-bold tracking-tight">8,420 lives reached</p>
                  <span className="grid size-11 shrink-0 place-items-center rounded-full border border-white/30"><Icon name="heart" className="size-5 fill-current" /></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/15 bg-[#293675]">
          <div className="mx-auto flex max-w-7xl overflow-x-auto px-5 lg:px-8">
            {categories.slice(0, 5).map((category, index) => (
              <button key={category.name} onClick={() => { setFilter(category.name); document.querySelector("#drives")?.scrollIntoView({ behavior: "smooth" }); }} className="group flex min-w-fit items-center gap-3 border-r border-white/10 px-5 py-5 text-sm font-semibold text-white/70 first:border-l transition hover:bg-white/5 hover:text-white">
                <span className="font-serif text-lg italic text-[#F2C94C]">{String(index + 1).padStart(2, "0")}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#34418E]/15 bg-[#F2C94C] text-[#34418E]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-[#34418E]/15 px-5 md:grid-cols-4 md:divide-y-0 lg:px-8">
          {[
            ["₱2.4M", "given with care"],
            ["184", "verified drives"],
            ["62", "partner organizations"],
            ["98%", "reaches the cause"],
          ].map(([value, label]) => (
            <div key={label} className="py-7 text-center">
              <p className="text-2xl font-bold tracking-tight sm:text-3xl">{value}</p>
              <p className="mt-1 text-sm text-[#34418E]/65">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <div className="grid overflow-hidden border border-[#34418E] lg:grid-cols-[.9fr_1.1fr]">
          <div className="relative flex flex-col justify-between bg-[#34418E] p-7 text-white sm:p-10 lg:p-12">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#F2C94C] px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#34418E]">
                <Icon name="alert" className="size-4" /> Urgent: Relief donations needed
              </div>
              <h2 className="mt-7 max-w-lg text-3xl font-bold tracking-[-0.04em] sm:text-4xl">200 families affected by flooding</h2>
              <p className="mt-4 max-w-md leading-7 text-white/65">Continuous rain has displaced families in low-lying communities. Immediate support is needed while evacuation and recovery efforts continue.</p>
              <div className="mt-6">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#F2C94C]">Needed immediately</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["Rice", "Drinking water", "Canned goods", "Blankets"].map((item) => (
                    <span key={item} className="border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold">{item}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-10">
              <div className="flex items-end justify-between text-sm">
                <span><strong className="text-lg text-[#F2C94C]">72%</strong> collected</span>
                <span className="text-white/55">3 days remaining</span>
              </div>
              <div className="mt-3 h-2 bg-white/15"><div className="h-full w-[72%] bg-[#F2C94C]" /></div>
              <button onClick={() => startDonation("Urgent Flood Relief for 200 Families")} className="mt-7 inline-flex items-center gap-3 border-b border-[#F2C94C] pb-2 font-bold text-[#F2C94C]">Support this drive <Icon name="arrow" className="size-4" /></button>
            </div>
          </div>
          <div className="bg-white p-7 sm:p-10 lg:p-12">
            <div className="flex items-end justify-between border-b border-[#34418E]/15 pb-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#B88910]">Live wishlist</p>
                <h3 className="mt-2 text-2xl font-bold">Still needed today</h3>
              </div>
              <span className="text-xs text-[#6B7C8F]">Updated 12 min ago</span>
            </div>
            <div className="mt-2">
              <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 py-3 text-xs font-bold uppercase tracking-wider text-[#6B7C8F]">
                <span>Item</span><span>Needed</span><span>Received</span><span>Remaining</span>
              </div>
              {[
                ["Rice", "500 kg", "320 kg", "180 kg"],
                ["Drinking water", "300 cases", "185", "115"],
                ["Blankets", "100", "70", "30"],
                ["Hygiene kits", "200", "92", "108"],
              ].map(([item, needed, received, remaining]) => (
                <div key={item} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 border-t border-[#34418E]/10 py-4 text-sm">
                  <span className="font-bold">{item}</span>
                  <span className="text-[#6B7C8F]">{needed}</span>
                  <span className="text-[#4A5BB0]">{received}</span>
                  <span className="min-w-16 text-right font-bold text-[#B88910]">{remaining}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-3 bg-[#FFF8E6] p-4 text-sm text-[#765A0A]">
              <Icon name="check" className="size-5 shrink-0" />
              <span><strong>Milestone:</strong> 100 donors have supported this campaign.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#34418E]/10 bg-[#ECEEF7]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 lg:grid-cols-[.65fr_1.35fr] lg:items-center lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#B88910]">Donation matching</p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em]">What would you like to give?</h2>
            <p className="mt-3 text-sm leading-6 text-[#6B7C8F]">Choose an item and DAMAYAN will find active drives requesting it.</p>
          </div>
          <div>
            <div className="flex flex-wrap gap-2">
              {Object.keys(matchRecommendations).map((item) => (
                <button key={item} onClick={() => setMatchType(item)} className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${matchType === item ? "bg-[#34418E] text-white" : "border border-[#34418E]/15 bg-white text-[#34418E] hover:border-[#34418E]/40"}`}>{item}</button>
              ))}
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {matchRecommendations[matchType].map((drive) => (
                <button key={drive} onClick={() => startDonation(drive)} className="group flex items-center justify-between bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <span><span className="block text-xs font-bold uppercase tracking-wider text-[#B88910]">Recommended match</span><span className="mt-1 block font-bold">{drive}</span></span>
                  <Icon name="arrow" className="size-5 shrink-0 transition group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#B88910]">Ways to give</p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">Your generosity, your way.</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#6B7C8F]">Choose what you can share. Every donation is documented, reviewed, and connected to a real need.</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => (
            <button
              key={category.name}
              onClick={() => { setFilter(category.name); document.querySelector("#drives")?.scrollIntoView({ behavior: "smooth" }); }}
              className={`group rounded-3xl border p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
                index === 0
                  ? "border-[#34418E] bg-[#34418E] text-white lg:col-span-2"
                  : index === categories.length - 1
                    ? "border-[#F2C94C] bg-[#F2C94C] text-[#34418E] lg:col-span-2"
                    : "border-[#B88910]/20 bg-white hover:border-[#B88910]/60"
              }`}
            >
              <span className={`grid size-12 place-items-center rounded-2xl ${category.color}`}><Icon name={category.icon} /></span>
              <h3 className="mt-8 text-xl font-bold">{category.name}</h3>
              <div className={`mt-2 flex items-center justify-between text-sm ${index === 0 ? "text-white/60" : index === categories.length - 1 ? "text-[#34418E]/65" : "text-[#6B7C8F]"}`}>
                <span>{category.note}</span>
                <Icon name="arrow" className="size-4 transition group-hover:translate-x-1" />
              </div>
            </button>
          ))}
        </div>
      </section>

      <section id="drives" className="border-y border-[#4A5BB0]/10 bg-[#E9ECF6] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#4A5BB0]">Verified opportunities</p>
              <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">Drives making a difference</h2>
            </div>
            <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
              {["All drives", ...categories.map((category) => category.name)].map((item) => (
                <button key={item} onClick={() => setFilter(item)} className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition ${filter === item ? "bg-[#34418E] text-white" : "bg-white text-[#52677A] hover:text-[#34418E]"}`}>{item}</button>
              ))}
            </div>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleDrives.map((drive, index) => {
              const progress = Math.round((drive.raised / drive.goal) * 100);
              const featured = index === 0 && filter === "All drives";
              return (
                <article key={drive.id} className={`overflow-hidden rounded-[2rem] border border-[#4A5BB0]/10 bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#B88910]/50 hover:shadow-xl ${featured ? "lg:col-span-2 lg:grid lg:grid-cols-[1.15fr_.85fr]" : ""}`}>
                  <div className={`relative overflow-hidden ${featured ? "min-h-72 lg:min-h-full" : "aspect-[16/10]"}`}>
                    <img src={drive.image} alt="" className="h-full w-full object-cover transition duration-500 hover:scale-105" />
                    <span className="absolute left-4 top-4 rounded-full bg-[#F2C94C] px-3 py-1.5 text-xs font-bold text-[#34418E] shadow-sm">{drive.tag}</span>
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.11em] text-[#4A5BB0]">{drive.org}</p>
                    <h3 className="mt-2 text-xl font-bold tracking-tight">{drive.title}</h3>
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-[#6B7C8F]"><Icon name="map" className="size-4" />{drive.location}</p>
                    <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#EEF0F5]">
                      <div className="h-full rounded-full bg-[#B88910]" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="mt-3 flex items-end justify-between">
                      <p>
                        <span className="font-bold">{drive.unit ? `${drive.raised.toLocaleString("en-PH")} ${drive.unit}` : `₱${drive.raised.toLocaleString("en-PH")}`}</span>
                        <span className="text-sm text-[#6B7C8F]"> of {drive.unit ? `${drive.goal.toLocaleString("en-PH")} ${drive.unit}` : `₱${drive.goal.toLocaleString("en-PH")}`}</span>
                      </p>
                      <p className="text-sm font-bold">{progress}%</p>
                    </div>
                    <div className="mt-6 flex items-center justify-between border-t border-[#34418E]/8 pt-5">
                      <span className="text-sm text-[#6B7C8F]">{drive.supporters} supporters</span>
                      <button onClick={() => startDonation(drive.title)} className="flex items-center gap-2 text-sm font-bold text-[#B88910]">Donate <Icon name="arrow" className="size-4" /></button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          {visibleDrives.length === 0 && <div className="mt-10 rounded-3xl bg-white p-10 text-center text-[#6B7C8F]">More verified {filter.toLowerCase()} drives are coming soon.</div>}
        </div>
      </section>

      <section id="how" className="relative overflow-hidden border-y border-[#B88910]/20 bg-[#FFF8E6]">
        <div className="absolute -left-12 top-0 hidden h-full items-center font-serif text-8xl italic text-[#F2C94C]/30 xl:flex [writing-mode:vertical-rl]">DAMAYAN</div>
        <div className="mx-auto grid max-w-7xl gap-16 px-5 py-24 lg:grid-cols-[.8fr_1.2fr] lg:px-8 lg:py-32">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#B88910]">Trust built in</p>
            <h2 className="mt-3 max-w-md text-4xl font-bold tracking-[-0.045em] sm:text-5xl">See exactly where your kindness goes.</h2>
            <p className="mt-6 max-w-lg leading-7 text-[#6B7C8F]">DAMAYAN keeps giving human and transparent. Collectors are verified, donations are reviewed, and proof is shared after delivery.</p>
          </div>
          <div className="border-t border-[#34418E]/20">
          {[
            ["01", "Choose a need", "Explore vetted drives or select a category that matters to you."],
            ["02", "Share the details", "Tell us what you’re giving and arrange payment, drop-off, or pickup."],
            ["03", "We verify it", "Receipts, photos, and collector details are reviewed by our team."],
            ["04", "Follow the impact", "Receive updates and documentation when your gift is delivered."],
          ].map(([number, title, description], index) => (
            <div key={number} className={`group grid grid-cols-[4.5rem_1fr] gap-5 border-b border-[#34418E]/20 py-8 transition hover:border-[#B88910] sm:grid-cols-[6rem_1fr] ${index % 2 ? "lg:ml-14" : ""}`}>
              <span className="font-serif text-4xl italic text-[#B88910] transition group-hover:text-[#34418E]">{number}</span>
              <div>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-[#6B7C8F]">{description}</p>
              </div>
            </div>
          ))}
          </div>
        </div>
      </section>

      <section id="organizations" className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <div className="grid overflow-hidden border border-[#34418E] bg-[#34418E] lg:grid-cols-[1.25fr_.75fr]">
          <div className="relative px-6 py-14 text-white sm:px-12 lg:px-16 lg:py-20">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#F2C94C]">For collectors</span>
            <h2 className="mt-8 max-w-2xl text-4xl font-bold leading-tight tracking-[-0.04em] sm:text-5xl">Turn your organization’s mission into a movement.</h2>
            <p className="mt-6 max-w-xl leading-7 text-white/60">Create donation drives, review incoming pledges, coordinate collection, and publish proof of impact—all through one accountable website.</p>
            <div className="absolute bottom-0 right-8 hidden font-serif text-[10rem] italic leading-none text-white/[.04] lg:block">D</div>
          </div>
          <div className="flex flex-col justify-between bg-[#F2C94C] p-8 text-[#34418E] sm:p-12">
            <span className="self-end font-serif text-7xl italic text-[#34418E]/20">03</span>
            <div className="mt-10">
              <p className="text-xs font-bold uppercase tracking-[0.15em]">Pickup request workflow</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                {["Accept", "Assign collector", "Picked up", "Received"].map((step, index) => (
                  <span key={step} className="flex items-center gap-2"><span className="grid size-6 place-items-center rounded-full border border-[#34418E]/30">{index + 1}</span>{step}{index < 3 && <Icon name="arrow" className="size-3 opacity-40" />}</span>
                ))}
              </div>
            </div>
            <button onClick={() => { setSignupRole("collector"); openAuth("signup"); }} className="group mt-16 flex w-full items-center justify-between border-b-2 border-[#34418E] pb-4 text-left text-xl font-bold transition hover:pb-6">
              Create an organization <Icon name="arrow" className="size-6 transition group-hover:translate-x-2" />
            </button>
          </div>
        </div>
      </section>

      <footer className="overflow-hidden bg-[#26336F] text-white">
        <div className="border-b border-white/10 px-5 py-8 lg:px-8">
          <p className="mx-auto max-w-7xl text-center text-[clamp(2.5rem,8vw,6.5rem)] font-bold leading-none tracking-[0.12em] text-[#F2C94C]">DAMAYAN</p>
        </div>
        <div className="mx-auto max-w-7xl px-5 pb-8 pt-12 lg:px-8">
          <div className="grid gap-12 border-b border-white/10 pb-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
            <div>
              <p className="max-w-xs text-sm leading-6 text-white/60">A trusted home for generous people and verified organizations to turn everyday giving into visible impact.</p>
              <button onClick={() => startDonation()} className="group mt-7 inline-flex items-center gap-2 border-b border-[#F2C94C] pb-2 text-sm font-bold text-[#F2C94C] transition hover:gap-4">
                Make a donation <Icon name="arrow" className="size-4" />
              </button>
            </div>

            <div>
              <h3 className="text-sm font-bold">Explore</h3>
              <nav className="mt-5 flex flex-col items-start gap-3.5 text-sm text-white/60">
                <a href="#drives" className="transition hover:text-white">Active drives</a>
                <a href="#how" className="transition hover:text-white">How it works</a>
                <a href="#" className="transition hover:text-white">Impact stories</a>
                <a href="#" className="transition hover:text-white">Donation guide</a>
              </nav>
            </div>

            <div>
              <h3 className="text-sm font-bold">Organizations</h3>
              <nav className="mt-5 flex flex-col items-start gap-3.5 text-sm text-white/60">
                <a href="#organizations" className="transition hover:text-white">Start a drive</a>
                <a href="#" className="transition hover:text-white">Collector portal</a>
                <a href="#" className="transition hover:text-white">Verification</a>
                <a href="#" className="transition hover:text-white">Partner with us</a>
              </nav>
            </div>

            <div>
              <h3 className="text-sm font-bold">Support</h3>
              <nav className="mt-5 flex flex-col items-start gap-3.5 text-sm text-white/60">
                <a href="#" className="transition hover:text-white">Help center</a>
                <a href="#" className="transition hover:text-white">Trust & safety</a>
                <a href="mailto:hello@damayan.ph" className="transition hover:text-white">Contact us</a>
                <a href="#" className="transition hover:text-white">Report a concern</a>
              </nav>
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-7 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2025 DAMAYAN. Giving made visible.</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <a href="#" className="transition hover:text-white">Privacy policy</a>
              <a href="#" className="transition hover:text-white">Terms of use</a>
              <a href="#" className="transition hover:text-white">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>

      {donationOpen && (
        <div className="fixed inset-0 z-50 grid place-items-end bg-[#1D2758]/55 p-0 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && setDonationOpen(false)}>
          <div className="max-h-[94vh] w-full overflow-y-auto rounded-t-[2rem] bg-[#F5F4EF] p-6 shadow-2xl sm:h-full sm:max-h-none sm:max-w-xl sm:rounded-none sm:border-l-[10px] sm:border-[#F2C94C] sm:p-10">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#B88910]">Secure donation</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight">{submitted ? "Thank you for showing up." : "Tell us what you’re giving"}</h2>
              </div>
              <button onClick={() => setDonationOpen(false)} className="grid size-10 place-items-center rounded-full bg-[#34418E]/5" aria-label="Close"><Icon name="close" /></button>
            </div>
            {submitted ? (
              <div className="py-12 text-center">
                <span className="mx-auto grid size-20 place-items-center rounded-full bg-[#E7EAF5] text-[#3C4C9D]"><Icon name="check" className="size-9" /></span>
                <p className="mx-auto mt-6 max-w-sm leading-7 text-[#6B7C8F]">Your donation details were submitted for review. You’ll receive a confirmation after our team verifies the documentation.</p>
                <div className="mx-auto mt-7 flex max-w-sm items-center gap-5 border border-[#34418E]/15 bg-white p-5 text-left">
                  <div className="grid size-20 shrink-0 grid-cols-9 gap-0.5 bg-white p-1">
                    {"111011001110101101001111000101011011101001011110101001011101110101010011101110101".slice(0, 81).split("").map((cell, index) => (
                      <span key={index} className={cell === "1" ? "bg-[#34418E]" : "bg-white"} />
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#B88910]">Donation record</p>
                    <p className="mt-1 font-mono text-lg font-bold">DON-2026-00125</p>
                    <p className="mt-1 text-xs leading-5 text-[#6B7C8F]">The receiving QR code activates after approval.</p>
                  </div>
                </div>
                <button onClick={() => setDonationOpen(false)} className="mt-8 rounded-full bg-[#34418E] px-7 py-3.5 font-bold text-white">Done</button>
              </div>
            ) : (
              <form className="mt-7 space-y-5" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold">Donation drive</span>
                  <select value={selectedDrive} onChange={(event) => setSelectedDrive(event.target.value)} className="w-full rounded-2xl border border-[#34418E]/12 bg-white px-4 py-3.5 outline-none focus:border-[#4A5BB0]">
                    <option>Philippines Priority Needs Fund</option>
                    {drives.map((drive) => <option key={drive.id}>{drive.title}</option>)}
                  </select>
                </label>
                <fieldset>
                  <legend className="mb-2 text-sm font-semibold">Donation type</legend>
                  <div className="grid grid-cols-4 gap-2">
                    {categories.map((category) => (
                      <label key={category.name} className="cursor-pointer">
                        <input type="radio" name="type" value={category.name} className="peer sr-only" defaultChecked={category.name === "Money"} />
                        <span className="flex flex-col items-center gap-2 rounded-2xl border border-[#34418E]/10 bg-white px-2 py-3 text-xs font-semibold peer-checked:border-[#B88910] peer-checked:bg-[#FFF4D6] peer-checked:text-[#7A5A12]">
                          <Icon name={category.icon} className="size-5" />{category.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="mb-2 text-sm font-semibold">Donation method</legend>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      ["pickup", "truck", "Request pickup"],
                      ["dropoff", "map", "Drop-off"],
                      ["center", "home", "Collection center"],
                    ].map(([value, icon, label]) => (
                      <button key={value} type="button" onClick={() => setDonationMethod(value as "pickup" | "dropoff" | "center")} className={`flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border px-2 text-center text-xs font-semibold transition ${donationMethod === value ? "border-[#34418E] bg-[#ECEEF7] text-[#34418E]" : "border-[#34418E]/10 bg-white text-[#6B7C8F]"}`}>
                        <Icon name={icon as IconName} className="size-5" />{label}
                      </button>
                    ))}
                  </div>
                </fieldset>
                {donationMethod === "pickup" ? (
                  <div className="space-y-4 border-l-4 border-[#F2C94C] pl-4">
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold">Province or region</span>
                      <select required value={selectedProvinceCode} onChange={(event) => setSelectedProvinceCode(event.target.value)} disabled={provincesLoading} className="w-full rounded-2xl border border-[#34418E]/12 bg-white px-4 py-3.5 outline-none disabled:cursor-wait disabled:opacity-60 focus:border-[#4A5BB0]">
                        <option value="" disabled>{provincesLoading ? "Loading Philippine provinces…" : "Select province or region"}</option>
                        {provinces.map((province) => <option key={province.code} value={province.code}>{province.name}</option>)}
                      </select>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold">City or municipality</span>
                        <select required value={selectedCityCode} onChange={(event) => setSelectedCityCode(event.target.value)} disabled={!selectedProvinceCode || citiesLoading} className="w-full rounded-2xl border border-[#34418E]/12 bg-white px-4 py-3.5 outline-none disabled:cursor-wait disabled:opacity-60 focus:border-[#4A5BB0]">
                          <option value="" disabled>{!selectedProvinceCode ? "Select a province first" : citiesLoading ? "Loading cities…" : cities.length ? "Select city or municipality" : "No cities available"}</option>
                          {cities.map((city) => <option key={city.code} value={city.code}>{city.name}</option>)}
                        </select>
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold">Barangay</span>
                        <select required value={selectedBarangayCode} onChange={(event) => setSelectedBarangayCode(event.target.value)} disabled={!selectedCityCode || barangaysLoading} className="w-full rounded-2xl border border-[#34418E]/12 bg-white px-4 py-3.5 outline-none disabled:cursor-not-allowed disabled:opacity-60 focus:border-[#4A5BB0]">
                          <option value="" disabled>
                            {!selectedCityCode ? "Select a city first" : barangaysLoading ? "Loading barangays…" : barangays.length ? "Select barangay" : "No barangays available"}
                          </option>
                          {barangays.map((barangay) => <option key={barangay.code} value={barangay.code}>{barangay.name}</option>)}
                        </select>
                      </label>
                    </div>
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold">House number and street</span>
                      <input required type="text" autoComplete="street-address" placeholder="House number, building, or street" className="w-full rounded-2xl border border-[#34418E]/12 bg-white px-4 py-3.5 outline-none placeholder:text-[#6B7C8F]/65 focus:border-[#4A5BB0]" />
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold">Preferred date</span>
                        <input required type="date" className="w-full rounded-2xl border border-[#34418E]/12 bg-white px-4 py-3.5 outline-none focus:border-[#4A5BB0]" />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold">Preferred time</span>
                        <input required type="time" className="w-full rounded-2xl border border-[#34418E]/12 bg-white px-4 py-3.5 outline-none focus:border-[#4A5BB0]" />
                      </label>
                    </div>
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold">Contact number</span>
                      <input required type="tel" autoComplete="tel" placeholder="+63 9XX XXX XXXX" className="w-full rounded-2xl border border-[#34418E]/12 bg-white px-4 py-3.5 outline-none placeholder:text-[#6B7C8F]/65 focus:border-[#4A5BB0]" />
                    </label>
                  </div>
                ) : (
                  <div className="space-y-4 border-l-4 border-[#F2C94C] pl-4">
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold">{donationMethod === "dropoff" ? "Drop-off location" : "Collection center"}</span>
                      <select required value={selectedCenter} onChange={(event) => setSelectedCenter(event.target.value)} className="w-full rounded-2xl border border-[#34418E]/12 bg-white px-4 py-3.5 outline-none focus:border-[#4A5BB0]">
                        {collectionCenters.map((center) => <option key={center.name}>{center.name}</option>)}
                      </select>
                    </label>
                    <div className="bg-white p-4 text-sm">
                      <p className="font-bold">{activeCenter.name}</p>
                      <p className="mt-2 flex gap-2 text-[#6B7C8F]"><Icon name="map" className="size-4 shrink-0" /> {activeCenter.address}</p>
                      <p className="mt-2 flex gap-2 text-[#6B7C8F]"><Icon name="clock" className="size-4 shrink-0" /> {activeCenter.hours}</p>
                      <p className="mt-2 flex gap-2 text-[#6B7C8F]"><Icon name="phone" className="size-4 shrink-0" /> {activeCenter.phone}</p>
                      <p className="mt-3 text-xs font-semibold text-[#34418E]">Accepts {activeCenter.accepts.toLowerCase()}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold">Date</span>
                        <input required type="date" className="w-full rounded-2xl border border-[#34418E]/12 bg-white px-4 py-3.5 outline-none focus:border-[#4A5BB0]" />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold">Time</span>
                        <input required type="time" className="w-full rounded-2xl border border-[#34418E]/12 bg-white px-4 py-3.5 outline-none focus:border-[#4A5BB0]" />
                      </label>
                    </div>
                  </div>
                )}
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold">Donation details</span>
                  <textarea required rows={3} placeholder="Amount, quantity, sizes, condition, or other helpful details" className="w-full resize-none rounded-2xl border border-[#34418E]/12 bg-white px-4 py-3.5 outline-none placeholder:text-[#6B7C8F]/70 focus:border-[#4A5BB0]" />
                </label>
                <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-[#34418E]/20 bg-white p-4 transition hover:border-[#4A5BB0]">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#EEF0F5] text-[#4A5BB0]"><Icon name="upload" /></span>
                  <span><span className="block text-sm font-semibold">Add photos or receipts</span><span className="mt-1 block text-xs text-[#6B7C8F]">JPG, PNG or PDF, up to 10 MB</span></span>
                  <input type="file" multiple accept="image/*,.pdf" className="sr-only" />
                </label>
                <label className="flex gap-3 text-sm leading-5 text-[#52677A]">
                  <input required type="checkbox" className="mt-0.5 size-4 accent-[#4A5BB0]" />
                  I confirm these details are accurate and agree to the verification process.
                </label>
                <button type="submit" className="w-full rounded-full bg-[#F2C94C] px-6 py-4 font-bold text-[#34418E] shadow-lg shadow-[#B88910]/20 transition hover:bg-[#F8DC7A]">Submit donation for review</button>
              </form>
            )}
          </div>
        </div>
      )}

      {authMode && (
        <div className="fixed inset-0 z-50 grid place-items-end bg-[#1D2758]/55 p-0 backdrop-blur-sm sm:place-items-center sm:p-5" onMouseDown={(event) => event.target === event.currentTarget && setAuthMode(null)}>
          <div className="max-h-[94vh] w-full overflow-y-auto rounded-t-[2rem] bg-[#F5F4EF] p-6 shadow-2xl sm:max-w-lg sm:rounded-[2rem] sm:p-8">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-sm font-bold tracking-[0.16em] text-[#34418E]">DAMAYAN</span>
                <h2 className="mt-5 text-3xl font-bold tracking-[-0.04em]">
                  {collectorApplicationSent ? "Application received" : authMode === "signin" ? "Welcome back" : "Join the giving community"}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#6B7C8F]">
                  {collectorApplicationSent
                    ? "Our verification team will review your organization before collector access is granted."
                    : authMode === "signin"
                      ? "Sign in to follow your donations and impact."
                      : "Create an account as a donor or apply to become a verified collector."}
                </p>
              </div>
              <button onClick={() => setAuthMode(null)} className="grid size-10 shrink-0 place-items-center rounded-full bg-[#34418E]/5" aria-label="Close"><Icon name="close" /></button>
            </div>

            {collectorApplicationSent ? (
              <div className="py-10 text-center">
                <span className="mx-auto grid size-20 place-items-center rounded-full bg-[#E7EAF5] text-[#3C4C9D]"><Icon name="shield" className="size-9" /></span>
                <h3 className="mt-6 text-xl font-bold">Verification is now pending</h3>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#6B7C8F]">We’ll check the organization registration, representative identity, and supporting documents. You’ll receive an email when a decision is ready.</p>
                <div className="mx-auto mt-6 max-w-sm rounded-2xl bg-white p-4 text-left text-sm">
                  <div className="flex items-center gap-3"><Icon name="check" className="size-4 text-[#4A5BB0]" /><span>Application securely submitted</span></div>
                  <div className="mt-3 flex items-center gap-3"><span className="size-4 rounded-full border-2 border-[#F2C94C]" /><span>Identity and organization review</span></div>
                  <div className="mt-3 flex items-center gap-3 text-[#6B7C8F]"><span className="size-4 rounded-full border-2 border-[#34418E]/15" /><span>Collector account activation</span></div>
                </div>
                <button onClick={() => setAuthMode(null)} className="mt-8 rounded-full bg-[#34418E] px-7 py-3.5 font-bold text-white">Done</button>
              </div>
            ) : (
            <>
            <form className="mt-7 space-y-4" onSubmit={(event) => {
              event.preventDefault();
              if (authMode === "signup" && signupRole === "collector") {
                setCollectorApplicationSent(true);
              } else {
                setSignedIn(true);
                setAuthMode(null);
              }
            }}>
              {authMode === "signup" && (
                <>
                  <fieldset>
                    <legend className="mb-2 text-sm font-semibold">I’m joining as</legend>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="cursor-pointer">
                        <input type="radio" name="role" value="donor" className="peer sr-only" checked={signupRole === "donor"} onChange={() => setSignupRole("donor")} />
                        <span className="flex items-center gap-3 rounded-2xl border border-[#34418E]/10 bg-white p-4 text-sm font-semibold transition peer-checked:border-[#B88910] peer-checked:bg-[#FFF4D6] peer-checked:text-[#7A5A12]">
                          <Icon name="heart" className="size-5" /> Donor
                        </span>
                      </label>
                      <label className="cursor-pointer">
                        <input type="radio" name="role" value="collector" className="peer sr-only" checked={signupRole === "collector"} onChange={() => setSignupRole("collector")} />
                        <span className="flex items-center gap-3 rounded-2xl border border-[#34418E]/10 bg-white p-4 text-sm font-semibold transition peer-checked:border-[#B88910] peer-checked:bg-[#FFF4D6] peer-checked:text-[#7A5A12]">
                          <Icon name="users" className="size-5" /> Collector
                        </span>
                      </label>
                    </div>
                  </fieldset>
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold">{signupRole === "collector" ? "Authorized representative" : "Full name"}</span>
                    <input required type="text" autoComplete="name" placeholder={signupRole === "collector" ? "Representative’s full legal name" : "Your full name"} className="w-full rounded-2xl border border-[#34418E]/12 bg-white px-4 py-3.5 outline-none placeholder:text-[#6B7C8F]/65 focus:border-[#4A5BB0]" />
                  </label>
                  {signupRole === "collector" && (
                    <>
                      <div className="flex gap-3 rounded-2xl border border-[#D6A72E]/30 bg-[#FFF7E4] p-4 text-sm leading-5 text-[#67500E]">
                        <Icon name="shield" className="mt-0.5 size-5 shrink-0" />
                        <p><span className="font-bold">Verification required.</span> Collector accounts can receive and manage donations, so access is only activated after organization and identity review.</p>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block">
                          <span className="mb-2 block text-sm font-semibold">Organization type</span>
                          <select required className="w-full rounded-2xl border border-[#34418E]/12 bg-white px-4 py-3.5 outline-none focus:border-[#4A5BB0]" defaultValue="">
                            <option value="" disabled>Select type</option>
                            <option>Registered nonprofit</option>
                            <option>Charity or foundation</option>
                            <option>Company or business</option>
                            <option>Community organization</option>
                            <option>Government agency or LGU</option>
                            <option>Individual collector</option>
                          </select>
                        </label>
                        <label className="block">
                          <span className="mb-2 block text-sm font-semibold">Your position</span>
                          <input required type="text" placeholder="Director, officer, coordinator" className="w-full rounded-2xl border border-[#34418E]/12 bg-white px-4 py-3.5 outline-none placeholder:text-[#6B7C8F]/65 focus:border-[#4A5BB0]" />
                        </label>
                      </div>
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold">Legal organization name</span>
                        <input required type="text" placeholder="Name shown on registration documents" className="w-full rounded-2xl border border-[#34418E]/12 bg-white px-4 py-3.5 outline-none placeholder:text-[#6B7C8F]/65 focus:border-[#4A5BB0]" />
                      </label>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block">
                          <span className="mb-2 block text-sm font-semibold">Registration number</span>
                          <input required type="text" placeholder="SEC, DTI, CDA, or BIR number" className="w-full rounded-2xl border border-[#34418E]/12 bg-white px-4 py-3.5 outline-none placeholder:text-[#6B7C8F]/65 focus:border-[#4A5BB0]" />
                        </label>
                        <label className="block">
                          <span className="mb-2 block text-sm font-semibold">Phone number</span>
                          <input required type="tel" autoComplete="tel" placeholder="+63 9XX XXX XXXX" className="w-full rounded-2xl border border-[#34418E]/12 bg-white px-4 py-3.5 outline-none placeholder:text-[#6B7C8F]/65 focus:border-[#4A5BB0]" />
                        </label>
                      </div>
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold">Registered address</span>
                        <input required type="text" autoComplete="street-address" placeholder="Full legal business address" className="w-full rounded-2xl border border-[#34418E]/12 bg-white px-4 py-3.5 outline-none placeholder:text-[#6B7C8F]/65 focus:border-[#4A5BB0]" />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold">Organization website or public profile</span>
                        <input required type="url" placeholder="https://" className="w-full rounded-2xl border border-[#34418E]/12 bg-white px-4 py-3.5 outline-none placeholder:text-[#6B7C8F]/65 focus:border-[#4A5BB0]" />
                      </label>
                      <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-[#34418E]/20 bg-white p-4 transition hover:border-[#4A5BB0]">
                        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#EEF0F5] text-[#4A5BB0]"><Icon name="upload" /></span>
                        <span><span className="block text-sm font-semibold">Upload verification documents</span><span className="mt-1 block text-xs leading-5 text-[#6B7C8F]">Registration certificate, representative ID, and proof of address. PDF, JPG, or PNG.</span></span>
                        <input required type="file" multiple accept="image/*,.pdf" className="sr-only" />
                      </label>
                    </>
                  )}
                </>
              )}
              <label className="block">
                <span className="mb-2 block text-sm font-semibold">Email address</span>
                <input required type="email" autoComplete="email" placeholder="you@example.com" className="w-full rounded-2xl border border-[#34418E]/12 bg-white px-4 py-3.5 outline-none placeholder:text-[#6B7C8F]/65 focus:border-[#4A5BB0]" />
              </label>
              <label className="block">
                <span className="mb-2 flex items-center justify-between text-sm font-semibold">
                  Password
                  {authMode === "signin" && <button type="button" className="font-semibold text-[#4A5BB0]">Forgot password?</button>}
                </span>
                <input required type="password" autoComplete={authMode === "signin" ? "current-password" : "new-password"} minLength={8} placeholder="At least 8 characters" className="w-full rounded-2xl border border-[#34418E]/12 bg-white px-4 py-3.5 outline-none placeholder:text-[#6B7C8F]/65 focus:border-[#4A5BB0]" />
              </label>
              {authMode === "signup" && (
                <label className="flex gap-3 pt-1 text-xs leading-5 text-[#52677A]">
                  <input required type="checkbox" className="mt-0.5 size-4 shrink-0 accent-[#4A5BB0]" />
                  {signupRole === "collector"
                    ? "I certify that I am authorized to represent this organization and that all submitted information is complete and accurate. I consent to identity and organization verification."
                    : "I agree to DAMAYAN’s Terms of Use and Privacy Policy."}
                </label>
              )}
              <button type="submit" className="w-full rounded-full bg-[#34418E] px-6 py-4 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#293675]">
                {authMode === "signin" ? "Sign in" : signupRole === "collector" ? "Submit for verification" : "Create my account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#6B7C8F]">
              {authMode === "signin" ? "Don’t have an account yet?" : "Already have an account?"}{" "}
              <button onClick={() => openAuth(authMode === "signin" ? "signup" : "signin")} className="font-bold text-[#B88910]">
                {authMode === "signin" ? "Create an account" : "Sign in"}
              </button>
            </p>
            </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
