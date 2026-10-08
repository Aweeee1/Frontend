import { useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth, type User } from "@/auth/AuthContext";
import { Notice } from "@/components/PagePrimitives";
import {
  loginSchema,
  registerSchema,
  type LoginFormValues,
  type RegisterFormValues,
} from "@/schemas/forms";

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="mt-6 block">
      <span className="mb-3 block text-xs font-bold uppercase tracking-wider text-[#34418E]/70">{label}</span>
      {children}
      {error && <span className="mt-2 block text-sm text-red-600 font-medium">{error}</span>}
    </label>
  );
}

// Where to send the user after signing in
function useAfterAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  return (user: User) =>
    navigate(location.state?.from ?? (user.role === "collector" ? "/collector" : "/drives"), {
      replace: true,
    });
}

function LoginForm() {
  const { login } = useAuth();
  const afterAuth = useAfterAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    setSubmitError(null);
    try {
      afterAuth(await login(values));
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to sign in");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[540px]">
      <div className="mb-5 flex items-center justify-between">
        <span className="text-sm font-bold tracking-[0.18em] text-[#34418E]">DAMAYAN</span>
        <Link to="/" className="grid size-10 place-items-center rounded-full bg-[#34418E]/5 text-[#34418E] transition hover:bg-[#34418E]/10" aria-label="Close sign in">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-5"><path d="m18 6-12 12M6 6l12 12" /></svg>
        </Link>
      </div>

      <h1 className="text-4xl font-bold tracking-[-0.05em] text-[#34418E]">Welcome back</h1>
      <p className="mt-2 text-sm leading-6 text-[#6B7C8F]">Sign in to follow donations, track impact, and manage your account.</p>

      {submitError && (
        <div className="mt-6">
          <Notice tone="error">{submitError}</Notice>
        </div>
      )}

      <Field label="Email address" error={errors.email?.message}>
        <input {...register("email")} type="email" autoComplete="email" placeholder="you@example.com" className="w-full rounded-2xl border border-[#34418E]/12 bg-white px-4 py-3.5 text-[#34418E] shadow-sm outline-none placeholder:text-[#6B7C8F]/65 transition focus:border-[#4A5BB0] focus:ring-2 focus:ring-[#4A5BB0]/10" />
      </Field>

      <Field label="Password" error={errors.password?.message}>
        <input {...register("password")} type="password" autoComplete="current-password" placeholder="At least 8 characters" className="w-full rounded-2xl border border-[#34418E]/12 bg-white px-4 py-3.5 text-[#34418E] shadow-sm outline-none placeholder:text-[#6B7C8F]/65 transition focus:border-[#4A5BB0] focus:ring-2 focus:ring-[#4A5BB0]/10" />
      </Field>

      <div className="mt-3 flex items-center justify-end">
        <button type="button" className="text-sm font-semibold text-[#4A5BB0] transition hover:text-[#34418E]">Forgot password?</button>
      </div>

      <button disabled={isSubmitting} className="mt-8 w-full rounded-full bg-[#34418E] px-6 py-4 font-bold text-white shadow-lg shadow-[#34418E]/15 transition hover:-translate-y-0.5 hover:bg-[#293675] disabled:opacity-60">
        {isSubmitting ? "Signing in…" : "Sign in"}
      </button>

      <p className="mt-7 text-center text-sm text-[#6B7C8F]">
        Don’t have an account yet?{" "}
        <Link to="/signin?mode=create" className="font-bold text-[#B88910] transition hover:text-[#A67A08]">Create an account</Link>
      </p>
    </form>
  );
}

