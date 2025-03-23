"use client";
import { Box, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import LoginForm from "@/Components/Login/LoginForm";
import RegistrationForm from "@/Components/Login/RegistrationForm";
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ mt: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

function LoginTabs() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Box>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="secondary"
        textColor="inherit"
        variant="fullWidth"
      >
        <Tab label="Login" {...a11yProps(0)} />
        <Tab label="Registration" {...a11yProps(1)} />
      </Tabs>

      <TabPanel value={value} index={0}>
        <LoginForm />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <RegistrationForm setValue={setValue} />
      </TabPanel>
    </Box>
  );
}

export default LoginTabs;
