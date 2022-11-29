import { AppBar, Toolbar, Typography } from "@mui/material";
import React from "react";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";

const styles = {
  title: {
    marginLeft: "12px",
  },
};

function Header() {
  const classes = styles;
  return (
    <AppBar color="primary" position="fixed">
      <Toolbar>
        <GraphicEqIcon />
        <Typography sx={classes.title} variant="h6" component="h1">
          Apollo Music Share
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
