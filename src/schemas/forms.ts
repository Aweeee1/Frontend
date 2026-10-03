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
