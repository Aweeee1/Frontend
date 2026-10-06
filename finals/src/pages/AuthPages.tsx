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
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
      <div className="mb-2">
        <p className="text-xs font-bold uppercase tracking-wider text-[#B88910]">Secure access</p>
      </div>
      <h1 className="text-4xl font-bold text-[#34418E] leading-tight">Welcome back</h1>
      <p className="mt-2 text-sm text-[#6B7C8F]">Sign in to your account and track your donations</p>
      {submitError && <div className="mt-6"><Notice tone="error">{submitError}</Notice></div>}
      <Field label="Email address" error={errors.email?.message}>
        <input {...register("email")} type="email" autoComplete="email" placeholder="you@example.com" className="w-full rounded-lg border border-[#34418E]/15 bg-white px-4 py-3 text-[#34418E] placeholder-[#6B7C8F]/50 transition focus:border-[#34418E]/40 focus:bg-white focus:ring-1 focus:ring-[#34418E]/20" />
      </Field>
      <Field label="Password" error={errors.password?.message}>
        <input {...register("password")} type="password" autoComplete="current-password" placeholder="Enter your password" className="w-full rounded-lg border border-[#34418E]/15 bg-white px-4 py-3 text-[#34418E] placeholder-[#6B7C8F]/50 transition focus:border-[#34418E]/40 focus:bg-white focus:ring-1 focus:ring-[#34418E]/20" />
      </Field>
      <button disabled={isSubmitting} className="mt-8 w-full rounded-lg bg-[#34418E] px-6 py-3.5 font-bold text-white shadow-sm transition hover:bg-[#293675] active:shadow-inner disabled:opacity-60">
        {isSubmitting ? "Signing in…" : "Sign in"}
      </button>
      <p className="mt-7 text-center text-sm text-[#6B7C8F]">
        Don't have an account yet?{" "}
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
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
      <div className="mb-2">
        <p className="text-xs font-bold uppercase tracking-wider text-[#B88910]">Join DAMAYAN</p>
      </div>
      <h1 className="text-4xl font-bold text-[#34418E] leading-tight">Create your account</h1>
      <p className="mt-2 text-sm text-[#6B7C8F]">Join our community of donors and organizations doing good</p>
      {submitError && <div className="mt-6"><Notice tone="error">{submitError}</Notice></div>}

      <div className="mt-8 grid grid-cols-2 gap-3">
        {[["donor", "I want to donate"], ["collector", "I run drives"]].map(([value, label]) => (
          <label key={value} className={`cursor-pointer rounded-lg border-2 p-4 text-center text-sm font-bold transition ${role === value ? "border-[#34418E] bg-[#ECEEF7] text-[#34418E]" : "border-[#34418E]/15 text-[#6B7C8F] hover:border-[#34418E]/30"}`}>
            <input {...register("role")} type="radio" value={value} className="sr-only" />
            {label}
          </label>
        ))}
      </div>

      <Field label="Full name" error={errors.name?.message}>
        <input {...register("name")} autoComplete="name" placeholder="John Doe" className="w-full rounded-lg border border-[#34418E]/15 bg-white px-4 py-3 text-[#34418E] placeholder-[#6B7C8F]/50 transition focus:border-[#34418E]/40 focus:bg-white focus:ring-1 focus:ring-[#34418E]/20" />
      </Field>
      {role === "collector" && (
        <Field label="Organization name" error={errors.organization?.message}>
          <input {...register("organization")} placeholder="Your organization" className="w-full rounded-lg border border-[#34418E]/15 bg-white px-4 py-3 text-[#34418E] placeholder-[#6B7C8F]/50 transition focus:border-[#34418E]/40 focus:bg-white focus:ring-1 focus:ring-[#34418E]/20" />
        </Field>
      )}
      <Field label="Email address" error={errors.email?.message}>
        <input {...register("email")} type="email" autoComplete="email" placeholder="you@example.com" className="w-full rounded-lg border border-[#34418E]/15 bg-white px-4 py-3 text-[#34418E] placeholder-[#6B7C8F]/50 transition focus:border-[#34418E]/40 focus:bg-white focus:ring-1 focus:ring-[#34418E]/20" />
      </Field>
      <Field label="Password" error={errors.password?.message}>
        <input {...register("password")} type="password" autoComplete="new-password" placeholder="At least 8 characters" className="w-full rounded-lg border border-[#34418E]/15 bg-white px-4 py-3 text-[#34418E] placeholder-[#6B7C8F]/50 transition focus:border-[#34418E]/40 focus:bg-white focus:ring-1 focus:ring-[#34418E]/20" />
      </Field>
      <Field label="Confirm password" error={errors.confirmPassword?.message}>
        <input {...register("confirmPassword")} type="password" autoComplete="new-password" placeholder="Re-enter your password" className="w-full rounded-lg border border-[#34418E]/15 bg-white px-4 py-3 text-[#34418E] placeholder-[#6B7C8F]/50 transition focus:border-[#34418E]/40 focus:bg-white focus:ring-1 focus:ring-[#34418E]/20" />
      </Field>

      <button disabled={isSubmitting} className="mt-8 w-full rounded-lg bg-[#34418E] px-6 py-3.5 font-bold text-white shadow-sm transition hover:bg-[#293675] active:shadow-inner disabled:opacity-60">
        {isSubmitting ? "Creating account…" : "Create account"}
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
    <main className="grid min-h-screen bg-[#F5F4EF] text-[#34418E] lg:grid-cols-2">
      <section className="hidden bg-gradient-to-b from-[#34418E] to-[#293675] p-16 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <span className="font-bold tracking-[.18em] text-[#F2C94C] text-lg">DAMAYAN</span>
        </div>
        <div>
          <p className="font-serif text-6xl italic text-[#F2C94C] leading-tight">Give with proof.</p>
          <p className="mt-6 max-w-md text-white/70 text-base leading-relaxed">One accountable website for donors and verified organizations.</p>
        </div>
        <div className="space-y-2 text-xs text-white/50">
          <p>✓ Track your donations</p>
          <p>✓ Verified organizations</p>
          <p>✓ Transparent giving</p>
        </div>
      </section>
      <section className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
        {creating ? <RegisterForm /> : <LoginForm />}
      </section>
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
