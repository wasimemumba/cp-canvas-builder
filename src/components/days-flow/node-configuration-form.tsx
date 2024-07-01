import { useMemo } from "react";
import {
  daysWorkflowDataAtom,
  nodeIdAtom,
  nodesConfigured,
  selectedDayAtom,
  undoAtom,
  workflowEdgesAtom,
} from "@/store/workflow-atoms";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Edge, useNodes, useReactFlow } from "reactflow";
import {
  checkIfNodesConfigured,
  getParsedNodeData,
  isSomething,
} from "../../utils/days-flow-constants";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  formSchema,
  getUpdatedNodes,
  handleCheckboxChange,
  items,
} from "@/utils/day-flow-form.utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Select, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import { v4 as uuidv4 } from "uuid";
import NodeConfigurationFormBtns from "./node-configuration-form-btns";
import NodeConfigurationFormSelectItems from "./node-configuration-form-select-items";

const NodeConfigurationForm = () => {
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
  const [undoItems, setUndoItems] = useAtom(undoAtom);

  const selectedNode = useMemo(
    () => nodes?.find((node) => node?.id === selectedAtomId),
    [nodes, selectedAtomId]
  );

  const parsedData = useMemo(
    () => getParsedNodeData(selectedNode?.data),
    [selectedNode]
  );

  const isNodeConnected = useMemo(() => {
    return workflowEdges?.some(
      (edge: Edge) =>
        edge.source === selectedAtomId || edge.target === selectedAtomId
    );
  }, [workflowEdges, selectedAtomId]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nodeType: parsedData?.nodeType,
      nodeTitle: parsedData?.nodeTitle,
      score: parsedData?.score || "",
      contactType: parsedData?.contactType || [],
      message: parsedData?.isConfigured ? parsedData.nodeDescription : "",
    },
  });

  const { handleSubmit, control, getValues } = form;
  const { contactType } = getValues();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const allNodes = getNodes();
    const updatedNodes = getUpdatedNodes(allNodes, selectedAtomId, values);

    setNodes([...updatedNodes]);

    const nodes = getNodes();
    const getworkspace = daysWorkflow?.find(
      (workflow) => workflow?.day?.id === selectedWorkflowId
    );

    if (getworkspace && isSomething(getworkspace)) {
      getworkspace.day.workflow = nodes;
      const updatedUndoItems = getUpdatedNodes(
        undoItems,
        selectedAtomId,
        values
      );
      setUndoItems([...updatedUndoItems]);
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
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <FormField
          control={control}
          name="nodeType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex flex-row gap-1 text-sm text-[#2A2D2E]">
                Node Type <span className="text-red-500">*</span>
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
                <NodeConfigurationFormSelectItems field={field} />
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
              <FormLabel className="flex flex-row gap-1 text-sm text-[#2A2D2E]">
                Title <span className="text-red-500">*</span>
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
              <FormLabel className="flex flex-row gap-1 text-sm text-[#2A2D2E]">
                Score <span className="text-red-500">*</span>
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
              <FormLabel className="flex flex-row gap-1 text-sm text-[#2A2D2E]">
                Contact Type <span className="text-red-500">*</span>
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
                                handleCheckboxChange(checked, item, field);
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
                <FormLabel className="flex flex-row gap-1">
                  Message <span className="text-red-500">*</span>
                </FormLabel>
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

        <NodeConfigurationFormBtns />
      </form>
    </Form>
  );
};

export default NodeConfigurationForm;
