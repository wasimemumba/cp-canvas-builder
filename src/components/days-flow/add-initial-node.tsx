import {
  daysWorkflowDataAtom,
  reactflowInstanceAtom,
  redoAtom,
  selectedDayAtom,
  undoAtom,
} from "@/store/workflow-atoms";
import {
  INITIAL_NODE,
  UNDO_ACTION_ADDED,
  newNodeToAdd,
} from "@/utils/days-flow-constants";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import { useReactFlow } from "reactflow";
import { v4 as uuidv4 } from "uuid";

import { PlusIconMain } from "../../utils/days-flow-icons";
import { Button } from "../ui/button";

const AddInitialNode = () => {
  const { setNodes } = useReactFlow();
  const reactFlowInstance = useAtomValue(reactflowInstanceAtom);
  const daysWorkflow = useAtomValue(daysWorkflowDataAtom);
  const selectedWorkflowId = useAtomValue(selectedDayAtom);
  const setUndo = useSetAtom(undoAtom);
  const setRedo = useSetAtom(redoAtom);

  const addStartNode = useCallback(
    (event: { clientX: number; clientY: number }) => {
      const position = reactFlowInstance?.screenToFlowPosition({
        x: event.clientX - 90,
        y: event.clientY - 50,
      }) || {
        x: 200,
        y: 200,
      };

      const newNodeId = uuidv4();

      const newNode = {
        id: newNodeId,
        nodeType: INITIAL_NODE,
        data: JSON.stringify(newNodeToAdd),
        undoType: UNDO_ACTION_ADDED,
        position,
        type: INITIAL_NODE,
      };

      setNodes((prevNodes) => [...prevNodes, newNode]);

      daysWorkflow?.forEach((workflow) => {
        if (workflow?.day?.id === selectedWorkflowId) {
          workflow.day.workflow = [...workflow.day.workflow, newNode];
        }
      });

      setUndo((prevUndo) => [...prevUndo, newNode]);
      setRedo([]);
    },
    [
      daysWorkflow,
      reactFlowInstance,
      selectedWorkflowId,
      setNodes,
      setRedo,
      setUndo,
    ]
  );
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2 justify-start items-center">
      <div className="relative bg-[#F1F1F1] w-[80px] h-[80px] rounded-full">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <PlusIconMain />
        </div>
      </div>

      <p className="text-base font-medium text-[#2A2D2E]">
        Start Building A Workflow
      </p>
      <p className="text-xs text-[#2A2D2E]">
        To initiate the workflow, add a “Dialog Start” node.
      </p>

      <Button
        className={` py-6 px-3 rounded-[5px] text-sm h-[28px]  bg-[#00B2E3] text-white hover:bg-opacity-70 hover:bg-[#00B2E3] hover:text-[white]
    mt-2`}
        onClick={addStartNode}
      >
        Add “Dialog Start” Node{" "}
      </Button>
    </div>
  );
};

export default AddInitialNode;
