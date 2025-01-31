import { Edge } from "reactflow";
import { DAYS_FLOW_DATA } from "./days-flow.types";

export const editTest: DAYS_FLOW_DATA[] = [
  {
    day: {
      id: "7bf9c2e3-4aeb-4508-a45e-2d1be402b9c1",
      dayValue: 1,
      workflow: [
        {
          id: "a8cfd02a-cd07-44b5-9959-e4c41cbf9f0d",
          nodeType: "initialNode",
          data: '{"nodeType":"initialNode","nodeTitle":"Dialogue Start","score":"2","contactType":["sms"],"message":"Starting Node","nodeIcon":"dialogue","nodeDescription":"Starting Node","handle":"source","isConfigured":true}',
          undoType: "added",
          position: {
            x: 225,
            y: 0,
          },
          type: "initialNode",
          width: 350,
          height: 74,
          selected: false,
          positionAbsolute: {
            x: 225,
            y: 0,
          },
          dragging: false,
          targetPosition: "top",
          sourcePosition: "bottom",
        },
        {
          id: "d4791444-1bbf-41c6-8c73-448dfb55095d",
          nodeType: "questionnareNode",
          data: '{"nodeIcon":"question","nodeTitle":"Questionnaire Node","nodeDescription":"Select a survey template to send to the Patient via SMS/Email","nodeType":"questionnareNode","handle":"both"}',
          undoType: "added",
          position: {
            x: 0,
            y: 250,
          },
          type: "questionnareNode",
          positionAbsolute: {
            x: 0,
            y: 250,
          },
          targetPosition: "top",
          sourcePosition: "bottom",
          width: 350,
          height: 74,
          selected: false,
          dragging: false,
        },
        {
          id: "24d1a06f-414c-4c77-921c-9320f7a478c9",
          nodeType: "messagePatientNode",
          data: '{"nodeType":"messagePatientNode","nodeTitle":"Message Node","score":"2","contactType":["sms"],"message":"sdsda","nodeIcon":"message","nodeDescription":"sdsda","handle":"both","isConfigured":true}',
          undoType: "added",
          position: {
            x: 450,
            y: 250,
          },
          type: "messagePatientNode",
          positionAbsolute: {
            x: 450,
            y: 250,
          },
          targetPosition: "top",
          sourcePosition: "bottom",
          width: 350,
          height: 74,
          selected: false,
          dragging: false,
        },
        {
          id: "313028fd-143f-400d-9c6e-cec8263e1dcf",
          nodeType: "liveChatNode",
          data: '{"nodeIcon":"chat","nodeTitle":"Chat Node","nodeDescription":"Start a Live chat with patient","nodeType":"liveChatNode","handle":"target"}',
          undoType: "added",
          position: {
            x: 0,
            y: 500,
          },
          type: "liveChatNode",
          positionAbsolute: {
            x: 0,
            y: 500,
          },
          targetPosition: "top",
          sourcePosition: "bottom",
          width: 350,
          height: 74,
          selected: false,
          dragging: false,
        },
        {
          id: "1b796dc8-77f0-43d0-a04f-901eaa9f6411",
          nodeType: "messagePatientNode",
          data: '{"nodeType":"messagePatientNode","nodeTitle":"Patient 1","score":"2","contactType":["sms"],"message":"sdsadada","nodeIcon":"message","nodeDescription":"sdsadada","handle":"both","isConfigured":true}',
          undoType: "added",
          position: {
            x: 450,
            y: 500,
          },
          type: "messagePatientNode",
          positionAbsolute: {
            x: 450,
            y: 500,
          },
          targetPosition: "top",
          sourcePosition: "bottom",
          width: 350,
          height: 74,
          selected: false,
          dragging: false,
        },
        {
          id: "814f093f-723b-4c02-a810-fb1e16b47156",
          nodeType: "messagePatientNode",
          data: '{"nodeIcon":"message","nodeTitle":"Patient 2","nodeDescription":"Send an SMS, IVR or Email message to the Patient","nodeType":"messagePatientNode","handle":"both"}',
          undoType: "added",
          position: {
            x: 900,
            y: 500,
          },
          type: "messagePatientNode",
          positionAbsolute: {
            x: 900,
            y: 500,
          },
          targetPosition: "top",
          sourcePosition: "bottom",
          width: 350,
          height: 74,
          selected: true,
          dragging: false,
        },
      ],
    },
  },
  {
    day: {
      id: "bdb89b03-0ef7-48c6-bb16-b525e96d4ed2",
      dayValue: 2,
      workflow: [
        {
          id: "86827c2e-04e6-4a6b-b398-dfec058cd1b8",
          nodeType: "initialNode",
          data: '{"nodeType":"initialNode","nodeTitle":"Dialogue Start","score":"2","contactType":["sms"],"message":"wqwqw","nodeIcon":"dialogue","nodeDescription":"wqwqw","handle":"source","isConfigured":true}',
          undoType: "added",
          position: {
            x: 225,
            y: 0,
          },
          type: "initialNode",
          width: 350,
          height: 74,
          selected: false,
          positionAbsolute: {
            x: 200,
            y: 0,
          },
          dragging: false,
          targetPosition: "top",
          sourcePosition: "bottom",
        },
        {
          id: "e6baf6fa-e8e1-4756-bca1-ea29a1947f8b",
          nodeType: "questionnareNode",
          data: '{"nodeIcon":"question","nodeTitle":"adasdsad","nodeDescription":"Select a survey template to send to the Patient via SMS/Email","nodeType":"questionnareNode","handle":"both"}',
          undoType: "added",
          position: {
            x: 0,
            y: 250,
          },
          type: "questionnareNode",
          positionAbsolute: {
            x: 0,
            y: 250,
          },
          targetPosition: "top",
          sourcePosition: "bottom",
          width: 350,
          height: 74,
          selected: false,
          dragging: false,
        },
        {
          id: "3c76a241-9ea0-4c59-8305-aaa795e1d32f",
          nodeType: "liveChatNode",
          data: '{"nodeIcon":"chat","nodeTitle":"adasdasd","nodeDescription":"Start a Live chat with patient","nodeType":"liveChatNode","handle":"target"}',
          undoType: "added",
          position: {
            x: 450,
            y: 250,
          },
          type: "liveChatNode",
          positionAbsolute: {
            x: 450,
            y: 250,
          },
          targetPosition: "top",
          sourcePosition: "bottom",
          width: 350,
          height: 74,
          selected: true,
          dragging: false,
        },
      ],
    },
  },

  {
    day: {
      id: "7218cada-6967-4714-91cc-1344b9d34bda",
      dayValue: 3,
      workflow: [
        {
          id: "77442481-3970-4f9d-9153-b3f9a01d1a00",
          nodeType: "initialNode",
          data: '{"nodeType":"initialNode","nodeTitle":"Dialogue Start","score":"4","contactType":["sms"],"message":"sdsadasd","nodeIcon":"dialogue","nodeDescription":"sdsadasd","handle":"source","isConfigured":true}',
          undoType: "added",
          position: {
            x: 200,
            y: 0,
          },
          type: "initialNode",
          width: 350,
          height: 74,
          selected: false,
          positionAbsolute: {
            x: 200,
            y: 0,
          },
          dragging: false,
          targetPosition: "top",
          sourcePosition: "bottom",
        },
        {
          id: "fe808f19-6940-4c69-bbb5-c570870131ea",
          nodeType: "liveChatNode",
          data: '{"nodeIcon":"chat","nodeTitle":"sadsadas","nodeDescription":"Start a Live chat with patient","nodeType":"liveChatNode","handle":"target"}',
          undoType: "added",
          position: {
            x: 0,
            y: 250,
          },
          type: "liveChatNode",
          positionAbsolute: {
            x: 0,
            y: 250,
          },
          targetPosition: "top",
          sourcePosition: "bottom",
          width: 350,
          height: 74,
          selected: false,
          dragging: false,
        },
        {
          id: "2f2b8910-0af3-437a-b1d2-fbf0da230aed",
          nodeType: "questionnareNode",
          data: '{"nodeType":"questionnareNode","nodeTitle":"dasdasd","score":"2","contactType":["sms"],"message":"dasd","nodeIcon":"question","nodeDescription":"dasd","handle":"both","isConfigured":true}',
          undoType: "added",
          position: {
            x: 450,
            y: 250,
          },
          type: "questionnareNode",
          positionAbsolute: {
            x: 450,
            y: 250,
          },
          targetPosition: "top",
          sourcePosition: "bottom",
          width: 350,
          height: 74,
          selected: false,
          dragging: false,
        },
        {
          id: "e1587d23-1328-47a6-b7c7-d167f319e801",
          nodeType: "liveChatNode",
          data: '{"nodeIcon":"chat","nodeTitle":"sdsadas","nodeDescription":"Start a Live chat with patient","nodeType":"liveChatNode","handle":"target"}',
          undoType: "added",
          position: {
            x: 450,
            y: 500,
          },
          type: "liveChatNode",
          positionAbsolute: {
            x: 450,
            y: 500,
          },
          targetPosition: "top",
          sourcePosition: "bottom",
          width: 350,
          height: 74,
          selected: true,
          dragging: false,
        },
      ],
    },
  },
];

