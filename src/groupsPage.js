import React from 'react';
import {Button, Dialog, IconButton, Snackbar, Toolbar, Typography} from "@material-ui/core";
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
      lastSavedGroups: this.props.groups,
      history: [],
      i: -1,
      isSaveWarningOpen: false,
    };

    this.refDownload = React.createRef();

    hash(JSON.stringify(this.props.promo)).then(
        (key) => {
          this.setState({
            key
          });
        }
    );
  }

  clearGroups() {
    // No need to actually clear this.state.groups
    this.props.handleGroupsChange({groups: [], key: ''});
    this.props.handleShowOp();
  }

  saveGroups(shouldShowWarning=true) {
    this.props.handleGroupsChange(this.state.groups);
    this.setState({
      lastSavedGroups: this.state.groups,
    });
    if (shouldShowWarning) {
      this.showSaveWarning();
    }
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

  downloadGroups() {
    this.saveGroups(false);
    this.refDownload.current.click();
  }

  render() {
    return <Dialog fullScreen
                   open={this.props.isOpen}>
      <a
          hidden
          ref={this.refDownload}
          href={`data: text/plain; charset=utf-8,${encodeURIComponent(JSON.stringify(this.state.groups))}`}
          download={`${this.props.promoName}_groups.txt`}
      >
        {JSON.stringify(this.state.groups)}
      </a>
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

        <IconButton color="inherit"
                    disabled={this.state.lastSavedGroups === this.state.groups}
                    onClick={this.saveGroups.bind(this)}>
          <SaveIcon/>
        </IconButton>
        <IconButton color="inherit">
          <UndoIcon/>
        </IconButton>
        <IconButton color="inherit">
          <RedoIcon/>
        </IconButton>

        <IconButton color="inherit" onClick={this.downloadGroups.bind(this)}>
          <GetAppIcon/>
        </IconButton>
      </Toolbar>

      <Snackbar
          anchorOrigin={{
            vertical: "top",
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
          action={
            <Button color="secondary" onClick={this.hideSaveWarning.bind(this)}>
              OK
            </Button>}
      />
      <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          open={this.state.groups.key !== this.state.key}
          message={
            <span>
                The list of students has changed!
              </span>
          }
          action={
            <Button color="secondary" onClick={this.clearGroups.bind(this)}>
              Go back
            </Button>
          }
      />
    </Dialog>
  }
}

export default GroupsPage;
