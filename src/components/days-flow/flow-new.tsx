import { DragEvent, useCallback, useEffect, useState } from "react";
import ReactFlow, {
  Connection,
  ReactFlowProps,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import NodeCardRender from "./node-card-render";

import {
  checkIfNodesConfigured,
  findClosestNode,
  initialEdges,
  initialNodes,
  isSomething,
} from "./days-flow-constants";
import CustomEdge from "./custom-edge";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  daysWorkflowDataAtom,
  newNodeId,
  nodeIdAtom,
  nodesConfigured,
  onDragging,
  reactflowInstanceAtom,
  redoAtom,
  selectedDayAtom,
  undoAtom,
  workflowEdgesAtom,
} from "@/store/workflow-atoms";
import { v4 as uuidv4 } from "uuid";
import TempNode from "./temp-node";
import { getLayoutedElementsDagreOverlap } from "./dagree-layout";
import AddInitialNode from "./add-initial-node";
import VidewTogglePanel from "./view-toggle-panel";
import UndoRedoPanel from "./undo-redo-panel";
import OnEditPanel from "./on-edit-panel";
import ZoomPanel from "./zoom-panel";
import { getTempNodes } from "@/utils/react-flow.utils";
import DaysPanel from "./days-panel";

const nodeTypes = {
  initialNode: NodeCardRender,
  messagePatientNode: NodeCardRender,
  questionnareNode: NodeCardRender,
  liveChatNode: NodeCardRender,
  tempNode: TempNode,
};

const edgeTypes = {
  buttonEdge: CustomEdge,
  tempEdge: CustomEdge,
};

