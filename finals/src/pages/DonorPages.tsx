import { useState } from "react";
import { Link, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { donationData, driveData } from "@/data/mockData";
import { donationSchema, type DonationFormValues } from "@/schemas/forms";
import { api } from "@/api/client";
import { Notice, PageHeader } from "@/components/PagePrimitives";

export function NewDonationPage() {
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: { driveId: "", type: "", quantity: 1, method: "pickup", details: "", contactNumber: "" },
  });

  async function onSubmit(values: DonationFormValues) {
    setSubmitError(null);
    try {
      if (import.meta.env.VITE_API_URL) await api.post("/donations", values);
      else await new Promise((resolve) => setTimeout(resolve, 500));
      setSuccess(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to submit donation");
    }
  }

  if (success) return <main className="mx-auto max-w-xl px-5 py-24 text-center"><div className="mx-auto grid size-20 place-items-center rounded-full bg-[#F2C94C] text-3xl">✓</div><h1 className="mt-6 text-4xl font-bold">Donation submitted</h1><p className="mt-3 text-[#6B7C8F]">Your record DON-2026-00126 is pending review. Its receiving QR code will activate after approval.</p><Link to="/donations" className="mt-8 inline-block rounded-full bg-[#34418E] px-6 py-3 font-bold text-white">View my donations</Link></main>;

  return (
    <>
      <PageHeader eyebrow="New record" title="Make a donation" description="Provide accurate details so the organization can verify, schedule, and document your gift." />
      <main className="mx-auto max-w-3xl px-5 py-12 lg:px-8">
        {submitError && <Notice tone="error">{submitError}</Notice>}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-6 bg-white p-6 shadow-sm sm:p-10">
          <Field label="Donation drive" error={errors.driveId?.message}><select {...register("driveId")} className="field"><option value="">Select a drive</option>{driveData.map((drive) => <option key={drive.id} value={drive.id}>{drive.title}</option>)}</select></Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Donation type" error={errors.type?.message}><select {...register("type")} className="field"><option value="">Select type</option>{["Money", "Food", "Clothing", "Education", "Medical", "Household"].map((type) => <option key={type}>{type}</option>)}</select></Field>
            <Field label="Quantity" error={errors.quantity?.message}><input {...register("quantity", { valueAsNumber: true })} type="number" min="1" className="field" /></Field>
          </div>
          <Field label="Donation method" error={errors.method?.message}><div className="grid grid-cols-3 gap-2">{[["pickup", "Request pickup"], ["dropoff", "Drop-off"], ["center", "Collection center"]].map(([value, label]) => <label key={value} className="cursor-pointer"><input {...register("method")} type="radio" value={value} className="peer sr-only" /><span className="block border border-[#34418E]/15 p-3 text-center text-sm font-semibold peer-checked:border-[#34418E] peer-checked:bg-[#ECEEF7]">{label}</span></label>)}</div></Field>
          <Field label="Donation details" error={errors.details?.message}><textarea {...register("details")} rows={4} className="field" placeholder="Describe the items, condition, sizes, or amount" /></Field>
          <Field label="Contact number" error={errors.contactNumber?.message}><input {...register("contactNumber")} className="field" placeholder="+639171234567" /></Field>
          <button disabled={isSubmitting} className="w-full rounded-full bg-[#F2C94C] px-6 py-4 font-bold disabled:opacity-60">{isSubmitting ? "Submitting…" : "Submit donation for review"}</button>
        </form>
      </main>
    </>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-sm font-bold">{label}</span>{children}{error && <span className="mt-1 block text-xs font-semibold text-red-700">{error}</span>}</label>;
}

export function MyDonationsPage() {
  const [items, setItems] = useState(donationData);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  function removeDonation() {
    if (!deleteId) return;
    setItems((current) => current.filter((item) => item.id !== deleteId));
    setDeleteId(null);
    setMessage("Donation record deleted successfully.");
  }
  return (
    <>
      <PageHeader eyebrow="Donor account" title="My donations" description="Review approval, pickup, receiving, and documentation status." action={<Link to="/donations/new" className="rounded-full bg-[#F2C94C] px-5 py-3 font-bold">New donation</Link>} />
      <main className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
        {message && <Notice tone="success">{message}</Notice>}
        {items.length === 0 ? <div className="mt-6 border border-dashed p-12 text-center"><h2 className="text-xl font-bold">No donation records</h2><p className="mt-2 text-[#6B7C8F]">Your submitted donations will appear here.</p></div> : (
          <div className="mt-6 overflow-x-auto bg-white">
            <table className="w-full min-w-3xl text-left text-sm"><thead className="bg-[#ECEEF7] text-xs uppercase"><tr>{["Reference", "Drive", "Method", "Status", "Date", "Actions"].map((heading) => <th key={heading} className="px-5 py-4">{heading}</th>)}</tr></thead><tbody>{items.map((item) => <tr key={item.id} className="border-t border-[#34418E]/10"><td className="px-5 py-4 font-mono font-bold">{item.id}</td><td className="px-5 py-4">{item.drive}</td><td className="px-5 py-4">{item.method}</td><td className="px-5 py-4"><span className="bg-[#FFF3C4] px-2 py-1 font-semibold">{item.status}</span></td><td className="px-5 py-4">{item.date}</td><td className="px-5 py-4"><Link to={`/donations/${item.id}`} className="font-bold">Track</Link>{item.status === "Pending" && <button onClick={() => setDeleteId(item.id)} className="ml-4 text-red-700">Delete</button>}</td></tr>)}</tbody></table>
          </div>
        )}
      </main>
      {deleteId && <div className="fixed inset-0 z-50 grid place-items-center bg-[#1D2758]/60 p-5"><div className="max-w-sm bg-white p-7"><h2 className="text-xl font-bold">Delete donation?</h2><p className="mt-3 text-sm text-[#6B7C8F]">This pending record will be permanently removed.</p><div className="mt-6 flex gap-3"><button onClick={() => setDeleteId(null)} className="flex-1 border px-4 py-3 font-bold">Cancel</button><button onClick={removeDonation} className="flex-1 bg-red-700 px-4 py-3 font-bold text-white">Delete</button></div></div></div>}
    </>
  );
}

export function DonationTrackingPage() {
  const { donationId } = useParams();
  const donation = donationData.find((item) => item.id === donationId);
  if (!donation) return <main className="mx-auto max-w-3xl px-5 py-24 text-center"><h1 className="text-4xl font-bold">Donation not found</h1><Link to="/donations" className="mt-6 inline-block text-[#B88910]">Return to donations</Link></main>;
  const steps = ["Submitted", "Approved", "Collector assigned", "Picked up", "Received"];
  const active = donation.status === "Received" ? 4 : donation.status === "Approved" ? 1 : 0;
  return (
    <>
      <PageHeader eyebrow={donation.id} title="Donation tracking" description={donation.drive} />
      <main className="mx-auto max-w-4xl px-5 py-12 lg:px-8">
        <div className="bg-white p-7 sm:p-10">
          {steps.map((step, index) => <div key={step} className="flex gap-5 pb-8 last:pb-0"><span className={`grid size-9 shrink-0 place-items-center rounded-full font-bold ${index <= active ? "bg-[#34418E] text-white" : "bg-[#ECEEF7]"}`}>{index + 1}</span><div><h2 className="font-bold">{step}</h2><p className="mt-1 text-sm text-[#6B7C8F]">{index <= active ? "Completed and documented" : "Waiting for the previous step"}</p></div></div>)}
        </div>
      </main>
    </>
  );
}

export function PickupRequestsPage() {
  const requests = [
    { id: "PK-1042", address: "Tumana, Marikina City", schedule: "Sep 22 · 10:00 AM", status: "Collector assigned" },
    { id: "PK-1038", address: "Commonwealth, Quezon City", schedule: "Sep 21 · 2:00 PM", status: "Accepted" },
  ];
  return (
    <>
      <PageHeader eyebrow="Physical donations" title="Pickup requests" description="Monitor scheduled collections and assigned collectors." />
      <main className="mx-auto max-w-5xl px-5 py-10 lg:px-8"><div className="grid gap-4">{requests.map((request) => <article key={request.id} className="grid gap-5 bg-white p-6 sm:grid-cols-[auto_1fr_auto] sm:items-center"><span className="font-mono font-bold">{request.id}</span><div><h2 className="font-bold">{request.address}</h2><p className="mt-1 text-sm text-[#6B7C8F]">{request.schedule}</p></div><span className="bg-[#FFF3C4] px-3 py-2 text-sm font-bold">{request.status}</span></article>)}</div></main>
    </>
  );
}
