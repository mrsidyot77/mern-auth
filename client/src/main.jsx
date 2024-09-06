import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Store, persistor } from './redux/Store.js';
import {Provider} from "react-redux"
import { PersistGate } from 'redux-persist/integration/react'

createRoot(document.getElementById('root')).render(
  <Provider store={Store}>
    <PersistGate persistor={persistor} loading = {null}>
    <App />
    </PersistGate>
  </Provider>
)
