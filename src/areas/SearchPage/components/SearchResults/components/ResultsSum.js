import React from 'react';


const ResultsSum = ({ total, searchTime }) => (
    <div className="__searchpage-results-sum" >About {total} results found in {searchTime} millisecond{searchTime === 1 ? "" : "s"}
    </div>
);

export default ResultsSum;