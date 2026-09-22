import { z } from "zod";
export const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(100),
  email: z.email("Please enter a valid email address.").max(254),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d ()-]{10,20}$/, "Please enter a valid phone number.")
    .refine(
      (s) =>
        s.replace(/\D/g, "").length >= 10 && s.replace(/\D/g, "").length <= 15,
      "Use 10–15 digits.",
    ),
  course: z.enum(["salesforce", "mern-stack", "ui-ux", "python", "not-sure"]),
  profileType: z.enum([
    "student",
    "graduate",
    "professional",
    "switcher",
    "other",
  ]),
  preferredTime: z.enum(["morning", "evening", "weekend", "flexibleTime"]),
  message: z.string().trim().max(3000),
  consent: z.boolean().refine((v) => v, "Please consent before submitting."),
  website: z.string().max(0, "Unable to submit this form.").default(""),
  source: z.string().max(80),
});
export type Lead = z.infer<typeof leadSchema>;
export const chatSchema = z.object({
  message: z.string().trim().min(1).max(1500),
  language: z.enum(["en", "ta", "hi", "ml", "kn"]).default("en"),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(4000),
      }),
    )
    .max(12)
    .default([]),
});
