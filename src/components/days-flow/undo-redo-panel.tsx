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
import { checkIfEdge } from "@/utils/react-flow.utils";

const UndoRedoPanel = () => {
  const { setEdges, setNodes } = useReactFlow();
  const [redoValue, setRedo] = useAtom(redoAtom);
  const [undoValue, setUndo] = useAtom(undoAtom);

  const onUndo = () => {
    const lastValue = undoValue?.pop();

    if (!isSomething(lastValue)) {
      return;
    }
    const filterUndo = (item: Edge | Node) => item.id !== lastValue.id;
    const addItem = (prevItems: Edge[] | Node[]) => [lastValue, ...prevItems];
    if (checkIfEdge(lastValue)) {
      if (lastValue.undoType === UNDO_ACTION_ADDED) {
        setEdges((edges) => edges.filter(filterUndo));
        setRedo(addItem);
      } else {
        setEdges((prevEdges) => addEdge(lastValue, prevEdges));
        setRedo(addItem);
      }
    } else {
      if (lastValue.undoType === UNDO_ACTION_ADDED) {
        setNodes((prevNodes) => prevNodes.filter(filterUndo));
        setRedo(addItem);
      } else {
        setNodes((prevNodes) => [...prevNodes, lastValue]);
        setRedo(addItem);
      }
    }
  };

  const onRedo = () => {
    const firstValue = redoValue?.shift();

    if (!isSomething(firstValue)) {
      return;
    }

    const filterRedo = (item: Edge | Node) => item.id !== firstValue.id;
    const addItem = (prevItems: Edge[] | Node[]) => [...prevItems, firstValue];

    if (firstValue.undoType === UNDO_ACTION_DELETED) {
      if (checkIfEdge(firstValue)) {
        setEdges((edges) => edges.filter(filterRedo));
      } else {
        setNodes((prevNodes) => prevNodes.filter(filterRedo));
      }
    } else {
      if (checkIfEdge(firstValue)) {
        setEdges((prevEdges) => addItem(prevEdges));
      } else {
        setNodes((prevNodes) => addItem(prevNodes));
      }
    }

    setUndo((prevUndo) => {
      if (!isSomething(prevUndo)) {
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
      <Button onClick={onUndo} disabled={!isSomething(undoValue)}>
        <UndoIcon />
      </Button>
      <Button onClick={onRedo} disabled={!isSomething(redoValue)}>
        <RedoIcon />
      </Button>
    </Panel>
  );
};

export default UndoRedoPanel;
