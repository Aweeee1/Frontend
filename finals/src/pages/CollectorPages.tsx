import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { driveData, type Drive } from "@/data/mockData";
import { useApiResource } from "@/hooks/useApiResource";
import { api, hasBackend } from "@/api/client";
import { driveSchema, type DriveFormValues } from "@/schemas/forms";
import { FormField, Notice, PageHeader } from "@/components/PagePrimitives";

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

const demoOwnedDrives = driveData.slice(0, 4);

export function ManageDrivesPage() {
  const { data, loading, error } = useApiResource<Drive[]>("/drives/owner/mine", demoOwnedDrives);
  const [items, setItems] = useState<Drive[]>(demoOwnedDrives);
  const [message, setMessage] = useState("");
  const [actionError, setActionError] = useState("");
  useEffect(() => setItems(data), [data]);

  async function archive(drive: Drive) {
    if (!confirm(`Archive "${drive.title}"? It will no longer appear to donors.`)) return;
    setActionError("");
    try {
      if (hasBackend) await api.patch(`/drives/${drive.id}`, { status: "Archived" });
      setItems((current) => current.map((item) => (item.id === drive.id ? { ...item, status: "Archived" } : item)));
      setMessage(`${drive.title} was archived.`);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Unable to archive this drive");
    }
  }

  return (
    <>
      <PageHeader eyebrow="Organization portal" title="Manage donation drives" description="Create, edit, mark urgent, and review campaign performance." action={<Link to="/collector/drives/new" className="rounded-full bg-[#34418E] px-5 py-3 font-bold text-white">New drive</Link>} />
      <main className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
        {message && <Notice tone="success">{message}</Notice>}
        {actionError && <Notice tone="error">{actionError}</Notice>}
        {error && <Notice>{error}</Notice>}
        {loading ? <p className="mt-5 text-[#6B7C8F]">Loading…</p> : items.length === 0 ? (
          <div className="mt-5 border border-dashed border-[#34418E]/20 p-12 text-center text-[#6B7C8F]">You haven’t created any drives yet.</div>
        ) : (
          <div className="mt-5 space-y-3">{items.map((drive) => (
            <article key={drive.id} className="grid gap-4 bg-white p-5 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-bold">{drive.title}</h2>
                  {drive.urgent && <span className="bg-[#F2C94C] px-2 py-1 text-xs font-bold">Urgent</span>}
                  {drive.status && <span className="bg-[#ECEEF7] px-2 py-1 text-xs font-bold">{drive.status === "Pending" ? "Pending admin review" : drive.status}</span>}
                </div>
                <p className="mt-1 text-sm text-[#6B7C8F]">{drive.category} · {drive.goal > 0 ? Math.round((drive.raised / drive.goal) * 100) : 0}% complete</p>
              </div>
              <div className="flex gap-2">
                <Link to={`/collector/drives/new?edit=${drive.id}`} className="border px-4 py-2 text-sm font-bold">Edit</Link>
                {drive.status !== "Archived" && <button onClick={() => archive(drive)} className="border border-red-200 px-4 py-2 text-sm font-bold text-red-700">Archive</button>}
              </div>
            </article>
          ))}</div>
        )}
      </main>
    </>
  );
}

export function DriveFormPage() {
  const [params] = useSearchParams();
  const editId = params.get("edit");
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<DriveFormValues>({
    resolver: zodResolver(driveSchema),
    defaultValues: { title: "", category: "", location: "", remaining: "", goal: 100, deadline: "", description: "", urgent: false },
  });

  // Edit mode: load the drive and pre-fill the form
  useEffect(() => {
    if (!editId) return;
    const fill = (d: Drive) => reset({
      title: d.title, category: d.category, location: d.location, remaining: d.remaining, goal: d.goal,
      deadline: d.deadline ? d.deadline.slice(0, 10) : "", description: d.description ?? "", urgent: Boolean(d.urgent),
    });
    if (!hasBackend) {
      const demo = driveData.find((d) => d.id === editId);
      if (demo) fill(demo);
      return;
    }
    api.get<Drive>(`/drives/${editId}`).then((res) => fill(res.data)).catch((e: Error) => setSubmitError(e.message));
  }, [editId, reset]);

  async function submit(values: DriveFormValues) {
    setSubmitError(null);
    setSuccess(false);
    try {
      if (hasBackend) await (editId ? api.patch(`/drives/${editId}`, values) : api.post("/drives", values));
      else await new Promise((resolve) => setTimeout(resolve, 500));
      setSuccess(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to save drive");
    }
  }
  return (
    <>
      <PageHeader eyebrow="Organization portal" title={editId ? "Edit donation drive" : "Create donation drive"} description="Publish a specific, measurable request for your verified organization." />
      <main className="mx-auto max-w-3xl px-5 py-12 lg:px-8">
        {success && <Notice tone="success">{editId ? "Drive updated." : "Drive created successfully and submitted for admin review."} <Link to="/collector/drives" className="font-bold underline">Back to my drives</Link></Notice>}
        {submitError && <Notice tone="error">{submitError}</Notice>}
        <form onSubmit={handleSubmit(submit)} className="mt-5 space-y-5 bg-white p-6 sm:p-10">
          <FormField label="Drive title" error={errors.title?.message}><input {...register("title")} className="field" /></FormField>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Category" error={errors.category?.message}><select {...register("category")} className="field"><option value="">Select category</option>{["Emergency", "Food", "Education", "Medical", "Household", "Hygiene"].map((category) => <option key={category}>{category}</option>)}</select></FormField>
            <FormField label="Donation goal" error={errors.goal?.message}><input {...register("goal", { valueAsNumber: true })} type="number" className="field" /></FormField>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Location" error={errors.location?.message}><input {...register("location")} placeholder="e.g. Marikina City" className="field" /></FormField>
            <FormField label="Deadline" error={errors.deadline?.message}><input {...register("deadline")} type="date" className="field" /></FormField>
          </div>
          <FormField label="What is still needed" error={errors.remaining?.message}><input {...register("remaining")} placeholder="e.g. Rice, water, blankets" className="field" /></FormField>
          <FormField label="Description" error={errors.description?.message}><textarea {...register("description")} rows={5} className="field" /></FormField>
          <label className="flex items-start gap-3 bg-[#FFF8E6] p-4"><input {...register("urgent")} type="checkbox" className="mt-1 size-4 accent-[#34418E]" /><span><strong className="block">Mark as urgent</strong><span className="text-sm text-[#6B7C8F]">Urgent drives are reviewed before receiving prominent placement.</span></span></label>
          <button disabled={isSubmitting} className="w-full rounded-full bg-[#F2C94C] px-6 py-4 font-bold">{isSubmitting ? "Saving…" : editId ? "Save changes" : "Create donation drive"}</button>
        </form>
      </main>
    </>
  );
}