const FlowNew = (props: ReactFlowProps) => {
  const { getNodes } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactflowInstanceAtom] = useAtom(
    reactflowInstanceAtom
  );
  const daysWorkflow = useAtomValue(daysWorkflowDataAtom);
  const selectedWorkflowId = useAtomValue(selectedDayAtom);
  const setWorkflowEdges = useSetAtom(workflowEdgesAtom);
  const setUndo = useSetAtom(undoAtom);
  const setRedo = useSetAtom(redoAtom);
  const setOnDragging = useSetAtom(onDragging);
  const setNewNodeId = useSetAtom(newNodeId);
  const setNodesConfigured = useSetAtom(nodesConfigured);
  const setAtomId = useSetAtom(nodeIdAtom);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [temporaryNodesArray, setTemporaryNodes] = useState<any>([]);
  const [closestTemporaryNodeFound, setClosestTemporaryNodeFound] =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useState<any>(null);

  const onConnect = useCallback(
    (connection: Connection) => {
      const edge = {
        ...connection,
        animated: false,
        id: uuidv4(),
        type: "buttonEdge",
        undoType: "added",
      };

      setEdges((prevEdges) => addEdge(edge, prevEdges));
      setUndo((prevUndo) => [...prevUndo, edge]);

      setRedo([]);
    },
    [setEdges, setRedo, setUndo]
  );

  const onDragOver = useCallback(
    (event: DragEvent) => {
      event?.preventDefault();
      event.dataTransfer.dropEffect = "move";

      const position = reactFlowInstance?.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      }) || { x: 200, y: 200 };

      const closestNodeFound = findClosestNode(temporaryNodesArray, position);

      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === closestNodeFound?.id && node.type === "tempNode") {
            node.data = closestNodeFound
              ? "Release to create a new node"
              : "Drag here to create new node";
          }
          return node;
        })
      );

      setClosestTemporaryNodeFound(closestNodeFound);
    },
    [reactFlowInstance, setNodes, temporaryNodesArray]
  );

  const onDrop = useCallback(
    (event: DragEvent) => {
      event?.preventDefault();

      const type = event?.dataTransfer?.getData("application/reactflow");
      const data = event?.dataTransfer?.getData(
        "application/reactflow/nodeData"
      );

      if (!type || !data) {
        return;
      }

      const position = reactFlowInstance?.screenToFlowPosition({
        x: event.clientX - 90,
        y: event.clientY - 50,
      }) || { x: 200, y: 200 };

      const newNodeId = uuidv4();

      const newNode = {
        id: newNodeId,
        type,
        data,
        undoType: "added",
        position,
        ...(isSomething(closestTemporaryNodeFound) && {
          position: {
            x: closestTemporaryNodeFound?.position?.x,
            y: closestTemporaryNodeFound?.position?.y,
          },
        }),
      };

      if (closestTemporaryNodeFound || nodes.length === 0) {
        setNodes((prevNodes) => [...prevNodes, newNode]);

        if (closestTemporaryNodeFound) {
          const autoEdge = {
            animated: false,
            id: uuidv4(),
            source: closestTemporaryNodeFound?.sourceId,
            target: newNodeId,
            type: "buttonEdge",
            undoType: "added",
          };

          setEdges((prevEdges) => addEdge(autoEdge, prevEdges));
        }

        setUndo((prevUndo) => [...prevUndo, newNode]);
        setRedo([]);

        const getworkspace = daysWorkflow?.find(
          (workflow) => workflow?.day?.id === selectedWorkflowId
        );

        if (getworkspace && isSomething(getworkspace)) {
          const allNodes = getNodes();
          const filterTempNodes = allNodes.filter(
            (node) => node.type !== "tempNode"
          );
          const nodesToSave = [...filterTempNodes, newNode];
          getworkspace.day.workflow = nodesToSave;

          const parsedNodeData = JSON.parse(data);
          if (parsedNodeData?.nodeType !== "initialNode") {
            setNewNodeId(newNodeId);
          }
        }
      }

      setNodes((nodes) => nodes.filter((node) => node.type !== "tempNode"));
      setEdges((edges) => edges.filter((edge) => edge.type !== "tempEdge"));

      setOnDragging(false);
    },
    [
      reactFlowInstance,
      closestTemporaryNodeFound,
      nodes.length,
      setNodes,
      setEdges,
      setOnDragging,
      setUndo,
      setRedo,
      daysWorkflow,
      selectedWorkflowId,
      getNodes,
      setNewNodeId,
    ]
  );

  useEffect(() => {
    if (temporaryNodesArray && nodes.length > 1) {
      const hasTempNode = nodes.some((n) => n.type === "tempNode");

      if (hasTempNode) {
        const { nodes: layoutedNodes, edges: layoutedEdges } =
          getLayoutedElementsDagreOverlap(nodes, edges);
        setNodes([...layoutedNodes]);
        setEdges([...layoutedEdges]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes.length, edges.length, temporaryNodesArray, setNodes, setEdges]);

  useEffect(() => {
    if (isSomething(daysWorkflow)) {
      const nodesSelected = daysWorkflow?.find(
        (workdflow) => workdflow?.day?.id === selectedWorkflowId
      );

      if (
        nodesSelected &&
        isSomething(nodesSelected?.day) &&
        isSomething(nodesSelected)
      ) {
        const { workflow } = nodesSelected.day;
        setNodes(workflow);
        setAtomId(null);
      } else {
        setNodes([]);
      }
    }
  }, [daysWorkflow, selectedWorkflowId, setAtomId, setNodes]);

  useEffect(() => {
    if (nodes.length > 0) {
      const nodesConfigured = checkIfNodesConfigured(nodes);

      setNodesConfigured(nodesConfigured);
    } else {
      setNodesConfigured(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes.length, setNodesConfigured]);

  useEffect(() => {
    setWorkflowEdges(edges);
  }, [edges, setWorkflowEdges]);

  const onDragEnter = useCallback(() => {
    const tempraryNodes = getTempNodes(nodes);

    tempraryNodes.forEach((tempNode) => {
      setNodes((prevNodes) => [...prevNodes, tempNode.tempNode]);
      setEdges((prevEdges) => addEdge(tempNode.tempEdge, prevEdges));
    });

    setTemporaryNodes(tempraryNodes.map((node) => node.tempNode));
  }, [nodes, setEdges, setNodes]);

  const onDagExit = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.type !== "tempNode"));
    setEdges((edges) => edges.filter((edge) => edge.type !== "tempEdge"));
  }, [setEdges, setNodes]);

  return (
    <>
      <ReactFlow
        {...props}
        onDrop={onDrop}
        onInit={setReactflowInstanceAtom}
        onDragOver={onDragOver}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onDragEnter={onDragEnter}
        onDragLeave={onDagExit}
        onEdgeMouseEnter={onDagExit}
        onPaneClick={() => setAtomId(null)}
        elevateNodesOnSelect
      />
      <DaysPanel />
      <OnEditPanel />
      <UndoRedoPanel />
      <ZoomPanel />
      <VidewTogglePanel />
      {nodes.length === 0 && <AddInitialNode />}
    </>
  );
};

export default FlowNew;
