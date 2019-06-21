import React from 'react';
import {
  AppBar,
  Button,
  Card,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
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

function diffGroups(gps1, gps2) {
  for (let i = 0; i < gps1.length; i++) {
    for (let j = 0; j < gps1[i].length; j++) {
      if (gps1[i][j] !== gps2[i][j]) {
        return [gps1[i][j], gps2[i][j]];
      }
    }
  }
  return [];
}


class GroupsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastSavedGroups: this.props.groups,
      history: [this.props.groups],
      i: 0,
      selected1: null,
      selected2: null,
      swapped: [],
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

  groups() {
    return this.state.history[this.state.i];
  }

  clearGroups() {
    // No need to actually clear this.state.groups
    this.props.handleGroupsChange({groups: [], key: ''});
    this.props.handleShowOp();
  }

  saveGroups(shouldShowWarning = true) {
    this.props.handleGroupsChange(this.groups());
    this.setState({
      lastSavedGroups: this.groups(),
      swapped: [],
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
    const id = this.groups().groups[i][j];
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
      highlighted = this.findIdsOfSameProfile(this.groups().groups[selected1.i][selected1.j]);
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

  canUndo() {
    return this.state.i - 1 >= 0;
  }

  canRedo() {
    return this.state.i + 1 <= this.state.history.length - 1;
  }

  handleUndo() {
    this.setState({
      i: this.state.i - 1,
      selected1: null,
      selected2: null,
      highlighted: [],
      swapped: diffGroups(this.state.history[this.state.i].groups, this.state.history[this.state.i - 1].groups),
    });
  }

  handleRedo() {
    this.setState({
      i: this.state.i + 1,
      selected1: null,
      selected2: null,
      highlighted: [],
      swapped: diffGroups(this.state.history[this.state.i].groups, this.state.history[this.state.i + 1].groups),
    });
  }

  handleSwap() {
    const groups = JSON.parse(JSON.stringify(this.groups().groups));
    const a = this.state.selected1;
    const b = this.state.selected2;
    [groups[a.i][a.j], groups[b.i][b.j]] = [groups[b.i][b.j], groups[a.i][a.j]];  // hehe bj aaa
    const i = this.state.i + 1;
    const history = [...this.state.history.slice(0, i), {key: this.groups().key, groups}];
    this.setState({
      i,
      history,
      selected1: null,
      selected2: null,
      highlighted: [],
      swapped: [groups[a.i][a.j], groups[b.i][b.j]],
    })
  }

  hasPromoChanged() {
    return this.groups().key !== this.state.key;
  }

  renderGroups() {
    if (this.hasPromoChanged()) return [];
    return (
        <div className="gps-container">
          {(this.groups().groups.map((gp, i) => (
              <GroupBox
                  key={JSON.stringify(gp)}
                  groupNb={i}
                  groupIds={gp}
                  promo={this.props.promo}
                  swapped={this.state.swapped}
                  selected1={this.state.selected1}
                  selected2={this.state.selected2}
                  highlighted={this.state.highlighted}
                  handleClick={this.handleStudentClick.bind(this)}
              />
          )))}
        </div>
    );
  }

  render() {
    return <Dialog fullScreen
                   open={this.props.isOpen}>
      <a
          hidden
          ref={this.refDownload}
          href={`data: text/plain; charset=utf-8,${encodeURIComponent(JSON.stringify(this.groups()))}`}
          download={`${this.props.promoName}_groups.txt`}
      >
        {JSON.stringify(this.groups())}
      </a>
      <AppBar position="sticky">
        <Toolbar className="gps-toolbar">
          <IconButton color="inherit"
                      onClick={this.clearGroups.bind(this)}>
            <CloseIcon/>
          </IconButton>

          <Typography variant="h5" className="gps-title">
            Groups of
            <Button color="inherit" onClick={this.props.handleShowPromo}>
              <Typography variant="h5"
                          className="gps-button-desc">
                Students
              </Typography>
              <PeopleIcon/>
            </Button>
          </Typography>

          <IconButton color="inherit"
                      disabled={JSON.stringify(this.state.lastSavedGroups) === JSON.stringify(this.groups())}
                      onClick={this.saveGroups.bind(this)}>
            <SaveIcon/>
          </IconButton>
          <IconButton color="inherit"
                      disabled={!this.canUndo()}
                      onClick={this.handleUndo.bind(this)}
          >
            <UndoIcon/>
          </IconButton>
          <IconButton color="inherit"
                      disabled={!this.canRedo()}
                      onClick={this.handleRedo.bind(this)}
          >
            <RedoIcon/>
          </IconButton>

          <IconButton color="inherit" onClick={this.downloadGroups.bind(this)}>
            <GetAppIcon/>
          </IconButton>
        </Toolbar>
      </AppBar>

      {this.renderGroups()}

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

      <Dialog open={this.hasPromoChanged()}>
        <DialogContent>
          <DialogTitle>
            The list of students has changed!
          </DialogTitle>
          <DialogContentText>
            The loaded groups were generated using a different list.
            This means that the groups may be unfairly distributed.
            <br/>
            You can either upload another saved file, or generate new groups.
          </DialogContentText>
          <DialogActions>
            <Button onClick={this.props.handleShowPromo} color="default">
              View students
            </Button>
            <Button onClick={this.clearGroups.bind(this)} color="secondary">
              Ok
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>

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

  isSwapped(id) {
    return this.props.swapped.includes(id);
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
          <ListItemText primary={name} className={this.isSwapped(id) ? "gps-swapped" : ""}/>
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
