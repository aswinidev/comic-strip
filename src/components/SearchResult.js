import React, { useState, useEffect } from "react";
import classNames from "classnames";

export default function SearchResult (props) {
    const [visible, setVisible] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [size, setSize] = React.useState(0);

    const { result } = props;

    const random = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    } 

    useEffect(() => {
        setSize(random(5, 10));
    }, []);
    
    useEffect(() => {
        if(visible) {
          const preview = new Image();
          preview.src = result;
    
          preview.onload = () => {
            setLoaded(true);
          };
        }
    }, [visible]);
    
    useEffect(() => {
        const ms = (props.index * 50) + random(0, 50);
        
        const timeout = setTimeout(() => {
          setVisible(true);
        }, ms);
        
        return () => {
          clearTimeout(timeout);
        }
    }, []);

    const backgroundImage = `url(${result})`
    const classes = classNames("search-result", { loaded, visible });
    const gridRowEnd = `span ${size}`;

    return (
        <div className={classes} style={{ gridRowEnd }}>
            <a className="search-result-background" role="link" aria-disabled="true" style={{ backgroundImage }} />
        </div>
    )
}