function RegisterForm() {
  const { register: registerUser } = useAuth();
  const afterAuth = useAfterAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", role: "donor", organization: "" },
  });
  const role = watch("role");

  async function onSubmit(values: RegisterFormValues) {
    setSubmitError(null);
    try {
      afterAuth(await registerUser(values));
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to create account");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[740px]">
      <div className="mb-5 flex items-center justify-between">
        <span className="text-sm font-bold tracking-[0.18em] text-[#34418E]">DAMAYAN</span>
        <Link to="/" className="grid size-10 place-items-center rounded-full bg-[#34418E]/5 text-[#34418E] transition hover:bg-[#34418E]/10" aria-label="Close create account">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-5"><path d="m18 6-12 12M6 6l12 12" /></svg>
        </Link>
      </div>

      <h1 className="text-4xl font-bold tracking-[-0.05em] text-[#34418E]">Join the giving community</h1>
      <p className="mt-2 text-sm leading-6 text-[#6B7C8F]">Create an account as a donor or apply to become a verified collector.</p>

      {submitError && (
        <div className="mt-6">
          <Notice tone="error">{submitError}</Notice>
        </div>
      )}

      <div className="mt-7">
        <p className="mb-3 text-sm font-semibold text-[#34418E]">I’m joining as</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[["donor", "Donor"], ["collector", "Collector"]].map(([value, label]) => (
            <label key={value} className={`cursor-pointer rounded-2xl border p-4 text-base font-semibold transition ${role === value ? "border-[#B88910] bg-[#FFF4D6] text-[#7A5A12] shadow-sm" : "border-[#34418E]/12 bg-white text-[#34418E] hover:border-[#34418E]/25"}`}>
              <input {...register("role")} type="radio" value={value} className="sr-only" />
              <span className="flex items-center justify-center gap-3">
                {value === "donor" ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-5"><path d="M12 21s-7.5-4.7-9.5-8.4C.9 10.3 2.9 5 7.2 5c2.2 0 3.2 1.2 4.8 3.2C13.6 6.2 14.6 5 16.8 5c4.3 0 6.3 5.3 4.7 7.6C19.5 16.3 12 21 12 21Z" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-5"><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="9.5" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                )}
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <Field label={role === "collector" ? "Authorized representative" : "Full name"} error={errors.name?.message}>
          <input {...register("name")} autoComplete="name" placeholder={role === "collector" ? "Representative’s full legal name" : "Your full name"} className="w-full rounded-2xl border border-[#34418E]/12 bg-white px-4 py-3.5 text-[#34418E] shadow-sm outline-none placeholder:text-[#6B7C8F]/65 transition focus:border-[#4A5BB0] focus:ring-2 focus:ring-[#4A5BB0]/10" />
        </Field>

        {role === "collector" && (
          <Field label="Organization name" error={errors.organization?.message}>
            <input {...register("organization")} placeholder="Your organization" className="w-full rounded-2xl border border-[#34418E]/12 bg-white px-4 py-3.5 text-[#34418E] shadow-sm outline-none placeholder:text-[#6B7C8F]/65 transition focus:border-[#4A5BB0] focus:ring-2 focus:ring-[#4A5BB0]/10" />
          </Field>
        )}

        <Field label="Email address" error={errors.email?.message}>
          <input {...register("email")} type="email" autoComplete="email" placeholder="you@example.com" className="w-full rounded-2xl border border-[#34418E]/12 bg-white px-4 py-3.5 text-[#34418E] shadow-sm outline-none placeholder:text-[#6B7C8F]/65 transition focus:border-[#4A5BB0] focus:ring-2 focus:ring-[#4A5BB0]/10" />
        </Field>

        <Field label="Password" error={errors.password?.message}>
          <input {...register("password")} type="password" autoComplete="new-password" placeholder="At least 8 characters" className="w-full rounded-2xl border border-[#34418E]/12 bg-white px-4 py-3.5 text-[#34418E] shadow-sm outline-none placeholder:text-[#6B7C8F]/65 transition focus:border-[#4A5BB0] focus:ring-2 focus:ring-[#4A5BB0]/10" />
        </Field>

        <Field label="Confirm password" error={errors.confirmPassword?.message}>
          <input {...register("confirmPassword")} type="password" autoComplete="new-password" placeholder="Re-enter your password" className="w-full rounded-2xl border border-[#34418E]/12 bg-white px-4 py-3.5 text-[#34418E] shadow-sm outline-none placeholder:text-[#6B7C8F]/65 transition focus:border-[#4A5BB0] focus:ring-2 focus:ring-[#4A5BB0]/10" />
        </Field>
      </div>

      <button disabled={isSubmitting} className="mt-8 w-full rounded-full bg-[#34418E] px-6 py-4 font-bold text-white shadow-lg shadow-[#34418E]/15 transition hover:-translate-y-0.5 hover:bg-[#293675] disabled:opacity-60">
        {isSubmitting ? "Creating account…" : role === "collector" ? "Submit for verification" : "Create my account"}
      </button>

      <p className="mt-7 text-center text-sm text-[#6B7C8F]">
        Already have an account?{" "}
        <Link to="/signin" className="font-bold text-[#B88910] transition hover:text-[#A67A08]">Sign in</Link>
      </p>
    </form>
  );
}

export function SignInPage() {
  const [params] = useSearchParams();
  const creating = params.get("mode") === "create";

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(242,201,76,0.20),_transparent_26%),linear-gradient(135deg,#F5F4EF_0%,#EEF2FF_100%)] px-4 py-8 text-[#34418E] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[920px]">
        <div className="rounded-[2rem] border border-[#34418E]/10 bg-[#F5F4EF]/90 p-4 shadow-[0_22px_70px_rgba(31,41,55,0.10)] backdrop-blur-xl sm:p-7">
          <div className="mx-auto max-w-[760px]">
            {creating ? <RegisterForm /> : <LoginForm />}
          </div>
        </div>
      </div>
    </main>
  );
}

export function NotFoundPage() {
  return (
    <main className="grid min-h-[70vh] place-items-center px-5 text-center text-[#34418E]">
      <div>
        <p className="font-serif text-8xl italic text-[#F2C94C]">404</p>
        <h1 className="mt-3 text-4xl font-bold">This page could not be found.</h1>
        <Link to="/" className="mt-7 inline-block rounded-lg bg-[#34418E] px-6 py-3 font-bold text-white transition hover:bg-[#293675]">Return to DAMAYAN</Link>
      </div>
    </main>
  );
}
