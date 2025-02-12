import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import './index.css'
import Home from './components/Home.jsx'
import EditorPage from './components/EditorPage.jsx'
/*
bugs 
1) multiple language compile nhi ho rhe 
2) alert ki wjha se code disappear ho rha

update
1) icon
*/

const router = createBrowserRouter([
  {
    path:"/",
    element: <App/>,
    children:[
      {
        path: '',
        element: <Home/>
      },
      {
        path:'/editor/:roomId',
        element:<EditorPage/>
      },
    ]

  }
])

createRoot(document.getElementById('root')).render(

        <RouterProvider router={router}/>

)
