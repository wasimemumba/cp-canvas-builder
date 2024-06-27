import {
  Handle,
  NodeProps,
  Position,
  useOnSelectionChange,
  useReactFlow,
  Node,
} from "reactflow";
import { getParsedNodeData, isSomething } from "./days-flow-constants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { currentViewAtom, newNodeId, nodeIdAtom } from "@/store/workflow-atoms";
import { EmailIcon, MessageIcon, PhoneIcon } from "./days-flow-icons";
import { getLayoutedElementsDagreOverlap } from "./dagree-layout";
import UnconfiguredNode from "./unconfigured-node";
import NodeCardHeader from "./node-card-header";
import NodeCardAddNodeSelect from "./node-card-add-node-select";

type NodeCardRenderProps = {
  data: string;
};

const NodeCardRender = (props: NodeProps<NodeCardRenderProps>) => {
  const { data, id, xPos, yPos } = props;

  const { setNodes, getNodes, getEdges, setEdges } = useReactFlow();
  const nodes = getNodes();
  const edges = getEdges();

  const [isSelfSelected, setIsSelfSelected] = useState<boolean | null>(false);

  const nodeatomId = useAtomValue(nodeIdAtom);
  const currentView = useAtomValue(currentViewAtom);
  const setAtomId = useSetAtom(nodeIdAtom);
  const newelyAddedNodeId = useAtomValue(newNodeId);
  const setNewlyAddedNodeId = useSetAtom(newNodeId);

  const parsedData = useMemo(() => getParsedNodeData(data), [data]);

  const { nodeDescription, handle, isConfigured, contactType } = parsedData;

  const onChangeSelection = useCallback(
    ({ nodes }: { nodes: Node[] }) => {
      const nodeId = nodes?.map((node) => node?.id);

      if (nodeId && nodeId[0] !== newelyAddedNodeId) {
        setNewlyAddedNodeId("");
      }
    },
    [newelyAddedNodeId, setNewlyAddedNodeId]
  );

  useOnSelectionChange({
    onChange: onChangeSelection,
  });

  useEffect(() => {
    if (nodes.length > 1) {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElementsDagreOverlap(nodes, edges);

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes.length, edges.length, setNodes, setEdges]);

  useEffect(() => {
    setIsSelfSelected(isSomething(nodeatomId) && nodeatomId === id);
  }, [id, nodeatomId, setIsSelfSelected]);

  const onNodeClick = useCallback(() => {
    if (!newelyAddedNodeId) {
      setAtomId(id);
    }
  }, [id, newelyAddedNodeId, setAtomId]);

  return (
    <div
      className={`w-[350px]  bg-white p-3 border border-[#E6E6E6] rounded-xl flex flex-col gap-3 ${
        isSelfSelected && `border-[1.5px] border-cyan-500`
      } relative`}
      onClick={(e) => {
        e.stopPropagation();
        onNodeClick();
      }}
    >
      {newelyAddedNodeId === id && <UnconfiguredNode parsedData={parsedData} />}

      {newelyAddedNodeId !== id && (
        <>
          <NodeCardHeader parsedData={parsedData} id={id} />

          {!isConfigured && currentView === "detailed" && (
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
              <NodeCardAddNodeSelect
                parsedData={parsedData}
                xPos={xPos}
                yPos={yPos}
                id={id}
              />
              <Handle
                type="target"
                position={Position?.Top}
                className="bg-transparent"
              />
            </div>
          )}

          {handle !== "target" && (
            <div className="absolute -bottom-[60px] left-1/2">
              <NodeCardAddNodeSelect
                parsedData={parsedData}
                xPos={xPos}
                yPos={yPos}
                id={id}
              />

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
