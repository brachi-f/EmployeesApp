import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'semantic-ui-css/semantic.min.css'
import { BrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import Header from './pages/Header.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
      <Header  style={{position:'fixed'}}/>
      <App />
    </Provider>
  </BrowserRouter>
)
