import { getHandle, getIcon, isSomething } from "@/utils/react-flow.utils";
import { Node } from "reactflow";
import { z } from "zod";

import {
  NODE_HANDLE_MAPPER_BY_TYPE,
  NODE_ICONS_TYPE_MAPPER,
} from "./days-flow-constants";

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

export const items = [
  {
    id: "sms",
    label: "SMS",
  },
  {
    id: "ivr",
    label: "IVR",
  },
  {
    id: "email",
    label: "Email",
  },
] as const;

export const getUpdatedNodes = (
  nodes: Node[],
  selectedAtomId: string | null,
  values: z.infer<typeof formSchema>
): Node[] => {
  return nodes.map((node) => {
    if (node.id === selectedAtomId) {
      const parsecurrentNodeData = JSON.parse(node.data);
      const parsedValues = {
        ...values,
        ...parsecurrentNodeData,
        nodeTitle: values?.nodeTitle,
        nodeDescription: values?.message,
        nodeType: values?.nodeType,
        contactType: values?.contactType,
        isConfigured: isSomething(values?.message?.length),
        nodeIcon: getIcon(
          values?.nodeType as keyof typeof NODE_ICONS_TYPE_MAPPER
        ),
        handle: getHandle(
          values?.nodeType as keyof typeof NODE_HANDLE_MAPPER_BY_TYPE
        ),
      };

      node.data = JSON.stringify(parsedValues);
    }

    return node;
  });
};

export const handleCheckboxChange = (
  checked: boolean | string,
  item: { id: string; label: string },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: any
) => {
  if (checked) {
    field.onChange([...field.value, item.id]);
  } else {
    field.onChange(field.value.filter((value: string) => value !== item.id));
  }
};
