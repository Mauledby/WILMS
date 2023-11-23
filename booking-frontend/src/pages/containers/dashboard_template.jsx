import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Button, Icon } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BookIcon from "@mui/icons-material/Book";
import ListIcon from "@mui/icons-material/List";
import Wild from "../../images/wild.png";
import { useNavigate, useLocation } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { useContext } from "react";

const drawerWidth = 200;

// interface Props {
//   /**
//    * Injected by the documentation to work in an iframe.
//    * You won't need it on your project.
//    */
//   window?: () => Window;
// }

export default function DashBoardTemplate(props) {
  const{user}=useContext(AuthContext)
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const {logoutUser}=React.useContext(AuthContext)
  const testUserType = "admin";
  const navigate = useNavigate();

  // const handleNavItemClick = (item) => {
  //   navigate(item.link);

  //admin sidenav
  const adminNavItems = [
    // { name: "Home", icon: HomeIcon, path: "/" },
    { name: "Tracker", icon: DashboardIcon, path: "/tracker" },
    { name: "Calendar", icon: CalendarMonthIcon, path: "/calendar" },
    { name: "Logs", icon: BookIcon, path: "/logs" },
    { name: "Bookings", icon: ListIcon, path: "/bookings",},
  ];

  //user sidenav
  const userNavItems = [
    // { name: "Home", icon: HomeIcon, path: "/home" },
    { name: "Calendar", icon: CalendarMonthIcon, path: "/calendar" },
    { name: "Bookings", icon: ListIcon, path: "/bookings" },
  ];
  const NavItems = user?.role === "admin" ? adminNavItems : userNavItems;
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const selectedStyle = {
    backgroundColor: "#fecc00",
    fontFamily: "Poppins",
    borderRadius: "0px",
    color: "black",
  };
  const unselectedStyle = {
    backgroundColor: "#black",
    fontFamily: "Poppins",
    transition: "background 0.7s, color 0.7s",
    ":hover": {
      bgcolor: "#9c7b16",
      color: "white",
      fontFamily: "Poppins",
    },
  };
  const location = useLocation();

  const drawer = (
    // sidenav sidenavbar
    <div>
      <Toolbar sx={{ backgroundColor: "#fecc00" }}>
        <img src={Wild} alt="logo" width={200} height={50} />
      </Toolbar>
      {/* <Divider sx={{ backgroundColor: "white" }} /> */}
      {/* sidenav color */}
      <List sx={{ backgroundColor: "black" }}>
        {NavItems.map((item, index) => (
          <ListItem
            sx={item.path === location.pathname ? selectedStyle : unselectedStyle}
            key={index}
            disablePadding
          >
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemIcon sx={{ color: "white" }}>
                <Icon component={item.icon}></Icon>
              </ListItemIcon>
              <ListItemText
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontFamily: "Poppins",
                }}
                fontWeight="bold"
                primary={item.name}
              />
            </ListItemButton>
          </ListItem>
        ))}
        <br />

        <ListItem
          disablePadding
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#fecc00",
              borderColor: "#fecc00",
              width: "80%",
              color: "black",
              ":hover": {
                bgcolor: "#9c7b16",
                color: "white",
              },
              borderRadius: "10px",
            }}
            onClick={()=>{
              logoutUser()
            }}
          >
            <Typography fontFamily="Poppins" fontWeight="bold">
              Logout
            </Typography>
          </Button>
        </ListItem>
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    // main nav
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar sx={{ backgroundColor: "#fecc00" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          {/* Roboto Slab */}
          <Typography
            variant="h4"
            noWrap
            component="div"
            fontFamily="Poppins"
            color="black"
            fontWeight="bold"
          >
            {props.title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
          backgroundColor: "black",
        }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          PaperProps={{
            sx: {
              backgroundColor: "black",
            },
          }}
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
            border: "none",
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              border: "none",
              // sidenav color
              backgroundColor: "black",
            },
          }}
          PaperProps={{
            sx: {
              backgroundColor: "#white",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Typography paragraph>{/* eraseable */}</Typography>
        {props.children}
      </Box>
    </Box>
  );
}
