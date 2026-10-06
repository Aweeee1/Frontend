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
    <label className="mt-5 block">
      <span className="mb-2 block text-sm font-bold">{label}</span>
      {children}
      {error && <span className="mt-1 block text-sm text-red-700">{error}</span>}
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
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md bg-white p-7 shadow-sm sm:p-10">
      <p className="text-xs font-bold uppercase tracking-wider text-[#B88910]">Secure access</p>
      <h1 className="mt-3 text-3xl font-bold">Welcome back</h1>
      {submitError && <div className="mt-5"><Notice tone="error">{submitError}</Notice></div>}
      <Field label="Email address" error={errors.email?.message}>
        <input {...register("email")} type="email" autoComplete="email" className="field" />
      </Field>
      <Field label="Password" error={errors.password?.message}>
        <input {...register("password")} type="password" autoComplete="current-password" className="field" />
      </Field>
      <button disabled={isSubmitting} className="mt-6 w-full rounded-full bg-[#34418E] px-6 py-4 font-bold text-white disabled:opacity-60">
        {isSubmitting ? "Signing in…" : "Sign in"}
      </button>
      <p className="mt-6 text-center text-sm text-[#6B7C8F]">
        Don’t have an account yet?{" "}
        <Link to="/signin?mode=create" className="font-bold text-[#B88910]">Create an account</Link>
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
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md bg-white p-7 shadow-sm sm:p-10">
      <p className="text-xs font-bold uppercase tracking-wider text-[#B88910]">Join DAMAYAN</p>
      <h1 className="mt-3 text-3xl font-bold">Create your account</h1>
      {submitError && <div className="mt-5"><Notice tone="error">{submitError}</Notice></div>}

      <div className="mt-6 grid grid-cols-2 gap-2">
        {[["donor", "I want to donate"], ["collector", "I run drives"]].map(([value, label]) => (
          <label key={value} className={`cursor-pointer border p-3 text-center text-sm font-bold ${role === value ? "border-[#34418E] bg-[#ECEEF7]" : "border-[#34418E]/15"}`}>
            <input {...register("role")} type="radio" value={value} className="sr-only" />
            {label}
          </label>
        ))}
      </div>

      <Field label="Full name" error={errors.name?.message}>
        <input {...register("name")} autoComplete="name" className="field" />
      </Field>
      {role === "collector" && (
        <Field label="Organization name" error={errors.organization?.message}>
          <input {...register("organization")} className="field" />
        </Field>
      )}
      <Field label="Email address" error={errors.email?.message}>
        <input {...register("email")} type="email" autoComplete="email" className="field" />
      </Field>
      <Field label="Password" error={errors.password?.message}>
        <input {...register("password")} type="password" autoComplete="new-password" className="field" />
      </Field>
      <Field label="Confirm password" error={errors.confirmPassword?.message}>
        <input {...register("confirmPassword")} type="password" autoComplete="new-password" className="field" />
      </Field>

      <button disabled={isSubmitting} className="mt-6 w-full rounded-full bg-[#34418E] px-6 py-4 font-bold text-white disabled:opacity-60">
        {isSubmitting ? "Creating account…" : "Create account"}
      </button>
      <p className="mt-6 text-center text-sm text-[#6B7C8F]">
        Already have an account?{" "}
        <Link to="/signin" className="font-bold text-[#B88910]">Sign in</Link>
      </p>
    </form>
  );
}

export function SignInPage() {
  const [params] = useSearchParams();
  const creating = params.get("mode") === "create";

  return (
    <main className="grid min-h-[calc(100vh-7rem)] lg:grid-cols-2">
      <section className="hidden bg-[#34418E] p-16 text-white lg:flex lg:flex-col lg:justify-between">
        <span className="font-bold tracking-[.18em] text-[#F2C94C]">DAMAYAN</span>
        <div>
          <p className="font-serif text-6xl italic text-[#F2C94C]">Give with proof.</p>
          <p className="mt-4 max-w-md text-white/60">One accountable website for donors and verified organizations.</p>
        </div>
      </section>
      <section className="grid place-items-center p-5">
        {creating ? <RegisterForm /> : <LoginForm />}
      </section>
    </main>
  );
}

export function NotFoundPage() {
  return (
    <main className="grid min-h-[70vh] place-items-center px-5 text-center">
      <div>
        <p className="font-serif text-8xl italic text-[#F2C94C]">404</p>
        <h1 className="mt-3 text-4xl font-bold">This page could not be found.</h1>
        <Link to="/" className="mt-7 inline-block rounded-full bg-[#34418E] px-6 py-3 font-bold text-white">Return to DAMAYAN</Link>
      </div>
    </main>
  );
}
