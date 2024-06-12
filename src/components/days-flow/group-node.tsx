import { onDragging } from "@/store/workflow-atoms";
import { useAtomValue } from "jotai";
import { Handle, NodeProps, Position } from "reactflow";

const GroupNode = (props: NodeProps) => {
  // eslint-disable-next-line no-empty-pattern
  const {} = props;

  const isDragging = useAtomValue(onDragging);

  return (
    <div
      className={`border-2 border-blue-600  w-[400px] h-[400px] ${isDragging} && "pointer-events-none"`}
    >
      <Handle type="target" position={Position?.Top} />
    </div>
  );
};

export default GroupNode;