export const edgesEdit: Edge[] = [
  {
    animated: false,
    id: "85fba3db-4d11-4263-bedb-dfd140a14e03",
    source: "a8cfd02a-cd07-44b5-9959-e4c41cbf9f0d",
    target: "d4791444-1bbf-41c6-8c73-448dfb55095d",
    type: "buttonEdge",
    undoType: "added",
  },
  {
    animated: false,
    id: "b37abb98-5089-4424-9620-5244437b8cc1",
    source: "a8cfd02a-cd07-44b5-9959-e4c41cbf9f0d",
    target: "24d1a06f-414c-4c77-921c-9320f7a478c9",
    type: "buttonEdge",
    undoType: "added",
  },
  {
    animated: false,
    id: "87c9c623-1b2a-4321-9814-508ec34e26e4",
    source: "24d1a06f-414c-4c77-921c-9320f7a478c9",
    target: "313028fd-143f-400d-9c6e-cec8263e1dcf",
    type: "buttonEdge",
    undoType: "added",
  },
  {
    animated: false,
    id: "81cedf58-8c46-4eb4-9094-70a44de61dc4",
    source: "24d1a06f-414c-4c77-921c-9320f7a478c9",
    target: "1b796dc8-77f0-43d0-a04f-901eaa9f6411",
    type: "buttonEdge",
    undoType: "added",
  },
  {
    animated: false,
    id: "926c9768-a96e-416c-aa81-bcb1302416ac",
    source: "24d1a06f-414c-4c77-921c-9320f7a478c9",
    target: "814f093f-723b-4c02-a810-fb1e16b47156",
    type: "buttonEdge",
    undoType: "added",
  },
  {
    animated: false,
    id: "158803f1-60e9-48ff-a1d3-89d92832eb78",
    source: "86827c2e-04e6-4a6b-b398-dfec058cd1b8",
    target: "e6baf6fa-e8e1-4756-bca1-ea29a1947f8b",
    type: "buttonEdge",
    undoType: "added",
  },
  {
    animated: false,
    id: "852c60f1-a5f8-4b3c-9cdb-c7cc204a4410",
    source: "86827c2e-04e6-4a6b-b398-dfec058cd1b8",
    target: "3c76a241-9ea0-4c59-8305-aaa795e1d32f",
    type: "buttonEdge",
    undoType: "added",
  },
  {
    animated: false,
    id: "e452f9b3-5046-4a9c-a270-fb36cc7c988a",
    source: "77442481-3970-4f9d-9153-b3f9a01d1a00",
    target: "fe808f19-6940-4c69-bbb5-c570870131ea",
    type: "buttonEdge",
    undoType: "added",
  },
  {
    animated: false,
    id: "e43b2899-f313-4074-8f44-d77feaa36c20",
    source: "77442481-3970-4f9d-9153-b3f9a01d1a00",
    target: "2f2b8910-0af3-437a-b1d2-fbf0da230aed",
    type: "buttonEdge",
    undoType: "added",
  },
  {
    animated: false,
    id: "8a1a4cc0-89a0-4483-a2c5-9109bb33188b",
    source: "2f2b8910-0af3-437a-b1d2-fbf0da230aed",
    target: "e1587d23-1328-47a6-b7c7-d167f319e801",
    type: "buttonEdge",
    undoType: "added",
  },
];
