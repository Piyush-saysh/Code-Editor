# Collaborative Code Editor

A real-time collaborative code editor where users can write, edit, and compile code together. The project leverages Docker for running the code in various programming languages like JavaScript, Python, C++, C, and Java.

## Features

- **Real-time Collaboration**: Multiple users can join the same room, edit code simultaneously, and see changes in real-time.
- **Language Support**: Supports multiple programming languages (JavaScript, Python, C++, C, Java).
- **Code Compilation**: Users can compile their code within the browser using Docker containers for isolated execution.
- **Socket.io Integration**: Real-time communication using Socket.IO to sync code and handle user interactions.

## Technologies Used

- **Frontend**:
  - React.js
  - CodeMirror (for code editing)
  - Tailwind CSS
  - React Hot Toast (for notifications)
  - React Router DOM

- **Backend**:
  - Express.js
  - Socket.IO (for real-time communication)
  - Docker (for running code in isolated containers)
  - Node.js (for backend server)

## Setup

### Prerequisites

- Node.js and npm
- Docker (to run the code in isolated containers)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-folder>

2. Install the dependencies:
   ```bash
   npm install

3. Make sure Docker is installed and running.

4. Start the server:
   
   npm start

5. Open the application in your browser:

   http://localhost:5174


### Folder Structure


- **public/**: Static files like the `index.html` file.
  
- **src/**: Source code for the frontend React app.
  - **components/**: Contains all React components like `Editor`, `Client`, `CompilerPage`.
  - **socket.js**: Initializes the Socket.IO connection.
  - **App.js**: The main entry point for React.
    
- **server/**: Backend server code (Node.js and Socket.IO).
  - **index.js**: Main server file with all Socket.IO events.
    
- **docker/**: Contains Dockerfiles for various languages if needed.
- **.gitignore**: Specifies files and folders to ignore in Git.
  
- **package.json**: Manages frontend dependencies.
  
- **README.md**: Project documentation file.


## How to Use

1. **Clone the repository:**

   ```bash
   
   git clone <repository-url>
   cd <project-directory>
   ```
   
2. **Install dependencies:**
  - **For the frontend:/**
   ```bash
   
       cd frontend
       npm install
   ```
  - **For the backend:/**
    ```bash
    
        cd server
        npm install
    ```

4. **Start the backend server:**
    ```bash
    
      node server/index.js
    ```

5. **Start the frontend React app:**
        ```bash
   
           npm run dev
   

   - **This will run the React app on http://localhost:3000.**

7. **Access the app:**

    - **Open your browser and go to `http://localhost:3000`. You can now create or join rooms to collaborate on coding in real-time.**
  
    - **Create a new room:**  
     On the home page, click **"New Room"** to generate a room ID.
     
    - **Join an existing room:**  
     Enter a room ID and your username to join an existing room.

8. **Real-time coding**
    - **You can edit code in the editor.**
    - **Changes will be broadcasted to all other clients in the room in real-time.**
    - **You can compile and run the code on the server.**
    


