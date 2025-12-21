
import { useState } from 'react'
import './App.css'
import { useEffect } from 'react'

function App() {

  const [tasks, setTasks] = useState([])
  const [inputTask, setInputTask] = useState('')
  const [reload, setReload] = useState(false);
  

  const fetchTasks = () => {
  fetch('http://127.0.0.1:3017/api/tasks')
    .then(res => res.json())
    .then(result => setTasks(result.data));
};

  useEffect(() => {
    fetchTasks()
  },[reload])

  


  const handleInputChange = (task) => {
    setInputTask(task)
  }

  const handleDoneTask = (id) => {
  fetch(`http://127.0.0.1:3017/api/tasks/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ isComplete: true }),
  })
    .then((res) => res.json())
    .then(() => {
      setReload(r => !r)
    });
};


  const handleCreateTask = () => {

    if(inputTask == '') {
      alert('Please enter task')
      return
    }

     fetch('http://127.0.0.1:3017/api/tasks', {
      method: "POST",
      body: JSON.stringify({
        title: inputTask
      })
     })
     .then((res) => {
      return res.json()
      
     })
     .then(() => {
      setInputTask('')
      setReload(r => !r)
     })
  }

  const handleDeleteTask = (id) => {
    fetch(`http://127.0.0.1:3017/api/tasks/${id}`, {
      method: "DELETE",
      body: JSON.stringify({
        title: inputTask
      })
     })
     .then((res) => {
      return res.json()
      
     })
     .then(() => {
      setReload(r => !r)
     })
  }

  return (
    <>
      <div className='wrapper'>
        <div className='input-wrapper'>
              <input type="text"  placeholder='Enter task' onChange={(e) => {handleInputChange(e.target.value)}} value={inputTask}/>
              <button onClick={handleCreateTask}>Add task</button>
        </div>
        <div className='list-tasks'>
          <span>To do list</span>
          <ul>
            {tasks.length === 0 
              ? (<li>No task in list</li>)
              : (tasks.map(task => (
                <li key={task.id} className={task.isComplete ? 'done': ''}>
                  <div>{task.title}</div>
                  
                  <input type="checkbox" isComplete={task.isComplete} disabled={task.isComplete} onChange={() => {handleDoneTask(task.id)}}/>
                  <button onClick={() => {handleDeleteTask(task.id)}}>Delete Task</button>
                  </li>
              )))
            }
          </ul>
        </div>
       </div>
    </>
  )
}

export default App
