import {
  Handle,
  NodeProps,
  Position,
  addEdge,
  useOnSelectionChange,
  useReactFlow,
} from "reactflow";
import {
  NODES_WITH_TYPE_RENDERED,
  NODE_HANDLE_MAPPER_BY_TYPE,
  NODE_ICONS_MAPPER,
  getHandle,
  getParsedNodeData,
  isSomething,
  processGraph,
} from "./days-flow-constants";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  currentViewAtom,
  daysWorkflowDataAtom,
  newNodeId,
  nodeIdAtom,
  redoAtom,
  selectedDayAtom,
  undoAtom,
} from "@/store/workflow-atoms";
import { TrashIcon } from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  EmailIcon,
  MessageIcon,
  PhoneIcon,
  PlusIconHandle,
  StraightLineSVG,
} from "./days-flow-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { v4 as uuidv4 } from "uuid";
import { getLayoutedElementsDagreOverlap } from "./dagree-layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";

type NodeCardRenderProps = {
  data: string;
};

const NodeCardRender = (props: NodeProps<NodeCardRenderProps>) => {
  const { data, id, xPos, yPos } = props;

  const { setNodes, getNodes, getEdges, deleteElements, setEdges } =
    useReactFlow();
  const nodes = getNodes();
  const edges = getEdges();

  const [isSelfSelected, setIsSelfSelected] = useState<boolean | null>(false);

  const nodeatomId = useAtomValue(nodeIdAtom);
  const currentView = useAtomValue(currentViewAtom);
  const setAtomId = useSetAtom(nodeIdAtom);
  const setUndo = useSetAtom(undoAtom);
  const setRedo = useSetAtom(redoAtom);
  const daysWorkflow = useAtomValue(daysWorkflowDataAtom);
  const selectedWorkflowId = useAtomValue(selectedDayAtom);
  const newelyAddedNodeId = useAtomValue(newNodeId);
  const setNewlyAddedNodeId = useSetAtom(newNodeId);

  const parsedData = useMemo(() => getParsedNodeData(data), [data]);

  const {
    nodeDescription,
    nodeIcon,
    nodeTitle,
    handle,
    isConfigured,
    contactType,
  } = parsedData;

  useOnSelectionChange({
    onChange: ({ nodes }) => {
      const nodeId = nodes?.map((node) => node?.id);
      if (!newelyAddedNodeId) {
        setAtomId(nodeId && nodeId[0]);
      }

      if (nodeId && nodeId[0] !== newelyAddedNodeId) {
        setNewlyAddedNodeId("");
      }
    },
  });

  const onNodeDelete = () => {
    const deletedNode = nodes.find((node) => node.id === id);
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id));

    setUndo((prevUndo) => [
      ...prevUndo,
      { ...deletedNode, undoType: "deleted" },
    ]);

    setAtomId(null);
  };

  const onDeleteStartNode = () => {
    const allTargets = processGraph(edges, id);
    allTargets.push(id);

    const dependentNodes = allTargets?.map((targetId) => {
      const foundNode = nodes?.find((node) => node?.id === targetId);

      return {
        id: targetId,
        foundNode,
      };
    });
    deleteElements({ nodes: dependentNodes, edges: [] });

    setUndo([]);
    setRedo([]);
    setAtomId(null);
  };

  const onAddNode = (nodeType: string) => {
    const newNodeToAdd = NODES_WITH_TYPE_RENDERED.find(
      (node) => node.nodeType === nodeType
    );

    const newNodeId = uuidv4();

    const newNode = {
      id: newNodeId,
      nodeType: nodeType,
      data: JSON.stringify(newNodeToAdd),
      undoType: "added",
      position: { x: xPos, y: yPos + 150 },
      type: nodeType,
    };

    setNodes((prevNodes) => [...prevNodes, newNode]);

    const autoEdge = {
      animated: false,
      id: uuidv4(),
      source: id,
      target: newNodeId,
      type: "buttonEdge",
      undoType: "added",
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

  useEffect(() => {
    if (nodes.length > 1) {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElementsDagreOverlap(nodes, edges);

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes.length, edges.length, setNodes, setEdges]);

  const isStartNode = useMemo(() => {
    return parsedData?.nodeType === "initialNode";
  }, [parsedData?.nodeType]);

  useEffect(() => {
    setIsSelfSelected(isSomething(nodeatomId) && nodeatomId === id);
  }, [id, nodeatomId, setIsSelfSelected]);

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

      if (typeof getworkspace !== "undefined" && isSomething(getworkspace)) {
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
    <div
      className={`w-[350px]  bg-white p-3 border border-[#E6E6E6] rounded-xl flex flex-col gap-3 ${
        isSelfSelected && `border-[1.5px] border-cyan-500`
      } relative`}
    >
      {newelyAddedNodeId === id && (
        <div className="flex flex-col gap-2">
          <Select
            defaultValue={parsedData?.nodeType}
            onValueChange={(value: string) => onNodeTypeChange(value)}
          >
            <SelectTrigger className="border rounded-[4px] border-[#ccc]  focus:border-[2px] focus:border-[#00B2E3]">
              <div className="flex flex-row gap-2">
                {/* {NODE_ICONS_MAPPER[NODE_ICONS_TYPE_MAPPER[newNodeType]]} */}
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
            onClick={(e) => {
              e.nativeEvent.stopPropagation();
            }}
            // defaultValue={parsedData.nodeTitle}
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
      )}

      {newelyAddedNodeId !== id && (
        <>
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row justify-start items-center gap-2">
              {NODE_ICONS_MAPPER[nodeIcon]}

              <h2 className="text-[#2A2D2E] text-sm font-medium">
                {nodeTitle}
              </h2>
            </div>
            {!isStartNode && (
              <TrashIcon
                key={id}
                className="h-4 w-4 hover:text-red-500"
                onClick={onNodeDelete}
              />
            )}

            {isStartNode && (
              <Dialog>
                <DialogTrigger asChild>
                  <TrashIcon key={id} className="h-4 w-4 hover:text-red-500" />
                </DialogTrigger>
                <DialogContent className="bg-white border rounded-[5px] sm:rounded-[5px]">
                  <DialogHeader>
                    <DialogTitle>Delete Start Node?</DialogTitle>
                    <DialogDescription className="text-base text-[#777777]">
                      Dialog start node “Daily Morning Medicine” and all
                      subsequent nodes will be deleted. Are you sure you want to
                      delete?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="sm:justify-start sm:space-x-0 gap-2 ">
                    <DialogClose asChild>
                      <Button
                        type="button"
                        className=" bg-[#B1203D] hover:bg-[#B1203D] hover:opacity-70 rounded-[5px] text-white"
                        onClick={onDeleteStartNode}
                      >
                        Delete
                      </Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="secondary"
                        className="border border-[#B1203D] text-[#B1203D] hover:opacity-70 rounded-[5px]"
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {!isConfigured && (
            <p className="text-xs text-[#BEBFC0]">Click to configure node</p>
          )}

          {isConfigured &&
            nodeDescription?.length >= 54 &&
            currentView === "detailed" && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex flex-row gap-1 justify-start items-center">
                      {contactType?.map((cont) => {
                        if (cont === "sms") {
                          return <MessageIcon />;
                        }
                        if (cont === "ivr") {
                          return <PhoneIcon />;
                        }
                        if (cont === "email") {
                          return <EmailIcon />;
                        }
                      })}
                      <p className="text-xs text-[#777] truncate">
                        {nodeDescription}
                        ...
                      </p>
                    </div>
                  </TooltipTrigger>

                  <TooltipContent className="bg-gray-800 text-white text-xs rounded-xl text-wrap break-words max-w-[250px]">
                    {nodeDescription}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

          {isConfigured &&
            nodeDescription?.length <= 54 &&
            currentView === "detailed" && (
              <div className="flex flex-row gap-1 justify-start items-center">
                {contactType?.map((cont) => {
                  if (cont === "sms") {
                    return <MessageIcon />;
                  }
                  if (cont === "ivr") {
                    return <PhoneIcon />;
                  }
                  if (cont === "email") {
                    return <EmailIcon />;
                  }
                })}
                <p className="text-xs text-[#777] truncate">
                  {nodeDescription}
                </p>
              </div>
            )}

          {handle === "target" && (
            <div className="absolute -bottom-[60px] left-1/2 opacity-0">
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
                        onClick={() => {}}
                        className="w-5 h-5 bg-[#00B2E3] rounded-full text-white hover:bg-[#00B2E3] hover:bg-opacity-70  hover:text-red-600"
                        disabled={!isConfigured}
                      >
                        <PlusIconHandle />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-white rounded-[5px]">
                      <DropdownMenuItem
                        className="cursor-pointer focus:bg-gray-300 rounded-[5px] flex flex-row justify-start items-center gap-2"
                        onClick={() => onAddNode("messagePatientNode")}
                      >
                        {NODE_ICONS_MAPPER["message"]}{" "}
                        <span className="inline-block text-[#2A2D2E] text-sm">
                          Message Patient
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer focus:bg-gray-300 rounded-[5px] flex flex-row justify-start items-center gap-2"
                        onClick={() => onAddNode("questionnareNode")}
                      >
                        {NODE_ICONS_MAPPER["question"]}{" "}
                        <span className="inline-block text-[#2A2D2E] text-sm">
                          Questionnaire
                        </span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="cursor-pointer focus:bg-gray-300 rounded-[5px] flex flex-row justify-start items-center gap-2"
                        onClick={() => onAddNode("liveChatNode")}
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
              <Handle
                type="target"
                position={Position?.Top}
                className="bg-transparent"
              />
            </div>
          )}

          {handle !== "target" && (
            <div className="absolute -bottom-[60px] left-1/2">
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
                        onClick={() => {}}
                        className="w-5 h-5 bg-[#00B2E3] rounded-full text-white hover:bg-[#00B2E3] hover:bg-opacity-70  hover:text-red-600"
                        disabled={!isConfigured}
                      >
                        <PlusIconHandle />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-white rounded-[5px]">
                      <DropdownMenuItem
                        className="cursor-pointer focus:bg-gray-300 rounded-[5px] flex flex-row justify-start items-center gap-2"
                        onClick={() => onAddNode("messagePatientNode")}
                      >
                        {NODE_ICONS_MAPPER["message"]}{" "}
                        <span className="inline-block text-[#2A2D2E] text-sm">
                          Message Patient
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer focus:bg-gray-300 rounded-[5px] flex flex-row justify-start items-center gap-2"
                        onClick={() => onAddNode("questionnareNode")}
                      >
                        {NODE_ICONS_MAPPER["question"]}{" "}
                        <span className="inline-block text-[#2A2D2E] text-sm">
                          Questionnaire
                        </span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="cursor-pointer focus:bg-gray-300 rounded-[5px] flex flex-row justify-start items-center gap-2"
                        onClick={() => onAddNode("liveChatNode")}
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
              {handle === "source" && (
                <>
                  <Handle
                    type="source"
                    position={Position?.Bottom}
                    className="bg-transparent"
                  />
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NodeCardRender;
