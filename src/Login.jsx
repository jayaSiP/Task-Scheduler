import './form.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
const Login=()=>{
    const navigate = useNavigate();
    
    const [email,setEmail]=useState();
    const [password,setPassword]=useState();

    const handleSubmit=async () => {
       axios.post('http://localhost:4000/',{email,password})
        .then(result=>{
            console.log(result)
            if(result.data==="Welcome bro"){
                navigate('/grid' ,{ state: { email } })//gets post req from backend
            }})
            .catch(err=>console.log(err)) 
      };




    return (
        <>
        <div className="fully">
            <br></br>
            <h1 className="big">Your schedule,<br></br> streamlined.</h1>
       
        <div className="form" >
            <br></br>
            <h3>LOGIN</h3>
            
            
            <input type="text"  className="out"  name="email" placeholder="enter email" onChange={(e)=>setEmail(e.target.value)}></input><br></br>
            <input type="password"  className="out" name="pass" placeholder="enter password" onChange={(e)=>setPassword(e.target.value)}></input><br></br>
            <button className='bt' onClick={handleSubmit}>SUBMIT</button>
            <Link className='lnk' to="/signup">New User ?? Create your account</Link>
            <br></br>
            <br></br>
            
        </div>
        <br></br>
            <br></br>
            <br></br>
            <br></br>
        <br></br>
            <br></br>
        </div>
        
        
        
        
        </>




    );
}
export default Login;