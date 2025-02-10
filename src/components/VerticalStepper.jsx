import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { useContext, useState } from "react";
import { IOConnectContext, useIOConnect } from "@interopio/react-hooks";

import {
  subscribeForSharedContext,
  updateContexts,
  subscribeForIntentAvailable,
  setAppDefs,
  registerShowCallerMethod,
  stepZero,
  registerSyncContact,
  raiseTaskIntent
} from "./helper";
import { Height } from "@mui/icons-material";

// async function getInitialContext(contextName, io) {
//   const contexts = await io.contexts.all();
//   const doesExist = contexts.includes(contextName);

//   if (doesExist) {
//     const { clientID } = await io.contexts.get(contextName);

//     console.log("Context Name : " + clientID);
//   }
// }

// function handleContextUpdate(data) {
//   const mdata = data;

//   console.log(mdata);
// }

// function startLstener(io) {
//   const contextName = "T42.Demo.Client";
//   getInitialContext(contextName, io);
// }

// const vsteps = [
//   {
//     label: "Validate Customer",
//     description: `Confirm the identity of the Policy Holder and review existing policies.`,
//   },
//   {
//     label: "Select Call Action",
//     description: "Select Call Action",
//   } 
// ];
const mTAsteps = [
  {
    label: "Validate Customer",
    description: `Confirm the identity of the Policy Holder and review existing policies.`,
  },
  {
    label: "Start MTA Process",
    description: "Select the MTA Type",
  },
  {
    label: "Update CRM with new address",
    description: `Update and validate the policy address in Salesforce`,
  },

  {
    label: "Raise new Quotes",
    description: `Generate a new House and Motor Quote and agree new premium schedule with customer`,
  },
  {
    label: "Take premium payment",
    description: `Process Debit or Credit Card payment or refund for premium adjustment`,
  },
  {
    label: "Update Motor & Home PAS",
    description: `Confirm Policy changes in PASs`,
  },
  {
    label: "Update CRM with new Policy Information",
    description: `Update Cutomer Record with new premium and policy detals in Salesforce.`,
  },

  {
    label: "Wrap up call",
    description: `Complete call wrap up record`,
  },
];

