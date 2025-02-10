import React from "react";
import logo from "./logo.svg";
import "./App.css";
// import IconMenu from "./components/Menu";
// import Button from "@mui/material/Button";
// import DividedList from "./components/List";
// import VerticalLinearStepper from "./components/VerticalStepper";
import PersistentDrawerLeft from "./components/PersistentDrawLeft";
import Footer from "./components/Footer";
import IOBrowser from "@interopio/browser";
import IODesktop from "@interopio/desktop";
import { IOConnectProvider, useIOConnect } from "@interopio/react-hooks";
import IOConnectIntentsResolver from "@interopio/intents-resolver-api";
import IOWorkspaces from "@interopio/workspaces-api";
// import Wrapper from "./components/Wrapper";
// import { registerInterception } from "./components/helper";
function App() {
  const settings = {
    browser: {
      factory: IOBrowser,
      config: {
        libraries: [IOWorkspaces ],
        appManager: "full"
      },
    },
  };
  const settingsDesktop = {
    desktop: {
      factory: IODesktop,
      config: {
        libraries: [IOWorkspaces ],
        appManager: "full"
      },
    },
  };
  
  return (
    <IOConnectProvider settings={settingsDesktop}>
      <PersistentDrawerLeft />
      <Footer />
    </IOConnectProvider>
  );
}

export default App;
