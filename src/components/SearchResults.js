import React from "react";
import SearchResult from "./SearchResult";

export default function SearchResults (props) {
    //console.log(props.results)
    const getResults = () => {
        return props.results.map((result, index) => (
          <SearchResult key={index} index={index} result={result} />
        ));
    }
    
    return (
        <div id="search-results-wrapper">
          <div id="search-results">
            {getResults()}
          </div>
        </div>
    );
}