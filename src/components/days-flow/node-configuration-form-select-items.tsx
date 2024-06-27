import { ControllerRenderProps } from "react-hook-form";
import { SelectContent, SelectItem } from "../ui/select";

type testType = {
  field: ControllerRenderProps<
    {
      contactType: string[];
      message: string;
      nodeTitle: string;
      nodeType: string;
      score: string;
      analytics?: boolean | undefined;
    },
    "nodeType"
  >;
};

const NodeConfigurationFormSelectItems = (props: testType) => {
  const { field } = props;

  return (
    <SelectContent className="bg-white rounded-[4px] p-0 m-0 w-full">
      <SelectItem
        value="initialNode"
        className={`focus:bg-[#BEBFC0] focus:bg-opacity-30 text-[#2A2D2E] ${
          field.value === "initialNode" && "bg-[#00B2E3] bg-opacity-20"
        } w-full m-0 `}
      >
        Dialogue Start
      </SelectItem>
      <SelectItem
        value="messagePatientNode"
        className={`focus:bg-[#BEBFC0] focus:bg-opacity-30 text-[#2A2D2E] ${
          field.value === "messagePatientNode" && "bg-[#00B2E3] bg-opacity-20"
        } w-full m-0 `}
      >
        Message Patient
      </SelectItem>
      <SelectItem
        value="questionnareNode"
        className={`focus:bg-[#BEBFC0] focus:bg-opacity-30 text-[#2A2D2E] ${
          field.value === "questionnareNode" && "bg-[#00B2E3] bg-opacity-20"
        } w-full m-0 `}
      >
        Questionnaire
      </SelectItem>
      <SelectItem
        value="liveChatNode"
        className={`focus:bg-[#BEBFC0] focus:bg-opacity-30 text-[#2A2D2E] ${
          field.value === "liveChatNode" && "bg-[#00B2E3] bg-opacity-20"
        } w-full m-0 `}
      >
        Live Chat
      </SelectItem>
    </SelectContent>
  );
};

export default NodeConfigurationFormSelectItems;
