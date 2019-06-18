import React from 'react';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import './homePage.css';
import {
  Dialog,
  Fab,
} from "@material-ui/core";


class HomePage extends React.Component {
  render() {
    return (
        <Dialog
            fullScreen
            className="homePage"
            open={this.props.isOpen}>
          <div className="homePage_button_container">
            <Fab color="primary"
                 aria-label="Upload list of students"
                 onClick={this.props.onClick}
                 variant="extended">
              <OpenInBrowserIcon/>
              Upload list of students
            </Fab>
          </div>
        </Dialog>
    );
  }
}

export default HomePage;
