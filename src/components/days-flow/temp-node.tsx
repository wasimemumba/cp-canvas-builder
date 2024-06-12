import { onDragging } from "@/store/workflow-atoms";
import { useAtomValue } from "jotai";
import { Handle, NodeProps, Position } from "reactflow";

const TempNode = (props: NodeProps) => {
  const { id, data } = props;

  const nearNode: boolean = data === "Release to create a new node";

  const isDragging = useAtomValue(onDragging);

  return (
    <div
      key={id}
      className={`w-[350px] bg-white p-3 border  ${
        nearNode ? "border-[#00B2E3]" : "border-[#CCC]"
      } rounded-xl border-dashed h-[48px] ${
        isDragging && "pointer-events-none"
      }`}
    >
      <p
        className={`text-xs  ${
          nearNode ? "text-[#00B2E3]" : "text-[#777777]"
        } text-center`}
      >
        {data}
      </p>

      <Handle type="target" position={Position?.Top} />
    </div>
  );
};

export default TempNode;
