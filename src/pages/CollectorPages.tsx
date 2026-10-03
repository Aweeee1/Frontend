import { useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { driveData } from "@/data/mockData";
import { driveSchema, type DriveFormValues } from "@/schemas/forms";
import { Notice, PageHeader } from "@/components/PagePrimitives";

export function CollectionCentersPage() {
  const centers = [
    { id: "ctr-01", name: "DAMAYAN Hub", location: "Marikina City", hours: "8:00 AM–5:00 PM", accepts: "Clothes, food, hygiene, school supplies" },
    { id: "ctr-02", name: "Bayanihan Center", location: "Pasig City", hours: "9:00 AM–6:00 PM", accepts: "Food, blankets, household, medical" },
    { id: "ctr-03", name: "DAMAYAN Relief Point", location: "Quezon City", hours: "8:00 AM–4:00 PM", accepts: "Food, water, clothing, emergency supplies" },
  ];
  return (
    <>
      <PageHeader eyebrow="Drop-off network" title="Collection centers" description="Find verified locations, opening hours, and accepted donation types." />
      <main className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">{centers.map((center) => <article key={center.id} className="border-t-8 border-[#F2C94C] bg-white p-6"><p className="text-xs font-bold uppercase text-[#B88910]">{center.location}</p><h2 className="mt-3 text-2xl font-bold">{center.name}</h2><p className="mt-5 text-sm"><strong>Open:</strong> {center.hours}</p><p className="mt-3 text-sm leading-6 text-[#6B7C8F]"><strong className="text-[#34418E]">Accepts:</strong> {center.accepts}</p><button className="mt-6 border-b border-[#34418E] pb-1 text-sm font-bold">View directions</button></article>)}</div>
      </main>
    </>
  );
}

export function CollectorDashboardPage() {
  const stats = [["24", "Pending approvals"], ["8", "Pickups today"], ["184", "Donations received"], ["72%", "Average goal"]];
  return (
    <>
      <PageHeader eyebrow="Organization portal" title="Collector dashboard" description="Community Table PH · Verified organization" action={<Link to="/collector/drives/new" className="rounded-full bg-[#F2C94C] px-5 py-3 font-bold">Create drive</Link>} />
      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="grid grid-cols-2 gap-px bg-[#34418E]/15 lg:grid-cols-4">{stats.map(([value, label]) => <div key={label} className="bg-white p-6"><strong className="text-3xl">{value}</strong><p className="mt-1 text-sm text-[#6B7C8F]">{label}</p></div>)}</div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
          <section className="bg-white p-6"><h2 className="text-xl font-bold">Pickup queue</h2>{["Accept request from Quezon City", "Assign collector to Marikina", "Confirm receipt at Pasig Hub"].map((task, index) => <div key={task} className="flex items-center justify-between border-b py-4"><span>{task}</span><button className="text-sm font-bold">{index === 0 ? "Review" : "Update"}</button></div>)}</section>
          <section className="bg-[#34418E] p-6 text-white"><h2 className="text-xl font-bold">Impact summary</h2><p className="mt-8 text-5xl font-bold text-[#F2C94C]">1,248</p><p className="mt-2 text-white/60">families reached this quarter</p><div className="mt-8 h-2 bg-white/15"><div className="h-full w-3/4 bg-[#F2C94C]" /></div></section>
        </div>
      </main>
    </>
  );
}

export function ManageDrivesPage() {
  const [message, setMessage] = useState("");
  return (
    <>
      <PageHeader eyebrow="Organization portal" title="Manage donation drives" description="Create, edit, mark urgent, and review campaign performance." action={<Link to="/collector/drives/new" className="rounded-full bg-[#34418E] px-5 py-3 font-bold text-white">New drive</Link>} />
      <main className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
        {message && <Notice tone="success">{message}</Notice>}
        <div className="mt-5 space-y-3">{driveData.slice(0, 4).map((drive) => <article key={drive.id} className="grid gap-4 bg-white p-5 sm:grid-cols-[1fr_auto] sm:items-center"><div><div className="flex items-center gap-2"><h2 className="font-bold">{drive.title}</h2>{drive.urgent && <span className="bg-[#F2C94C] px-2 py-1 text-xs font-bold">Urgent</span>}</div><p className="mt-1 text-sm text-[#6B7C8F]">{drive.category} · {Math.round(drive.raised / drive.goal * 100)}% complete</p></div><div className="flex gap-2"><Link to={`/collector/drives/new?edit=${drive.id}`} className="border px-4 py-2 text-sm font-bold">Edit</Link><button onClick={() => setMessage(`${drive.title} was archived.`)} className="border border-red-200 px-4 py-2 text-sm font-bold text-red-700">Archive</button></div></article>)}</div>
      </main>
    </>
  );
}

export function DriveFormPage() {
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<DriveFormValues>({
    resolver: zodResolver(driveSchema),
    defaultValues: { title: "", category: "", goal: 100, deadline: "", description: "", urgent: false },
  });
  async function submit() {
    await new Promise((resolve) => setTimeout(resolve, 400));
    setSuccess(true);
  }
  return (
    <>
      <PageHeader eyebrow="Organization portal" title="Create donation drive" description="Publish a specific, measurable request for your verified organization." />
      <main className="mx-auto max-w-3xl px-5 py-12 lg:px-8">
        {success && <Notice tone="success">Drive created successfully and submitted for admin review.</Notice>}
        <form onSubmit={handleSubmit(submit)} className="mt-5 space-y-5 bg-white p-6 sm:p-10">
          <FormField label="Drive title" error={errors.title?.message}><input {...register("title")} className="field" /></FormField>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Category" error={errors.category?.message}><select {...register("category")} className="field"><option value="">Select category</option>{["Emergency", "Food", "Education", "Medical", "Household"].map((category) => <option key={category}>{category}</option>)}</select></FormField>
            <FormField label="Donation goal" error={errors.goal?.message}><input {...register("goal", { valueAsNumber: true })} type="number" className="field" /></FormField>
          </div>
          <FormField label="Deadline" error={errors.deadline?.message}><input {...register("deadline")} type="date" className="field" /></FormField>
          <FormField label="Description" error={errors.description?.message}><textarea {...register("description")} rows={5} className="field" /></FormField>
          <label className="flex items-start gap-3 bg-[#FFF8E6] p-4"><input {...register("urgent")} type="checkbox" className="mt-1 size-4 accent-[#34418E]" /><span><strong className="block">Mark as urgent</strong><span className="text-sm text-[#6B7C8F]">Urgent drives are reviewed before receiving prominent placement.</span></span></label>
          <button disabled={isSubmitting} className="w-full rounded-full bg-[#F2C94C] px-6 py-4 font-bold">{isSubmitting ? "Saving…" : "Create donation drive"}</button>
        </form>
      </main>
    </>
  );
}

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-sm font-bold">{label}</span>{children}{error && <span className="mt-1 block text-xs font-semibold text-red-700">{error}</span>}</label>;
}
