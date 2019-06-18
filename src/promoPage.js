import React from 'react';
import {
  Button,
  Dialog,
  IconButton,
  Slide,
  Toolbar,
  Typography
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import MaterialTable from 'material-table';
import './promoPage.css';

function encodeData(data) {
  return data.map(s => {
    return {
      ...s,
      gender: s.gender === "M" ? 0 : s.gender === "F" ? 1 : 2,
      leader: s.leader === undefined || s.leader ? 0 : 1,
      bio: s.bio === "HL" ? 2 : s.bio === "SL" ? 1 : 0,
      chm: s.chm === "HL" ? 2 : s.chm === "SL" ? 1 : 0,
      phy: s.phy === "HL" ? 2 : s.phy === "SL" ? 1 : 0,
    }
  });
}

const genderLookup = {0: "M", 1: "F", 2: "Other"};
const leadershipLookup = {0: "", 1: "Yes"};
const sciLookup = {0: " ", 1: "SL", 2: "HL"};

function decodeData(data) {
  return data.map(s => {
    return {
      ...s,
      gender: genderLookup[s.gender],
      leader: leadershipLookup[s.leader],
      bio: sciLookup[s.bio],
      chm: sciLookup[s.chm],
      phy: sciLookup[s.phy],
    }
  });
}

class PromoPage extends React.Component {
  constructor(props) {
    super(props);

    this.tableRef = React.createRef();
  }

  render() {
    const Transition = React.forwardRef(function Transition(props, ref) {
      return <Slide direction="up" ref={ref} {...props} />;
    });
    return <Dialog fullScreen
                   open={this.props.isOpen}
                   onClose={this.props.handleClose}
                   TransitionComponent={Transition}>
      <Toolbar className={'tbl-app_bar'}>
        <IconButton edge="start" color="inherit" onClick={this.props.handleClose} aria-label="Close">
          <CloseIcon/>
        </IconButton>
        <Typography variant="h5" className="tbl-title">
          List of Students
        </Typography>
        <Button color="inherit"
                onClick={() => this.props.handleSave(decodeData(this.tableRef.current.state.data))}>
          Next
        </Button>
      </Toolbar>
      <StudentsTable
          ref={this.tableRef}
          students={this.props.students}
          fileName={this.props.fileName}/>
    </Dialog>
  }
}


class StudentsTable extends React.Component {
  TIMEOUT = 230;

  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {title: "Name", field: "name"},
        {title: "Gender", field: "gender", lookup: genderLookup},
        {title: "Leadership", field: "leader", lookup: leadershipLookup},
        {title: "Biology level", field: "bio", lookup: sciLookup},
        {title: "Chemistry level", field: "chm", lookup: sciLookup},
        {title: "Physics level", field: "phy", lookup: sciLookup},
      ],
      data: encodeData(props.students),
    };
  }

  render() {
    return <MaterialTable
        title={this.props.fileName}
        columns={this.state.columns}
        data={this.state.data}
        options={{
          addRowPosition: "first",
          exportButton: true,
          filtering: true,
          pageSize: 10,
        }}
        editable={{
          onRowAdd: newData =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  {
                    const data = this.state.data;
                    data.push(newData);
                    this.setState({data}, () => resolve());
                  }
                  resolve()
                }, this.TIMEOUT)
              }),
          onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  {
                    const data = this.state.data;
                    const index = data.indexOf(oldData);
                    data[index] = newData;
                    this.setState({data}, () => resolve());
                  }
                  resolve()
                }, this.TIMEOUT)
              }),
          onRowDelete: oldData =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  {
                    let data = this.state.data;
                    const index = data.indexOf(oldData);
                    data.splice(index, 1);
                    this.setState({data}, () => resolve());
                  }
                  resolve()
                }, this.TIMEOUT)
              }),
        }}
    />
  }
}

export default PromoPage;
