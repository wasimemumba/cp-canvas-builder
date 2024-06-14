import { DragEvent, useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Connection,
  Panel,
  ReactFlowInstance,
  ReactFlowProps,
  addEdge,
  useEdgesState,
  useNodesState,
  useOnSelectionChange,
  useReactFlow,
  useViewport,
  Node,
  Edge,
} from "reactflow";
import NodeCardRender from "./node-card-render";

import {
  checkIfNodesConfigured,
  findClosestNode,
  initialEdges,
  initialNodes,
  isSomething,
  valueToPercentage,
} from "./days-flow-constants";
import CustomEdge from "./custom-edge";
import { useAtomValue, useSetAtom } from "jotai";
import {
  currentViewAtom,
  daysWorkflowDataAtom,
  newNodeId,
  nodeIdAtom,
  nodesConfigured,
  onDragging,
  redoAtom,
  selectedDayAtom,
  undoAtom,
  workflowEdgesAtom,
} from "@/store/workflow-atoms";
import { v4 as uuidv4 } from "uuid";
import Sidebar from "./sidebar";
import { Button } from "../ui/button";
import TempNode from "./temp-node";
import {
  MinusIcon,
  PlusIcon,
  PlusIconMain,
  RedoIcon,
  UndoIcon,
} from "./days-flow-icons";
// import { getLayoutedElementsDagreOverlap } from "./dagree-layout";
import dagre from "@dagrejs/dagre";
import GroupNode from "./group-node";
import DaysMenu from "./days-menu";
import { edgesEdit, editTest } from "./temp-edit-test";
import { getLayoutedElementsDagreOverlapTemp } from "./dagree-layout-temp";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeTypes = {
  initialNode: NodeCardRender,
  messagePatientNode: NodeCardRender,
  questionnareNode: NodeCardRender,
  liveChatNode: NodeCardRender,
  tempNode: TempNode,
  groupNode: GroupNode,
};

const edgeTypes = {
  buttonEdge: CustomEdge,
  tempEdge: CustomEdge,
};

