import React from 'react';
import { GridList, GridTile } from 'material-ui/GridList';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';

class ProductCreationDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      unitDescription: '',
      categoryId: ''
    };

    this.updateProduct = this.updateProduct.bind(this);
  }
  updateProduct(payload) {
    this.setState(payload);
  }

  render() {
    const actions = [
      <FlatButton label="Cancel" primary onClick={this.props.handleClose} />,
      <FlatButton
        label="Submit"
        primary
        keyboardFocused
        onClick={() => {
          this.props.handleClose();
        }}
      />
    ];

    return (
      <Dialog
        title="New Product"
        actions={actions}
        modal={false}
        open={this.props.open}
        onRequestClose={this.props.handleClose}
        contentStyle={{ maxWidth: 284 }}
      >
        <GridList cols={1} cellHeight={64}>
          <GridTile>
            <TextField
              onChange={e => this.updateProduct({ name: e.target.value })}
              value={this.state.name || ''}
              floatingLabelText="Name"
            />
          </GridTile>
          <GridTile>
            <TextField
              onChange={e => this.updateProduct({ unitDescription: e.target.value })}
              value={this.state.unitDescription || ''}
              floatingLabelText="Unit (e.g. 1oz, 10lbs)"
            />
          </GridTile>
          <GridTile>
            <SelectField
              value={this.state.categoryId}
              onChange={(e,i,v) => this.updateProduct({ categoryId: v })}
              floatingLabelText="Category"
            >
              <MenuItem primaryText="Clothes" value="0" />
              <MenuItem primaryText="Food" value="1" />
            </SelectField>
          </GridTile>
        </GridList>
      </Dialog>
    );
  }
}

export default ProductCreationDialog;
