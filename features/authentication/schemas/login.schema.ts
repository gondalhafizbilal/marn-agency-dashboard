import { z } from "zod";

export const loginSchema = z.object({
  countryCode: z.string().min(1),
  phone: z
    .string()
    .min(7, "Phone number is required")
    .regex(/^[\d\s]+$/, "Enter a valid phone number"),
  email: z.email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
