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

export const registerSchema = z
  .object({
    name: z.string().min(2, "Enter your full name"),
    email: z.email("Enter a valid email address"),
    password: z.string().min(8, "Password must have at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
    role: z.enum(["donor", "collector"]),
    organization: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.role !== "collector" || data.organization.trim().length >= 2, {
    message: "Enter your organization name",
    path: ["organization"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
