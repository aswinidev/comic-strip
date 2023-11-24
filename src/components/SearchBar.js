import React, { useState, useRef } from "react";
import classNames from "classnames";
import { FaSearch } from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";
import { ThreeDots } from  'react-loader-spinner'

export default function SearchBar (props) {
    const [focused, setFocused] = useState(false)
    const [querying, setQuerying] = useState(false)
    const [query, setQuery] = useState('')
    const [status, setStatus] = useState("")
    const ref = useRef(null);

    const handleOnBlur = () => {
        setFocused(false)
    }

    const handleOnFocus = () => {
        setFocused(true)
    }

    const handleOnChange = (value) => {
        setQuery(value)
    }
    const handleOnKeyDown = (e) => {
        if(e.key === "Enter") {
            handleOnSearch();
        }
    }

    const getClicker = () => {
        if(!focused && !props.searching) {
          const handleOnClick = () => {
            ref.current.focus(); 
          }
    
          return (
            <div id="search-bar-clicker" onClick={handleOnClick} />
          );
        }
    }

    const getResetButton = () => {    
        if(props.searching) {
          const handleOnReset = () => {
            setQuery("");
          }
          
          return (
            <button id="search-bar-reset-button" type="button" onClick={handleOnReset}>
              <GrPowerReset size={20} color='white'/>
            </button>
          );
        }
    }

    async function getImage(data) {
        const response = await fetch(
            "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
            {
                headers: { 
                    "Accept": "image/png",
                    "Authorization": "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM", 
                    "Content-Type": "application/json" 
                },
                method: "POST",
                body: JSON.stringify(data),
            }
        );
        const result = await response.blob();
        return result;
    }

    const handleOnSearch = async () => {
        if(query.trim() === "") {
            return;
        } else if(status !== "Loading") {
            setStatus("Loading")
            getImage({"inputs": query}).then((response) => {
                const srcForImage = URL.createObjectURL(response)
                props.addToResultsCallback(srcForImage);
                setStatus("Success")
                props.handleSearchingCallback(true)
            }).catch ((error) => {
                window.alert("There was an error while fetching image!");
                console.log('There was an error', error);
            })
        }
      }

    return (
        <div id="search-bar-aligner" className={classNames({ focused, querying, searching: props.searching })}>
            <div id="search-bar-wrapper">
                <div id="search-bar">
                {getClicker()}
                <i id="search-bar-logo">
                    <FaSearch size={20}/>
                </i>
                <input 
                    autoComplete="off"
                    onBlur={handleOnBlur}
                    onFocus={handleOnFocus}
                    id="search-bar-input"
                    placeholder="Search"
                    ref={ref}
                    type="text" 
                    value={query}
                    onChange={(e) => handleOnChange(e.target.value)}
                    onKeyDown={handleOnKeyDown}
                />
                {getResetButton()}
                </div>
            </div>
            <ThreeDots 
                height="60" 
                width="60" 
                radius="9"
                color="#FFFFFF" 
                ariaLabel="three-dots-loading"
                visible={status == "Loading"}
            />
        </div>
    );
}