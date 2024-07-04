import { onDragging } from "@/store/workflow-atoms";
import { useSetAtom } from "jotai";
import { DragEvent, useMemo } from "react";

import { isSomething } from "@/utils/react-flow.utils";
import { useReactFlow } from "reactflow";
import {
  INITIAL_NODE,
  NODE_ICONS_MAPPER,
} from "../../utils/days-flow-constants";
import { NODE_CARD_TYPE } from "../../utils/types/days-flow.types";

type NodeCardPropType = {
  nodeCardDetails: NODE_CARD_TYPE;
};

const NodeCard = (props: NodeCardPropType) => {
  const { nodeCardDetails } = props;
  const { getNodes } = useReactFlow();
  const nodes = getNodes();

  const { nodeDescription, nodeIcon, nodeTitle, nodeType } = nodeCardDetails;
  const isDraggable = useMemo(
    () =>
      (!isSomething(nodes) && nodeType === INITIAL_NODE) ||
      (isSomething(nodes) && nodeType !== INITIAL_NODE),
    [nodes, nodeType]
  );

  const setOnDragging = useSetAtom(onDragging);

  const onDragStart = (
    event: DragEvent,
    nodeType: string,
    nodeCardDetails: NODE_CARD_TYPE
  ) => {
    setOnDragging(true);
    event?.dataTransfer?.setData("application/reactflow", nodeType);
    event?.dataTransfer?.setData(
      "application/reactflow/nodeData",
      JSON.stringify(nodeCardDetails)
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className={`bg-white border border-gray-400 rounded-xl flex flex-col gap-2 pt-2 pb-2 pl-3 pr-3 min-w-[180px] max-w-[250px] hover:bg-gray-200 hover:cursor-pointer`}
      onDragStart={(event) => onDragStart(event, nodeType, nodeCardDetails)}
      draggable={isDraggable}
    >
      <div className="flex flex-row gap-1 justify-start items-center ">
        {NODE_ICONS_MAPPER[nodeIcon]}
        <h4 className="">{nodeTitle}</h4>
      </div>

      <p className="text-xs text-gray-400">{nodeDescription}</p>
    </div>
  );
};

export default NodeCard;
