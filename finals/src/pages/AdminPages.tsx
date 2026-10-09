import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/api/client";
import { Notice, PageHeader, LoadingState, FormField } from "@/components/PagePrimitives";
import { adminDriveSchema, driveCategories, driveStatuses, type AdminDriveFormValues } from "@/schemas/forms";

type Stats = { users: { total:number; active:number; byRole:Record<string,number> }; drives:{total:number;active:number;urgent:number;completed:number;raised:number;goal:number;progressPercent:number}; donations:{total:number;pending:number;approved:number;received:number;rejected:number;quantity:number} };
type User = { id:string; name:string; email:string; role:string; organization:string; active:boolean; verified:boolean; createdAt:string };
type Drive = { id:string; title:string; organization:string; location?:string; category:string; raised:number; goal:number; urgent:boolean; status:string; remaining?:string; deadline?:string; description?:string; daysRemaining:number|null; progressPercent:number };
type Donation = { hasProof?:boolean; code:string; drive:string; donorName:string; type:string; quantity:number; method:string; status:string; createdAt:string };

function Card({value,label}:{value:string|number;label:string}) {
  return <div className="rounded-2xl border border-[#34418E]/10 bg-white p-5 shadow-sm"><p className="text-3xl font-bold">{value}</p><p className="mt-1 text-sm text-[#6B7C8F]">{label}</p></div>;
}

export function AdminDashboardPage() {
  const [data,setData]=useState<Stats|null>(null); const [error,setError]=useState(""); const [loading,setLoading]=useState(true);
  useEffect(()=>{ api.get<Stats["users"]>("/users/stats").then(async users=>{ const [drives,donations]=await Promise.all([api.get("/drives/stats/overview"),api.get("/donations/admin/stats")]); setData({users:users.data,drives:drives.data,donations:donations.data}); }).catch(e=>setError(e.message)).finally(()=>setLoading(false)); },[]);
  if(loading) return <LoadingState/>; if(error) return <main className="mx-auto max-w-7xl px-5 py-20"><Notice tone="error">{error}</Notice></main>;
  if(!data) return null;
  return <><PageHeader eyebrow="Administration" title="DAMAYAN command center" description="Monitor donations, drives, users, and measurable community impact from one place." action={<Link to="/admin/donations" className="rounded-full bg-[#F2C94C] px-5 py-3 font-bold">Review donations</Link>}/><main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Card value={data.users.total} label="Registered users"/><Card value={data.drives.active} label="Active drives"/><Card value={data.donations.pending} label="Pending donations"/><Card value={data.donations.received} label="Completed donations"/></div>
    <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_.6fr]">
      <section className="rounded-2xl bg-[#34418E] p-7 text-white"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#F2C94C]">Community funding</p><p className="mt-4 text-5xl font-bold">₱{data.drives.raised.toLocaleString()}</p><p className="mt-2 text-white/60">raised across {data.drives.total} drives against ₱{data.drives.goal.toLocaleString()} in goals.</p><div className="mt-7 h-3 rounded-full bg-white/10"><div className="h-full rounded-full bg-[#F2C94C]" style={{width:`${Math.min(100,data.drives.progressPercent)}%`}}/></div><p className="mt-2 text-sm">{data.drives.progressPercent}% aggregate progress</p></section>
      <section className="rounded-2xl border border-[#34418E]/10 bg-white p-7"><h2 className="text-xl font-bold">Needs attention</h2><div className="mt-5 space-y-4 text-sm"><Link className="flex justify-between border-b pb-4" to="/admin/donations"><span>Pending donations</span><strong>{data.donations.pending}</strong></Link><Link className="flex justify-between border-b pb-4" to="/admin/drives"><span>Urgent drives</span><strong>{data.drives.urgent}</strong></Link><Link className="flex justify-between" to="/admin/users"><span>Collectors</span><strong>{data.users.byRole.collector ?? 0}</strong></Link></div></section>
    </div>
    <div className="mt-6 grid gap-4 sm:grid-cols-3"><Link to="/admin/users" className="rounded-2xl bg-white p-6 shadow-sm hover:shadow-md"><strong>User management</strong><p className="mt-2 text-sm text-[#6B7C8F]">Verify organizations, activate accounts, and manage roles.</p></Link><Link to="/admin/drives" className="rounded-2xl bg-white p-6 shadow-sm hover:shadow-md"><strong>Drive moderation</strong><p className="mt-2 text-sm text-[#6B7C8F]">Approve, archive, or complete community drives.</p></Link><Link to="/admin/donations" className="rounded-2xl bg-white p-6 shadow-sm hover:shadow-md"><strong>Donation operations</strong><p className="mt-2 text-sm text-[#6B7C8F]">Review status transitions and donation processing.</p></Link></div>
  </main></>;
}

