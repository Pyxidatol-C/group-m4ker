import React from 'react';
import './newGroupsPage.css';
import {Dialog, Fab, Snackbar} from "@material-ui/core";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import OpenInBroswerIcon from "@material-ui/icons/OpenInBrowser";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";


class NewGroupsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focus: '',
      clicked: '',
      nbGroups: props.nbGroups,
    };

    this.refUploaderText = React.createRef();
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleClickLeft = this.handleClickLeft.bind(this);
    this.handleClickRight = this.handleClickRight.bind(this);
  }

  handleMouseEnter(focus) {
    this.setState({
      focus,
      clicked: this.state.clicked === 'left' && this.refUploaderText.current.value === "" ? '' : this.state.clicked,
    });
  }

  handleMouseLeave() {
    this.setState({
      focus: '',
    });
  }

  getClassName(part) {
    let className;
    if (this.state.focus === '') {
      className = "";
    } else {
      className = part === this.state.focus ? "gp-focus" : "gp-blur";
    }
    if (this.state.clicked === part) {
      className = "gp-focus active";
    }
    return className;
  }

  handleClickLeft() {
    if (this.state.clicked) return;
    this.setState(
        {clicked: 'left'},
        () => this.refUploaderText.current.click()
    );
  }

  handleClickRight() {
    if (this.state.clicked) return;
    this.setState(
        {clicked: 'right'}
    );
    setTimeout(
        () => this.props.handleGenerateGroups(this.state.nbGroups),
        100,
    );

  }

  canIncrementNb() {
    return this.state.nbGroups + 1 <= this.props.maxNbGroups;
  }

  canDecrementNb() {
    return this.state.nbGroups - 1 > 0;
  }

  incrementNb() {
    this.setState({nbGroups: this.state.nbGroups + 1});
  }

  decrementNb() {
    this.setState({nbGroups: this.state.nbGroups - 1});
  }

  render() {
    return <Dialog fullScreen
                   open={this.props.isOpen}>
      <input type="file"
             id="file"
             ref={this.refUploaderText}
             accept="text/plain"
             onChange={(e) => this.props.handleUploadGroups(e, () => this.setState({clicked: ''}))}
             hidden/>
      <div id="gp-container">
        <OptionPanel id_="gp-upload"
                     className_={"gp-action " + this.getClassName('left')}
                     handleFocus={() => this.handleMouseEnter('left')}
                     handleBlur={this.handleMouseLeave.bind(this)}>
          <OpenInBroswerIcon className="svg_icon clickable"
                             onMouseEnter={() => this.handleMouseEnter('left')}
                             onMouseLeave={this.handleMouseLeave}
                             onClick={this.handleClickLeft}/>
          <h1 className="gp-desc">
            Upload Groups
          </h1>
        </OptionPanel>
        <OptionPanel id_="gp-generate"
                     className_={"gp-action " + this.getClassName('right')}>
          <GroupAddIcon className="svg_icon clickable"
                        onMouseEnter={() => this.handleMouseEnter('right')}
                        onMouseLeave={this.handleMouseLeave}
                        onClick={this.handleClickRight}/>
          <h1 className="gp-desc ">
            Generate {this.state.nbGroups} Groups
          </h1>
          <div className={"gp-toolbar"}>
            <Fab color="primary"
                 disabled={!this.canIncrementNb()}
                 onClick={() => this.incrementNb()}>
              <AddIcon/>
            </Fab>
            <Fab color="secondary"
                 disabled={!this.canDecrementNb()}
                 onClick={() => this.decrementNb()}>
              <RemoveIcon/>
            </Fab>
          </div>
        </OptionPanel>
      </div>
      <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          open={this.state.clicked === "right"}
          message={
            <span>
                Processing ...
              </span>
          }
      />
    </Dialog>
  }
}


class OptionPanel extends React.Component {
  render() {
    return <div id={this.props.id_}
                className={this.props.className_}>
      <div className="gp-table">
        <div className="gp-child">
          {this.props.children}
        </div>
      </div>
    </div>
  }
}

export default NewGroupsPage;
