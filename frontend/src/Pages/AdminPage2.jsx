import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import CardMenu from "../Components/Admin/admin-main-menu";
import EventContainer from "../Components/Admin/view-events-container";
import ViewEventTitle from "../Components/Admin/view-events-title";
import CreateEvent from "../Components/Admin/create-event";
import FeedbackTitle from "../Components/Admin/feedback-title";
import FeedbackContainer from "../Components/Admin/feedback-container";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <CardMenu />,
  },
  {
    path: "/view-events",
    element: (
      <>
        <ViewEventTitle />
        <EventContainer />
      </>
    ),
  },
  {
    path: "/create-event",
    element: <CreateEvent />,
  },
  {
    path: "/view-feedbacks",
    element: (
      <>
        <FeedbackTitle />
        <FeedbackContainer />
      </>
    ),
  },
]);

function AdminPage2() {
  return <RouterProvider router={router} />;
}

export default AdminPage2;
