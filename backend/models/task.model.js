import mongoose from 'mongoose';

const taskSchema= new mongoose.Schema(
        {
            email:{ type:String, required:true},
          date: { type: Date, required: true },
          task: { type: String, required: true }
        }
    );

const Task=mongoose.model('Task', taskSchema,'tasks');
export default Task;