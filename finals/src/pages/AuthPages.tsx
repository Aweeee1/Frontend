import { Link } from "react-router";

export function SignInPage() {
  return (
    <main className="grid min-h-[calc(100vh-7rem)] lg:grid-cols-2">
      <section className="hidden bg-[#34418E] p-16 text-white lg:flex lg:flex-col lg:justify-between"><span className="font-bold tracking-[.18em] text-[#F2C94C]">DAMAYAN</span><div><p className="font-serif text-6xl italic text-[#F2C94C]">Give with proof.</p><p className="mt-4 max-w-md text-white/60">One accountable website for donors and verified organizations.</p></div></section>
      <section className="grid place-items-center p-5"><form className="w-full max-w-md bg-white p-7 shadow-sm sm:p-10" onSubmit={(event) => event.preventDefault()}><p className="text-xs font-bold uppercase tracking-wider text-[#B88910]">Secure access</p><h1 className="mt-3 text-3xl font-bold">Welcome back</h1><label className="mt-7 block"><span className="mb-2 block text-sm font-bold">Email address</span><input type="email" required className="field" /></label><label className="mt-5 block"><span className="mb-2 flex justify-between text-sm font-bold">Password <button type="button" className="text-[#B88910]">Forgot password?</button></span><input type="password" required minLength={8} className="field" /></label><button className="mt-6 w-full rounded-full bg-[#34418E] px-6 py-4 font-bold text-white">Sign in</button><p className="mt-6 text-center text-sm text-[#6B7C8F]">Don’t have an account yet? <Link to="/signin?mode=create" className="font-bold text-[#B88910]">Create an account</Link></p></form></section>
    </main>
  );
}

export function NotFoundPage() {
  return <main className="grid min-h-[70vh] place-items-center px-5 text-center"><div><p className="font-serif text-8xl italic text-[#F2C94C]">404</p><h1 className="mt-3 text-4xl font-bold">This page could not be found.</h1><Link to="/" className="mt-7 inline-block rounded-full bg-[#34418E] px-6 py-3 font-bold text-white">Return to DAMAYAN</Link></div></main>;
}
