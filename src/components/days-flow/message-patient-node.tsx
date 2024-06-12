import { Handle, Position } from "reactflow";

const MessagePatiendNode = () => {
  return (
    <div className="bg-white p-4">
      MessagePatiendNode
      <Handle type="target" position={Position?.Top} />
      <Handle type="source" position={Position?.Bottom} />
    </div>
  );
};

export default MessagePatiendNode;
