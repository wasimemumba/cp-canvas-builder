import { Edge, Node, Panel, addEdge, useReactFlow } from "reactflow";
import Sidebar from "./sidebar";
import { Button } from "../ui/button";
import { RedoIcon, UndoIcon } from "./days-flow-icons";
import { isSomething } from "./days-flow-constants";
import { redoAtom, undoAtom } from "@/store/workflow-atoms";
import { useAtom } from "jotai";

const UndoRedoPanel = () => {
  const { setEdges, setNodes } = useReactFlow();
  const [redoValue, setRedo] = useAtom(redoAtom);
  const [undoValue, setUndo] = useAtom(undoAtom);

  const checkIfEdge = (value: Edge | Node) => {
    if (Object.prototype.hasOwnProperty.call(value, "targetHandle")) {
      return true;
    } else {
      return false;
    }
  };

  const onUndo = () => {
    const lastValue = undoValue?.pop();

    if (!lastValue || !isSomething(lastValue)) {
      return;
    }

    if (checkIfEdge(lastValue)) {
      const filterFn = (edge: Edge) => edge.id !== lastValue.id;
      const addFn = (prevEdges: Edge[]) => addEdge(lastValue, prevEdges);

      if (lastValue.undoType === "added") {
        setEdges((edges) => edges.filter(filterFn));
        setRedo((prevRedo) => [lastValue, ...prevRedo]);
      } else {
        setEdges((prevEdges) => addFn(prevEdges));
        setRedo((prevRedo) => [lastValue, ...prevRedo]);
      }
    } else {
      const filterFn = (node: Node) => node.id !== lastValue.id;
      const addFn = (prevNodes: Node[]) => [...prevNodes, lastValue];

      if (lastValue.undoType === "added") {
        setNodes((prevNodes) => prevNodes.filter(filterFn));
        setRedo((prevRedo) => [lastValue, ...prevRedo]);
      } else {
        setNodes((prevNodes) => addFn(prevNodes));
        setRedo((prevRedo) => [lastValue, ...prevRedo]);
      }
    }
  };

  const onRedo = () => {
    const firstValue = redoValue?.shift();

    if (!firstValue || !isSomething(firstValue)) {
      return;
    }

    const filterFn = (item: Edge | Node) => item.id !== firstValue.id;
    const addFn = (prevItems: Edge[] | Node[]) => [...prevItems, firstValue];

    if (firstValue.undoType === "deleted") {
      if (checkIfEdge(firstValue)) {
        setEdges((edges) => edges.filter(filterFn));
      } else {
        setNodes((prevNodes) => prevNodes.filter(filterFn));
      }
    } else {
      if (checkIfEdge(firstValue)) {
        setEdges((prevEdges) => addFn(prevEdges));
      } else {
        setNodes((prevNodes) => addFn(prevNodes));
      }
    }

    setUndo((prevUndo) => {
      if (prevUndo.length === 0) {
        return [firstValue];
      }
      return [...prevUndo, firstValue];
    });
  };

  return (
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
  );
};

export default UndoRedoPanel;
