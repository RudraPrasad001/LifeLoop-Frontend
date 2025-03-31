import {Routes,Route,BrowserRouter} from 'react-router-dom';
import Home from './Home';
import './App.css';
import Login from './Login';
import Signup from './Signup';
import FileUpload from './FileUpload';
function App() {

  return (
      <BrowserRouter>
      <Routes>
      <Route path = '/' element={<Home></Home>} ></Route>
      <Route path = '/login' Component={Login}/>
      <Route path='/signup' element={<Signup></Signup>}></Route>
      <Route path='/upload' Component={FileUpload}></Route>
      </Routes>
      </BrowserRouter>
  )
}

export default App
