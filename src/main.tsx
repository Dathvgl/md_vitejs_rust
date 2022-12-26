import { ChakraProvider } from "@chakra-ui/react";
import { lazy, StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./style.css";

type BaseLazy = React.LazyExoticComponent<() => JSX.Element>;
const App: BaseLazy = lazy(() => import("./App"));

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <ChakraProvider>
      <Router>
        <App />
      </Router>
    </ChakraProvider>
  </StrictMode>
);
