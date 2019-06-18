import React from 'react';
import './newGroupsPage.css';
import {Dialog,} from "@material-ui/core";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import OpenInBroswerIcon from "@material-ui/icons/OpenInBrowser";


class NewGroupsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focus: '',
      clicked: '',
    };
    this.refUploaderText = React.createRef();
  }

  handleFocus(focus) {
    this.setState({
      focus,
    });
  }

  handleBlur() {
    this.setState({
      focus: '',
    });
  }

  getClassName(part) {
    let className;
    if (this.state.focus === '') {
      className =  "";
    } else {
      className = part === this.state.focus ? "gp-focus" : "gp-blur";
    }
    if (this.state.clicked === part) {
      className += " active";
    }
    return className;
  }

  render() {
    return <Dialog fullScreen
                   open={this.props.isOpen}>
      <input type="file"
             id="file"
             ref={this.refUploaderText}
             accept="text/plain"
             onChange={this.props.handleUploadGroups}
             hidden/>
      <div id="gp-container">
        <OptionPanel id_="gp-upload"
                     className_={"gp-action " + this.getClassName('left')}
                     handleFocus={() => this.handleFocus('left')}
                     handleClick={() => {
                       this.setState({clicked: 'left'});
                       this.refUploaderText.current.click();
                     }}
                     handleBlur={this.handleBlur.bind(this)}>
          <OpenInBroswerIcon className="svg_icon"/>
          <h1 className="gp-desc">Upload Groups</h1>
        </OptionPanel>
        <OptionPanel id_="gp-generate"
                     className_={"gp-action " + this.getClassName('right')}
                     handleFocus={() => this.handleFocus('right')}
                     handleClick={() => {
                       this.setState({clicked: 'right'});

                     }}
                     handleBlur={this.handleBlur.bind(this)}>
          <GroupAddIcon className="svg_icon"/>
          <h1 className="gp-desc">Generate Groups</h1>
        </OptionPanel>
      </div>
    </Dialog>
  }
}


class OptionPanel extends React.Component {
  render() {
    return <div id={this.props.id_}
                className={this.props.className_}
                onMouseEnter={this.props.handleFocus}
                onClick={this.props.handleClick}
                onBlur={this.props.handleBlur}>
      <div className="gp-table">
        <div className="gp-child">
          {this.props.children}
        </div>
      </div>
    </div>
  }
}

export default NewGroupsPage;
