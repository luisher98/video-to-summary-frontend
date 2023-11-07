import {createContext, useContext, useState} from "react";

const Context = createContext({});


function getSummary(url) {
    return fetch(`http://localhost:5000/api/summary?url=${url}`)
        .then(response => response.json())
        .then(data => data.summary);
}


export function ContextProvider({children}) {
    const [input, setInput] = useState("");
 
    const [summary, setSummary] = useState("");

    return (
        <Context.Provider value={{input, setInput, summary, setSummary}}>
            {children}
        </Context.Provider>
    );
}