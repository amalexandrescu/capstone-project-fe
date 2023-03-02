import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";

import { Provider } from "react-redux";
import { store } from "./redux/store";
// import { store, persistor } from "./redux/store";
// import { PersistGate } from "redux-persist/integration/react";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    {/* PersistGate is a component you want to inject in between your
    Redux Provider and your main component (App) */}
    {/* <PersistGate persistor={persistor}> */}
    <App />
    {/* so inside here we have also BookStore, BookDetail, CartIndicator */}
    {/* </PersistGate> */}
  </Provider>
);
