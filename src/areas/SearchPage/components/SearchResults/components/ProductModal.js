import React from 'react';
import { Dialog, FlatButton, GridList, GridTile, TextField } from 'material-ui';

class ProductModal extends React.Component{
    render(){
        return <Dialog
					open={this.props.showModal}
					actions={[
						<FlatButton
							label="Close"
							primary
							onClick={this.props.closeModal}
						/>
					]}
					modal={false}
					onRequestClose={this.props.closeModal}
				>
                Test
                </Dialog>;
    }
}

export default ProductModal;