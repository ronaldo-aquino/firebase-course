todoForm.onsubmit = event => {
  event.preventDefault()

  if (todoForm.name.value !== '') {
    const file = todoForm.file.files[0]
    if (file !== null) {
      if (file.type.includes('image')) {
        const userAtual = firebase.auth().currentUser.uid
        const imgName = `${firebase.database().ref().push().key}-${file.name}` // Concatenar
        const imgPath = `todoListFiles/${userAtual}/${imgName}`
        const storageRef = firebase.storage().ref(imgPath)
        const upload = storageRef.put(file)

        trackUpload(upload)
          .then(() => {
            storageRef.getDownloadURL()
              .then(downloadURL => {
                const data = {
                  imgUrl: downloadURL,
                  name: todoForm.name.value,
                  nameLowerCase: todoForm.name.value.toLowerCase()
                }
                dbRefUsers.child(firebase.auth().currentUser.uid).push(data)
                  .then(() => {
                    console.log(`Tarefa ${data.name} adicionada com sucesso`)
                  }).catch(error => {
                    showError(`Falha ao adicionar tarefa : ${error}`)
                  })

                todoForm.name.value = ''
                todoForm.file.value = ''
              })
          }).catch(error => {
            showError(`Falha ao adicionar tarefa : ${error}`)
          })
      } else {
        alert('O arquivo selecionado precisa ser uma imagem. Tente novamente.')
      }
    } else {
      const data = {
        name: todoForm.name.value,
        nameLowerCase: todoForm.name.value.toLowerCase()
      }
      dbRefUsers.child(firebase.auth().currentUser.uid).push(data)
        .then(() => {
          console.log(`Tarefa ${data.name} adicionada com sucesso`)
          todoForm.name.value = ''
        }).catch(error => {
          showError(`Falha ao adicionar tarefa : ${error}`)
        })

      todoForm.name.value = ''
    }
  } else {
    alert('O nome da tarefa não pode estar fazio.')
  }
}

const trackUpload = upload => {

  return new Promise((resolve, reject) => {
    showItem(progressFeedback)
    upload.on('state_changed',
      snapshot => {
        console.log(`${(snapshot.bytesTransferred / snapshot.totalBytes * 100).toFixed(0)}%`)
        const progressUpload = snapshot.bytesTransferred / snapshot.totalBytes * 100
        progress.value = progressUpload
      },
      error => {
        hideItem(progressFeedback)
        reject(error)
      },
      () => {
        console.log('Sucesso no upload')
        hideItem(progressFeedback)
        resolve()
      }
    )

    let playPauseUpload = true
    playPauseBtn.onclick = () => {
      playPauseUpload = !playPauseUpload
      if (playPauseUpload) {
        upload.resume()
        playPauseBtn.innerHTML = 'Pausar'
        console.log('Upload foi retomado')
      } else {
        upload.pause()
        playPauseBtn.innerHTML = 'Retomar'
        console.log('Upload pausado')
      }
    }

    cancelBtn.onclick = () => {
      upload.cancel()
      alert('Upload cancelado peolo usuário')
      hideItem(progressFeedback)
      todoForm.name.value = ''
      todoForm.file.value = ''
    }
  })

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

    const imgLi = document.createElement('img')
    imgLi.src = value.imgUrl ? value.imgUrl : './img/defaultTodo.png'
    imgLi.setAttribute('class', 'imgTodo')
    li.appendChild(imgLi)

    const spanLi = document.createElement('span')
    spanLi.appendChild(document.createTextNode(value.name))
    spanLi.id = item.key
    li.appendChild(spanLi)

    const liRemoveBtn = document.createElement('button')
    liRemoveBtn.appendChild(document.createTextNode('Excluir'))
    liRemoveBtn.setAttribute('onclick', 'removeTodo(\"' + item.key + '\")')
    liRemoveBtn.setAttribute('class', 'danger todoBtn')
    li.appendChild(liRemoveBtn)

    const liUpdateBtn = document.createElement('button')
    liUpdateBtn.appendChild(document.createTextNode('Editar'))
    liUpdateBtn.setAttribute('onclick', 'updateTodo(\"' + item.key + '\")')
    liUpdateBtn.setAttribute('class', 'alternative todoBtn')
    li.appendChild(liUpdateBtn)

    ulTodoList.appendChild(li)
  })
}

const removeTodo = key => {
  const selectedItem = document.getElementById(key)
  const confirmation = confirm(`Realmente deseja remover a tarefa "${selectedItem.innerHTML}?"`)
  if (confirmation) {
    dbRefUsers.child(firebase.auth().currentUser.uid).child(key).remove()
      .catch(error => {
        showError(`Falha ao remover tarefa : ${error}`)
      })
  }
}

const updateTodo = key => {
  const selectedItem = document.getElementById(key)
  const newTodoName = prompt(`Escolha um novo nome para a tarefa "${selectedItem.innerHTML}"`)
  if (newTodoName !== '' && newTodoName !== null) {
    const data = {
      name: newTodoName,
      nameLowerCase: newTodoName.toLowerCase()
    }

    dbRefUsers.child(firebase.auth().currentUser.uid).child(key).update(data)
      .then(() => {
        console.log(`Tarefa ${data.name} atualizado com sucesso`)
      }).catch(error => {
        showError(`Falha ao atualizar tarefa : ${error}`)
      })
  } else {
    alert('O nome da tarefa não pode ser em branco para atualizar a tarefa.')
  }
}