import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CardMenu from './components/admin-main-menu';
import EventContainer from './components/view-events-container'
import ViewEventTitle from './components/view-events-title';
import CreateEvent from './components/create-event';
import FeedbackTitle from './components/feedback-title';
import FeedbackContainer from "./components/feedback-container"

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <CardMenu/>,
  },
  {
    path: "/view-events",
    element : <><ViewEventTitle/><EventContainer/></>
  },
  {
    path: "/create-event",
    element: <CreateEvent/>
  },
  {
    path: "/view-feedbacks",
    element: <><FeedbackTitle/><FeedbackContainer/></>
  }
])

createRoot(document.getElementById('root')).render(
<RouterProvider router={router}/>
)
