import React, { useState, useRef } from "react";

function CompilerPage({ compiling, compileResult, onClose }) {
    const [outputWidth, setOutputWidth] = useState(400); 
    const resizingRef = useRef(false);
    const animationFrameRef = useRef(null);

    const handleMouseDown = (e) => {
        const startX = e.clientX; 
        const startWidth = outputWidth;

        resizingRef.current = true;

        const handleMouseMove = (e) => {
            if (resizingRef.current && !animationFrameRef.current) {
                animationFrameRef.current = requestAnimationFrame(() => {
                    const newWidth = Math.max(300, startWidth - (e.clientX - startX)); 
                    setOutputWidth(newWidth);
                    animationFrameRef.current = null; 
                });
            }
        };


        const handleMouseUp = () => {
            resizingRef.current = false; 
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };


    const getOutputColor = () => {
        if (compiling) return "text-gray-400"; 
        if (compileResult.toLowerCase().includes("error")) return "text-red-500"; 
        return "text-green-500"; 
    };

    return (
        <div className="flex h-full fixed top-0 right-0 shadow-lg" style={{ zIndex: 50 }}>

            <div
                className="w-2 bg-black hover:bg-blue-800 cursor-ew-resize"
                onMouseDown={handleMouseDown} 
                style={{ zIndex: 100 }}
            ></div>


            <div
                className="bg-black text-gray-100 p-4 border-l border-gray-800"
                style={{
                    width: `${outputWidth}px`,
                    transition: resizingRef.current ? "none" : "width 0.2s ease",
                }}
            >
                <div className="flex justify-between items-center mb-2">
                    <h2 className="font-semibold">Compilation Output</h2>
                    <button onClick={onClose} className="text-red-400 border px-1 border-gray-700 ">
                        X
                    </button>
                </div>
                <pre
                    className={`bg-black p-2 rounded overflow-auto text-sm ${getOutputColor()}`}
                    style={{ maxHeight: "80vh", whiteSpace: "pre-wrap" }}
                >
                    {compiling ? "Compiling...\n" : ""}
                    {compileResult || "No output available"}
                </pre>
            </div>
        </div>
    );
}

export default CompilerPage;
