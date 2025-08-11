import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { SettingsProvider } from "./SettingsContext";
import { TimesProvider } from "./TimesContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <SettingsProvider>
  <TimesProvider>
    <App />
  </TimesProvider>
    </SettingsProvider>

  </BrowserRouter>
);
