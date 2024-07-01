import { useAtom, useAtomValue } from "jotai";
import { useCallback } from "react";
import { Handle, NodeTypes, Position, useReactFlow } from "reactflow";

import {
  BOTH_HANDLE,
  SOURCE_HANDLE,
  TARGET_HANDLE,
  isSomething,
  updateNewlyAddedNodeTitle,
  updateNewlyAddedNodeType,
} from "../../utils/days-flow-constants";
import { NODE_CARD_TYPE } from "../../utils/types/days-flow.types";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  daysWorkflowDataAtom,
  newNodeId,
  selectedDayAtom,
  undoAtom,
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
  const [undoValue, setUndoValue] = useAtom(undoAtom);

  const { handle } = parsedData;

  const onNodeTypeChange = useCallback(
    (nodeType: string) => {
      const nodes = getNodes();
      const updatedNodes = updateNewlyAddedNodeType(
        nodes,
        newelyAddedNodeId,
        nodeType
      );

      setNodes([...updatedNodes]);

      const getworkspace = daysWorkflow?.find(
        (workflow) => workflow?.day?.id === selectedWorkflowId
      );

      if (isSomething(getworkspace)) {
        getworkspace.day.workflow = updatedNodes;
      }

      const updateUndoValues = updateNewlyAddedNodeType(
        undoValue,
        newelyAddedNodeId,
        nodeType
      );

      setUndoValue(updateUndoValues);
    },
    [
      daysWorkflow,
      getNodes,
      newelyAddedNodeId,
      selectedWorkflowId,
      setNodes,
      setUndoValue,
      undoValue,
    ]
  );

  const onNodeTitleChange = useCallback(
    (nodeTitle: string) => {
      const nodes = getNodes();
      const updatedNodes = updateNewlyAddedNodeTitle(
        nodes,
        newelyAddedNodeId,
        nodeTitle
      );
      setNodes([...updatedNodes]);

      const getworkspace = daysWorkflow?.find(
        (workflow) => workflow?.day?.id === selectedWorkflowId
      );

      if (getworkspace && isSomething(getworkspace)) {
        getworkspace.day.workflow = updatedNodes;
      }

      const updatedUndoValues = updateNewlyAddedNodeTitle(
        nodes,
        newelyAddedNodeId,
        nodeTitle
      );
      setUndoValue(updatedUndoValues);
    },
    [
      daysWorkflow,
      getNodes,
      newelyAddedNodeId,
      selectedWorkflowId,
      setNodes,
      setUndoValue,
    ]
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

      {handle === TARGET_HANDLE && (
        <>
          <Handle
            type={TARGET_HANDLE}
            position={Position?.Top}
            className="bg-transparent"
          />
        </>
      )}

      {handle === BOTH_HANDLE && (
        <>
          <Handle
            type={TARGET_HANDLE}
            position={Position?.Top}
            className="bg-transparent"
          />
          <Handle
            type={SOURCE_HANDLE}
            position={Position?.Bottom}
            className="bg-transparent"
          />
        </>
      )}
    </div>
  );
};

export default UnconfiguredNode;
