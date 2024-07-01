import { Edge, Node, Panel, addEdge, useReactFlow } from "reactflow";
import Sidebar from "./sidebar";
import { Button } from "../ui/button";
import { RedoIcon, UndoIcon } from "../../utils/days-flow-icons";
import {
  UNDO_ACTION_ADDED,
  UNDO_ACTION_DELETED,
  isSomething,
} from "../../utils/days-flow-constants";
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
      const filterEdges = (edge: Edge) => edge.id !== lastValue.id;

      if (lastValue.undoType === UNDO_ACTION_ADDED) {
        setEdges((edges) => edges.filter(filterEdges));
        setRedo((prevRedo) => [lastValue, ...prevRedo]);
      } else {
        setEdges((prevEdges) => addEdge(lastValue, prevEdges));
        setRedo((prevRedo) => [lastValue, ...prevRedo]);
      }
    } else {
      const filterNodes = (node: Node) => node.id !== lastValue.id;

      if (lastValue.undoType === UNDO_ACTION_ADDED) {
        setNodes((prevNodes) => prevNodes.filter(filterNodes));
        setRedo((prevRedo) => [lastValue, ...prevRedo]);
      } else {
        setNodes((prevNodes) => [...prevNodes, lastValue]);
        setRedo((prevRedo) => [lastValue, ...prevRedo]);
      }
    }
  };

  const onRedo = () => {
    const firstValue = redoValue?.shift();

    if (!firstValue || !isSomething(firstValue)) {
      return;
    }

    const filterRedo = (item: Edge | Node) => item.id !== firstValue.id;
    const addToRedo = (prevItems: Edge[] | Node[]) => [
      ...prevItems,
      firstValue,
    ];

    if (firstValue.undoType === UNDO_ACTION_DELETED) {
      if (checkIfEdge(firstValue)) {
        setEdges((edges) => edges.filter(filterRedo));
      } else {
        setNodes((prevNodes) => prevNodes.filter(filterRedo));
      }
    } else {
      if (checkIfEdge(firstValue)) {
        setEdges((prevEdges) => addToRedo(prevEdges));
      } else {
        setNodes((prevNodes) => addToRedo(prevNodes));
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
