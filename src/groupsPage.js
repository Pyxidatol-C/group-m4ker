import React from 'react';
import {Dialog} from "@material-ui/core";
import {AppBar, Fab, Toolbar} from "@material-ui/core";
import {Save, SwapHoriz, Undo, Redo, GetApp, Delete, People} from "@material-ui/icons";


class GroupsPage extends React.Component {
  render() {
    return <Dialog fullScreen
                   open={this.props.isOpen}>
      <AppBar>
        <Toolbar>
        </Toolbar>
      </AppBar>

      <Fab>

      </Fab>
    </Dialog>
  }
}

export default GroupsPage;
