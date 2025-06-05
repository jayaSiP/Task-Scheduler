import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { connectDB } from './config/db.js';

import mongoose from 'mongoose';
import cors from 'cors';
import User from './models/user.model.js';
import Task from './models/task.model.js';
const app = express();

// Middleware
app.use(express.json());
app.use(cors());



//POST SIGNUP
app.post("/signup",async(req,res)=>{
     User.create(req.body) //creates with given email and password and saves in db
     .then(users=>res.json(users))
     .catch(err=>res.json(err))
    
  });

//POST LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "Email is incorrect" });
    }

    if (user.password !== password) {
      return res.status(401).json({ success: false, message: "Password is incorrect" });
    }

    res.status(200).json({ success: true, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});


// updating tasks
app.put("/tasks",async(req,res)=>{  
    const {id}=req.params;
      const newtask=req.body;
      if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({success:false,message:"nope"});
      }
    try {
      const updated=await Task.findByIdAndUpdate(id,newtask,{new:true});
      res.status(200).json({success:true,data:updated});
      
  
      
    } catch (error) {
      res.statusMessage(401).json({success:false,message:"nope"});
      console.log("error:",error.message);
      
    }
  });

  //FOR DELETING A TASK
  app.delete("/tasks/:id",async(req,res)=>{  
    const {id}=req.params;
      
      if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({success:false,message:"nope"});
      }
    try {
      const deleted=await Task.findByIdAndDelete(id);
      if(!deleted){
        return res.status(404).json({success:false,message:"task not found"});
      }
      res.status(200).json({success:true,data:deleted});
      
  
      
    } catch (error) {
      res.status(500).json({success:false,message:"nope"});
      console.log("error:",error.message);
      
    }
  });
  
  // POST
  app.post("/grid", async (req, res) => {
    const { email,date,task } = req.body;
  
    if (!email || !date || !task) { // if any of the fiels are missing , return error
      return res.status(400).json({ success:false,message:"Missing required fields" });
    }
  
    const newTask=new Task({ email,date,task });
  
    try {
      await newTask.save();
      res.status(201).json({ success:true,message:"Task saved successfully",data: newTask });
    } catch (error) {
      console.error("Error in creating task:",error.message);
      res.status(500).json({ success:false,message:"Server error" });
    }
  });
  
//POST GRID

/*app.post('/grid', async (req, res) => {
    const { email, date, task } = req.body;
    try {
        const newTask = new Task({ email, date, task });
        await newTask.save(); // Save the task to db
        res.status(201).json({ success: true, message: "Task saved successfully!" });
    } catch (error) {
        console.error("Error in saving task:", error.message);
        res.status(500).json({ error: 'Error saving task' });
    }
});*/

  

  //FETCH BY EMAIL
 
app.get('/tasks', async (req, res) => {
    const { email } = req.query;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        //finding task for the specific email
        const tasks = await Task.find({ email });
        res.json(tasks); //sending tasks
    } catch (error) {
        console.error("Error in fetching tasks:", error.message);
        res.status(500).json({ error: 'Error fetching tasks' });
    }
});


//START SERVER
const startServer = async () => {
    await connectDB();
    app.listen(4000, () => {
      console.log('Server started at http://localhost:4000');
    });
  };
  
  startServer();