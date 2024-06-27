import { useMemo } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { NODE_ICONS_MAPPER, processGraph } from "./days-flow-constants";
import { NodeTypes, useReactFlow } from "reactflow";
import { NODE_CARD_TYPE } from "./days-flow.types";
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
import { useSetAtom } from "jotai";
import { nodeIdAtom, redoAtom, undoAtom } from "@/store/workflow-atoms";

type NodeCardHeaderType = {
  parsedData: NodeTypes & NODE_CARD_TYPE;
  id: string;
};

const NodeCardHeader = (props: NodeCardHeaderType) => {
  const { parsedData, id } = props;
  const { nodeIcon, nodeTitle } = parsedData;

  const { setNodes, getNodes, getEdges, deleteElements } = useReactFlow();
  const nodes = getNodes();
  const edges = getEdges();
  const setUndo = useSetAtom(undoAtom);
  const setRedo = useSetAtom(redoAtom);
  const setAtomId = useSetAtom(nodeIdAtom);

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

  const isStartNode = useMemo(() => {
    return parsedData?.nodeType === "initialNode";
  }, [parsedData?.nodeType]);

  return (
    <div className="flex flex-row justify-between items-center">
      <div className="flex flex-row justify-start items-center gap-2">
        {NODE_ICONS_MAPPER[nodeIcon]}

        <h2 className="text-[#2A2D2E] text-sm font-medium">{nodeTitle}</h2>
      </div>
      {!isStartNode && (
        <TrashIcon
          key={id}
          className="h-4 w-4 hover:text-red-500"
          onClick={(e) => {
            e.stopPropagation();
            onNodeDelete();
          }}
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
                Dialog start node “Daily Morning Medicine” and all subsequent
                nodes will be deleted. Are you sure you want to delete?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-start sm:space-x-0 gap-2 ">
              <DialogClose asChild>
                <Button
                  type="button"
                  className=" bg-[#B1203D] hover:bg-[#B1203D] hover:opacity-70 rounded-[5px] text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteStartNode();
                  }}
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
  );
};

export default NodeCardHeader;
