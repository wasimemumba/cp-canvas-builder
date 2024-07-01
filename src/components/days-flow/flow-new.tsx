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
import { getTempNodes } from "@/utils/react-flow.utils";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { DragEvent, useCallback, useEffect, useState } from "react";
import ReactFlow, {
  Connection,
  ReactFlowProps,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import { v4 as uuidv4 } from "uuid";

import { getLayoutedElementsDagreOverlap } from "../../utils/dagree-layout";
import {
  BUTTON_EDGE,
  INITIAL_NODE,
  TEMP_EDGE,
  TEMP_NODE,
  UNDO_ACTION_ADDED,
  checkIfNodesConfigured,
  edgeTypes,
  findClosestNode,
  getTempNodesForConfiguredNodes,
  initialEdges,
  initialNodes,
  isSomething,
  nodeTypes,
} from "../../utils/days-flow-constants";
import AddInitialNode from "./add-initial-node";
import DaysPanel from "./days-panel";
import OnEditPanel from "./on-edit-panel";
import UndoRedoPanel from "./undo-redo-panel";
import VidewTogglePanel from "./view-toggle-panel";
import ZoomPanel from "./zoom-panel";

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
        type: BUTTON_EDGE,
        undoType: UNDO_ACTION_ADDED,
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

      const addTempNodesToConfiguredNodes = getTempNodesForConfiguredNodes(
        nodes,
        closestNodeFound
      );

      setNodes(addTempNodesToConfiguredNodes);
      setClosestTemporaryNodeFound(closestNodeFound);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nodes.length, reactFlowInstance, setNodes, temporaryNodesArray]
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
        undoType: UNDO_ACTION_ADDED,
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
            type: BUTTON_EDGE,
            undoType: UNDO_ACTION_ADDED,
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
            (node) => node.type !== TEMP_NODE
          );
          const nodesToSave = [...filterTempNodes, newNode];
          getworkspace.day.workflow = nodesToSave;

          const parsedNodeData = JSON.parse(data);
          if (parsedNodeData?.nodeType !== INITIAL_NODE) {
            setNewNodeId(newNodeId);
          }
        }
      }

      setNodes((prevNodes) =>
        prevNodes.filter((node) => node.type !== TEMP_NODE)
      );
      setEdges((prevEdges) =>
        prevEdges.filter((edge) => edge.type !== TEMP_EDGE)
      );

      setOnDragging(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      reactFlowInstance,
      closestTemporaryNodeFound,
      nodes.length,
      setNodes,
      setEdges,
      edges.length,
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
      const hasTempNode = nodes.some((n) => n.type === TEMP_NODE);

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
        isSomething(nodesSelected) &&
        isSomething(nodesSelected?.day)
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
    const tempNodes = tempraryNodes.map((node) => node.tempNode);
    const tempEdges = tempraryNodes.map((node) => node.tempEdge);
    setNodes((prevNodes) => [...prevNodes, ...tempNodes]);
    setEdges((prevEdges) => [...prevEdges, ...tempEdges]);
    setTemporaryNodes([...tempNodes]);
  }, [nodes, setEdges, setNodes]);

  const onDagExit = useCallback(() => {
    setNodes((prevNodes) =>
      prevNodes.filter((node) => node.type !== TEMP_NODE)
    );
    setEdges((prevEdges) =>
      prevEdges.filter((edge) => edge.type !== TEMP_EDGE)
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edges.length, nodes.length, setEdges, setNodes]);

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
