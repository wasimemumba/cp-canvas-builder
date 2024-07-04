import { cn } from "@/lib/utils";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { Handle, NodeProps, Position } from "reactflow";

import { onDragging } from "@/store/workflow-atoms";
import { TEMP_NODE_DATA_RELEASE } from "@/utils/days-flow-constants";

const TempNode = (props: NodeProps) => {
  const { id, data } = props;

  const nearNode = useMemo(() => data === TEMP_NODE_DATA_RELEASE, [data]);

  const isDragging = useAtomValue(onDragging);

  return (
    <div
      key={id}
      className={cn(
        "w-[350px] bg-white p-3 border rounded-xl border-dashed h-[48px]",
        {
          "border-[#00B2E3]": nearNode,
          "border-[#CCC]": !nearNode,
          "pointer-events-none": isDragging,
        }
      )}
    >
      <p
        className={cn("text-xs text-center", {
          "text-[#00B2E3]": nearNode,
          "text-[#777777]": !nearNode,
        })}
      >
        {data}
      </p>

      <Handle type="target" position={Position.Top} />
    </div>
  );
};

export default TempNode;
