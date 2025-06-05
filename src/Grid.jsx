import React,{useState} from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
function Grid(){

	const navigate = useNavigate();

	const days=['Sun','Mon','Tue','Wed','Thur','Fri','Sat'];
	const today=new Date();

	const [day,setDay]=useState(today.getDate());
	const [month,setMon]=useState(today.getMonth());
	const [year,setYear]=useState(today.getFullYear());
	const [selected,setSelect]=useState({day:today.getDate(),month:today.getMonth(),year:today.getFullYear()});
	const [tasksByDate,setTasksByDate]=useState({});
	const [newtask,setnew]=useState("");
	const [showPopup,setShowPopup]=useState(false);
	const [task,setTask]=useState();
	const updateDate=(d,m,y,openpopup=true)=>{
		setDay(d);
		setMon(m);
		setYear(y);
		setSelect({day:d,month:m,year:y});
    if(openpopup){
		setShowPopup(true);}
	};

	const next=()=>{
		const nextMonth=month===11?0:month+1;
		const nextYear=month===11?year+1:year;
		updateDate(1,nextMonth,nextYear,false);
	};

	const prev=()=>{
		const prevMonth=month===0?11:month-1;
		const prevYear=month===0?year-1:year;
		updateDate(1,prevMonth,prevYear,false);
	};

	const add=()=>{
		if(newtask.trim()==="")return;
		const key=`${selected.day}-${selected.month+1}-${selected.year}`;
		const updatedTasks=[...(tasksByDate[key]||[]),{name:newtask}];
		setTasksByDate(prev=>({...prev,[key]:updatedTasks}));
		setnew("");
	};

	const remove=(index)=>{
		const key=`${selected.day}-${selected.month+1}-${selected.year}`;
		const updated=[...(tasksByDate[key]||[])];
		updated.splice(index,1);
		setTasksByDate(prev=>({...prev,[key]:updated}));
	};

	const handleremove=async(taskid)=>{
		try {
			
			const response=await axios.delete(`http://localhost:4000/tasks/${taskid}`);
		
			if (response.data.success) {
				const key=`${selected.day}-${selected.month+1}-${selected.year}`;
				const updated=tasksByDate[key].filter(task => task._id !== taskid);
				
				setTasksByDate(prev=>({...prev,[key]:updated}));
			};
		}catch(error){
			console.log("error removing task",error.message);
		}
	};

	const namechange=(e)=>{
		setnew(e.target.value);
	};

	const calendar=[];
	const firstDay=new Date(year,month,1).getDay();
	const daysInMonth=new Date(year,month+1,0).getDate();

	for(let i=0;i<firstDay;i++){
		calendar.push('');
	}
	for(let i=1;i<=daysInMonth;i++){
		calendar.push(i);
	}

	const location = useLocation();
	const { email } = location.state || {};


	
		
	  const fetchTasks = () => {
		axios
		  .get('http://localhost:4000/tasks', { params: { email } })
		  .then((res) => {
			const grouped = {};
			res.data.forEach((task) => {
			  const date = new Date(task.date);
			  const key = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
			  if (!grouped[key]) {
				grouped[key] = [];
			  }
			  grouped[key].push({ name: task.task ,_id: task._id});
			});
			setTasksByDate(grouped);
		  })
		  .catch((err) => console.error('Error fetching tasks:', err));
	  };


	  useEffect(() => {
		if (email) {
		  fetchTasks();
		}
	  }, [email]);
	  
	  


const handleAdd = async () => {
	const day = String(selected.day).padStart(2, '0');
	const month = String(selected.month + 1).padStart(2, '0'); 
	const year = selected.year;
  
	const isoString = `${year}-${month}-${day}`;
	const formattedDate = new Date(isoString).toISOString(); // ISO format
  
	try {
	  await axios.post('http://localhost:4000/grid', {
		email,
		date: formattedDate,
		task: newtask,
	  });
	  setnew('');
	  fetchTasks(); // Refresh the list
	} catch (error) {
	  console.error('Error saving task:', error.response?.data || error.message);
	}
  };
  

	return(
		<>
    <div className='full' style={{background: 'linear-gradient(to bottom right,rgb(40, 47, 110),rgb(29, 66, 83),rgb(134, 193, 203))',
  minHeight: '97vh',
  padding: '10px'}}>
			<h2 style={{textAlign:'center',fontSize:'45px',color:'rgb(157, 206, 212)'}}>{new Date(year,month).toLocaleString('default',{month:'long'})} {year}</h2>
			<div style={{textAlign:'center',marginBottom:'10px'}}>
				<button onClick={prev} style={{padding:'10px',borderRadius:'18px',fontSize:'15px'}}>Prev</button>
				<span style={{margin:'0 15px',fontSize:'20px',color:'rgb(157, 206, 212)'}}>{selected.day}-{selected.month+1}-{selected.year}</span>
				<button onClick={next}style={{padding:'10px',borderRadius:'18px',fontSize:'15px'}}>Next</button>
			</div>

			<div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:'3px',marginTop:'45px',fontSize:'25px',padding:'1px'}}>
				{days.map(day=><div key={day} style={{fontWeight:'bold',textAlign:'center',color:'rgb(157, 206, 212)',margin:'2px'}}>{day}</div>)}

				{calendar.map((date,index)=>{
					const isToday=date===today.getDate()&&month===today.getMonth()&&year===today.getFullYear();
					const isSelected=date===selected.day&&month===selected.month&&year===selected.year;
					const key=`${date}-${month+1}-${year}`;
					const taskCount=(tasksByDate[key]?.length)||0;

					return(
						<div
							key={index}
							onClick={()=>{
								if(date){
									updateDate(date,month,year,true);
								}
							}}
							style={{
								padding:'23px',
								
								backgroundColor:isSelected?'rgb(44, 90, 106)':isToday?'rgb(228, 230, 230)':'rgb(178, 213, 218)',
                color:isSelected?'white':isToday?'black':'black',
								textAlign:'center',
								cursor:date?'pointer':'default',
								position:'relative',
                
							}}>
							<div>{date}</div>
							{taskCount>0&&(
								<div style={{fontSize:'15px',marginTop:'2px',
                  color:isSelected?'rgb(244, 240, 240)':'rgb(43, 41, 41)'

                }}>
									{taskCount} task{taskCount>1?'s':''}
								</div>
							)}
						</div>
					);
				})}
			</div><br></br>
			<button className='logout' onClick={()=>navigate('/')}>LOGOUT</button>

			{showPopup&&(
				<div style={{
					position:'fixed',
					top:'50%',
					left:'50%',
					transform:'translate(-50%,-50%)',
					backgroundColor:'rgb(237, 246, 247)',
					padding:'50px',
					border:'2px solid #444',
					borderRadius:'8px',
					boxShadow:'0 0 10px rgba(0,0,0,0.3)',
					height:'300px',
          width:'270px',
          fontSize:'20px'

				}}>
					<h3 style={{fontSize:'27px',color:'rgb(30, 47, 79)',textAlign:'center'}}>Tasks for {selected.day}-{selected.month+1}-{selected.year}</h3>
					<input
						type="text"
						placeholder="Enter task..."
						value={newtask}
						onChange={namechange}
            
						style={{padding:'5px',fontSize:'20px'}}
					/>
					<button onClick={() => {
                add();
                handleAdd();}

            }>Add</button>
					<ul>
						{(tasksByDate[`${selected.day}-${selected.month+1}-${selected.year}`]||[]).map((t,index)=>(
							<li key={index}>
								{t.name}
								<span onClick={()=>{
									remove(index);
									handleremove(t._id);
								}} style={{marginLeft:'10px',cursor:'pointer'}}>✘</span>
							</li>
						))}
					</ul>
					<button onClick={()=>setShowPopup(false)} style={{marginTop:'10px'}}>Close</button>
				</div>
			)}
      </div>
		</>

	);
}

export default Grid;


  
  