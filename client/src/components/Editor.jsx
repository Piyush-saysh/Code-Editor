import React, { useEffect, useRef, useState } from "react";
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css"; // Base CodeMirror styles
import "codemirror/theme/dracula.css";
import "codemirror/theme/monokai.css";
import "codemirror/theme/material.css";
import "codemirror/theme/nord.css";
import "codemirror/theme/eclipse.css";

import "codemirror/mode/javascript/javascript.js"; 
import "codemirror/mode/python/python.js"; 
import "codemirror/mode/clike/clike.js"; 

import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/hint/show-hint.css"; 
import "codemirror/addon/hint/show-hint"; 
import "codemirror/addon/hint/javascript-hint"; 

function Editor({ socketRef, roomId, onCodeChange, selectedLanguage }) {
    const editorRef = useRef(null); 
    const [code, setCode] = useState(""); 
    const [theme, setTheme] = useState("material"); 
    const [fontSize, setFontSize] = useState(14); 

// models for autoCompletion 
    const languageModes = {
        javascript: "javascript",
        java: "text/x-java",
        python: "python",
        c: "text/x-csrc",
        cpp: "text/x-c++src",
    };

    useEffect(() => {
        const editor = CodeMirror.fromTextArea(document.getElementById("realTimeEditor"), {
            mode: languageModes[selectedLanguage], 
            theme: theme, 
            autoCloseTags: true,
            autoCloseBrackets: true, 
            lineNumbers: true, 
            extraKeys: {
                "Ctrl-Space": "autocomplete",
            },
        });

        editorRef.current = editor; 
        editor.setSize("100%", "100%");
        editor.getWrapperElement().style.fontSize = `${fontSize}px`; 


        editor.on("inputRead", (cm, change) => {
            if (change.origin !== "setValue") {
                cm.showHint({
                    completeSingle: false, 
                });
            }
        });

// editor handle
        editor.on("change", (instance, changes) => {
            if (!changes) return;
            const { origin } = changes;
            const codeContent = instance.getValue();
            setCode(codeContent); 
            onCodeChange(codeContent); 


            if (origin !== "setValue") {
                socketRef.current.emit("code-change", {
                    roomId,
                    code: codeContent,
                });
            }
        });

        return () => {
            editor.toTextArea(); 
        };
    }, [theme, selectedLanguage, fontSize]); 

// Sync code
    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on("code-change", ({ code }) => {
                if (code !== null) {
                    editorRef.current.setValue(code);
                }
            });
        }
        return () => {
            socketRef.current.off("code-change");
        };
    }, [socketRef.current]);

// Auto Suggestion Style
    useEffect(() => {
        const style = document.createElement("style");
        style.textContent = `
            .CodeMirror-hints {
                background-color: #1f2937 !important; 
                color: #ffffff !important; 
                border: 1px solid #374151; 
            }
            .CodeMirror-hint-active {
                background-color: #374151 !important; 
                color: #ffffff !important; 
                border-left: 4px solid #3b82f6 !important; 
            }
        `;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);
    

    return (
        <div className="flex flex-col h-full w-full">
{/* Editor Settings */}
            <div className="flex items-center justify-between p-4 bg-gray-850 text-gray-200 rounded-t-lg">
                <h2 className="font-semibold text-lg">Editor Settings</h2>
                <div className="flex items-center space-x-4">
{/* Theme Selector */}
                    <div>
                        <label htmlFor="theme-select" className="text-sm mr-2">
                            Theme:
                        </label>
                        <select
                            id="theme-select"
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)} 
                            className="p-2 bg-gray-700 text-white rounded-lg focus:ring focus:ring-blue-500"
                        >
                            <option value="material">Material</option>
                            <option value="dracula">Dracula</option>
                            <option value="monokai">Monokai</option>
                            <option value="eclipse">Eclipse</option>
                            <option value="nord">Nord</option>
                        </select>
                    </div>

{/* Font Size Selector */}
                    <div>
                        <label htmlFor="font-size-select" className="text-sm mr-2">
                            Font Size:
                        </label>
                        <select
                            id="font-size-select"
                            value={fontSize}
                            onChange={(e) => setFontSize(Number(e.target.value))} 
                            className="p-2 bg-gray-700 text-white rounded-lg focus:ring focus:ring-blue-500"
                        >
                            <option value="12">12px</option>
                            <option value="14">14px</option>
                            <option value="16">16px</option>
                            <option value="18">18px</option>
                            <option value="20">20px</option>
                            <option value="22">22px</option>
                        </select>
                    </div>


                </div>
            </div>

{/* Code Editor */}
            <div className="flex-1 overflow-hidden bg-gray-900 rounded-b-lg relative">
                <textarea
                    id="realTimeEditor"
                    className="absolute top-0 left-0 w-full h-full"
                ></textarea>
            </div>
        </div>
    );
}

export default Editor;
