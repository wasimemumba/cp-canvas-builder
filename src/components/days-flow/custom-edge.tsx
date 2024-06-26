import React from "react";
import { BaseEdge, EdgeProps, getSmoothStepPath } from "reactflow";

const CustomEdge = (props: EdgeProps) => {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
  } = props;

  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <React.Fragment key={id}>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
    </React.Fragment>
  );
};

export default CustomEdge;