const FlowTest = (props: ReactFlowProps) => {
  const { getNodes, setViewport } = useReactFlow();
  const { zoom, x, y } = useViewport();

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const daysWorkflow = useAtomValue(daysWorkflowDataAtom);
  const setDaysWorkflow = useSetAtom(daysWorkflowDataAtom);
  const selectedWorkflowId = useAtomValue(selectedDayAtom);

  const setWorkflowEdges = useSetAtom(workflowEdgesAtom);
  const setUndo = useSetAtom(undoAtom);
  const undoValue = useAtomValue(undoAtom);
  const setRedo = useSetAtom(redoAtom);
  const redoValue = useAtomValue(redoAtom);
  const nodeAtomId = useAtomValue(nodeIdAtom);
  const setCurrentView = useSetAtom(currentViewAtom);
  const currentView = useAtomValue(currentViewAtom);
  const setOnDragging = useSetAtom(onDragging);
  const setNewNodeId = useSetAtom(newNodeId);
  const setNodesConfigured = useSetAtom(nodesConfigured);
  const setAtomId = useSetAtom(nodeIdAtom);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [temporaryNodesArray, setTemporaryNodes] = useState<any>([]);
  const [closestTemporaryNodeFound, setClosestTemporaryNodeFound] =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useState<any>(null);

  const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);

  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

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
      }) || {
        x: 200,
        y: 200,
      };

      const closesNodeFound = findClosestNode(temporaryNodesArray, position);

      if (closesNodeFound) {
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === closesNodeFound?.id && node.type === "tempNode") {
              node.data = "Release to create a new node";
            }

            return node;
          })
        );
      } else {
        setNodes((nds) =>
          nds.map((node) => {
            if (node.type === "tempNode")
              node.data = "Drag here to create new node";

            return node;
          })
        );
      }

      setClosestTemporaryNodeFound(closesNodeFound);
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

      if (
        typeof type === "undefined" ||
        !type ||
        typeof data === "undefined" ||
        !data
      ) {
        return;
      }

      const position = reactFlowInstance?.screenToFlowPosition({
        x: event.clientX - 90,
        y: event.clientY - 50,
      }) || {
        x: 200,
        y: 200,
      };

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

      if (closestTemporaryNodeFound && isSomething(nodes)) {
        setNodes((prevNodes) => [...prevNodes, newNode]);

        const autoEdge = {
          animated: false,
          id: uuidv4(),
          source: closestTemporaryNodeFound?.sourceId,
          target: newNodeId,
          type: "buttonEdge",
          undoType: "added",
        };

        setEdges((prevEdges) => addEdge(autoEdge, prevEdges));

        setUndo((prevUndo) => [...prevUndo, newNode]);
        setRedo([]);
        const getworkspace = daysWorkflow?.find(
          (workflow) => workflow?.day?.id === selectedWorkflowId
        );

        if (typeof getworkspace !== "undefined" && isSomething(getworkspace)) {
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
      } else if (nodes?.length === 0) {
        setNodes((prevNodes) => [...prevNodes, newNode]);

        setUndo((prevUndo) => [...prevUndo, newNode]);
        setRedo([]);

        const getworkspace = daysWorkflow?.find(
          (workflow) => workflow?.day?.id === selectedWorkflowId
        );

        if (typeof getworkspace !== "undefined" && isSomething(getworkspace)) {
          const allNodes = getNodes();

          const filterTempNodes = allNodes.filter(
            (node) => node.type !== "tempNode"
          );
          const nodesToSave = [...filterTempNodes, newNode];
          getworkspace.day.workflow = nodesToSave;
        }
      }

      setNodes((nodes) => nodes.filter((node) => node.type !== "tempNode"));
      setEdges((edges) => edges.filter((edge) => edge.type !== "tempEdge"));

      setOnDragging(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      reactFlowInstance,
      closestTemporaryNodeFound,
      setNodes,
      setUndo,
      setRedo,
      setEdges,
      daysWorkflow,
      selectedWorkflowId,
      getNodes,
      nodes?.length,
    ]
  );

  useEffect(() => {
    if (temporaryNodesArray && nodes.length > 1) {
      const hasTempNode = nodes.some((n) => n.type === "tempNode");

      if (hasTempNode) {
        const { nodes: layoutedNodes, edges: layoutedEdges } =
          getLayoutedElementsDagreOverlapTemp(nodes, edges);

        setNodes([...layoutedNodes]);
        setEdges([...layoutedEdges]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes.length, edges.length, temporaryNodesArray, setNodes, setEdges]);

  const onUndo = () => {
    const lastValue = undoValue && undoValue.length > 0 && undoValue.pop();

    if (!lastValue || !isSomething(lastValue)) {
      return;
    }
    if (
      // eslint-disable-next-line no-prototype-builtins
      lastValue?.hasOwnProperty("targetHandle")
    ) {
      if (lastValue.undoType === "added") {
        setEdges((edges) => edges.filter((edge) => edge.id !== lastValue.id));

        setRedo((prevRedo) => {
          if (prevRedo?.length === 0) {
            return [lastValue];
          }
          return [lastValue, ...prevRedo];
        });
      } else {
        setEdges((prevEdges) => addEdge(lastValue, prevEdges));

        setRedo((prevRedo) => {
          if (prevRedo?.length === 0) {
            return [lastValue];
          }
          return [lastValue, ...prevRedo];
        });
      }
    } else {
      if (lastValue.undoType === "added") {
        setNodes((prevNodes) =>
          prevNodes.filter((node) => node.id !== lastValue.id)
        );

        setRedo((prevRedo) => {
          if (prevRedo?.length === 0) {
            return [lastValue];
          }
          return [lastValue, ...prevRedo];
        });
      } else {
        setNodes((prevNodes) => [...prevNodes, lastValue]);

        setRedo((prevRedo) => {
          if (prevRedo?.length === 0) {
            return [lastValue];
          }
          return [lastValue, ...prevRedo];
        });
      }
    }
  };

  const onRedo = () => {
    const firstValue = redoValue && redoValue.length > 0 && redoValue.shift();

    if (!firstValue || !isSomething(firstValue)) {
      return;
    }

    if (
      // eslint-disable-next-line no-prototype-builtins
      firstValue?.hasOwnProperty("targetHandle")
    ) {
      if (firstValue.undoType === "deleted") {
        setEdges((edges) => edges.filter((edge) => edge.id !== firstValue.id));

        setUndo((prevUndo) => {
          if (prevUndo.length === 0) {
            return [firstValue];
          }
          return [...prevUndo, firstValue];
        });
      } else {
        setEdges((prevEdges) => addEdge(firstValue, prevEdges));

        setUndo((prevUndo) => {
          if (prevUndo.length === 0) {
            return [firstValue];
          }
          return [...prevUndo, firstValue];
        });
      }
    } else {
      if (firstValue.undoType === "deleted") {
        setNodes((prevNodes) =>
          prevNodes.filter((node) => node.id !== firstValue.id)
        );

        setUndo((prevUndo) => {
          if (prevUndo.length === 0) {
            return [firstValue];
          }
          return [...prevUndo, firstValue];
        });
      } else {
        setNodes((prevNodes) => [...prevNodes, firstValue]);

        setUndo((prevUndo) => {
          if (prevUndo.length === 0) {
            return [firstValue];
          }
          return [...prevUndo, firstValue];
        });
      }
    }
  };

  const vluePercentage = useMemo(() => valueToPercentage(zoom), [zoom]);

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
    const tempraryNodes = nodes
      ?.filter((node) => node.type !== "liveChatNode")
      ?.filter((node) => node?.type !== "groupNode")
      ?.filter((node) => {
        const parsedData = JSON.parse(node.data);
        return parsedData?.isConfigured;
      })
      .map((node) => {
        const tempTargetId = uuidv4();

        // const allTargets = processGraph(edges, node.id);

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

    tempraryNodes?.forEach((tempNode) => {
      setNodes((prevNodes) => [...prevNodes, tempNode?.tempNode]);
      setEdges((prevEdges) => addEdge(tempNode?.tempEdge, prevEdges));
    });

    setTemporaryNodes(() => tempraryNodes?.map((node) => node?.tempNode));
  }, [nodes, setEdges, setNodes]);

  const onDagExit = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.type !== "tempNode"));
    setEdges((edges) => edges.filter((edge) => edge.type !== "tempEdge"));
  }, [setEdges, setNodes]);

  const onSelectChange = useCallback(
    ({ nodes }: { nodes: Node[]; edges: Edge[] }) => {
      setSelectedNodes(nodes);
    },
    []
  );

  const onSelectionEnd = useCallback(() => {
    if (selectedNodes.length >= 2) {
      const initialNodeId = nodes?.map((node) => {
        if (node?.type === "initialNode") {
          return node?.id;
        }
      });

      const removeEdgesIds: string[] = [];

      selectedNodes?.forEach((sl) => {
        edges?.forEach((edge) => {
          if (sl?.id === edge?.target) {
            removeEdgesIds?.push(edge?.id);
          }
        });
      });

      removeEdgesIds?.forEach((re) => {
        // setEdges((edges) => edges.filter((edge) => edge.id !== re));
        setEdges((edges) =>
          edges.map((edge) => {
            if (edge && edge?.id === re) {
              edge.hidden = true;

              return edge;
            } else return edge;
          })
        );
      });

      const groupId = uuidv4();
      const groupNode = {
        id: groupId,
        type: "groupNode",
        data: {},
        position: { x: 0, y: 0 },
      };
      setNodes((prev) => [...prev, groupNode]);
      selectedNodes?.forEach((selNod) => {
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === selNod?.id) {
              node.parentId = groupId;
              node.extent = "parent";
              // node.draggable = true;
            }
            return node;
          })
        );
      });

      if (initialNodeId[0]) {
        const groupEdge = {
          animated: false,
          id: uuidv4(),
          source: initialNodeId[0],
          target: groupId,
          type: "buttonEdge",
          undoType: "added",
        };
        setEdges((prevEdges) => addEdge(groupEdge, prevEdges));
      }

      setSelectedNodes([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes?.length, selectedNodes, setEdges, setNodes]);

  useOnSelectionChange({
    onChange: onSelectChange,
  });

  const addStartNode = useCallback(
    (event: { clientX: number; clientY: number }) => {
      const position = reactFlowInstance?.screenToFlowPosition({
        x: event.clientX - 90,
        y: event.clientY - 50,
      }) || {
        x: 200,
        y: 200,
      };

      const newNodeToAdd = {
        nodeIcon: "dialogue",
        nodeTitle: "Dialogue Start",
        nodeDescription:
          "Marks the start of a new dialog tree and defines trigger time",
        nodeType: "initialNode",
        handle: "source",
        isConfigured: false,
      };

      const newNodeId = uuidv4();

      const newNode = {
        id: newNodeId,
        nodeType: "initialNode",
        data: JSON.stringify(newNodeToAdd),
        undoType: "added",
        position,
        type: "initialNode",
      };

      setNodes((prevNodes) => [...prevNodes, newNode]);

      daysWorkflow?.forEach((workflow) => {
        if (workflow?.day?.id === selectedWorkflowId) {
          workflow.day.workflow = [...workflow.day.workflow, newNode];
        }
      });

      setUndo((prevUndo) => [...prevUndo, newNode]);
      setRedo([]);
    },
    [
      daysWorkflow,
      reactFlowInstance,
      selectedWorkflowId,
      setNodes,
      setRedo,
      setUndo,
    ]
  );

  const onEditTest = () => {
    setDaysWorkflow(editTest);
    const nodesSelected = editTest?.find(
      (workdflow) => workdflow?.day?.id === selectedWorkflowId
    );

    if (
      typeof nodesSelected !== "undefined" &&
      isSomething(nodesSelected?.day) &&
      isSomething(nodesSelected)
    ) {
      const { workflow } = nodesSelected.day;
      setNodes(workflow || []);
      const edgesTest = edgesEdit;

      setEdges(edgesTest || []);
    } else {
      setNodes([]);
    }
  };

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
        onDragEnter={onDragEnter}
        onDragLeave={onDagExit}
        onEdgeMouseEnter={onDagExit}
        onSelectionEnd={onSelectionEnd}
        onPaneClick={() => setAtomId(null)}
        elevateNodesOnSelect
      />

      <Panel
        position="bottom-left"
        className="bg-white rounded-[5px] w-[120px] shadow-xl mt-16"
        key="edit-test"
        onClick={onEditTest}
      >
        <Button
          className={` rounded-[5px] text-sm h-[28px]  bg-[#00B2E3] text-white hover:bg-opacity-70 hover:bg-[#00B2E3] hover:text-[white] w-full
          `}
        >
          Edit Test
        </Button>
      </Panel>
      <Panel
        position="top-left"
        className="bg-white rounded-[5px] w-[120px] shadow-xl mt-16"
        key="days-menu"
      >
        <DaysMenu />
      </Panel>

      <Panel
        position="bottom-center"
        className="bg-white p-2 flex flex-row gap-2 rounded-[5px] shadow-xl"
        key="main-menu-panel"
      >
        <Sidebar />
        <Button onClick={onUndo} disabled={undoValue && undoValue.length <= 0}>
          <UndoIcon />
        </Button>
        <Button onClick={onRedo} disabled={redoValue && redoValue.length <= 0}>
          <RedoIcon />
        </Button>
      </Panel>

      <Panel
        position="bottom-right"
        className={`bg-white rounded-[5px] flex flex-row justify-start items-center  shadow-xl ${
          nodeAtomId && "mr-[21%]"
        } `}
        key="zoom-menu-panel"
      >
        <Button
          onClick={() =>
            setViewport({
              zoom: zoom >= 0.5 ? Math.min(zoom - 0.25, 2) : 0.25,
              x,
              y,
            })
          }
          disabled={vluePercentage === 0}
        >
          <MinusIcon />
        </Button>
        <span className="text-base text-[#777777]">{vluePercentage} %</span>
        <Button
          onClick={() => setViewport({ zoom: Math.min(zoom + 0.25, 2), x, y })}
          disabled={vluePercentage === 100}
        >
          <PlusIcon />
        </Button>
      </Panel>
      <Panel
        position="top-right"
        className={`bg-white rounded-[5px] flex flex-row justify-start items-center mt-14  shadow-xl ${
          nodeAtomId && "mr-[21%]"
        }`}
        key="view-panel"
      >
        <Button
          className={`text-[#777777] text-sm rounded-l-[5px] hover:text-[#00B2E3] ${
            currentView === "summary" &&
            "bg-[#00B2E3] text-white hover:bg-opacity-70 hover:bg-[#00B2E3] hover:text-[white]"
          }`}
          onClick={() => setCurrentView("summary")}
        >
          Summary
        </Button>

        <Button
          className={`text-[#777777] text-sm rounded-r-[5px] hover:text-[#00B2E3] ${
            currentView === "detailed" &&
            "bg-[#00B2E3] text-white hover:bg-opacity-70 hover:bg-[#00B2E3] hover:text-[white]"
          }`}
          onClick={() => setCurrentView("detailed")}
        >
          Detailed
        </Button>
      </Panel>

      {nodes.length === 0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2 justify-start items-center">
          <div className="relative bg-[#F1F1F1] w-[80px] h-[80px] rounded-full">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <PlusIconMain />
            </div>
          </div>

          <p className="text-base font-medium text-[#2A2D2E]">
            Start Building A Workflow
          </p>
          <p className="text-xs text-[#2A2D2E]">
            To initiate the workflow, add a “Dialog Start” node.
          </p>

          <Button
            className={` py-6 px-3 rounded-[5px] text-sm h-[28px]  bg-[#00B2E3] text-white hover:bg-opacity-70 hover:bg-[#00B2E3] hover:text-[white]
          mt-2`}
            onClick={addStartNode}
          >
            Add “Dialog Start” Node{" "}
          </Button>
        </div>
      )}
    </>
  );
};

export default FlowTest;
