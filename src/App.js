import React from 'react';
import './loadCSV';
import './App.css';
import csv2promo from "./loadCSV";
import makeGroups from './students';
import HomePage from "./homePage";
import PromoPage from "./promoPage";
import NewGroupsPage from "./newGroupsPage";

// TODO snackbar
// TODO avatar
// TODO dropzone

const STAGE = {
  newPromo: 0,
  promo: 1,
  newGroups: 2,
  groups: 3,
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nbGroups: 10,
      groups: [], // [[54,19,57,18,28,23],[55,25,32,35,3,51],[36,11,26,31,48,46],[45,53,17,14,56,43],[58,8,10,0,13,6],[39,27,40,29,21,33],[37,49,16,38,9,12],[34,52,15,5,50,47],[24,7,20,30,22,2],[41,42,4,1,44]],
      fileName: "IB Students",
      students: [],
      stage: STAGE.newPromo,
    };

    this.refUploaderCSV = React.createRef();
    this.handleHomeOpen = this.handleHomeOpen.bind(this);
    this.handleChooseCSV = this.handleChooseCSV.bind(this);
    this.handleUploadCSV = this.handleUploadCSV.bind(this);
    this.handleOpOpen = this.handleOpOpen.bind(this);
    this.handlePromoOpen = this.handlePromoOpen.bind(this);
    this.handlePromoClose = this.handlePromoClose.bind(this);
    this.handlePromoSave = this.handlePromoSave.bind(this);
    this.handleGenerateGroups = this.handleGenerateGroups.bind(this);
    this.handleUploadGroups = this.handleUploadGroups.bind(this);
    this.handleGroupsOpen = this.handleGroupsOpen.bind(this);
    this.handleGroupsChange = this.handleGroupsChange.bind(this);
  }

  handleHomeOpen() {
    this.refUploaderCSV.current.value = "";
    this.setState({
      stage: STAGE.newPromo
    });
  }

  handleChooseCSV() {
    this.refUploaderCSV.current.click();
  }

  handleUploadCSV(e) {
    try {
      let file = e.target.files[0];
      let reader = new FileReader();
      reader.onload = (evt) => {
        let content = evt.target.result;
        let students = csv2promo(content);
        console.log(makeGroups(students, 10));
        this.setState({
          students,
          fileName: file.name.split('.').slice(0, -1).join('.')
        }, this.handlePromoOpen);
      };
      reader.readAsText(file);
    } catch (e) {
      console.log(e);
    }
  }

  handlePromoOpen() {
    this.setState({stage: STAGE.promo});
  }

  handleOpOpen() {
    this.setState({stage: STAGE.newGroups});
  }

  handlePromoClose() {
    if (this.state.groups.length === 0) {
      this.handleOpOpen();
    } else {
      this.handleGroupsOpen();
    }
  }

  handlePromoSave(students) {
    this.setState({students});
    this.handlePromoClose();
  }

  handleGenerateGroups() {
    this.setState({
      groups: makeGroups(this.state.students, this.state.nbSL)
    }, this.handleShowGroups);
  }

  handleUploadGroups(e) {
    try {
      let file = e.target.files[0];
      let reader = new FileReader();
      reader.onload = (evt) => {
        let content = evt.target.result;

        this.setState({
          groups: [],
        }, this.handleGroupsOpen);
      };
      reader.readAsText(file);
    } catch (e) {
      console.log(e);
    }
  }

  handleGroupsOpen() {
    this.setState({stage: STAGE.groups});
  }

  handleGroupsChange(groups) {
    this.setState({groups});
  }

// TODO group_add
  render() {
    return (
        <div className="App">

          <input type="file"
                 id="file"
                 ref={this.refUploaderCSV}
                 accept="text/csv"
                 onChange={this.handleUploadCSV}
                 hidden/>

          <HomePage key={'home' + this.state.stage}
                    isOpen={this.state.stage === STAGE.newPromo}
                    onClick={this.handleChooseCSV}/>
          <PromoPage key={'promo' + this.state.stage}
                     students={this.state.students}
                     fileName={this.state.fileName}
                     isOpen={this.state.stage === STAGE.promo}
                     handleClose={this.handleHomeOpen}
                     handleSave={this.handlePromoSave}/>
          <NewGroupsPage key={'op' + this.state.stage}
                         handleGenerateGroups={this.handleGenerateGroups}
                         handleUploadGroups={this.handleUploadGroups}
                         isOpen={this.state.stage === STAGE.newGroups}/>
        </div>
    );
  }
}

export default App;
