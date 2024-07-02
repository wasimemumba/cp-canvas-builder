import { Edge, Node } from "reactflow";
import { v4 as uuidv4 } from "uuid";
import {
  EMAIL_CONTACT,
  IVR_CONTACT,
  LIVE_CHAT_NODE,
  SMS_CONTACT,
} from "./days-flow-constants";
import { EmailIcon, MessageIcon, PhoneIcon } from "./days-flow-icons";

export const getTempNodes = (nodes: Node[]) => {
  return nodes
    .filter(
      (node) =>
        node.type !== LIVE_CHAT_NODE && JSON.parse(node.data)?.isConfigured
    )
    .map((node) => {
      const tempTargetId = uuidv4();
      const nodeWidth = node.width || 50;
      const nodeHeight = node.height || 50;

      const tempNode = {
        id: tempTargetId,
        type: "tempNode",
        position: {
          x: nodeWidth,
          y: node.position.y + nodeHeight + 20,
        },
        data: "Drag here to add new node",
        undoType: "added",
        sourceId: node.id,
      };

      const tempEdge = {
        animated: true,
        id: uuidv4(),
        type: "tempEdge",
        undoType: "added",
        source: node.id,
        sourceHandle: null,
        target: tempTargetId,
      };

      return {
        tempEdge,
        tempNode,
      };
    });
};

export const renderContactIcons = (contactTypes: string[] | undefined) => {
  return contactTypes?.map((contactType) => {
    if (contactType === SMS_CONTACT) {
      return <MessageIcon />;
    }
    if (contactType === IVR_CONTACT) {
      return <PhoneIcon />;
    }
    if (contactType === EMAIL_CONTACT) {
      return <EmailIcon />;
    }
    return <></>;
  });
};

export const checkIfEdge = (value: Edge | Node) => {
  if (Object.prototype.hasOwnProperty.call(value, "targetHandle")) {
    return true;
  } else {
    return false;
  }
};
