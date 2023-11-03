import {createContext, useContext, useState} from "react";

const Context = createContext({});

export function ContextProvider({children}) {
    const [input, setInput] = useState("");
    const [video, setVideo] = useState("");
    const [summary, setSummary] = useState("");

    return (
        <Context.Provider value={{input, setInput, video, setVideo, summary, setSummary}}>
            {children}
        </Context.Provider>
    );
}