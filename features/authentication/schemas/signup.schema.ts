import { z } from "zod";

export const signupSchema = z.object({
  agencyName: z.string().min(1, "Agency name is required").max(64),
  agencyType: z.string().min(1, "Select an agency type"),
  email: z.email("Enter a valid email address"),
  countryCode: z.string().min(1),
  phone: z
    .string()
    .min(7, "Phone number is required")
    .regex(/^[\d\s]+$/, "Enter a valid phone number"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[A-Z])(?=.*\d)/, "Include at least one uppercase letter and one number"),
  acceptTerms: z.boolean().refine((value) => value, {
    message: "You must agree to the terms and privacy",
  }),
});

export type SignupFormValues = z.infer<typeof signupSchema>;
