import React from 'react';
import logo from './club_logo.png';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import './loadCSV';
import './App.css';
import csv2promo from "./loadCSV";
import StudentsTableDialog from "./studentsTable";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      groups: [],
      fileName: "IB Students",
      students: [],
      tableOpen: false,
      loading: false,
    };

    this.refUploaderCSV = React.createRef();
    this.onChooseCSV = this.onChooseCSV.bind(this);
    this.onUploadCSV = this.onUploadCSV.bind(this);
    this.handleTableOpen = this.handleTableOpen.bind(this);
    this.handleTableClose = this.handleTableClose.bind(this);
    this.handleTableSave = this.handleTableSave.bind(this);
  }

  onChooseCSV() {
    this.refUploaderCSV.current.click();
  }

  onUploadCSV(e) {
    try {
      let file = e.target.files[0];
      let reader = new FileReader();
      reader.onload = (evt) => {
        let content = evt.target.result;
        let students = csv2promo(content);
        this.setState({
          students,
          fileName: file.name.split('.').slice(0, -1).join('.')
        });
      };
      reader.readAsText(file);
    } catch (e) {
      console.log(e);
    }
  }

  handleTableOpen() {
    this.setState({tableOpen: true});
  }

  handleTableClose() {
    this.setState({
      tableOpen: false,
      loading: true
    });
    setTimeout(
        () => {
          this.setState({
            loading: false
          });
        },
        500
    );
  }

  handleTableSave(students) {
    this.setState({students});
    this.handleTableClose();
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
          <Button variant="outlined"
                  color="primary"
                  disabled={this.state.loading}
                  onClick={this.onChooseCSV}>
            Upload List of Students
          </Button>
          <Button variant="outlined"
                  color="secondary"
                  disabled={this.state.students.length === 0 || this.state.loading}
                  onClick={this.handleTableOpen}>
            Edit List of Students
          </Button>
          <div>
            <LinearProgress className={this.state.loading ? '' : 'invisible'}/>
          </div>
          <StudentsTableDialog key={JSON.stringify(this.state.students + this.state.tableOpen)}
                               students={this.state.students}
                               fileName={this.state.fileName}
                               tableOpen={this.state.tableOpen}
                               handleTableOpen={this.handleTableOpen}
                               handleTableClose={this.handleTableClose}
                               handleTableSave={this.handleTableSave}/>
        </div>
    );
  }
}

export default App;
