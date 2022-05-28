import React from "react";
import io from 'socket.io-client'
import { v4 as uuidv4 } from 'uuid';

class App extends React.Component {

  state = {
    tasks: [],
    taskName: '',
  }

  componentDidMount() {

    this.socket = io('http://localhost:3000/')
    this.socket.on('updateData', (tasks) => this.updateData(tasks))

    this.socket.on('addTask', (task) => this.addTask(task))

    this.socket.on('removeTask', (id) => this.removeTask(id))
  }

  removeTask = (id, local) => {
    const filtered = this.state.tasks.filter(task => task.id !== id)
    this.setState ({
      tasks: filtered,
    })
    if(local)this.socket.emit('removeTask', id)
  }

  submitForm = (e) => {
    e.preventDefault()
    const task = {id: uuidv4(), name: this.state.taskName}
    this.addTask(task)
    this.socket.emit('addTask', task);
    this.setState({
      taskName: '',
    })
  }

  addTask = (task) => {
    this.setState({
      tasks: [...this.state.tasks, task]
    })
  }

  render() {
    const { tasks, taskName } = this.state

    return (

    <div className='App'>

      <header>
        <h1>ToDoList.app</h1>
      </header>

      <section className='tasks-section' id='tasks-section'>
        <h2>Tasks</h2>

        <ul className='tasks-section__list' id='tasks-list'>
          {tasks.map(task => (
            <li key={task.id} className='task'>{task.name}
            <button onClick={e => {
              e.preventDefault();
              this.removeTask(task.id)
            }} className='btn btn--red'>Remove</button>  
            </li>
          ))}
        </ul>

        <form onSubmit={this.submitForm} id='add-task-form'>

          <input 
            className='text-input' 
            autoComplete='off' type='text' 
            placeholder='Type your description' 
            id='task-name' 
            value={taskName}
            onChange={event => {
              this.setState({ taskName: event.target.value });
            }}
          />
          <button className='btn' type='submit'>Add</button>
        </form>

      </section>
    </div>
    );
  }
}

export default App;