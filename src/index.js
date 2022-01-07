const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = []

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers
  const user = users.find(user => user.username === username)
  if(user) {
    request.user = user
    next()
  }
  
  return response.status(404).json({ error: 'Mensagem do erro' })
}

app.post('/users', (request, response) => {
  const { name, username } = request.body
  if(users.find(user => user.username === username)){
    return response.status(400).json({ error: 'Mensagem do erro' })
  }
  const newUser = {
    id: uuidv4(),
    name, 
    username, 
    todos: []
  }
  users.push(newUser)
  return response.status(201).json(newUser)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request
  return response.json(user.todos)
});

app.post('/todos/', checksExistsUserAccount, (request, response) => {
  const { user } = request
  const { title, deadline } = request.body
  const newTodo = { 
    id: uuidv4(),
    title,
    done: false, 
    deadline: new Date(deadline), 
    created_at: new Date()
  }

  user.todos.push(newTodo)

  return response.status(201).json(newTodo)
})

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request
  const { id } = request.params
  const { title, deadline } = request.body

  const todo = user.todos.find(todo => todo.id === id)
  
  if(!todo) {
    return response.status(404).json({ error: 'Mensagem do erro' })
  }

  todo.title = title
  todo.deadline = new Date(deadline)

  return response.status(201).json(todo)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request
  const { id } = request.params

  const todoUpdated = user.todos.find(todo => todo.id === id)
  if(!todoUpdated){
    return response.status(404).json({ error: 'Mensagem do erro' })
  }
  todoUpdated.done = true
  return response.json(todoUpdated)

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request
  const { id } = request.params

  if(!user.todos.find(todo => todo.id === id)) {
    return response.status(404).json({ error: 'Mensagem do erro' })
  }

  user.todos = user.todos.filter(todo => todo.id !== id)

  return response.status(204).send()
});

module.exports = app;