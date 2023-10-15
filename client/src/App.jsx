import axios from 'axios'
import {  UserContextProvider } from "./userContext";
import Routes from "./Routes";


export default function App() {
  axios.defaults.baseURL = 'http://localhost:4000'
  axios.defaults.withCredentials = true
  return (
    <UserContextProvider>
    <Routes/>
    </UserContextProvider>
  )
}