import React from 'react';
import {Dialog} from "@material-ui/core";
import {AppBar, Button, IconButton, Fab, Toolbar, Typography} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";
import UndoIcon from "@material-ui/icons/Undo";
import RedoIcon from "@material-ui/icons/Redo";
import GetAppIcon from "@material-ui/icons/GetApp";
import CloseIcon from "@material-ui/icons/Close";
import PeopleIcon from "@material-ui/icons/People";
import "./groupsPage.css";


class GroupsPage extends React.Component {
  render() {
    return <Dialog fullScreen
                   open={this.props.isOpen}>
      <AppBar>
        <Toolbar className="gps-toolbar">
          <IconButton color="inherit">
            <CloseIcon/>
          </IconButton>

          <Typography variant="h5" className="gps-title">
            Groups of
            <Button color="inherit">
              <Typography variant="h5" className="gps-button-desc">
                Students
              </Typography>
              <PeopleIcon/>
            </Button>
          </Typography>

          <IconButton color="inherit">
            <SaveIcon/>
          </IconButton>
          <IconButton color="inherit">
            <UndoIcon/>
          </IconButton>
          <IconButton color="inherit">
            <RedoIcon/>
          </IconButton>

          <IconButton color="inherit">
            <GetAppIcon/>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Fab>

      </Fab>
    </Dialog>
  }
}

export default GroupsPage;
