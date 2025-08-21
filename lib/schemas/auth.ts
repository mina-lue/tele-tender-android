import { z } from "zod";

const baseSignupSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const vendorSignupSchema = baseSignupSchema.extend({
  role: z.literal("VENDOR"),
  name: z.string().min(1, { message: "Name is required" }),
  sex: z.enum(["male", "female", "other"], {
    message: "Please select sex",
}),
  phone: z.string().min(5, { message: "Phone is required" }),
});

export const buyerSignupSchema = baseSignupSchema.extend({
  role: z.literal("BUYER"),
  name: z.string().min(1, { message: "Company/Person name required" }),
//  urlToDoc: z.string().min(5, { message: "document is required" }),
  phone: z.string().min(5, { message: "Phone is required" }),
});

export type VendorSignup = z.infer<typeof vendorSignupSchema>;
export type BuyerSignup = z.infer<typeof buyerSignupSchema>;

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type Signin = z.infer<typeof signinSchema>;