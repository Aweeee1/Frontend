import { z } from "zod";

export const donationSchema = z.object({
  driveId: z.string().min(1, "Select a donation drive"),
  type: z.string().min(1, "Select a donation type"),
  quantity: z.number().positive("Quantity must be greater than zero"),
  method: z.enum(["pickup", "dropoff", "center"]),
  details: z.string().min(10, "Provide at least 10 characters"),
  contactNumber: z.string().regex(/^(\+63|0)9\d{9}$/, "Enter a valid Philippine mobile number"),
});

export type DonationFormValues = z.infer<typeof donationSchema>;

export const driveSchema = z.object({
  title: z.string().min(8, "Title must have at least 8 characters"),
  category: z.string().min(1, "Select a category"),
  goal: z.number().positive("Goal must be greater than zero"),
  deadline: z.string().min(1, "Select a deadline"),
  description: z.string().min(30, "Description must have at least 30 characters"),
  urgent: z.boolean(),
});

export type DriveFormValues = z.infer<typeof driveSchema>;

export const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(8, "Password must have at least 8 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// Password strength rules (used by the sign-up schema and the live checklist)
export const passwordRules = [
  { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  { label: "One lowercase letter (a–z)", test: (v: string) => /[a-z]/.test(v) },
  { label: "One uppercase letter (A–Z)", test: (v: string) => /[A-Z]/.test(v) },
  { label: "One number (0–9)", test: (v: string) => /\d/.test(v) },
  { label: "One symbol (e.g. ! @ # $ %)", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

export const strongPassword = z
  .string()
  .min(1, "Create a password")
  .refine((v) => passwordRules.every((rule) => rule.test(v)), "Password doesn’t meet all the requirements below");

export const registerSchema = z
  .object({
    name: z.string().min(2, "Enter your full name"),
    email: z.email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must have at least 8 characters")
      .regex(/[a-z]/, "Include at least one lowercase letter (a-z)")
      .regex(/[A-Z]/, "Include at least one uppercase letter (A-Z)")
      .regex(/[0-9]/, "Include at least one number (0-9)")
      .regex(/[^A-Za-z0-9\s]/, "Include at least one symbol (e.g. ! @ # $ %)"),
    confirmPassword: z.string().min(1, "Confirm your password"),
    role: z.enum(["donor", "collector"]),
    // Collector (organization) fields
    organization: z.string(),
    orgType: z.string(),
    position: z.string(),
    registrationNumber: z.string(),
    phone: z.string(),
    address: z.string(),
    website: z.string(),
    documents: z.any().optional(),
    agree: z.boolean().refine((v) => v, "You must accept this to continue"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({ code: "custom", message: "Passwords do not match", path: ["confirmPassword"] });
    }
    if (data.role !== "collector") return;
    const need = (key: keyof typeof data, min: number, message: string) => {
      if (String(data[key] ?? "").trim().length < min) ctx.addIssue({ code: "custom", message, path: [key] });
    };
    need("orgType", 1, "Select an organization type");
    need("position", 2, "Enter your position");
    need("organization", 2, "Enter your legal organization name");
    need("registrationNumber", 3, "Enter your registration number");
    need("address", 5, "Enter your registered address");
    if (!/^(\+63|0)9\d{9}$/.test(data.phone.replace(/\s+/g, ""))) {
      ctx.addIssue({ code: "custom", message: "Enter a valid Philippine mobile number", path: ["phone"] });
    }
    if (!/^https?:\/\/.+\..+/.test(data.website.trim())) {
      ctx.addIssue({ code: "custom", message: "Enter a valid website or profile link (https://…)", path: ["website"] });
    }
    const files = data.documents as FileList | undefined;
    if (!files || files.length === 0) {
      ctx.addIssue({ code: "custom", message: "Upload your verification documents", path: ["documents"] });
    }
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
