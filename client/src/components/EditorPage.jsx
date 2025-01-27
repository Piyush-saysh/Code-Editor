import React, { useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import Client from "./Client";
import Editor from "./Editor";
import CompilerPage from "./CompilerPage"; 
import { initSocket } from "./socket";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const supportedLanguages = ["javascript", "python", "cpp", "c", "java"];

function EditorPage() {
    const [selectedLanguage, setSelectedLanguage] = useState("javascript");
    const [clients, setClients] = useState([]); 
    const [compiling, setCompiling] = useState(false); 
    const [compileResult, setCompileResult] = useState(""); 
    const [showCompiler, setShowCompiler] = useState(false); 


    const socketRef = useRef(null); 
    const codeRef = useRef(null);
    const location = useLocation();
    const { roomId } = useParams(); 
    const navigate = useNavigate();

    const handleError = (e) => {
        console.error("Socket error ->", e);
        toast.error("Socket connection failed");
        navigate("/");
    };


    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket(); 

            socketRef.current.on("connect_error", handleError); 

            socketRef.current.on("connect_failed", handleError);


            socketRef.current.emit("join", {
                roomId,
                username: location.state?.username,
            });


            socketRef.current.on("joined", ({ clients, username, socketId, language }) => {
                if (username !== location.state?.username) {
                    toast.success(`${username} joined`);
                }
                setClients(clients);

                if (language) {
                    setSelectedLanguage(language); 

                }


                socketRef.current.emit("sync-code", {
                    code: codeRef.current,
                    socketId,
                });
            });


            socketRef.current.on("disconnected", ({ socketId, username }) => {
                toast.success(`${username} left`);
                setClients((prev) =>
                    prev.filter((client) => client.socketId !== socketId)
                );
            });


            socketRef.current.on("language-change", ({ language }) => {
                setSelectedLanguage(language);
                toast.success(`Language changed to ${language.toUpperCase()}`);
            });


            socketRef.current.on("compile-result", ({ result, success }) => {
                setCompiling(false); 

                setCompileResult((prev) => prev + result); 
                // Append the result


                if (!success && result.trim().toLowerCase().includes("error")) {
                    toast.error("Compilation error!");
                } else {
                    toast.success("Compilation successful");
                }

                setShowCompiler(true); 

            });
        };

        init(); 
        // Initialize everything


        return () => {
            socketRef.current.disconnect();
            socketRef.current.off("joined");
            socketRef.current.off("disconnected");
            socketRef.current.off("language-change");
            socketRef.current.off("compile-result");
        };
    }, []);


    const compileFunc = () => {
        if (codeRef.current) {
            setCompiling(true); 

            setCompileResult(""); 

            setShowCompiler(true); 



            socketRef.current.emit("compile", {
                roomId,
                code: codeRef.current,
                language: selectedLanguage,
            });
        } else {
            toast.error("No code to compile");
        }
    };

    const copyRoomId = async () => {
        try {
            await navigator.clipboard.writeText(roomId);

            toast.success("Room ID copied");
        } catch (error) {
            toast.error("Unable to copy Room ID");
        }
    };

    const saveCodeToFile = () => {
        const blob = new Blob([codeRef.current], { type: "text/javascript" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "code.js"; 

        link.click();
    };

    const leaveRoom = () => {
        navigate("/");

    };

    if (!location.state) {
        return <Navigate to="/" />;
    }

    return (
        <div className="h-screen flex flex-col bg-black text-gray-200">
            <div className="flex h-full gap-6 p-6">
                <aside className="w-72 bg-gray-900 flex flex-col rounded-lg shadow-lg p-6">
                    <div className="mb-6 text-center">
                        <Logo />
                        <p className="text-sm text-gray-400 mt-2">
                            Code and collaborate in real-time.
                        </p>
                    </div>
                    <div className="mb-6">
                        <label className="block mb-1 text-sm font-medium">
                            Select Language:
                        </label>
                        <select
                            value={selectedLanguage}
                            onChange={(e) => {
                                const newLanguage = e.target.value;
                                setSelectedLanguage(newLanguage);
                                socketRef.current.emit("language-change", {
                                    roomId,
                                    language: newLanguage,
                                });
                            }}
                            className="w-full bg-gray-700 text-white py-2 px-3 rounded focus:ring focus:ring-blue-500"
                        >
                            {supportedLanguages.map((lang) => (
                                <option key={lang} value={lang}>
                                    {lang.toUpperCase()}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div
                        className="flex-grow overflow-y-auto space-y-2"
                        style={{ maxHeight: "400px" }}
                    >
                        {clients.map((client) => (
                            <Client key={client.socketId} userName={client.username} />
                        ))}
                    </div>
                    <div className="space-y-3 mt-6">
                        <button
                            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded shadow-md transition"
                            onClick={copyRoomId}
                        >
                            Copy Room ID
                        </button>
                        <button
                            className="w-full bg-red-600 hover:bg-red-700 py-2 rounded shadow-md transition"
                            onClick={leaveRoom}
                        >
                            Leave Room
                        </button>
                        <button
                            className={`w-full py-2 rounded shadow-md transition ${
                                compiling
                                    ? "bg-gray-500 cursor-not-allowed"
                                    : "bg-green-600 hover:bg-green-700"
                            }`}
                            onClick={compileFunc}
                            disabled={compiling}
                        >
                            {compiling ? "Compiling..." : "Compile Code"}
                        </button>
                        <button
                            className="w-full bg-yellow-500 hover:bg-yellow-600 py-2 rounded shadow-md text-black transition"
                            onClick={saveCodeToFile}
                        >
                            Save Code
                        </button>
                    </div>
                </aside>
                <main className="flex-1 bg-gray-900 rounded-lg shadow-lg overflow-hidden relative flex">
                    <Editor
                        socketRef={socketRef}
                        roomId={roomId}
                        onCodeChange={(code) => (codeRef.current = code)}
                        selectedLanguage={selectedLanguage}

                    />
                </main>
                {showCompiler && (
                    <CompilerPage
                        compiling={compiling}
                        compileResult={compileResult}
                        onClose={() => setShowCompiler(false)}
                        
                    />
                )}
            </div>
        </div>
    );
}

export default EditorPage;
