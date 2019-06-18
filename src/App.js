import React from 'react';
import './loadCSV';
import './App.css';
import csv2promo from "./loadCSV";
import HomePage from "./homePage";
import PromoPage from "./promoPage";

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
      groups: [],
      fileName: "IB Students",
      students: [],
      // new promo -> promo -> new groups -> groups
      stage: STAGE.newPromo,
    };

    this.refUploaderCSV = React.createRef();
    this.handleChooseCSV = this.handleChooseCSV.bind(this);
    this.handleUploadCSV = this.handleUploadCSV.bind(this);
    this.handlePromoOpen = this.handlePromoOpen.bind(this);
    this.handlePromoClose = this.handlePromoClose.bind(this);
    this.handlePromoSave = this.handlePromoSave.bind(this);
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

  handlePromoClose() {
    this.setState({
      stage: STAGE.newGroups,
    });
  }

  handlePromoSave(students) {
    this.setState({students});
    this.handlePromoClose();
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
                 className='hidden'/>

          <HomePage isOpen={this.state.stage === STAGE.newPromo}
                    onClick={this.handleChooseCSV}/>
          <PromoPage key={this.state.stage}
                     students={this.state.students}
                     fileName={this.state.fileName}
                     isOpen={this.state.stage === STAGE.promo}
                     handleClose={this.handlePromoClose}
                     handleSave={this.handlePromoSave}/>
        </div>
    );
  }
}

export default App;
