import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import  store from "./redux/Store.js"
import  persistor from "./redux/Store.js"
import {Provider} from "react-redux"
import { PersistGate } from 'redux-persist/integration/react'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate persistor={persistor} loading = {null}>
    <App />
    </PersistGate>
  </Provider>
)
