import { useCallback } from "react";
import { Handle, NodeTypes, Position, useReactFlow } from "reactflow";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { NODE_CARD_TYPE } from "./days-flow.types";
import {
  NODE_HANDLE_MAPPER_BY_TYPE,
  getHandle,
  isSomething,
} from "./days-flow-constants";
import { useAtomValue } from "jotai";
import {
  daysWorkflowDataAtom,
  newNodeId,
  selectedDayAtom,
} from "@/store/workflow-atoms";

type UnconfiguredNodeProps = {
  parsedData: NodeTypes & NODE_CARD_TYPE;
};

const UnconfiguredNode = (props: UnconfiguredNodeProps) => {
  const { parsedData } = props;

  const { setNodes, getNodes } = useReactFlow();
  const daysWorkflow = useAtomValue(daysWorkflowDataAtom);
  const newelyAddedNodeId = useAtomValue(newNodeId);
  const selectedWorkflowId = useAtomValue(selectedDayAtom);

  const { handle } = parsedData;

  const onNodeTypeChange = useCallback(
    (nodeType: string) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === newelyAddedNodeId) {
            const parsecurrentNodeData = JSON.parse(node.data);

            const parsedValues = {
              ...parsecurrentNodeData,
              handle: getHandle(
                nodeType as keyof typeof NODE_HANDLE_MAPPER_BY_TYPE
              ),
              nodeType,
            };

            const stringifyData = JSON.stringify(parsedValues);

            node.data = stringifyData;
            node.type = nodeType;
          }

          return node;
        })
      );

      const nodes = getNodes();

      const getworkspace = daysWorkflow?.find(
        (workflow) => workflow?.day?.id === selectedWorkflowId
      );

      if (getworkspace && isSomething(getworkspace)) {
        getworkspace.day.workflow = nodes;
      }
    },
    [daysWorkflow, getNodes, newelyAddedNodeId, selectedWorkflowId, setNodes]
  );

  const onNodeTitleChange = useCallback(
    (nodeTitle: string) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === newelyAddedNodeId) {
            const parsecurrentNodeData = JSON.parse(node.data);

            const parsedValues = {
              ...parsecurrentNodeData,
              nodeTitle,
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
      }
    },
    [daysWorkflow, getNodes, newelyAddedNodeId, selectedWorkflowId, setNodes]
  );

  return (
    <div className="flex flex-col gap-2">
      <Select
        defaultValue={parsedData?.nodeType}
        onValueChange={(value: string) => onNodeTypeChange(value)}
      >
        <SelectTrigger className="border rounded-[4px] border-[#ccc]  focus:border-[2px] focus:border-[#00B2E3]">
          <div className="flex flex-row gap-2">
            <SelectValue
              placeholder="Select a fruit"
              className="placeholder:text-[#BEBFC0]"
            />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white rounded-[4px] p-0 m-0 w-full">
          <SelectItem
            value="messagePatientNode"
            className={`focus:bg-[#BEBFC0] focus:bg-opacity-30 text-[#2A2D2E]  w-full m-0 `}
          >
            Message Patient
          </SelectItem>
          <SelectItem
            value="questionnareNode"
            className={`focus:bg-[#BEBFC0] focus:bg-opacity-30 text-[#2A2D2E]  w-full m-0 `}
          >
            Questionnaire
          </SelectItem>
          <SelectItem
            value="liveChatNode"
            className={`focus:bg-[#BEBFC0] focus:bg-opacity-30 text-[#2A2D2E]  w-full m-0 `}
          >
            Live Chat
          </SelectItem>
        </SelectContent>
      </Select>

      <Input
        placeholder="Enter Node Title"
        className="border rounded-[4px] border-[#ccc]  focus:border-[2px] focus:border-[#00B2E3] placeholder:text-[#BEBFC0]"
        onChange={(e) => {
          onNodeTitleChange(e.target.value);
        }}
      />

      {handle === "target" && (
        <>
          <Handle
            type="target"
            position={Position?.Top}
            className="bg-transparent"
          />
        </>
      )}

      {handle === "both" && (
        <>
          <Handle
            type="target"
            position={Position?.Top}
            className="bg-transparent"
          />
          <Handle
            type="source"
            position={Position?.Bottom}
            className="bg-transparent"
          />
        </>
      )}
    </div>
  );
};

export default UnconfiguredNode;
