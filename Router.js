import { createHashRouter } from "react-router-dom";
import Layout from "./Layout.jsx";
import Contact from "./contact.js";
import Home from "./home.jsx"; 
import Hospitality from "./Hospitality.jsx";
import About from "./About.jsx"; 
import Portraits from "./Potraits.jsx";
import LiveEvents from "./LiveEvents.jsx"; 
export const Router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "portfolio", element: <h1>Our Portfolio</h1> },
      { path: "contact", element: <Contact /> },
      { path: "shop", element: <h1>Coming Soon!</h1> },
      { path: "portraits", element: <Portraits /> },
      { path: "live_events", element: <LiveEvents /> },
      { path: "hospitality", element: <Hospitality /> },
    ]
  }
]);