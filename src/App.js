import React from 'react';
import './loadCSV';
import './App.css';
import csv2promo from "./loadCSV";
import makeGroups from './students';
import HomePage from "./homePage";
import PromoPage from "./promoPage";
import NewGroupsPage from "./newGroupsPage";
import GroupsPage from "./groupsPage";

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
      groups: [],
      fileName: "IB Students",
      promo: [],
      stage: STAGE.groups,
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
        let promo = csv2promo(content);
        this.setState({
          promo,
          nbGroups: Math.ceil(promo.length / 6),
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

  handlePromoSave(promo) {
    this.setState({promo});
    this.handlePromoClose();
  }

  handleGenerateGroups(nbGroups) {
    const groups = makeGroups(this.state.promo, nbGroups);
    this.setState({
      groups,
      nbGroups,
    }, this.handleGroupsOpen);
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
                     students={this.state.promo}
                     fileName={this.state.fileName}
                     isOpen={this.state.stage === STAGE.promo}
                     handleClose={this.handleHomeOpen}
                     handleSave={this.handlePromoSave}/>
          <NewGroupsPage key={'op' + this.state.stage}
                         nbGroups={this.state.nbGroups}
                         maxNbGroups={this.state.promo.length}
                         handleUploadGroups={this.handleUploadGroups}
                         handleGenerateGroups={this.handleGenerateGroups}
                         isOpen={this.state.stage === STAGE.newGroups}/>
          <GroupsPage key={'gp' + this.state.stage}
                      groups={this.state.groups}
                      promo={this.state.promo}
                      handleGroupsChange={this.handleGroupsChange}
                      handleShowPromo={this.handlePromoOpen}
                      handleShowOp={this.handlePromoOpen}
                      isOpen={this.state.stage === STAGE.groups}/>
        </div>
    );
  }
}

export default App;
