import { useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { driveData, type Drive } from "@/data/mockData";
import { useApiResource } from "@/hooks/useApiResource";
import { LoadingState, Notice, PageHeader } from "@/components/PagePrimitives";

function Progress({ drive }: { drive: Drive }) {
  const percent = Math.min(100, Math.round((drive.raised / drive.goal) * 100));
  return (
    <div>
      <div className="h-2 overflow-hidden rounded-full bg-[#E7EAF5]"><div className="h-full bg-[#F2C94C]" style={{ width: `${percent}%` }} /></div>
      <div className="mt-2 flex justify-between text-xs"><span>{drive.raised.toLocaleString("en-PH")} received</span><strong>{percent}%</strong></div>
    </div>
  );
}

export function BrowseDrivesPage() {
  const { data, loading, error } = useApiResource<Drive[]>("/drives", driveData);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const filtered = useMemo(() => data.filter((drive) =>
    (category === "All" || drive.category === category) &&
    `${drive.title} ${drive.organization} ${drive.location}`.toLowerCase().includes(query.toLowerCase()),
  ), [category, data, query]);

  return (
    <>
      <PageHeader eyebrow="Verified opportunities" title="Explore donation drives" description="Search, filter, and compare active needs across Philippine communities." action={<Link to="/donations/new" className="rounded-full bg-[#34418E] px-5 py-3 font-bold text-white">Make a donation</Link>} />
      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        {error && <Notice>{error}</Notice>}
        <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by need, organization, or location" className="rounded-full border border-[#34418E]/15 bg-white px-5 py-3 outline-none focus:border-[#34418E]" />
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-full border border-[#34418E]/15 bg-white px-5 py-3">
            {["All", ...new Set(data.map((drive) => drive.category))].map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        {loading ? <LoadingState /> : filtered.length === 0 ? <div className="mt-10 border border-dashed border-[#34418E]/20 p-12 text-center text-[#6B7C8F]">No drives match your current search.</div> : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((drive) => (
              <article key={drive.id} className="flex flex-col justify-between border border-[#34418E]/12 bg-white p-6 shadow-sm">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#B88910]">{drive.category}</span>
                    {drive.urgent && <span className="bg-[#F2C94C] px-2.5 py-1 text-xs font-bold">Urgent</span>}
                  </div>
                  <h2 className="mt-5 text-2xl font-bold tracking-tight">{drive.title}</h2>
                  <p className="mt-2 text-sm text-[#6B7C8F]">{drive.organization} · {drive.location}</p>
                  <p className="mt-5 text-sm"><strong>Still needed:</strong> {drive.remaining}</p>
                </div>
                <div className="mt-8">
                  <Progress drive={drive} />
                  <Link to={`/drives/${drive.id}`} className="mt-6 inline-block border-b border-[#34418E] pb-1 text-sm font-bold">View drive details</Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export function DriveDetailPage() {
  const { driveId } = useParams();
  const { data: drive, loading } = useApiResource<Drive | null>(`/drives/${driveId}`, driveData.find((item) => item.id === driveId) ?? null);
  if (loading) return <main className="mx-auto max-w-3xl px-5 py-24 text-center">Loading…</main>;
  if (!drive) return <main className="mx-auto max-w-3xl px-5 py-24 text-center"><p className="text-sm font-bold uppercase text-[#B88910]">404</p><h1 className="mt-3 text-4xl font-bold">Drive not found</h1><Link to="/drives" className="mt-6 inline-block rounded-full bg-[#34418E] px-5 py-3 text-white">Return to drives</Link></main>;
  return (
    <>
      <PageHeader eyebrow={drive.urgent ? "Urgent verified drive" : drive.category} title={drive.title} description={`${drive.organization} · ${drive.location}`} action={<Link to="/donations/new" className="rounded-full bg-[#F2C94C] px-5 py-3 font-bold">Donate to this drive</Link>} />
      <main className="mx-auto grid max-w-6xl gap-8 px-5 py-12 lg:grid-cols-[1fr_.7fr] lg:px-8">
        <section className="bg-white p-7 sm:p-10">
          <h2 className="text-2xl font-bold">About this drive</h2>
          {drive.description && <p className="mt-4 leading-7 text-[#34418E]/80">{drive.description}</p>}
          <h3 className="mt-8 text-lg font-bold">Still needed</h3>
          <p className="mt-2">{drive.remaining || "Contact the organization for the current list of needs."}</p>
        </section>
        <aside className="border border-[#34418E] bg-[#34418E] p-7 text-white sm:p-10">
          <p className="text-xs font-bold uppercase tracking-wider text-[#F2C94C]">Campaign progress</p>
          <p className="mt-4 text-4xl font-bold">{drive.raised.toLocaleString("en-PH")}</p>
          <p className="mt-1 text-white/55">of {drive.goal.toLocaleString("en-PH")} goal</p>
          <div className="mt-8"><Progress drive={drive} /></div>
          <div className="mt-8 border-t border-white/15 pt-6">
            <strong>{typeof drive.daysRemaining === "number" ? (drive.daysRemaining === 0 ? "Deadline reached" : `${drive.daysRemaining} ${drive.daysRemaining === 1 ? "day" : "days"} left`) : "No deadline set"}</strong>
            <p className="mt-2 text-sm text-white/65">{drive.status && drive.status !== "Active" ? `Status: ${drive.status}` : "This drive is accepting donations."}</p>
          </div>
        </aside>
      </main>
    </>
  );
}

export function MatchingPage() {
  const [item, setItem] = useState("Education");
  const { data: allDrives } = useApiResource<Drive[]>("/drives", driveData);
  const matches = allDrives.filter((drive) => drive.category === item || (item === "Emergency" && drive.urgent));
  return (
    <>
      <PageHeader eyebrow="Smart recommendations" title="Donation matching" description="Tell DAMAYAN what you can give and see where it is requested right now." />
      <main className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
        <div className="bg-[#34418E] p-7 text-white sm:p-10">
          <label className="text-sm font-bold">I want to donate</label>
          <select value={item} onChange={(event) => setItem(event.target.value)} className="mt-3 w-full bg-white px-5 py-4 text-[#34418E] sm:max-w-md">
            {["Education", "Food", "Medical", "Household", "Hygiene", "Emergency"].map((category) => <option key={category}>{category}</option>)}
          </select>
        </div>
        <p className="mt-8 text-sm font-bold uppercase tracking-wider text-[#B88910]">{matches.length} recommended {matches.length === 1 ? "drive" : "drives"}</p>
        <div className="mt-4 space-y-3">
          {matches.length ? matches.map((drive) => <Link key={drive.id} to={`/drives/${drive.id}`} className="flex items-center justify-between bg-white p-5 shadow-sm"><span><strong className="block">{drive.title}</strong><span className="mt-1 block text-sm text-[#6B7C8F]">{drive.location} · Needs {drive.remaining}</span></span><span className="font-bold">View →</span></Link>) : <Notice>No active drives currently request this item. Try another category.</Notice>}
        </div>
      </main>
    </>
  );
}