export default function VerticalLinearStepper(cname) {

  const [vsteps, setVsteps] =  useState([
    {
      label: "Validate Customer",
      description: `Confirm the identity of the Policy Holder and review existing policies.`,
    },
    {
      label: "Select Call Action",
      description: "Select Call Action",
    } 
  ]);
  const [mTAsteps, setMTAsteps] = ([
    {
      label: "Validate Customer",
      description: `Confirm the identity of the Policy Holder and review existing policies.`,
    },
    {
      label: "Start MTA Process",
      description: "Select the MTA Type",
    },
    {
      label: "Update CRM with new address",
      description: `Update and validate the policy address in Salesforce`,
    },
  
    {
      label: "Raise new Quotes",
      description: `Generate a new House and Motor Quote and agree new premium schedule with customer`,
    },
    {
      label: "Take premium payment",
      description: `Process Debit or Credit Card payment or refund for premium adjustment`,
    },
    {
      label: "Update Motor & Home PAS",
      description: `Confirm Policy changes in PASs`,
    },
    {
      label: "Update CRM with new Policy Information",
      description: `Update Cutomer Record with new premium and policy detals in Salesforce.`,
    },
  
    {
      label: "Wrap up call",
      description: `Complete call wrap up record`,
    },
  ]);
  const io = useContext(IOConnectContext);
  const [activeStep, setActiveStep] = React.useState(0);
  const [procType, setProcType] = useState('');
  const [mtaType, setMtaType] = useState('');

  const handleClientChange = async (update) => {
    // console.log("handler called : ");
    // console.log(update.addresses);
    const newContext = {
      address: update.addresses[0],
    };
    await io.contexts.setPath(
      "T42.Demo.Client",
      "address",
      update.addresses[0]
    );
  };

  const handleShowCallerMethod = async (params) => {
    console.log("handleShowCallerMethod Params : " + params);
    console.log(params);
    const contactObj = {
      contact: {
        ids: [{
          "systemName": "SalesforceAdapter",
          "nativeId": "003QH00000AGQGxYAP",
        }]
      }
    }

    stepZero(params, io);

    const methodName = "T42.CRM.SyncContact";
    const args = contactObj;
    const target = "all";
    const options = {
      waitTimeoutMs: 5000,
      methodResponseTimeoutMs: 8000,
    };

    const result = await io.interop.invoke(methodName, args, target, options);
    console.log("T42.CRM.SyncContact");
    console.log(result);
  };
  const T42SyncContactHandler = async (T42Contact) => {
    console.log("T42Contact : ");
    console.log(T42Contact);

  };
  const intentAvailable = async (update) => {
    console.log("Insurance_Desktop_demo is available");
  };

  useIOConnect(subscribeForIntentAvailable(intentAvailable));
  useIOConnect(subscribeForSharedContext(handleClientChange));
  useIOConnect(registerShowCallerMethod(handleShowCallerMethod));
  useIOConnect(registerSyncContact(T42SyncContactHandler));

  const [process, setProcess] = useState(() => {
    return "validate";
  });

  // const [stage, setStage] = useState(() => {
  //   return 0;
  // });
  // const [client, setClient] = useState(() => {
  //   return "";
  // });

  let steps;

  if (process == "validate") {
    steps = vsteps;
  } else {
    steps = mTAsteps;
  }

  // set the process type in Kestra
  const setProcessType = async () => {
    const methodName = "setProcessType";
    const args = {
      "processType": procType
    }
    const target = "all";
    const NLoptions = {
      waitTimeoutMs: 5000,
      methodResponseTimeoutMs: 8000
    };
    const result = await io.interop.invoke(methodName, args, target, NLoptions);

    console.log(result);
  }
  const setMTAType = async () => {
    const methodName = "setProcessType";
    const args = {
      "processType": mtaType
    }
    const target = "all";
    const NLoptions = {
      waitTimeoutMs: 5000,
      methodResponseTimeoutMs: 8000
    };
    const result = await io.interop.invoke(methodName, args, target, NLoptions);
    //if (result.returned.jsonMenuOptions !== null || result.returned.jsonMenuOptions !== "") {
      console.log("steps")
      console.log(steps)

      steps = result.returned.jsonMenuOptions;
      console.log("steps")
      console.log(steps)
   // }
    console.log(result);
  }
  // Retrieve nextLayout from Kestra flow
  const getNextLayout = async () => {
    const methodName = "getNextLayout";
    const args = {
      "previousStep": 1,
      "b": 2
    };
    const target = "all";
    const NLoptions = {
      waitTimeoutMs: 5000,
      methodResponseTimeoutMs: 8000
    };
    const result = await io.interop.invoke(methodName, args, target, NLoptions);
    const testJsonString = '{"type": "group", "children": [{"type":"window", "appName": "clientlist"},{ "type": "window","appName": "clientportfolio"}]}';
    //console.log(JSON.stringify(result.returned.nextLayout));
    const pJson = JSON.parse(result.returned.nextLayout);
    console.log(pJson);
    return pJson;
  }
  const updateNarrative = async (update) => {
    const context = await io.contexts.get("T42.Demo.Client")
    const currentN = context.callNarrative;
    let updateT = "";
    if (currentN == undefined) {
      console.log("callNarratve is null");
      updateT = update

    } else {
      console.log(currentN);
      updateT = currentN + " \n " + update;
    }

    await io.contexts.setPath(
      "T42.Demo.Client",
      "callNarrative",
      updateT
    );
  }
  // ================================ handleNext ===================================================
  const handleNext = async () => {

    // ================ Step Zero currently hardcoded ==================
    if (activeStep === 0 && process == "validate") {
      // Before anything has been done
      // TO DO trigger all of this stage in the accept call handler - recieve invoke from the twillio plugin
      ;
      console.log("IO : activeStep : " + activeStep);
      console.log("Narative : Setup with customer name");
      console.log("process : " + process);


      updateNarrative("Started call with " + cname.client)


      setActiveStep((prevActiveStep) => prevActiveStep + 1);

      // ======================  step one =====================
    } else if (activeStep === 1 && process === "validate") {
      // Validating the customer SF + Dashboards


      //const ws = await io.workspaces?.getMyWorkspace();
      //console.log("IO : activeStep : " + activeStep + " : " + process);
      //console.log("IO : Narative : We have chosen tha call action");
      setProcess("mta");
      //console.log("IO : Narative : We have set process to mta");
      updateNarrative(cname.client + " is moving house");


      // invoke setProcessType 
      const methodName = "setProcessType";
      const args = {
        "processType": procType
      }
      const target = "all";
      const NLoptions = {
        waitTimeoutMs: 5000,
        methodResponseTimeoutMs: 8000
      };
      // first setProcessTYype
      const result = await io.interop.invoke(methodName, args, target, NLoptions);

      console.log(result);

      //setStage(2);
      //setActiveStep((prevActiveStep) => prevActiveStep + 1);
      // ====================== step 1 MTA ==============================
    } else if (activeStep === 1 && process === "mta") {
      console.log("IO : activeStep : " + activeStep + " : " + process);

      console.log("IO : Narative : We have chosen the MTA type");
      //   This needs to be integrated with Lubo's LLM... ==============
      const options = {
        title: "Next Best Action",
        body: "Lubo thinks that this customer may be interested in buying house insurance, shall we raise a  home quote at the same time ",
        actions: [
          {
            action: "openClientPortfolio",
            title: "Open Home Quote"
          }
        ]
      };

      const setProcRTypeResult = await setMTAType();

      // ========= Get next layout from Kestra =============
      const pJson = await getNextLayout();

      // Raising a notification.
      const notification = await io.notifications.raise(options);
      // I think we should change to client edit here

      if (pJson.type === 'group') {
        // getting the parent of the existing middle window which should be a group so we can add the new app to it
        const mdWindow = await io.workspaces.getWindow(
          (window) => window.appName === "Motor Client Dashboard"
        );
        const hdWindow = await io.workspaces.getWindow(
          (window) => window.appName === "Home Client Dashboard"
        );
        hdWindow.close();

        // get the paret so we can add the group at the right level
        const tColumn = mdWindow.parent.parent.parent;

        // Add the new groups retrieved from Kestra to the parent
        const updatedGroupM = await tColumn.addGroup(pJson.groupdef[0]);
        const updatedGroupR = await tColumn.addGroup(pJson.groupdef[1]);

        mdWindow.close();

      }

      updateNarrative("Address updated");
      setActiveStep((prevActiveStep) => prevActiveStep + 1);


      // ============================== step 2 MTA ===========================
    } else if (activeStep === 2 && process === "mta") {
      // open quote screens
      const ws = await io.workspaces?.getMyWorkspace();
      console.log("IO : activeStep : " + activeStep + " : " + process);
      console.log("IO : Narative : We have updated SF");
      console.log("IO : now we are going display the quote apps");

      // get nextLayout from Kestra

      const nextLayout = await getNextLayout();

      if (nextLayout.type === 'group') {
        // getting the parent of the existing middle window which should be a group so we can add the new app to it
        const mdWindow = await io.workspaces.getWindow(
          (window) => window.appName === "Motor Edit Client"
        );
        const mdParent = mdWindow.parent.parent;
        console.log(mdParent.type);
        const hdWindow = await io.workspaces.getWindow(
          (window) => window.appName === "Home Edit Client"
        );
        hdWindow.close();
        const tColumn = mdWindow.parent.parent.parent;
        const updatedGroupM = await tColumn.addGroup(nextLayout.groupdef[0]);
        const updatedGroupR = await tColumn.addGroup(nextLayout.groupdef[1]);
        //const mdParent = mdWindow.parent;
        //mdParent.addWindow(mWinDef);
        mdWindow.close();
      } else if (nextLayout.type === 'app') {
        nextLayout.app.forEach(async app => {
          const p1 = await io.windows.open(app.appDef.name, app.appDef.URL, app.options);
        })
        // const p1 = await io.windows.open(nextLayout.appDef.name, nextLayout.appDef.URL, nextLayout.options);
      }



      updateNarrative("New quotes for Motor and Home created");
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else if (activeStep === 3) {
      // new quotes created
      console.log("IO : activeStep : " + activeStep + " : " + process);
      console.log("Narative : We have raised the new quotes");
      console.log("Narative : We have will now take payment");
      updateNarrative("New quotes for Motor and Home Accepted by customer");
      const nextLayout = await getNextLayout();
      console.log("nextLayout")
      console.log(nextLayout)



      if (nextLayout.type === 'app') {
        nextLayout.app.forEach(async app => {
          const p1 = await io.windows.open(app.appDef.name, app.appDef.URL, app.options);
        })
        //const p1 = await io.windows.open(nextLayout.appDef.name, nextLayout.appDef.URL, nextLayout.options);
      }

      setActiveStep((prevActiveStep) => prevActiveStep + 1);

      // ============= Step 4 migrate to getNextLayout ==================
    } else if (activeStep === 4) {
      const options = {
        title: "Next Best Action",
        body: "Lubo thinks that this would be a good time to ask the customer if we can arrange a call one month before the renewal to discuss their level of coverage ",

      };

      // Raising a notification.
      const notification = await io.notifications.raise(options);
      console.log("IO : activeStep : " + activeStep + " : " + process);
      console.log("Narative : We have taken payment");
      console.log("Narative : We will now update the PASs");
      updateNarrative("Payment sucessfull");
      const ws = await io.workspaces?.getMyWorkspace();
      // New Home Policy Page
      const r1GroupDef = {
        type: "group",
        children: [
          { appName: "Home New Policy", type: "window" }

        ],
      };


      const rightWindow = await io.workspaces.getWindow(
        (window) => window.appName === "Home Edit Client"
      );
      // const myWorkspace4 = await io.workspaces.getMyWorkspace();
      const hdParent = rightWindow.parent.parent;
      const gr1 = await hdParent.addGroup(r1GroupDef);
      rightWindow.close();

      // Motor Policy Page
      const l1GroupDef = {
        type: "group",
        children: [
          { appName: "Motor Edit Policy", type: "window" }

        ],
      };


      const leftWindow = await io.workspaces.getWindow(
        (window) => window.appName === "Motor Edit Client"
      );
      const myWorkspace5 = await io.workspaces.getMyWorkspace();
      const mdParent = leftWindow.parent.parent;
      const gl1 = await mdParent.addGroup(l1GroupDef);
      leftWindow.close();
      setActiveStep((prevActiveStep) => prevActiveStep + 1);


      // ==================== Step 5 ==================
    } else if (activeStep === 5) {
      console.log("IO : activeStep : " + activeStep + " : " + process);
      console.log("Narative : We have updated PASs");
      console.log("Narative : We have will now create a task in SFDC");
      raiseTaskIntent({ "customer": "Martyn Bedford" }, io)
      updateNarrative("Renweal Opportunity and Follup Call Task created");
      setActiveStep((prevActiveStep) => prevActiveStep + 1);

      // ==================== STep 6 ===================
    } else if (activeStep === 6) {
      console.log("IO : activeStep : " + activeStep + " : " + process);
      console.log("Narative : We have wrapped up the call");
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  const [age, setAge] = React.useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };
  const handleProcChange = (event) => {
    setProcType(event.target.value);
  }
  const handleMtaTypeChange = (event) => {
    setMtaType(event.target.value);
  }
  return (
    <Box sx={{ maxWidth: 400 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={
                index === steps.length - 1 ? (
                  <Typography variant="caption">Last step</Typography>
                ) : null
              }
            >
              {step.label}
            </StepLabel>
            <StepContent>
              <Typography>{step.description}</Typography>
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 1, mr: 1 }}
                >
                  {index === steps.length - 1 ? "Finish" : "Next"}
                </Button>

                <Button
                  disabled={index === 0}
                  onClick={handleBack}
                  sx={{ mt: 1, mr: 1 }}
                >
                  Back
                </Button>
              </Box>
              {index === 1 ? (
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Process</InputLabel>
                  {process === "validate" ? (
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={procType}
                      label="Process"
                      onChange={handleProcChange}
                    >
                      <MenuItem value={1}>Select Process </MenuItem>
                      <MenuItem value={"claim"}>Claim</MenuItem>
                      <MenuItem value={"mta"}>MTA</MenuItem>
                      <MenuItem value={"quote"}>New Quote</MenuItem>
                    </Select>
                  ) : (
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={mtaType}
                      label="Type"
                      onChange={handleMtaTypeChange}
                    >
                      <MenuItem value={1}>Select Type </MenuItem>
                      <MenuItem value={"addDriverToPolicy"}>Add Driver to policy</MenuItem>
                      <MenuItem value={"changeAddress"}>Change Address</MenuItem>
                      <MenuItem value={"addPointsToLicense"}>Add Points to Licence</MenuItem>
                    </Select>
                  )}
                </FormControl>
              ) : (
                ""
              )}
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Paper>
      )}
    </Box>
  );
}
