import { z } from "zod";

export const formSchema = z.object({
  nodeType: z.string({
    required_error: "Please select node type",
  }),
  nodeTitle: z
    .string({
      required_error: "Node title is required",
    })
    .min(1, {
      message: "Node title is required",
    }),
  score: z.string().min(1, {
    message: "Score is required",
  }),
  contactType: z
    .array(z.string())
    .refine((value) => value?.some((item) => item), {
      message: "You have to select at least one contact type.",
    }),
  analytics: z.boolean().default(false).optional(),
  message: z
    .string({
      required_error: "Message is required",
    })
    .min(1, {
      message: "Message is required",
    })
    .max(234, {
      message: "Message must not be longer than 234 characters.",
    }),
});

export const newNodeFormSchema = z.object({
  nodeType: z.string({
    required_error: "Please select node type",
  }),
  nodeTitle: z.string().optional(),
});
