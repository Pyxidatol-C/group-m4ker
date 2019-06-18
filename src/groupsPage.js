import React from 'react';
import {Dialog} from "@material-ui/core";


class GroupsPage extends React.Component {
  render() {
    return <Dialog fullScreen
                   open={this.props.isOpen}>
      {this.props.groups.map((g) => {
        return (
            <ul key={JSON.stringify(g)}>
              {g.map((id) => <ul>{this.props.promo[id].name}</ul>)}
            </ul>
        )
      })}
    </Dialog>
  }
}

export default GroupsPage;
