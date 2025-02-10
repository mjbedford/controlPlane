import React, { useState, useContext, useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
// import VerticalLinearStepper from "./VerticalStepper";
import { IOConnectContext, useIOConnect } from "@interopio/react-hooks";
import { IOConnectBrowser } from "@interopio/browser";
import { IOConnectDesktop } from "@interopio/desktop";
import {
  subForCallerData,
  setSharedContext,
  registerInterception,
} from "./helper";
import VerticalLinearStepper from "./VerticalStepper";
const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme }) => ({
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: `-${drawerWidth}px`,
      variants: [
        {
          props: ({ open }) => open,
          style: {
            transition: theme.transitions.create('margin', {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
          },
        },
      ],
    }),
  );
  
  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })(({ theme }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
      {
        props: ({ open }) => open,
        style: {
          width: `calc(100% - ${drawerWidth}px)`,
          marginLeft: `${drawerWidth}px`,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      },
    ],
  }));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));
function handler(context, delta, removed) {
  const clientName = context.clientName;
  console.log("client Name : " + clientName);
  const elementTitle = document.getElementById("clientName");
  const fullname = document.getElementById("name");
  // elementTitle.textContent = `${context.clientName}`;
  if (fullname !== null) {
    fullname.innerHTML = `${context.clientName}`;
  } else {
    console.log("name not found");
  }

  // ioConnectMessage
  console.log("client Name : " + clientName);
}
// async function subscribe(io: IOConnectBrowser.API | IOConnectDesktop.API) {
//     // const newContext = {clientId: "0", clientName: ""};
//     // await io.contexts.set("T42.Demo.Client", newContext);
//     await io.contexts.subscribe("T42.Demo.Client", handler);
//     console.log("subscribed");
//     const ioImg = document.getElementById("name");

//   };

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const io = useContext(IOConnectContext);
  // useIOConnect(registerInterception());
  const [client, setClient] = useState("");
  // setSharedContext(io);
  // console.log("PDL : " + client);
  const clientN = "h";
  //    setClient("WRAP");
  const handleSub = async (context, delta, removed, clientN) => {
    clientN = context.clientName;
    console.log("PDL : client Name : " + clientN);
    const client = document.getElementById("name");
    if (client != null) {
      client.textContent = `${context.clientName}`;
    }
    // useEffect(() => {
    //   setClient(clientName);
    // },[])
  };
  const sub = async (io) => {
    await io.contexts.subscribe("T42.Demo.Client", handleSub);
  };
  // sub(io);
  // const client = "GREG";

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleMenuItemClick = (event, index, text) => {
    console.log("Menu Item Clicked : Index : " + index + " text : " + text);
  };
  // const callName = "bedford" as String;
  const [caller, setCaller] = useState("");
  useIOConnect(setSharedContext());
  useIOConnect(subForCallerData(setCaller));

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                mr: 2,
              },
              open && { display: "none" },
            ]}
          >
            <MenuIcon />
          </IconButton>
          <Typography id="name" variant="h6" noWrap component="div">
            {caller}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                onClick={(event) => handleMenuItemClick(event, index, text)}
              >
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {["All mail", "Trash", "Spam"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <VerticalLinearStepper client={caller} />
     </Main>
    </Box>
  );
}
