import { DragEvent, useCallback, useEffect, useState } from "react";
import ReactFlow, {
  Connection,
  Panel,
  ReactFlowInstance,
  ReactFlowProps,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";
import NodeCardRender from "./node-card-render";

import { initialEdges, initialNodes, isSomething } from "./days-flow-constants";
import CustomEdge from "./custom-edge";
import { useAtomValue, useSetAtom } from "jotai";
import {
  daysWorkflowDataAtom,
  selectedDayAtom,
  workflowEdgesAtom,
} from "@/store/workflow-atoms";
import { v4 as uuidv4 } from "uuid";
import Sidebar from "./sidebar";

const nodeTypes = {
  initialNode: NodeCardRender,
  messagePatientNode: NodeCardRender,
  questionnareNode: NodeCardRender,
  liveChatNode: NodeCardRender,
};

const edgeTypes = {
  buttonEdge: CustomEdge,
};

const Flow = (props: ReactFlowProps) => {
  // const { setNodes } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const daysWorkflow = useAtomValue(daysWorkflowDataAtom);
  const selectedWorkflowId = useAtomValue(selectedDayAtom);
  const setWorkflowEdges = useSetAtom(workflowEdgesAtom);

  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  const onConnect = useCallback(
    (connection: Connection) => {
      const edge = {
        ...connection,
        animated: true,
        id: `${edges?.length} + 1`,
        type: "buttonEdge",
      };

      setEdges((prevEdges) => addEdge(edge, prevEdges));
    },
    [edges?.length, setEdges]
  );

  const onDragOver = useCallback((event: DragEvent) => {
    event?.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event?.preventDefault();

      const type = event?.dataTransfer?.getData("application/reactflow");
      const data = event?.dataTransfer?.getData(
        "application/reactflow/nodeData"
      );

      if (
        typeof type === "undefined" ||
        !type ||
        typeof data === "undefined" ||
        !data
      ) {
        return;
      }

      const position = reactFlowInstance?.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      }) || {
        x: 200,
        y: 200,
      };

      const newNode = {
        id: uuidv4(),
        type,
        position,
        data,
      };
      setNodes((prevNodes) => [...prevNodes, newNode]);
    },
    [reactFlowInstance, setNodes]
  );

  useEffect(() => {
    if (isSomething(daysWorkflow)) {
      const nodesSelected = daysWorkflow?.find(
        (workdflow) => workdflow?.day?.id === selectedWorkflowId
      );

      if (
        typeof nodesSelected !== "undefined" &&
        isSomething(nodesSelected?.day) &&
        isSomething(nodesSelected)
      ) {
        const { workflow } = nodesSelected.day;
        setNodes(workflow);
      } else {
        setNodes([]);
      }
    }
  }, [daysWorkflow, selectedWorkflowId, setNodes]);

  useEffect(() => {
    setWorkflowEdges(edges);
  }, [edges, setWorkflowEdges]);

  return (
    <>
      <ReactFlow
        {...props}
        onDrop={onDrop}
        onInit={setReactFlowInstance}
        onDragOver={onDragOver}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
      />

      <Panel
        position="bottom-center"
        className="bg-white p-2"
        key="main-menu-panel"
      >
        <Sidebar />
      </Panel>
    </>
  );
};

export default Flow;
