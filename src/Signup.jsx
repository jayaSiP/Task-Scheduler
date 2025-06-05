import { useState } from 'react';
import './form.css';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Link } from 'react-router-dom';

const Signup=()=>{
    const navigate = useNavigate();
    const [name,setName]=useState();
    const [email,setEmail]=useState();
    const [password,setPassword]=useState();

    const handleSubmit=async () => {
       axios.post('http://localhost:4000/signup',{name,email,password})
        .then(result=>console.log(result))//gets post req from backend
        .catch(err=>console.log(err)); 
      };



    return (
        <>
        <div className="fully">
            <br></br>
            <h1 className="big">Your schedule,<br></br> streamlined.</h1>
       
        <div className="form" >
            <br></br>
            <h3>SIGNUP</h3>
            
        <input className="out" type="text" name="name" placeholder="enter name" onChange={(e)=>setName(e.target.value)}></input><br></br>
            <input type="text"  className="out"  name="email" placeholder="enter email" onChange={(e)=>setEmail(e.target.value)}></input><br></br>
            <input type="password"  className="out" name="pass" placeholder="enter password" onChange={(e)=>setPassword(e.target.value)}></input><br></br>
            <button className='bt'  onClick={() => {
                navigate('/');
                handleSubmit();}

            }>SIGNUP</button>
            <Link className='lnk' to="/">Go to Login page</Link>
            
            <br>
            </br><br></br>
            </div>
        <br></br>
            <br></br>
            <br></br>
            <br></br>
        
            
        </div>
        
        
        
        </>




    );
}
export default Signup;