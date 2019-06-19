import React from 'react';
import {
  AppBar,
  Button,
  Card,
  Dialog,
  Divider,
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Toolbar,
  Typography
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";
import UndoIcon from "@material-ui/icons/Undo";
import RedoIcon from "@material-ui/icons/Redo";
import GetAppIcon from "@material-ui/icons/GetApp";
import CloseIcon from "@material-ui/icons/Close";
import PeopleIcon from "@material-ui/icons/People";
import hash from './utils';
import "./groupsPage.css";


function isPosEq(x, y) {
  if (x === null || y === null) {
    return x === y;
  }
  return x.i === y.i && x.j === y.j;
}

function hasSameProfile(s1, s2) {
  return s1.gender === s2.gender
      && s1.leader === s2.leader
      && s1.bio === s2.bio
      && s1.chm === s2.chm
      && s1.phy === s2.phy;
}


class GroupsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: this.props.groups,
      lastSavedGroups: this.props.groups,
      history: [],
      i: -1,
      selected1: null,
      selected2: null,
      highlighted: [],
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

  saveGroups(shouldShowWarning = true) {
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

  findIdsOfSameProfile(id) {
    const s1 = this.props.promo[id];
    const ids = [];
    for (const [i, s2] of this.props.promo.entries()) {
      if (i !== id) {
        if (hasSameProfile(s1, s2)) {
          ids.push(i);
        }
      }
    }
    return ids;
  }

  handleStudentClick(i, j) {
    const x = {i, j};
    const id = this.state.groups.groups[i][j];
    let selected1, selected2;
    if (this.state.selected1 === null) {
      selected1 = x;
      selected2 = null;
    } else if (isPosEq(x, this.state.selected1)) {
      selected1 = null;
      selected2 = null;
    } else {
      if (this.state.highlighted.includes(id)) {
        selected1 = this.state.selected1;
        selected2 = x;
      } else {
        selected1 = x;
        selected2 = null;
      }
    }
    let highlighted;
    if (selected1 !== null && selected2 === null) {
      highlighted = this.findIdsOfSameProfile(this.state.groups.groups[selected1.i][selected1.j]);
    } else {
      highlighted = [];
    }

    this.setState({
      selected1,
      selected2,
      highlighted,
    })
  }

  canSwap() {
    return this.state.selected1 !== null && this.state.selected2 !== null;
  }

  handleSwap() {

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
      <AppBar position="sticky">
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
      </AppBar>

      <div className="gps-container">
        {(this.state.groups.groups.map((gp, i) => (
            <GroupBox
                key={JSON.stringify(gp)}
                groupNb={i}
                groupIds={gp}
                promo={this.props.promo}
                selected1={this.state.selected1}
                selected2={this.state.selected2}
                highlighted={this.state.highlighted}
                handleClick={this.handleStudentClick.bind(this)}
            />
        )))}
      </div>
      <div className="gps-fab-container">
        <Fab
            variant="extended"
            color="secondary"
            disabled={!this.canSwap()}
            onClick={this.handleSwap.bind(this)}
        >
          <SwapHorizIcon/>
          Swap!
        </Fab>
      </div>

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
            horizontal: "left",
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


class GroupBox extends React.Component {
  isSelected(j) {
    const x = {i: this.props.groupNb, j};
    return isPosEq(x, this.props.selected1) || isPosEq(x, this.props.selected2);
  }

  isHighlighted(id) {
    return this.props.highlighted.includes(id);
  }

  getPersonBox(id, j) {
    const name = this.props.promo[id].name;
    return (
        <ListItem
            button
            className={this.isHighlighted(id) ? "gps-highlighted" : ""}
            selected={this.isSelected(j)}
            key={id + "/" + j}
            divider={j !== this.props.groupIds.length - 1}
            onClick={() => this.props.handleClick(this.props.groupNb, j)}
        >
          <ListItemText primary={name}/>
        </ListItem>
    );
  }

  render() {
    return (
        <Card className="gps-box">
          <List>
            <Typography variant="h5" className="gps-box-title">
              Group {String.fromCharCode(65 + this.props.groupNb)}
            </Typography>
            <Divider variant="middle"/>
            {this.props.groupIds.map((id, j) => this.getPersonBox(id, j))}
          </List>
        </Card>
    );
  }
}

export default GroupsPage;
