import axios from "axios";
// https://{your_hostname}/api/v1/executions/webhook/{namespace}/{flowId}/{key}
const KESTRA_START_FLOW_URL = "http://localhost:8080/api/v1/executions/webhook/io.connect/masterFlow/plmnkoijb012938"
const INTENT_CONTEXT_TYPE = "T42Contact";

export const stepZero = async (cname, io) => {
  console.log("IOConnect : cname : " + cname);
  // updateContexts({ name: cname.name, phone: cname.phone }, io);
  //export const stepZero = (cname) => async (io) => {
  //setStage(1);

  //  new workspace app
  const targetAppName = "SFDC";

  // Target a Workspaces App which will create the Workspace.
  const definition = { children: [], frame: { applicationName: targetAppName } };

  //await io.workspaces.createWorkspace(definition);

  // Target a Workspaces App which will restore the Workspace.
  //const restoreOptions = { applicationName: targetAppName , isSelected: false};
  const restoreOptions = { isSelected: false};
  //await io.workspaces.restoreWorkspace("SFDC", restoreOptions);
  await io.workspaces.restoreWorkspace("HOME PAS", restoreOptions);
  await io.workspaces.restoreWorkspace("Motor PAS", restoreOptions);
  console.log("StepZero");
  // start kestra flow
  //let responseMessage = "";

  //const callWebhook = async () => {
  //const webhookUrl = KESTRA_START_FLOW_URL; // Replace with your webhook URL

  const payload = {
    key1: "value1",
    key2: "value2",
  };

  try {
    const response = await axios.post(KESTRA_START_FLOW_URL, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Kestra response");
    console.log("Success: " + JSON.stringify(response.data));
  } catch (error) {
    console.log("Failed to call webhook: " + error.message);
  }

  const ws = await io.workspaces?.getMyWorkspace();
  // if (subsStarted) {
  if (ws != null) {
    // const windows = ws.getAllWindows();

    const targetElement = ws.getBox((boxElement) => {
      return boxElement.children.some(
        (child) => child.type === "group" || child.type === "window"
      );
    });

    //setTartgetEl(targetElement);

    // Column

    if (targetElement.type === "column") {
      console.log("Its a " + targetElement.type);
      const row = await targetElement.addRow();
      await row.addWindow({ appName: "Home  Dashboard" });
    } else if (targetElement.type === "group") {
      console.log("Its a " + targetElement.type);

      // ROW
    } else if (targetElement.type === "row") {
      // Get the id of the welcome app, we will close it later

      const welcomeWindow = await io.workspaces.getWindow(
        (window) => window.appName === "Welcome"
      );

      // Add tjhe SF Demo App

      const c0 = await targetElement.addColumn();
      const a0 = await c0.addGroup({
        type: "group",
        children: [{ appName: "Insurance_Desktop_demo", type: "window" }],
      });
      const a3 = await c0.addGroup({
        type: "group",
        children: [{ appName: "Salesfore-Contacts", type: "window" }],
      });

      // Update the shared context and raise the intent on the SF Demo App

      // updateContexts({ name: cname.client, phone: "0779 669 2467" }, io);

      // Close the welcome window app

      welcomeWindow.close();

      // Add the Motor Dash Board to Column 1 (middle)

      const c1 = await targetElement.addColumn();
      const a1 = await c1.addGroup({
        type: "group",
        children: [{ appName: "Motor Client Dashboard", type: "window" }],
      });

      // Add the Home Dashboard to Column2 (Right)

      const c2 = await targetElement.addColumn();
      const a2 = await c2.addGroup({
        type: "group",
        children: [{ appName: "Home Client Dashboard", type: "window" }],
      });

      //

      //setApp1(a1.id);
      //setApp2(a2.id);

      // setLeftWindow(c1);
      // setRightWindow(c2);
      updateContexts({ name: cname.name, phone: cname.phone }, io);
    }
  } else {
    console.log("WS Not Found !!");
  }
};

export const stepOne = async (cname, io) => { };
export const registerShowCallerMethod = (handler) => async (io) => {
  // Required name for the method to register.
  console.log("===================== ShowCaller =================");
  const methodName = "ShowCaller";
  const methodFilter = { name: methodName };
  const filteredMethods = io.interop.methods(methodFilter);
  if (filteredMethods.length < 1) {
    // Required callback that will handle client invocations.
    const mhandler = ({ clientName, phoneNumber }) => {
      console.log("ShowCaller : method invoked : name : " + clientName);
      handler({ name: clientName, phone: phoneNumber });

      const result = "succes";

      return result;
    };

    await io.interop.register(methodName, mhandler);
  }
};
export const registerSyncContact = (handler) => async (io) => {
  // Required name for the method to register.
  console.log("============ syncContact =========================");
  const methodName = "T42.CRM.SyncContact";
  const methodFilter = { name: methodName };
  const filteredMethods = io.interop.methods(methodFilter);
  // if (filteredMethods.length < 1) {
  // Required callback that will handle client invocations.
  const mhandler = (T42Contact) => {
    console.log(T42Contact);

    handler(T42Contact);

    const result = "succes";

    return result;
  };

  await io.interop.register(methodName, mhandler);
  // }
};
export const subForCallerData = (handler) => async (io) => {
  // Create a stream subscription.
  console.log(
    "======================= sub For Caller Data ========================"
  );
  const handleUpdates = async (context) => {
    handler(context.clientName);
  };
  const subscription = await io.contexts.subscribe(
    "T42.Demo.Client",
    handleUpdates
  );

  return subscription;
};

export const handleStep0 = () => (io) => { };

export const subscribeForSharedContext = (handler) => (io) => {
  // Subscribing for the shared context.
  io.contexts.subscribe("T42Contact", handler);
};
export const subscribeForIntentAvailable = (handler) => (io) => {
  const mhandler = (intentHandler) => {
    if (intentHandler.applicationName === "Insurance_Desktop_demo") {
      console.log(
        `App "${intentHandler.applicationName}" was registered as an Intent handler.`
      );
      handler();
    }
  };
  const unsubscribe = io.intents.onHandlerAdded(mhandler);
};
export const setSharedContext = () => async (io) => {
  console.log("==================== set shared context =====================");

  const newContext = {
    clientId: "120271",
    // clientName: "",
    // phoneNumber: "",
    // address: {},
    motorPolicy: {
      policyId: "MB1",
      premium: 320,
      make: "BMW",
      model: "Z3",
      registration: "YP15 UGY",
      age: 20,
      marketValue: 4500,
      postCode: "",
      parking: "Off Street",
    },
    motorPremium: 0,
    housePolicy: {
      type: "",
      postcode: "",
      numOfBedrooms: 0,
      age: 0,
      rebuildCost: 0,
    },
    housePremium: 0,
    processName: "",
    processStep: 0,
  };
  await io.contexts.set("T42.Demo.Client", newContext);
};

export const updateSharedContext = (update) => async (io) => {
  console.log("update shared context");

  const newContext = {
    address: update.addresses[0],
  };
  await io.contexts.updateContexts("T42.Demo.Client", newContext);
};

export const registerInterception = () => async (io) => {
  // Specify which API domains and which operations within them to intercept.
  console.log("registerInterception");
  const interceptions = [
    {
      domain: "intents",
      operation: "raise",
      // If an interception phase isn't explicitly specified here, the handler
      // will be invoked during both interception phases - before and after the default
      // platform implementation of the intercepted operation has been executed.
    },
  ];

  // Handler that will be invoked when the targeted platform operation has been intercepted.
  // The handler will receive as an argument an `InterceptionMessage` object describing the intercepted operation.
  const handler = (message) => {
    const phase = message.phase;
    console.log("intercepton handler");
  };

  // Configuration for registering an interception handler.
  const config = { interceptions, handler };

  // Registering an interception handler.
  await io.interception.register(config);
};
export const waitForIntent = async (name, io) => {
  const handler = (intentHandler) => {
    if (intentHandler.applicationName === name) {
      console.log(
        `App "${intentHandler.applicationName}" was registered as an Intent handler.`
      );
    }
  };

  const unsubscribe = io.intents.onHandlerAdded(handler);
};
export const raiseTaskIntent = async (data, io) => {
  console.log("Raise Task");
  console.log(data);
  // ================================ get T42.Demo.Client context =============

  const clientContext = await io.contexts.get("T42.Demo.Client");
  const totalPremium = parseFloat(clientContext.motorPremium) + parseFloat(clientContext.homePremium);

  // ========================= call log intent ===================

  const contactObj = {
    contact: {
      ids: [
        {
          systemName: "SalesforceAdapter",
          nativeId: "003QH00000AGQGxYAP",
        },
      ],
    },
  };
  const intentName = "LogContactCall";
  let found = false;
  while (found == false) {
    let a = await io.intents.find(intentName);

    if (a.length > 0) {
      found = true;
      console.log("LogContactCall found");
    } else {
      console.log("LogContactCall not found");
    }
  }
  const context = await io.contexts.get("T42.Demo.Client")
  console.log(context.callNarrative);
  if (found) {
    // Call lo need implementing in adapter
    io.intents
      .raise({
        context: {
          context: INTENT_CONTEXT_TYPE,
          data: {
            type: "Other",
            status: "Completed",
            subject: "Customer call log | " + data.customer,
            details:
              context.callNarrative, // maps to 'description'
            priority: "Normal",
            contact: {
              ids: [
                {
                  systemName: "SalesforceAdapter",
                  nativeId: "003QH00000AGQGxYAP",
                },
              ],
            }, // maps to 'whoid'
            empty: true,
          },
        },
        intent: "LogContactCall",
      })
      .then((callResult) => { })
      .catch((e) => {
        console.log(e.message);
      });
  }

  // ==========  create sf task for the call in 11 months time to discuss renewal ============

  const taskDate = new Date();
  taskDate.setDate(taskDate.getDate() + 334);
  const taskTimestamp = Math.floor(taskDate);
  const taskObject = {
    task: {
      description:
        "Contact the customer before the renewal date to discuss levels of cover ",
      subject: "Contact call " + data.customer + " to discuss renewal.",
      status: "Not Started",
      priority: "Normal",
      dueDate: taskTimestamp,
    },
  };

  const methodName = "T42.CRM.CreateTask";
  const args = taskObject;
  const target = "best";
  const options = {
    waitTimeoutMs: 5000,
    methodResponseTimeoutMs: 8000,
  };

  const result = await io.interop.invoke(methodName, args, target, options);
  console.log(result);

  //  ============ create opportunity for the renewal  =================
  const testDate = new Date();
  testDate.setDate(testDate.getDate() + 364);
  const ts = Math.floor(testDate);
  const opObject = {
    opportunity: {
      name: "Motor & House renewal | " + data.customer + " | Q4 2025 ",
      currency: "GBP",
      budget: totalPremium,
      status: "In Progress",
      state: "Open",
      closedDate: ts,
      probability: 50,
      description: "Multi cover renweal with existing customer ",
      // account: "003QH00000AGQGxYAP"
    },
  };

  const opMethodName = "T42.CRM.CreateOpportunity";
  const opargs = opObject;
  const optarget = "best";
  const opOptions = {
    waitTimeoutMs: 5000,
    methodResponseTimeoutMs: 8000,
  };

  const opresult = await io.interop.invoke(
    opMethodName,
    opargs,
    optarget,
    opOptions
  );
  console.log(result);

  // ======== sync contact =========

  const contObj = {
    contact: {
      ids: [
        {
          systemName: "SalesforceAdapter",
          nativeId: "003QH00000AGQGxYAP",
        },
      ],
    },
  };

  const cresult = await io.interop.invoke(
    "T42.CRM.SyncContact",
    contObj,
    "best",
    {
      waitTimeoutMs: 5000,
      methodResponseTimeoutMs: 8000,
    }
  );
  console.log("sync contact");
  console.log(cresult);
};
export const updateContexts = async (contactObj, io) => {
  // ================= SearchContact Intent to LO Component ==================
  console.log(contactObj);
  console.log("updateContexts");
  const intentName = "T42.InsuranceDemo.SearchContact";
  let found = false;
  while (found == false) {
    let a = await io.intents.find(intentName);

    if (a.length > 0) {
      found = true;
    }
  }
  if (found) {
    io.intents
      .raise({
        context: {
          context: INTENT_CONTEXT_TYPE,
          data: { ...contactObj }, // SF safety related destructuring
        },
        intent: intentName,
      })
      .then((callResult) => { })
      .catch((e) => {
        console.log(e.message);
      });
  }
  // ============================== syncContact interop method ====================
  console.log("syncContact interop method ");
  // console.log(params);

  const contactMethodObj = {
    contact: {
      ids: [
        {
          systemName: "SalesforceAdapter",
          nativeId: "003QH00000AGQGxYAP",
        },
      ],
    },
  };

  const methodName = "T42.CRM.SyncContact";
  const args = contactMethodObj;
  const target = "all";
  const options = {
    waitTimeoutMs: 5000,
    methodResponseTimeoutMs: 8000,
  };
  console.log("====== wait for method ===========");
  const arrived = await io.interop.waitForMethod(methodName);

  // let sfound = false;
  // while (sfound == false) {
  //   let s = await io.interop.servers({ name: methodName });

  //   if (s.length > 1) {
  //     console.log(s);
  //     sfound = true;
  //   }
  // }

  console.log("====== after wait for method =====");

  const result = await io.interop.invoke(methodName, args, target, options);
  console.log("T42.CRM.SyncContact");
  console.log(result);
  // ==============================================================================
};
export const setAppDefs = async (cname, io) => {
  // async function updateAppDefs(cname){
  console.log("================== setAppDefs ======================");
  const appType = "window";

  const definitions = [
    {
      name: "Home All Clients",
      title: "Home All Clients",
      type: appType,
      allowClearingCache: false,
      details: {
        url:
          "http://localhost:8080/html/client/all?client_page=0&client_size=10&client_sort=&client_search=" +
          cname.client,
        // mclient.client,
        left: 100,
        top: 100,
        width: 1000,
        height: 400,
      },
      customProperties: {
        includeInWorkspaces: true,
      },
    },
    {
      name: "Motor All Clients",
      title: "Motor All Clients",
      type: appType,
      allowClearingCache: false,
      details: {
        url:
          "http://ip-172-31-22-18.eu-west-2.compute.internal:8082/html/client/all?client_page=0&client_size=10&client_sort=&client_search=" +
          cname.client,
        // mclient.client,
        left: 100,
        top: 100,
        width: 1000,
        height: 400,
      },
      customProperties: {
        includeInWorkspaces: true,
      },
    },
  ];
  const mode = "merge";

  const importResult = await io.appManager.inMemory.import(definitions, mode);

  const importedApps = importResult.imported;
  const errors = importResult.errors;
};
