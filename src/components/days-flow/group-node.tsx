import { onDragging } from "@/store/workflow-atoms";
import { useAtomValue } from "jotai";
import { useCallback, useState } from "react";
import { Handle, NodeProps, Position, useReactFlow } from "reactflow";
import { Button } from "../ui/button";

const GroupNode = (props: NodeProps) => {
  const { setNodes } = useReactFlow();

  const { id } = props;

  const isDragging = useAtomValue(onDragging);

  const [expand, setExpand] = useState(true);

  const onExpand = useCallback(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.parentId === id) {
          node.hidden = false;
        }
        return node;
      })
    );

    setExpand(true);
  }, [id, setNodes]);

  const onRetract = useCallback(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.parentId === id) {
          node.hidden = true;
        }
        return node;
      })
    );

    setExpand(false);
  }, [id, setNodes]);

  return (
    <div
      className={`${
        expand ? "bg-blue-100" : "bg-white"
      } bg-opacity-40 border-2 rounded-xl   ${
        expand ? "w-[800px] h-[400px]" : "w-[350px] h-[72px]"
      }  ${isDragging} && "pointer-events-none hover:pointer-events-none"`}
    >
      <div
        className={`flex flex-row ${
          expand ? "justify-end" : "justify-start items-center"
        }`}
      >
        <div className="flex flex-row gap-2">
          <Button
            className="text-[#2A2D2E] hover:text-blue-500"
            onClick={!expand ? onExpand : onRetract}
          >
            {!expand ? "Expand" : "Retract"}
          </Button>
        </div>
      </div>
      <Handle type="target" position={Position?.Top} />
      <Handle type="source" position={Position?.Top} />
    </div>
  );
};

export default GroupNode;
