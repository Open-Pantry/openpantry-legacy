import React from 'react';
import ProductCard from 'shared/ResultCards/ProductCard';
import ResultsSum from '../components/ResultsSum.js';


class ProductResults extends React.Component {

    render() {
        return <div className="__product-results-container"><ResultsSum searchTime={this.props.searchTime} total={this.props.productResults.length} />
            <div className="__searchpage-product-results-contents">
                {this.props.productResults.map((result, index) => {
                    return <ProductCard 
                    updateSearch={this.props.updateSearch} 
                    fancy={this.props.fancyResults} 
                    key={index} 
                    tags={result.tags} 
                    data={result} />
                })}
        </div></div>;
    }
}


export default ProductResults;