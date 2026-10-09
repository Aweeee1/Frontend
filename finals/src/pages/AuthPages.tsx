
import { useState, type ReactNode } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth, type User } from "@/auth/AuthContext";
import { Notice } from "@/components/PagePrimitives";
import {
  loginSchema,
  registerSchema,
  passwordRules,
  type LoginFormValues,
  type RegisterFormValues,
} from "@/schemas/forms";

// Same input styling as the landing-page popup
const inputClass =
  "w-full appearance-none rounded-2xl border border-[#34418E]/12 bg-white px-4 py-3.5 text-[#34418E] outline-none placeholder:text-[#6B7C8F]/60 focus:border-[#4A5BB0]";

// Reusable form field
function Field({
  label,
  error,
  aside,
  children,
}: {
  label: string;
  error?: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between text-sm font-semibold">
        {label}
        {aside}
      </span>

      {children}

      {error && (
        <span className="mt-2 block text-sm font-medium text-red-600">
          {error}
        </span>
      )}
    </label>
  );
}

// Icons used throughout the authentication pages
function Icon({
  name,
  className = "size-5",
}: {
  name: "close" | "heart" | "users" | "shield" | "upload";
  className?: string;
}) {
  const paths: Record<string, ReactNode> = {
    close: <path d="m18 6-12 12M6 6l12 12" />,

    heart: (
      <path d="M12 21s-7.5-4.7-9.5-8.4C.9 10.3 2.9 5 7.2 5c2.2 0 3.2 1.2 4.8 3.2C13.6 6.2 14.6 5 16.8 5c4.3 0 6.3 5.3 4.7 7.6C19.5 16.3 12 21 12 21Z" />
    ),

    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
        <circle cx="9.5" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),

    shield: (
      <path d="M12 3 4 6v6c0 4.5 3.2 8.2 8 9 4.8-.8 8-4.5 8-9V6l-8-3Zm-3 9 2 2 4-4" />
    ),

    upload: (
      <path d="M12 16V4m0 0L7 9m5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

// Reusable eye / eye-off button for password fields
function PasswordVisibilityButton({
  visible,
  onClick,
}: {
  visible: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute inset-y-0 right-4 flex items-center justify-center text-[#4A5BB0] transition hover:text-[#293675]"
      aria-label={visible ? "Hide password" : "Show password"}
      aria-pressed={visible}
    >
      {visible ? (
        // Eye-off symbol
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5"
          aria-hidden="true"
        >
          <path d="M3 3l18 18" />
          <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
          <path d="M9.9 5.2A11 11 0 0 1 12 5c5.5 0 9 7 9 7a13.2 13.2 0 0 1-3 3.8" />
          <path d="M6.6 6.6C4.1 8.2 3 12 3 12s3.5 7 9 7a10 10 0 0 0 3-.5" />
        </svg>
      ) : (
        // Eye symbol
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5"
          aria-hidden="true"
        >
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  );
}

// Full-page shell: branded side panel + form area
type Panel = {
  eyebrow: string;
  heading: string;
  text: string;
  points: string[];
};

function AuthCard({
  title,
  description,
  closeLabel,
  panel,
  children,
}: {
  title: string;
  description: string;
  closeLabel: string;
  panel: Panel;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#F5F4EF] text-[#34418E] lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <aside className="relative hidden overflow-hidden bg-[#34418E] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-[#F2C94C]/15" />

        <div className="pointer-events-none absolute -bottom-32 -left-20 size-96 rounded-full bg-white/5" />

        <Link
          to="/"
          className="relative text-xl font-bold tracking-[0.2em]"
        >
          DAMAYAN
        </Link>

        <div className="relative">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#F2C94C]">
            {panel.eyebrow}
          </span>

          <h2 className="mt-6 max-w-md text-5xl font-bold leading-[1.05] tracking-[-0.04em]">
            {panel.heading}
          </h2>

          <p className="mt-6 max-w-md leading-7 text-white/65">
            {panel.text}
          </p>

          <ul className="mt-10 space-y-4">
            {panel.points.map((point) => (
              <li
                key={point}
                className="flex items-center gap-3 text-sm font-medium text-white/85"
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#F2C94C] text-[#34418E]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-3.5"
                    aria-hidden="true"
                  >
                    <path d="m5 12 5 5 9-10" />
                  </svg>
                </span>

                {point}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/45">
          Verified collectors. Transparent giving.
        </p>
      </aside>

      <section className="flex min-h-screen flex-col px-5 py-6 sm:px-10 lg:px-16 lg:py-10">
        <div className="mx-auto flex w-full max-w-xl items-center justify-between">
          <span className="text-sm font-bold tracking-[0.16em] lg:invisible">
            DAMAYAN
          </span>

          <Link
            to="/"
            aria-label={closeLabel}
            className="grid size-10 shrink-0 place-items-center rounded-full bg-[#34418E]/5 text-[#34418E] transition hover:bg-[#34418E]/10"
          >
            <Icon name="close" />
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center py-8">
          <h1 className="text-4xl font-bold tracking-[-0.04em] text-[#34418E]">
            {title}
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#6B7C8F]">
            {description}
          </p>

          {children}
        </div>
      </section>
    </main>
  );
}

const signInPanel: Panel = {
  eyebrow: "Welcome back",
  heading: "Pick up where your giving left off.",
  text: "Follow your donations from pledge to delivery and see the proof of impact.",
  points: [
    "Track every donation in real time",
    "See receipts and delivery photos",
    "Manage drives if you’re a collector",
  ],
};

const signUpPanel: Panel = {
  eyebrow: "Join DAMAYAN",
  heading: "Give with confidence. Collect with accountability.",
  text: "Donors give to verified drives. Organizations create drives, review pledges, and publish proof of impact.",
  points: [
    "Donors can start giving in minutes",
    "Collectors are verified before activation",
    "Every donation is reviewed and tracked",
  ],
};

// Where to send the user after signing in
function useAfterAuth() {
  const navigate = useNavigate();
  const location = useLocation();

  return (user: User) =>
    navigate(
      location.state?.from ??
        (user.role === "admin"
          ? "/admin"
          : user.role === "collector"
            ? "/collector"
            : "/drives"),
      { replace: true }
    );
}

// ==============================
// SIGN IN PAGE
// ==============================

export function SignInPage() {
  const { login } = useAuth();
  const afterAuth = useAfterAuth();

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setSubmitError(null);

    try {
      afterAuth(await login(values));
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Unable to sign in"
      );
    }
  }

  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to follow your donations and impact."
      closeLabel="Close sign in"
      panel={signInPanel}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-7 space-y-4"
        noValidate
      >
        {submitError && <Notice tone="error">{submitError}</Notice>}

        <Field label="Email address" error={errors.email?.message}>
          <input
            {...register("email")}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={inputClass}
          />
        </Field>

        <Field label="Password" error={errors.password?.message}>
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              className={`${inputClass} pr-12`}
            />

            <PasswordVisibilityButton
              visible={showPassword}
              onClick={() => setShowPassword((prev) => !prev)}
            />
          </div>
        </Field>

        <div className="-mt-1 text-right">
          <Link
            to="/forgot-password"
            className="text-sm font-semibold text-[#4A5BB0] transition hover:text-[#293675]"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-[#34418E] px-6 py-4 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#293675] disabled:opacity-60"
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#6B7C8F]">
        Don’t have an account yet?{" "}
        <Link to="/signup" className="font-bold text-[#B88910]">
          Create an account
        </Link>
      </p>
    </AuthCard>
  );
}

// ==============================
// SIGN UP PAGE
// ==============================

export function SignUpPage() {
  const { register: registerUser } = useAuth();
  const afterAuth = useAfterAuth();
  const [params] = useSearchParams();

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: params.get("role") === "collector" ? "collector" : "donor",
      organization: "",
      orgType: "",
      position: "",
      registrationNumber: "",
      phone: "",
      address: "",
      website: "",
      agree: false,
    },
  });

  const role = watch("role");
  const isCollector = role === "collector";
  const passwordValue = watch("password") ?? "";
  const fileCount =
    (watch("documents") as FileList | undefined)?.length ?? 0;

  async function onSubmit(values: RegisterFormValues) {
    setSubmitError(null);

    // Files can't travel in the JSON body; send everything else.
    const {
      documents: _documents,
      agree: _agree,
      confirmPassword: _confirm,
      ...payload
    } = values;

    try {
      afterAuth(
        await registerUser({
          ...payload,
          confirmPassword: values.confirmPassword,
        } as RegisterFormValues)
      );
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Unable to create account"
      );
    }
  }

  return (
    <AuthCard
      title="Join the giving community"
      description="Create an account as a donor or apply to become a verified collector."
      closeLabel="Close create account"
      panel={signUpPanel}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-7 space-y-4"
        noValidate
      >
        {submitError && <Notice tone="error">{submitError}</Notice>}

        <fieldset>
          <legend className="mb-2 text-sm font-semibold">
            I’m joining as
          </legend>

          <div className="grid grid-cols-2 gap-2">
            {(
              [
                ["donor", "Donor", "heart"],
                ["collector", "Collector", "users"],
              ] as const
            ).map(([value, label, icon]) => (
              <label key={value} className="cursor-pointer">
                <input
                  {...register("role")}
                  type="radio"
                  value={value}
                  className="peer sr-only"
                />

                <span className="flex items-center gap-3 rounded-2xl border border-[#34418E]/10 bg-white p-4 text-sm font-semibold transition peer-checked:border-[#B88910] peer-checked:bg-[#FFF4D6] peer-checked:text-[#7A5A12]">
                  <Icon name={icon} />
                  {label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <Field
          label={isCollector ? "Authorized representative" : "Full name"}
          error={errors.name?.message}
        >
          <input
            {...register("name")}
            autoComplete="name"
            placeholder={
              isCollector
                ? "Representative’s full legal name"
                : "e.g. Juan Dela Cruz"
            }
            className={inputClass}
          />
        </Field>

        {isCollector && (
          <>
            <div className="flex gap-3 rounded-2xl border border-[#D6A72E]/30 bg-[#FFF7E4] p-4 text-sm leading-5 text-[#67500E]">
              <Icon name="shield" className="mt-0.5 size-5 shrink-0" />

              <p>
                <span className="font-bold">Verification required.</span>{" "}
                Collector accounts can receive and manage donations, so access
                is only activated after organization and identity review.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Organization type"
                error={errors.orgType?.message}
              >
                <select {...register("orgType")} className={inputClass}>
                  <option value="" disabled>
                    Select type
                  </option>
                  <option>Registered nonprofit</option>
                  <option>Charity or foundation</option>
                  <option>Company or business</option>
                  <option>Community organization</option>
                  <option>Government agency or LGU</option>
                  <option>Individual collector</option>
                </select>
              </Field>

              <Field label="Your position" error={errors.position?.message}>
                <input
                  {...register("position")}
                  placeholder="Director, officer, coordinator"
                  className={inputClass}
                />
              </Field>
            </div>

            <Field
              label="Legal organization name"
              error={errors.organization?.message}
            >
              <input
                {...register("organization")}
                placeholder="Name shown on registration documents"
                className={inputClass}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Registration number"
                error={errors.registrationNumber?.message}
              >
                <input
                  {...register("registrationNumber")}
                  placeholder="SEC, DTI, CDA, or BIR number"
                  className={inputClass}
                />
              </Field>

              <Field label="Phone number" error={errors.phone?.message}>
                <input
                  {...register("phone")}
                  type="tel"
                  autoComplete="tel"
                  placeholder="+63 9XX XXX XXXX"
                  className={inputClass}
                />
              </Field>
            </div>

            <Field
              label="Registered address"
              error={errors.address?.message}
            >
              <input
                {...register("address")}
                autoComplete="street-address"
                placeholder="Full legal business address"
                className={inputClass}
              />
            </Field>

            <Field
              label="Organization website or public profile"
              error={errors.website?.message}
            >
              <input
                {...register("website")}
                type="url"
                placeholder="https://"
                className={inputClass}
              />
            </Field>

            <div>
              <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-[#34418E]/20 bg-white p-4 transition hover:border-[#4A5BB0]">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#EEF0F5] text-[#4A5BB0]">
                  <Icon name="upload" />
                </span>

                <span>
                  <span className="block text-sm font-semibold">
                    {fileCount
                      ? `${fileCount} file${fileCount > 1 ? "s" : ""} selected`
                      : "Upload verification documents"}
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-[#6B7C8F]">
                    Registration certificate, representative ID, and proof of
                    address. PDF, JPG, or PNG.
                  </span>
                </span>

                <input
                  {...register("documents")}
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  className="sr-only"
                />
              </label>

              {errors.documents?.message && (
                <span className="mt-2 block text-sm font-medium text-red-600">
                  {String(errors.documents.message)}
                </span>
              )}
            </div>
          </>
        )}

        <Field label="Email address" error={errors.email?.message}>
          <input
            {...register("email")}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={inputClass}
          />
        </Field>

        <Field label="Password" error={errors.password?.message}>
          <div className="relative">
            <input
              {...register("password")}
              type={showSignupPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a strong password"
              className={`${inputClass} pr-12`}
            />

            <PasswordVisibilityButton
              visible={showSignupPassword}
              onClick={() =>
                setShowSignupPassword((prev) => !prev)
              }
            />
          </div>
        </Field>

        <ul
          className="grid gap-x-4 gap-y-1.5 rounded-2xl bg-white/60 p-4 sm:grid-cols-2"
          aria-label="Password requirements"
        >
          {passwordRules.map((rule) => {
            const ok = rule.test(passwordValue);

            return (
              <li
                key={rule.label}
                className={`flex items-center gap-2 text-xs font-medium transition ${
                  ok ? "text-green-700" : "text-[#6B7C8F]"
                }`}
              >
                <span
                  className={`grid size-4 shrink-0 place-items-center rounded-full ${
                    ok
                      ? "bg-green-600 text-white"
                      : "border border-[#34418E]/25"
                  }`}
                >
                  {ok && (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-2.5"
                      aria-hidden="true"
                    >
                      <path d="m5 12 5 5 9-10" />
                    </svg>
                  )}
                </span>

                {rule.label}
              </li>
            );
          })}
        </ul>

        <Field
          label="Confirm password"
          error={errors.confirmPassword?.message}
        >
          <div className="relative">
            <input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              className={`${inputClass} pr-12`}
            />

            <PasswordVisibilityButton
              visible={showConfirmPassword}
              onClick={() =>
                setShowConfirmPassword((prev) => !prev)
              }
            />
          </div>
        </Field>

        <div>
          <label className="flex gap-3 pt-1 text-xs leading-5 text-[#52677A]">
            <input
              {...register("agree")}
              type="checkbox"
              className="mt-0.5 size-4 shrink-0 accent-[#4A5BB0]"
            />

            {isCollector
              ? "I certify that I am authorized to represent this organization and that all submitted information is complete and accurate. I consent to identity and organization verification."
              : "I agree to DAMAYAN’s Terms of Use and Privacy Policy."}
          </label>

          {errors.agree?.message && (
            <span className="mt-2 block text-sm font-medium text-red-600">
              {errors.agree.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-[#34418E] px-6 py-4 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#293675] disabled:opacity-60"
        >
          {isSubmitting
            ? "Creating account…"
            : isCollector
              ? "Submit for verification"
              : "Create my account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#6B7C8F]">
        Already have an account?{" "}
        <Link to="/signin" className="font-bold text-[#B88910]">
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}

// ==============================
// NOT FOUND PAGE
// ==============================

export function NotFoundPage() {
  return (
    <main className="grid min-h-[70vh] place-items-center px-5 text-center text-[#34418E]">
      <div>
        <p className="font-serif text-8xl italic text-[#F2C94C]">
          404
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          This page could not be found.
        </h1>

        <Link
          to="/"
          className="mt-7 inline-block rounded-lg bg-[#34418E] px-6 py-3 font-bold text-white transition hover:bg-[#293675]"
        >
          Return to DAMAYAN
        </Link>
      </div>
    </main>
  );
}

