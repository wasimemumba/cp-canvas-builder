import {
  daysWorkflowDataAtom,
  newNodeId,
  redoAtom,
  selectedDayAtom,
  undoAtom,
} from "@/store/workflow-atoms";
import { useAtomValue, useSetAtom } from "jotai";
import { NodeTypes, addEdge, useReactFlow } from "reactflow";
import { v4 as uuidv4 } from "uuid";

import {
  BUTTON_EDGE,
  NODES_WITH_TYPE_RENDERED,
  NODE_ICONS_MAPPER,
  UNDO_ACTION_ADDED,
} from "../../utils/days-flow-constants";
import { PlusIconHandle, StraightLineSVG } from "../../utils/days-flow-icons";
import { NODE_CARD_TYPE } from "../../utils/types/days-flow.types";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type NodeCardAddNodeSelectType = {
  parsedData: NodeTypes & NODE_CARD_TYPE;
  xPos: number;
  yPos: number;
  id: string;
};

const NodeCardAddNodeSelect = (props: NodeCardAddNodeSelectType) => {
  const { parsedData, xPos, yPos, id } = props;
  const { isConfigured } = parsedData;

  const { setNodes, setEdges } = useReactFlow();
  const setUndo = useSetAtom(undoAtom);
  const setRedo = useSetAtom(redoAtom);
  const setNewlyAddedNodeId = useSetAtom(newNodeId);
  const daysWorkflow = useAtomValue(daysWorkflowDataAtom);
  const selectedWorkflowId = useAtomValue(selectedDayAtom);

  const onAddNode = (nodeType: string) => {
    const newNodeToAdd = NODES_WITH_TYPE_RENDERED.find(
      (node) => node.nodeType === nodeType
    );

    const newNodeId = uuidv4();

    const newNode = {
      id: newNodeId,
      nodeType: nodeType,
      data: JSON.stringify(newNodeToAdd),
      undoType: UNDO_ACTION_ADDED,
      position: { x: xPos, y: yPos + 150 },
      type: nodeType,
    };

    setNodes((prevNodes) => [...prevNodes, newNode]);

    const autoEdge = {
      animated: false,
      id: uuidv4(),
      source: id,
      target: newNodeId,
      type: BUTTON_EDGE,
      undoType: UNDO_ACTION_ADDED,
    };

    setEdges((prevEdges) => addEdge(autoEdge, prevEdges));

    daysWorkflow?.forEach((workflow) => {
      if (workflow?.day?.id === selectedWorkflowId) {
        workflow.day.workflow = [...workflow.day.workflow, newNode];
      }
    });

    setUndo((prevUndo) => [...prevUndo, newNode]);
    setRedo([]);
    setNewlyAddedNodeId(newNodeId);
  };

  return (
    <div>
      <StraightLineSVG />

      <div
        style={{
          position: "absolute",
          transform: `translate(-50%, -50%) translate(4px,-30px)`,
          fontSize: 12,
          pointerEvents: "all",
        }}
        className="nodrag nopan"
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => e.stopPropagation()}
              className="w-5 h-5 bg-[#00B2E3] rounded-full text-white hover:bg-[#00B2E3] hover:bg-opacity-70  hover:text-red-600"
              disabled={!isConfigured}
            >
              <PlusIconHandle />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white rounded-[5px]">
            <DropdownMenuItem
              className="cursor-pointer focus:bg-gray-300 rounded-[5px] flex flex-row justify-start items-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                onAddNode("messagePatientNode");
              }}
            >
              {NODE_ICONS_MAPPER["message"]}{" "}
              <span className="inline-block text-[#2A2D2E] text-sm">
                Message Patient
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer focus:bg-gray-300 rounded-[5px] flex flex-row justify-start items-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                onAddNode("questionnareNode");
              }}
            >
              {NODE_ICONS_MAPPER["question"]}{" "}
              <span className="inline-block text-[#2A2D2E] text-sm">
                Questionnaire
              </span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cursor-pointer focus:bg-gray-300 rounded-[5px] flex flex-row justify-start items-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                onAddNode("liveChatNode");
              }}
            >
              {NODE_ICONS_MAPPER["chat"]}{" "}
              <span className="inline-block text-[#2A2D2E] text-sm">
                {" "}
                Live Chat
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default NodeCardAddNodeSelect;
