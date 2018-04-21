import React, { Component } from 'react';
import { Dialog, FlatButton, GridList, GridTile, TextField } from 'material-ui';
import './style.css';
import Tag from 'shared/Tag';

class ProductPanel extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showProductDialog: false,
			newProduct: {
				tags: []
			},
			editingProduct: -1,
			newStock: 0,
			addingTag: -1,
			newProductTag: ''
		};

		this.createNewProduct = this.createNewProduct.bind(this);
		this.deleteProduct = this.deleteProduct.bind(this);
		this.addTag = this.addTag.bind(this);
		this.removeTag = this.removeTag.bind(this);
		this.deleteTag = this.deleteTag.bind(this);
		this.postTag = this.postTag.bind(this);
		this.updateStock = this.updateStock.bind(this);
	}

	deleteProduct(productId) {
		if (window.confirm('Are you sure you want to delete this product?')) {
			fetch(`/api/product/${productId}`, { method: 'DELETE' })
				.then(Response => Response.json())
				.then(Response => {
					this.props.getOrganization();
				});
		}
	}

	createNewProduct() {
		const config = {
			method: 'POST',
			body: JSON.stringify({
				...this.state.newProduct,
				organization_id: this.props.organizationInfo.id
			}),
			headers: {
				'content-type': 'application/json'
			}
		};
		fetch('/api/product', config)
			.then(Response => Response.json())
			.then(Response => {
				const resetProduct = {
					tags:[]
				};
				this.setState({
					newProduct:resetProduct
				})
				this.props.getOrganization();
			});
	}

	addTag() {
		if (
			this.state.newProductTag.length &&
			!this.state.newProduct.tags.some(t => t === this.state.newProductTag)
		) {
			this.setState({
				newProduct: {
					...this.state.newProduct,
					tags: [...this.state.newProduct.tags, this.state.newProductTag]
				},
				newProductTag: ''
			});
		}
	}

	removeTag(name) {
		this.setState({
			newProduct: {
				...this.state.newProduct,
				tags: this.state.newProduct.tags.filter(t => t !== name)
			}
		});
	}

	deleteTag(id) {
		fetch(`/api/tag/${id}`, { method: 'DELETE' })
			.then(Response => Response.json())
			.then(Response => {
				this.props.getOrganization();
			});
	}

	postTag() {
		fetch(`/api/tag/${this.state.newProductTag}?product_id=${this.state.addingTag}`, {
			method: 'POST'
		})
			.then(Response => Response.json())
			.then(Response => {
				this.setState({
					editingProduct: -1,
					addingTag: '',
					newProductTag: ''
				});
				this.props.getOrganization();
			});
	}

	updateStock(product) {
		fetch(`/api/stock`, {
			method: 'PUT',
			body: JSON.stringify({
				...product,
				organization_id: this.props.organizationInfo.id,
				amount: this.state.newStock
			}),
			headers: {
				'content-type': 'application/json'
			}
		})
			.then(Response => Response.json())
			.then(Response => {
				this.setState({
					editingProduct: -1
				});
				this.props.getOrganization();
			});
	}

	render() {
		return (
			<div className="org-box org-products">
				<Dialog
					open={this.state.showProductDialog}
					actions={[
						<FlatButton
							label="Cancel"
							primary
							onClick={() => this.setState({ showProductDialog: false })}
						/>,
						<FlatButton
							label="Submit"
							primary
							keyboardFocused
							onClick={() => {
								this.createNewProduct();
								this.setState({ showProductDialog: false });
							}}
						/>
					]}
					modal={false}
					style={{
						width: 378,
						left: this.state.showProductDialog ? 'calc(50% - 189px)' : '-1000px'
					}}
				>
					<GridList cols={1} cellHeight={64}>
						<GridTile>
							<TextField
								floatingLabelText="Product Name"
								value={this.state.newProduct.name || ''}
								onChange={e =>
									this.setState({
										newProduct: {
											...this.state.newProduct,
											name: e.target.value
										}
									})
								}
							/>
						</GridTile>
						<GridTile>
							<TextField
								floatingLabelText="Stock"
								value={this.state.newProduct.amount || ''}
								type="number"
								onChange={e =>
									this.setState({
										newProduct: {
											...this.state.newProduct,
											amount: e.target.value
										}
									})
								}
							/>
						</GridTile>
						<GridTile style={{ display: 'flex', justifyContent: 'space-between' }}>
							<TextField
								floatingLabelText="Tag"
								value={this.state.newProductTag || ''}
								style={{ width: 200 }}
								onChange={e =>
									this.setState({
										newProductTag: e.target.value
									})
								}
							/>
							<div className="tag-button-container">
								<i className="material-icons add-product-tag" onClick={this.addTag}>
									add_box
								</i>
							</div>
						</GridTile>
					</GridList>
					<div className="tag-list">
						{this.state.newProduct.tags.map(tag => (
							<Tag key={tag} name={tag} onClick={() => this.removeTag(tag)} showIcon />
						))}
					</div>
				</Dialog>
				<span className="org-name-container">
					<span className="org-name org-section-label">Products</span>
					{this.props.hasAccess && (
						<i
							className="material-icons add-product-button"
							onClick={() => this.setState({ showProductDialog: true })}
						>
							add_box
						</i>
					)}
				</span>
				<div className="org-product-list">
					{this.props.organizationInfo.products.map((p, index) => (
						<div key={index} className="product-card">
							<div className="info-container">
								<span>{p.name}</span>
								<span className="amount-container">
									{this.state.editingProduct === p.product_id
										? [
											<input
												key="input"
												value={this.state.newStock || ''}
												onChange={e =>
													this.setState({ newStock: e.target.value })
												}
											/>,
											<i
												key={'button'}
												className="material-icons add-tag-button"
												onClick={() => this.updateStock(p)}
											>
												save
												</i>,
											<i
												key="delete"
												className="material-icons trashcan"
												onClick={() => this.deleteProduct(p.product_id)}
											>
												delete_forever
												</i>
										]
										: p.amount} unit{p.amount===1?"":"s"}
									{this.state.editingProduct === p.product_id ? (
										<i
											className="material-icons edit"
											onClick={() => this.setState({ editingProduct: -1 })}
										>
											cancel
										</i>
									) : (
											this.props.hasAccess && (
												<i
													className="material-icons edit"
													onClick={() =>
														this.setState({ editingProduct: p.product_id })
													}
												>
													build
											</i>
											)
										)}
								</span>
							</div>
							<div className="tag-list">
								{this.state.addingTag === p.product_id
									? [
										<input
											key={'input'}
											value={this.state.newProductTag || ''}
											onChange={e =>
												this.setState({ newProductTag: e.target.value })
											}
										/>,
										<i
											key={'button'}
											className="material-icons add-tag-button"
											onClick={this.postTag}
										>
											save
											</i>
									]
									: this.props.hasAccess && (
										<i
											className="material-icons add-tag-button"
											onClick={() => {
												this.setState({ addingTag: p.product_id });
											}}
										>
											add_box
											</i>
									)}
								{p.tags.map(tag => (
									<Tag
										key={tag.name}
										name={tag.name}
										onClick={() => this.deleteTag(tag.id)}
										showIcon={this.props.hasAccess}
									/>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}
}

export default ProductPanel;
