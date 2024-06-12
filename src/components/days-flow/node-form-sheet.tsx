import { useMemo } from "react";
import {
  daysWorkflowDataAtom,
  nodeIdAtom,
  nodesConfigured,
  selectedDayAtom,
  workflowEdgesAtom,
} from "@/store/workflow-atoms";
import { ClipboardDocumentIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAtomValue, useSetAtom } from "jotai";
import { Edge, useNodes, useReactFlow } from "reactflow";
import {
  NODE_HANDLE_MAPPER_BY_TYPE,
  NODE_ICONS_TYPE_MAPPER,
  checkIfNodesConfigured,
  getHandle,
  getIcon,
  getParsedNodeData,
  isSomething,
} from "./days-flow-constants";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "./day-flow-form.utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import { v4 as uuidv4 } from "uuid";

const items = [
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

const NodeFormSheet = () => {
  const nodes = useNodes();
  const { setNodes, getNodes } = useReactFlow();

  const selectedAtomId = useAtomValue(nodeIdAtom);
  const setAtomId = useSetAtom(nodeIdAtom);
  const setDaysWorkflow = useSetAtom(daysWorkflowDataAtom);
  const daysWorkflow = useAtomValue(daysWorkflowDataAtom);
  const selectedWorkflowId = useAtomValue(selectedDayAtom);
  const setSelectedWorkflowId = useSetAtom(selectedDayAtom);
  const workflowEdges = useAtomValue(workflowEdgesAtom);
  const setNodesConfigured = useSetAtom(nodesConfigured);

  const selectedNode = useMemo(
    () => nodes?.find((node) => node?.id === selectedAtomId),
    [nodes, selectedAtomId]
  );

  const parsedData = useMemo(
    () => getParsedNodeData(selectedNode?.data),
    [selectedNode]
  );

  const isNodeConnected = useMemo(() => {
    if (typeof selectedAtomId === "string") {
      return workflowEdges?.some(
        (edge: Edge) =>
          edge.source === selectedAtomId || edge.target === selectedAtomId
      );
    }
  }, [workflowEdges, selectedAtomId]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nodeType: parsedData?.nodeType,
      nodeTitle: parsedData?.nodeTitle,
      score: parsedData.score || "",
      contactType: parsedData.contactType || [],
      message: parsedData.nodeDescription,
    },
  });

  const {
    handleSubmit,
    control,
    getValues,
    formState: { isValid },
  } = form;
  const { contactType } = getValues();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedAtomId) {
          const parsecurrentNodeData = JSON.parse(node.data);

          const parsedValues = {
            ...values,
            ...parsecurrentNodeData,
            nodeTitle: values?.nodeTitle,
            nodeDescription: values?.message,
            nodeType: values?.nodeType,
            isConfigured: values?.message?.length > 0,
            nodeIcon: getIcon(
              values?.nodeType as keyof typeof NODE_ICONS_TYPE_MAPPER
            ),
            handle: getHandle(
              values?.nodeType as keyof typeof NODE_HANDLE_MAPPER_BY_TYPE
            ),
          };

          const stringifyData = JSON.stringify(parsedValues);

          node.data = stringifyData;
        }

        return node;
      })
    );

    const nodes = getNodes();

    const getworkspace = daysWorkflow?.find(
      (workflow) => workflow?.day?.id === selectedWorkflowId
    );

    if (typeof getworkspace !== "undefined" && isSomething(getworkspace)) {
      getworkspace.day.workflow = nodes;
    } else {
      const newId = uuidv4();
      setSelectedWorkflowId(newId);
      const tosave = {
        day: {
          id: newId,
          dayValue: daysWorkflow?.length + 1,
          workflow: nodes,
        },
      };
      setDaysWorkflow([...daysWorkflow, tosave]);
    }

    const nodesConfigured = checkIfNodesConfigured(nodes);

    setNodesConfigured(nodesConfigured);
    setAtomId(null);
  };

  return (
    <div className="p-5 flex flex-col">
      <div className="flex flex-row justify-between items-center">
        <h4 className="text-base text-[#2A2D2E]">Node Configuration</h4>

        <XMarkIcon
          className="w-4 h-4 text-[#777777] cursor-pointer hover:text-red-600"
          onClick={() => setAtomId(null)}
        />
      </div>

      <div className="mt-10">
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              control={control}
              name="nodeType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-[#2A2D2E]">
                    Node Type
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isNodeConnected}
                  >
                    <FormControl>
                      <SelectTrigger className="border rounded-[4px] border-[#ccc]  focus:border-[2px] focus:border-[#00B2E3]">
                        <SelectValue
                          placeholder="Select a verified node type to display"
                          className="placeholder:text-[#BEBFC0]"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white rounded-[4px] p-0 m-0 w-full">
                      <SelectItem
                        value="initialNode"
                        className={`focus:bg-[#BEBFC0] focus:bg-opacity-30 text-[#2A2D2E] ${
                          field.value === "initialNode" &&
                          "bg-[#00B2E3] bg-opacity-20"
                        } w-full m-0 `}
                      >
                        Dialogue Start
                      </SelectItem>
                      <SelectItem
                        value="messagePatientNode"
                        className={`focus:bg-[#BEBFC0] focus:bg-opacity-30 text-[#2A2D2E] ${
                          field.value === "messagePatientNode" &&
                          "bg-[#00B2E3] bg-opacity-20"
                        } w-full m-0 `}
                      >
                        Message Patient
                      </SelectItem>
                      <SelectItem
                        value="questionnareNode"
                        className={`focus:bg-[#BEBFC0] focus:bg-opacity-30 text-[#2A2D2E] ${
                          field.value === "questionnareNode" &&
                          "bg-[#00B2E3] bg-opacity-20"
                        } w-full m-0 `}
                      >
                        Questionnaire
                      </SelectItem>
                      <SelectItem
                        value="liveChatNode"
                        className={`focus:bg-[#BEBFC0] focus:bg-opacity-30 text-[#2A2D2E] ${
                          field.value === "liveChatNode" &&
                          "bg-[#00B2E3] bg-opacity-20"
                        } w-full m-0 `}
                      >
                        Live Chat
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nodeTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-[#2A2D2E]">
                    Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Title"
                      {...field}
                      className="border rounded-[4px] border-[#ccc]  focus:border-[2px] focus:border-[#00B2E3] placeholder:text-[#BEBFC0]"
                    />
                  </FormControl>

                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-[#2A2D2E]">
                    Score
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter score"
                      {...field}
                      className="border rounded-[4px] border-[#ccc]  focus:border-[2px] focus:border-[#00B2E3] placeholder:text-[#BEBFC0]"
                      type="number"
                    />
                  </FormControl>

                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactType"
              render={() => (
                <FormItem>
                  <FormLabel className="text-sm text-[#2A2D2E]">
                    Contact Type
                  </FormLabel>
                  <div className="flex flex-row gap-3 justify-start items-center">
                    {items.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="contactType"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row justify-start items-center gap-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          item.id,
                                        ])
                                      : field.onChange(
                                          field?.value?.filter(
                                            (value: string) => value !== item.id
                                          )
                                        );
                                  }}
                                  className="data-[state=checked]:bg-[#00B2E3] data-[state=checked]:text-[white] border rounded-[4px] border-[#ccc]"
                                />
                              </FormControl>
                              <FormLabel className="text-sm text-[#2A2D2E]">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="analytics"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center  space-x-3 -space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-[#00B2E3] data-[state=checked]:text-[white] border rounded-[4px] border-[#ccc]"
                    />
                  </FormControl>

                  <FormLabel className="text-sm text-[#2A2D2E]">
                    Include in Analytics
                  </FormLabel>
                </FormItem>
              )}
            />

            {contactType?.length > 0 && (
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <div className="border border-[#ccc] rounded-[5px]">
                      <FormControl>
                        <Textarea
                          placeholder="Type Message"
                          className="resize-none border-transparent h-[184px] placeholder:text-[#BEBFC0]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="py-1 bg-[#FAFAFA] h-[44px]">
                        <div className="flex flex-row justify-between items-center h-[44px]">
                          <span className="inline-block px-3 text-[#BEBFC0]">
                            Max 234 chars
                          </span>

                          <ClipboardDocumentIcon className="h-3 w-3 text-[#BEBFC0] mr-3 cursor-pointer" />
                        </div>
                      </FormDescription>
                    </div>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
            )}

            <div className="flex flex-row justify-start items-center gap-2">
              <Button
                type="submit"
                variant="secondary"
                className="text-white bg-[#00B2E3]  rounded-[5px] hover:bg-[#00B2E3] hover:opacity-70"
                disabled={!isValid}
              >
                Save
              </Button>
              <Button
                type="button"
                variant="outline"
                className="text-[#00B2E3] bg-white border border-[#00B2E3] rounded-[5px] hover:text-[#00B2E3] hover:opacity-70"
                onClick={() => setAtomId(null)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default NodeFormSheet;
