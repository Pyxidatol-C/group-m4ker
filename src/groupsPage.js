import React from 'react';
import {Button, Dialog, IconButton, Slide, Snackbar, Toolbar, Typography} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";
import UndoIcon from "@material-ui/icons/Undo";
import RedoIcon from "@material-ui/icons/Redo";
import GetAppIcon from "@material-ui/icons/GetApp";
import CloseIcon from "@material-ui/icons/Close";
import PeopleIcon from "@material-ui/icons/People";
import hash from './utils';
import "./groupsPage.css";


class GroupsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: this.props.groups,
      history: [],
      i: -1,
      isSaveWarningOpen: false,
    };

    hash(this.props.promo).then(
        (key) => this.promoKey = key
    );
  }

  clearGroups() {
    // No need to actually clear this.state.groups
    this.props.handleGroupsChange([]);
    this.props.handleShowOp();
  }

  saveGroups() {
    this.props.handleGroupsChange(this.state.groups);
    this.showSaveWarning();
  }

  showSaveWarning() {
    this.setState({
      isSaveWarningOpen: true,
    });
  }

  hideSaveWarning() {
    this.setState({
      isSaveWarningOpen: false,
    });
  }

  render() {
    const Transition = React.forwardRef(function Transition(props, ref) {
      return <Slide direction="right" ref={ref} {...props} />;
    });

    return <Dialog fullScreen
                   TransitionComponent={Transition}
                   open={this.props.isOpen}>
      <Toolbar className="gps-toolbar">
        <IconButton color="inherit"
                    onClick={this.clearGroups.bind(this)}>
          <CloseIcon/>
        </IconButton>

        <Typography variant="h5" className="gps-title">
          Groups of
          <Button color="inherit">
            <Typography variant="h5"
                        onClick={this.props.handleShowPromo}
                        className="gps-button-desc">
              Students
            </Typography>
            <PeopleIcon/>
          </Button>
        </Typography>

        <IconButton color="inherit" onClick={this.saveGroups.bind(this)}>
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

      <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          open={this.state.isSaveWarningOpen}
          onClose={this.hideSaveWarning.bind(this)}
          message={
            <span>
                Groups saved UNTIL this tab is closed.
                Use <GetAppIcon/> to download the groups.
              </span>
          }
      />
      <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          open={this.state.isSaveWarningOpen}
          onClose={this.hideSaveWarning.bind(this)}
          message={
            <span>
                Groups saved UNTIL this tab is closed.
                Use <GetAppIcon/> to download the groups.
              </span>
          }
          action={<Button color="secondary">OK</Button>}
      />
      <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={this.state.isSaveWarningOpen}
          onClose={this.hideSaveWarning.bind(this)}
          message={
            <span>
                Groups saved UNTIL this tab is closed.
                Use <GetAppIcon/> to download the groups.
              </span>
          }
          action={<Button color="secondary">OK</Button>}
      />
    </Dialog>
  }
}

export default GroupsPage;
