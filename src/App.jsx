import Login from './Login';
import Signup from './Signup';
import Grid from './Grid';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
function App() {
  

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}></Route>
        <Route path="/signup" element={<Signup/>}></Route>
        <Route path="/grid" element={<Grid year={2025} month={4} />}></Route>
      </Routes>
      
      </BrowserRouter>
      
      
      
    </>
  )
}

export default App;