export function AdminUsersPage() {
  const [items,setItems]=useState<User[]>([]),[q,setQ]=useState(""),[error,setError]=useState(""),[message,setMessage]=useState("");
  const load=()=>api.get<User[]>("/users", {params:q?{q}:undefined}).then(r=>setItems(r.data)).catch(e=>setError(e.message));
  useEffect(()=>{load()},[]);
  async function update(id:string, patch:Partial<User>){try{await api.patch(`/users/${id}`,patch);setMessage("User updated successfully.");load()}catch(e){setError(e instanceof Error?e.message:"Update failed")}}
  async function remove(id:string){if(!confirm("Delete this user permanently?"))return;try{await api.delete(`/users/${id}`);setMessage("User deleted.");load()}catch(e){setError(e instanceof Error?e.message:"Delete failed")}}
  return <><PageHeader eyebrow="Administration" title="Users & organizations" description="Review accounts, verify collectors, and control access."/><main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">{message&&<Notice tone="success">{message}</Notice>}{error&&<Notice tone="error">{error}</Notice>}<div className="mb-5 flex gap-2"><input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&load()} className="field max-w-md" placeholder="Search name, email, organization"/><button onClick={load} className="rounded-full bg-[#34418E] px-5 font-bold text-white">Search</button></div><div className="overflow-x-auto rounded-2xl bg-white shadow-sm"><table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-[#ECEEF7] text-xs uppercase"><tr>{["User","Role","Organization","Verified","Status","Actions"].map(h=><th key={h} className="px-5 py-4">{h}</th>)}</tr></thead><tbody>{items.map(u=><tr key={u.id} className="border-t border-[#34418E]/10"><td className="px-5 py-4"><strong>{u.name}</strong><p className="text-xs text-[#6B7C8F]">{u.email}</p></td><td className="px-5 py-4 capitalize">{u.role}</td><td className="px-5 py-4">{u.organization||"—"}</td><td className="px-5 py-4">{u.verified?"✓ Verified":"Pending"}</td><td className="px-5 py-4">{u.active?"Active":"Disabled"}</td><td className="px-5 py-4 space-x-3">{u.role==="collector"&&!u.verified&&<button onClick={()=>update(u.id,{verified:true})} className="font-bold">Verify</button>}<button onClick={()=>update(u.id,{active:!u.active})} className="font-bold">{u.active?"Disable":"Enable"}</button>{u.role!=="admin"&&<button onClick={()=>remove(u.id)} className="font-bold text-red-700">Delete</button>}</td></tr>)}</tbody></table></div></main></>;
}

const statusStyles:Record<string,string>={Pending:"bg-[#FFF3C4]",Active:"bg-green-100 text-green-800",Completed:"bg-[#ECEEF7]",Archived:"bg-gray-100 text-gray-600",Rejected:"bg-red-50 text-red-700"};

export function AdminDrivesPage() {
  const [items,setItems]=useState<Drive[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState(""),[message,setMessage]=useState(""),[filter,setFilter]=useState("All"),[q,setQ]=useState("");
  // For an admin this endpoint returns every drive regardless of status
  const load=()=>api.get<Drive[]>("/drives/owner/mine").then(r=>setItems(r.data)).catch(e=>setError(e.message)).finally(()=>setLoading(false));
  useEffect(()=>{load()},[]);
  const counts=useMemo(()=>Object.fromEntries(["All",...driveStatuses].map(s=>[s,s==="All"?items.length:items.filter(d=>d.status===s).length])),[items]);
  const visible=useMemo(()=>items.filter(d=>(filter==="All"||d.status===filter)&&(!q.trim()||[d.title,d.organization,d.location].some(v=>(v??"").toLowerCase().includes(q.trim().toLowerCase())))),[items,filter,q]);

  async function run(action:()=>Promise<unknown>,success:string,fail:string){setError("");setMessage("");try{await action();setMessage(success);await load()}catch(e){setError(e instanceof Error?e.message:fail)}}
  const setStatus=(d:Drive,status:string)=>run(()=>api.patch(`/drives/${d.id}/status`,{status}),`"${d.title}" marked ${status}.`,"Unable to update drive");
  const toggleUrgent=(d:Drive)=>run(()=>api.patch(`/drives/${d.id}`,{urgent:!d.urgent}),d.urgent?"Urgent flag removed.":"Drive marked urgent.","Unable to update drive");
  const remove=(d:Drive)=>{if(!confirm(`Permanently delete "${d.title}"? This can't be undone.`))return;run(()=>api.delete(`/drives/${d.id}`),`"${d.title}" was deleted.`,"Unable to delete drive")};

  const actions=(d:Drive)=>{
    const btn="font-bold underline-offset-2 hover:underline";
    return <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
      <Link to={`/admin/drives/${d.id}/edit`} className={btn}>Edit</Link>
      {d.status==="Pending"&&<><button onClick={()=>setStatus(d,"Active")} className={btn}>Approve</button><button onClick={()=>setStatus(d,"Rejected")} className={`${btn} text-red-700`}>Reject</button></>}
      {d.status==="Active"&&<><button onClick={()=>setStatus(d,"Completed")} className={btn}>Mark completed</button><button onClick={()=>toggleUrgent(d)} className={btn}>{d.urgent?"Remove urgent":"Mark urgent"}</button></>}
      {(d.status==="Archived"||d.status==="Rejected"||d.status==="Completed")&&<button onClick={()=>setStatus(d,"Active")} className={btn}>Reactivate</button>}
      {d.status!=="Archived"&&<button onClick={()=>setStatus(d,"Archived")} className={btn}>Archive</button>}
      <button onClick={()=>remove(d)} className={`${btn} text-red-700`}>Delete</button>
    </div>;
  };

  return <><PageHeader eyebrow="Administration" title="Manage drives" description="Create drives, review submissions, edit details, and control each drive's lifecycle." action={<Link to="/admin/drives/new" className="rounded-full bg-[#F2C94C] px-5 py-3 font-bold">New drive</Link>}/>
  <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
    {message&&<div className="mb-4"><Notice tone="success">{message}</Notice></div>}{error&&<div className="mb-4"><Notice tone="error">{error}</Notice></div>}
    <div className="mb-5 flex flex-wrap items-center gap-2">
      {["All",...driveStatuses].map(s=><button key={s} onClick={()=>setFilter(s)} className={`rounded-full px-4 py-2 text-sm font-bold ${filter===s?"bg-[#34418E] text-white":"bg-white"}`}>{s} <span className="opacity-60">{counts[s]}</span></button>)}
      <input value={q} onChange={e=>setQ(e.target.value)} className="field ml-auto max-w-xs" placeholder="Search title, organization, location"/>
    </div>
    {loading?<LoadingState/>:visible.length===0?<div className="rounded-2xl border border-dashed p-12 text-center"><h2 className="text-xl font-bold">No drives found</h2><p className="mt-2 text-[#6B7C8F]">{items.length===0?"Create the first drive to get started.":"Try a different status or search."}</p></div>:
    <div className="grid gap-4">{visible.map(d=><article key={d.id} className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><span className="text-xs font-bold uppercase text-[#B88910]">{d.category}</span><h2 className="mt-2 text-xl font-bold">{d.title}</h2><p className="mt-1 text-sm text-[#6B7C8F]">{d.organization}{d.location?` · ${d.location}`:""}{d.daysRemaining!==null&&d.daysRemaining!==undefined?` · ${d.daysRemaining} days left`:""}</p></div>
      <div className="flex gap-2">{d.urgent&&<span className="rounded-full bg-[#F2C94C] px-3 py-1 text-xs font-bold">Urgent</span>}<span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[d.status]??""}`}>{d.status}</span></div></div>
      <p className="mt-4 text-sm">Goal ₱{d.goal.toLocaleString()} · Raised ₱{d.raised.toLocaleString()} · {d.progressPercent}%</p>
      <div className="mt-2 h-2 rounded-full bg-[#ECEEF7]"><div className="h-full rounded-full bg-[#34418E]" style={{width:`${Math.min(100,d.progressPercent)}%`}}/></div>
      <div className="mt-5 border-t border-[#34418E]/10 pt-4">{actions(d)}</div>
    </article>)}</div>}
  </main></>;
}

export function AdminDriveFormPage() {
  const {driveId}=useParams(); const editId=driveId;
  const [success,setSuccess]=useState(""),[submitError,setSubmitError]=useState(""),[loading,setLoading]=useState(Boolean(editId));
  const {register,handleSubmit,reset,formState:{errors,isSubmitting}}=useForm<AdminDriveFormValues>({resolver:zodResolver(adminDriveSchema),defaultValues:{title:"",organization:"",category:"",location:"",remaining:"",goal:100,raised:0,deadline:"",description:"",status:"Active",urgent:false}});

  useEffect(()=>{ if(!editId) return;
    api.get<Drive>(`/drives/${editId}`).then(({data:d})=>reset({title:d.title,organization:d.organization??"",category:d.category,location:d.location??"",remaining:d.remaining??"",goal:d.goal,raised:d.raised,deadline:d.deadline?d.deadline.slice(0,10):"",description:d.description??"",status:d.status,urgent:Boolean(d.urgent)})).catch((e:Error)=>setSubmitError(e.message)).finally(()=>setLoading(false));
  },[editId,reset]);

  async function submit(values:AdminDriveFormValues){
    setSubmitError("");setSuccess("");
    const payload={...values,deadline:values.deadline||null};
    try{ if(editId){await api.patch(`/drives/${editId}`,payload);setSuccess("Drive updated.")} else {await api.post("/drives",payload);setSuccess("Drive created.");reset()} window.scrollTo({top:0,behavior:"smooth"}) }
    catch(e){setSubmitError(e instanceof Error?e.message:"Unable to save drive")}
  }
  if(loading) return <LoadingState/>;
  return <><PageHeader eyebrow="Administration" title={editId?"Edit drive":"Create drive"} description={editId?"Update any detail of this drive, including its progress and status.":"Drives you create are published immediately unless you set a different status."}/>
  <main className="mx-auto max-w-3xl px-5 py-12 lg:px-8">
    {success&&<Notice tone="success">{success} <Link to="/admin/drives" className="font-bold underline">Back to all drives</Link></Notice>}{submitError&&<Notice tone="error">{submitError}</Notice>}
    <form onSubmit={handleSubmit(submit)} className="mt-5 space-y-5 bg-white p-6 sm:p-10">
      <FormField label="Drive title" error={errors.title?.message}><input {...register("title")} className="field"/></FormField>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Organization" error={errors.organization?.message}><input {...register("organization")} className="field"/></FormField>
        <FormField label="Category" error={errors.category?.message}><select {...register("category")} className="field"><option value="">Select category</option>{driveCategories.map(c=><option key={c}>{c}</option>)}</select></FormField>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Location" error={errors.location?.message}><input {...register("location")} placeholder="e.g. Marikina City" className="field"/></FormField>
        <FormField label="Deadline (optional)" error={errors.deadline?.message}><input {...register("deadline")} type="date" className="field"/></FormField>
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        <FormField label="Donation goal" error={errors.goal?.message}><input {...register("goal",{valueAsNumber:true})} type="number" className="field"/></FormField>
        <FormField label="Raised so far" error={errors.raised?.message}><input {...register("raised",{valueAsNumber:true})} type="number" className="field"/></FormField>
        <FormField label="Status" error={errors.status?.message}><select {...register("status")} className="field">{driveStatuses.map(s=><option key={s}>{s}</option>)}</select></FormField>
      </div>
      <FormField label="What is still needed" error={errors.remaining?.message}><input {...register("remaining")} placeholder="e.g. Rice, water, blankets" className="field"/></FormField>
      <FormField label="Description" error={errors.description?.message}><textarea {...register("description")} rows={5} className="field"/></FormField>
      <label className="flex items-start gap-3 bg-[#FFF8E6] p-4"><input {...register("urgent")} type="checkbox" className="mt-1 size-4 accent-[#34418E]"/><span><strong className="block">Mark as urgent</strong><span className="text-sm text-[#6B7C8F]">Urgent drives get prominent placement for donors.</span></span></label>
      <div className="flex gap-3"><button disabled={isSubmitting} className="flex-1 rounded-full bg-[#F2C94C] px-6 py-4 font-bold">{isSubmitting?"Saving…":editId?"Save changes":"Create drive"}</button><Link to="/admin/drives" className="rounded-full border px-6 py-4 font-bold">Cancel</Link></div>
    </form>
  </main></>;
}

export function AdminDonationsPage() {
  const [items,setItems]=useState<Donation[]>([]),[error,setError]=useState(""),[message,setMessage]=useState(""),[status,setStatus]=useState("Pending");
  const load=()=>api.get<Donation[]>("/donations/admin/all",{params:status?{status}:undefined}).then(r=>setItems(r.data)).catch(e=>setError(e.message));
  useEffect(()=>{load()},[status]);
  async function change(code:string,next:string){
    try{await api.patch(`/donations/${code}/status`,{status:next});setMessage(`${code} updated to ${next}.`);load()}
    catch(e){setError(e instanceof Error?e.message:"Unable to update donation")}
  }
  async function viewProof(code:string){
    try{const r=await api.get(`/donations/${code}/proof`,{responseType:"blob"});window.open(URL.createObjectURL(r.data),"_blank")}
    catch(e){setError(e instanceof Error?e.message:"Unable to open proof of donation")}
  }
  return <><PageHeader eyebrow="Administration" title="Donation operations" description="Review real donation records and enforce valid status transitions."/><main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">{message&&<Notice tone="success">{message}</Notice>}{error&&<Notice tone="error">{error}</Notice>}<div className="mb-5 flex flex-wrap gap-2">{["Pending","Approved","Dropped off","Received","Rejected",""].map(s=><button key={s||"all"} onClick={()=>setStatus(s)} className={`rounded-full px-4 py-2 text-sm font-bold ${status===s?"bg-[#34418E] text-white":"bg-white"}`}>{s||"All"}</button>)}</div><div className="overflow-x-auto rounded-2xl bg-white shadow-sm"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-[#ECEEF7] text-xs uppercase"><tr>{["Reference","Donor","Drive","Type","Qty","Method","Status","Action"].map(h=><th key={h} className="px-5 py-4">{h}</th>)}</tr></thead><tbody>{items.map(d=><tr key={d.code} className="border-t border-[#34418E]/10"><td className="px-5 py-4 font-mono font-bold">{d.code}</td><td className="px-5 py-4">{d.donorName||"—"}</td><td className="px-5 py-4">{d.drive}</td><td className="px-5 py-4">{d.type}</td><td className="px-5 py-4">{d.quantity}</td><td className="px-5 py-4 capitalize">{d.method}</td><td className="px-5 py-4">{d.status}</td><td className="px-5 py-4">{d.status==="Pending"&&<button onClick={()=>change(d.code,"Approved")} className="font-bold">Approve</button>}{d.status==="Approved"&&d.type!=="Money"&&<button onClick={()=>change(d.code,"Dropped off")} className="font-bold">Mark dropped off</button>}{((d.status==="Approved"&&d.type==="Money")||d.status==="Dropped off")&&<button onClick={()=>change(d.code,"Received")} className="font-bold">Mark received</button>}{d.hasProof&&<button onClick={()=>viewProof(d.code)} className="ml-4 font-bold underline">View proof</button>}</td></tr>)}</tbody></table></div></main></>;
}
