todoForm.onsubmit = event => {
  event.preventDefault()
  
  if(todoForm.name.value !== '') {
    const data = {
      name: todoForm.name.value
    }
    dbRefUsers.child(firebase.auth().currentUser.uid).push(data)
      .then(() => {
        console.log(`Tarefa ${data.name} adicionada com sucesso`)
        todoForm.name.value = ''
      }).catch(error => {
        showError(`Falha ao adicionar tarefa : ${error}`)
      })
  } else {
    alert('O nome da tarefa não pode estar fazio.')
  }
}

// exibe a lista de tarefas do usuário

const fillTodoList = dataSnapshot => {
  ulTodoList.innerHTML = ''
  const num = dataSnapshot.numChildren()
  const numNums = (num > 1 ? 'tarefas' : 'tarefa')
  todoCount.innerHTML = `${num} ${numNums}:`
  dataSnapshot.forEach(item => {
    const value = item.val()
    const li = document.createElement('li')
    const spanLi = document.createElement('span')
    spanLi.appendChild(document.createTextNode(value.name))
    spanLi.id = item.key
    li.appendChild(spanLi)

    const liRemoveBtn = document.createElement('button')
    liRemoveBtn.appendChild(document.createTextNode('Excluir'))
    liRemoveBtn.setAttribute('onclick', 'removeTodo(\"' + item.key + '\")')
    liRemoveBtn.setAttribute('class', 'danger todoBtn')
    li.appendChild(liRemoveBtn)

    ulTodoList.appendChild(li)
  })
}

const removeTodo = key => {
  const selectedItem = document.getElementById(key)
  const confirmation = confirm(`Realmente deseja remover a tarefa "${selectedItem.innerHTML}?"`)
  if(confirmation) {
    dbRefUsers.child(firebase.auth().currentUser.uid).child(key).remove()
      .catch(error => {
        showError(`Falha ao remover tarefa : ${error}`)
    })
  }
}