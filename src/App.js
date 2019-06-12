import React from 'react';
import logo from './club_logo.png';
import Button from '@material-ui/core/Button';
import './loadCSV';
import csv2promo from "./loadCSV";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      groups: [],
      students: [],
      queryName: "",
    };

    this.refUploaderCSV = React.createRef();
    this.onChooseCSV = this.onChooseCSV.bind(this);
    this.onUploadCSV = this.onUploadCSV.bind(this);
  }

  onChooseCSV() {
    this.refUploaderCSV.current.click();
  }

  onUploadCSV(e) {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onload = function(evt) {
      let res = evt.target.result;
      // csv2promo(res);
      console.log(csv2promo(res));
    };
    reader.readAsText(file);
  }

  render() {
    return (
        <div className="App">
          <img src={logo} className="App-logo" alt="logo"/>
          <div>{this.state.students.length}</div>

          <input type="file"
                 id="file"
                 ref={this.refUploaderCSV}
                 accept="text/csv"
                 onChange={this.onUploadCSV}
                 style={{display: "none"}}/>
          <Button variant="contained"
                  color="primary"
                  onClick={this.onChooseCSV}
                  className="uploadList">
            Upload List of Students
          </Button>
        </div>
    );
  }
}

export default App;
