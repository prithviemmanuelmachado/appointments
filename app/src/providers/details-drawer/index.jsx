import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserDetails from "../../containers/user-details";
import AppointmentDetails from "../../containers/appointment-details";
import { Drawer } from "@mui/material";
import { Contianer } from "./index.style";

const DrawerContext = createContext();

export const DrawerProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  //extract id from location
  const pathname = location.pathname;
  const match = pathname.match(/\/(\d+)(\/|$)/);
  const id =  match ? match[1] : null;

  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (id) {
      setDrawerOpen(true);
    } else {
      setDrawerOpen(false);
    }
  }, [id]);

  const closeDrawer = () => {
    setDrawerOpen(false);
    navigate(-1);
  };

  return (
    <DrawerContext.Provider value={{ closeDrawer }}>
      {children}
      <Drawer
        open={drawerOpen}
        onClose={closeDrawer}
        anchor="right"
      >
        <Contianer>
        {
            pathname.includes('appointment-list')&&
            <AppointmentDetails id={id}/>

        }
        {
            pathname.includes('user-management-list')&&
            <UserDetails id={id}/>
        }
        </Contianer>
      </Drawer>
    </DrawerContext.Provider>
  );
};

export const useDrawer = () => useContext(DrawerContext);