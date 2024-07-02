import {
  INITIAL_NODE,
  LIVE_CHAT_NODE,
  MESSAGE_PATIENT_NODE,
  QUESTIONNAIRE_NODE,
} from "@/utils/days-flow-constants";
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
        value={INITIAL_NODE}
        className={`focus:bg-[#BEBFC0] focus:bg-opacity-30 text-[#2A2D2E] ${
          field.value === INITIAL_NODE && "bg-[#00B2E3] bg-opacity-20"
        } w-full m-0 `}
      >
        Dialogue Start
      </SelectItem>
      <SelectItem
        value={MESSAGE_PATIENT_NODE}
        className={`focus:bg-[#BEBFC0] focus:bg-opacity-30 text-[#2A2D2E] ${
          field.value === MESSAGE_PATIENT_NODE && "bg-[#00B2E3] bg-opacity-20"
        } w-full m-0 `}
      >
        Message Patient
      </SelectItem>
      <SelectItem
        value={QUESTIONNAIRE_NODE}
        className={`focus:bg-[#BEBFC0] focus:bg-opacity-30 text-[#2A2D2E] ${
          field.value === QUESTIONNAIRE_NODE && "bg-[#00B2E3] bg-opacity-20"
        } w-full m-0 `}
      >
        Questionnaire
      </SelectItem>
      <SelectItem
        value={LIVE_CHAT_NODE}
        className={`focus:bg-[#BEBFC0] focus:bg-opacity-30 text-[#2A2D2E] ${
          field.value === LIVE_CHAT_NODE && "bg-[#00B2E3] bg-opacity-20"
        } w-full m-0 `}
      >
        Live Chat
      </SelectItem>
    </SelectContent>
  );
};

export default NodeConfigurationFormSelectItems;
