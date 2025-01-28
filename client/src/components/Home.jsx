import React, { useState } from "react";
import Logo from "./Logo";
import { v4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Home() {
    const [roomId, setRoomId] = useState("");
    const [username, setUsername] = useState("");

    const navigate = useNavigate();

    const generateRoom = (e) => {
        e.preventDefault();
        const id = v4();
        setRoomId(id);
        toast.success("Room ID is generated");
    };

    const joinRoom = () => {
        if (!roomId || !username) {
            toast.error("Both fields are required");
            return;
        } else {
            navigate(`editor/${roomId}`, {
                state: { username },
            });
            toast.success("Room is created");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-gray-100">
            <div className="w-full max-w-md p-8 bg-gray-900 border border-gray-700 rounded-xl shadow-lg">
                {/* Header Section */}
                <div className="flex flex-col items-center mb-8">
                    <Logo />
                    <h1 className="text-3xl font-bold text-center mt-4">
                        SyncScript   
                    </h1>
                    <p className="text-gray-400 mt-2 text-center">
                        Join or create a real-time collaborative coding room
                    </p>
                </div>

                {/* Form Section */}
                <form className="space-y-6">
                    {/* Room ID */}
                    <div>
                        <label
                            htmlFor="roomId"
                            className="block text-sm font-medium text-gray-400"
                        >
                            Room ID
                        </label>
                        <input
                            type="text"
                            id="roomId"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            className="w-full px-4 py-2 mt-2 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Enter Room ID"
                        />
                    </div>

                    {/* Username */}
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-400"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 mt-2 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Enter Your Name"
                        />
                    </div>

                    {/* Join Room Button */}
                    <button
                        type="button"
                        onClick={joinRoom}
                        className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none shadow-md"
                    >
                        Join Room
                    </button>
                </form>

                {/* Footer Section */}
                <p className="mt-6 text-sm text-center text-gray-400">
                    Don’t have a room ID?{" "}
                    <span
                        onClick={generateRoom}
                        className="text-green-500 cursor-pointer hover:text-green-400"
                    >
                        Create New Room
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Home;
