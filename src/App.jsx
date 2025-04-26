import {Routes,Route,BrowserRouter} from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import FileUpload from './FileUpload';
import Profile from './Profile';
import { configDotenv } from 'dotenv';
function App() {
  return (
      <BrowserRouter>
      <Routes>
      <Route path = '/' element={<Home></Home>} ></Route>
      <Route path = '/login' Component={Login}/>
      <Route path='/signup' element={<Signup></Signup>}></Route>
      <Route path='/upload' Component={FileUpload}></Route>
      <Route path= '/user/:id' Component={Profile}></Route>
      </Routes>
      </BrowserRouter>
  )
}

export default App
