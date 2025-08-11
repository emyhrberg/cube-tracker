import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { SettingsProvider } from "./SettingsContext";
import { TimesProvider } from "./TimesContext";
import { ToastProvider, ToastViewport } from "./ToastContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <ToastProvider>
      <SettingsProvider>
        <TimesProvider>
          <App />
          <ToastViewport />
        </TimesProvider>
      </SettingsProvider>
    </ToastProvider>
  </BrowserRouter>
);
