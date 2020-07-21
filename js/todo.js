// Trata a submissão do formulário de tarefas
todoForm.onsubmit = function (event) {
  event.preventDefault() // Evita o redirecionamento da página
  if (todoForm.name.value != '') {
    var file = todoForm.file.files[0] // Seleciona o primeiro aquivo da seleção de aquivos
    if (file != null) { // Verifica se o arquivo foi selecionado
      if (file.type.includes('image')) { // Verifica se o arquivo é uma imagem
        
        if (file.size > 1024 * 1024 * 2) {
          alert('A imagem não pode ser maior do que 2MB. Imagem selecionada tem: ' + (file.size / 1024 / 1024).toFixed(3) + ' MB' )
          return
        }
        
        // Compõe o nome do arquivo
        var imgName = firebase.database().ref().push().key + '-' + file.name
        // Compõe o caminho do arquivo
        var imgPath = 'todoListFiles/' + firebase.auth().currentUser.uid + '/' + imgName
        // Cria uma referência de arquivo usando o caminho criado na linha acima
        var storageRef = firebase.storage().ref(imgPath)
        // Inicia o processo de upload
        var upload = storageRef.put(file)

        trackUpload(upload).then(function () {
          storageRef.getDownloadURL().then(function (downloadURL) {
            var data = {
              imgUrl: downloadURL,
              name: todoForm.name.value,
              nameLowerCase: todoForm.name.value.toLowerCase()
            }
  
            completeTodoCreate(data) // Completa a criação de tarefas 
          })      
        }).catch(function (error) {
          showError('Falha ao adicionar tarefa: ', error)
        })
      } else {
        alert('O arquivo selecionado precisa ser uma imagem. Tente novamente')
      }
    } else {
      var data = {
        name: todoForm.name.value,
        nameLowerCase: todoForm.name.value.toLowerCase()
      }

      completeTodoCreate(data) // Completa a criação de tarefas 
    }
  } else {
    alert('O nome da tarefa não pode ser em branco para criar a tarefa!')
  }
}

// Completa a criação de tarefas (persiste as informações no banco de dados)
function completeTodoCreate(data) {
  dbFirestore.doc(firebase.auth().currentUser.uid).collection('tarefas').add(data).then(function() {
    console.log('Tarefa "' + data.name + '" adicionada com sucesso')
  }).catch(function (error) {
    showError('Falha ao adicionar tarefa (use no máximo 30 caracteres): ', error)
  })
  
  // dbRefUsers.child(firebase.auth().currentUser.uid).push(data).then(function () {
  //   console.log('Tarefa "' + data.name + '" adicionada com sucesso')
  // }).catch(function (error) {
  //   showError('Falha ao adicionar tarefa (use no máximo 30 caracteres): ', error)
  // })

  todoForm.name.value = ''
  todoForm.file.value = ''
}

// Rastreia o progresso de upload
function trackUpload(upload) {
  return new Promise(function (resolve, reject) {
    showItem(progressFeedback)
    upload.on('state_changed',
      function (snapshot) { // Segundo argumento: Recebe informações sobre o upload
        console.log((snapshot.bytesTransferred / snapshot.totalBytes * 100).toFixed(2) + '%')
        progress.value = snapshot.bytesTransferred / snapshot.totalBytes * 100
      }, function (error) { // Terceiro argumento: Função executada em caso de erro no upload
        hideItem(progressFeedback)
        reject(error)
      }, function () { // Quarto argumento: Função executada em caso de sucesso no upload
        console.log('Sucesso no upload')
        hideItem(progressFeedback)
        resolve()
      })

    var playPauseUpload = true // Estado de controle do nosso upload (pausado ou em andamento)
    playPauseBtn.onclick = function () { // Botão para pausar/continuar upload clicado
      playPauseUpload = !playPauseUpload // Inverte o estado de controle do upload

      if (playPauseUpload) { // Se deseja retomar o upload, faça...
        upload.resume() // Retoma o upload
        playPauseBtn.innerHTML = 'Pausar'
        console.log('Upload retomado')
      } else { // Se deseja pausar o upload, faça...
        upload.pause() // Pausa o upload
        playPauseBtn.innerHTML = 'Continuar'
        console.log('Upload pausado')
      }
    }

    cancelBtn.onclick = function () { // Botão para cancelar upload clicado
      upload.cancel() // Cancela o upload
      hideItem(progressFeedback)
      resetTodoForm()
    }
  })
}

// Exibe a lista de tarefas do usuário
function fillTodoList(dataSnapshot) {
  ulTodoList.innerHTML = ''
  var num = dataSnapshot.size
  // var num = dataSnapshot.numChildren()
  todoCount.innerHTML = num + (num > 1 ? ' tarefas' : ' tarefa') + ':' // Exibe na interface o número de tarefas
  dataSnapshot.forEach(function (item) { // Percorre todos os elementos
    var value = item.data()
    // var value = item.val()
    var li = document.createElement('li') // Cria um elemento do tipo li
    li.id = item.id // Define o id do li como a chave da tarefa
    // li.id = item.key // Define o id do li como a chave da tarefa

    var imgLi = document.createElement('img') // Cria um elemento img
    // Configura src (origem da imagem) como sendo o imgUrl da tarefa
    imgLi.src = value.imgUrl ? value.imgUrl : 'img/defaultTodo.png'
    imgLi.setAttribute('class', 'imgTodo') // Define classe de estilização
    li.appendChild(imgLi) // Adiciona o img dentro do li

    var spanLi = document.createElement('span') // Cria um elemento do tipo span
    spanLi.appendChild(document.createTextNode(value.name)) // Adiciona o elemento de texto dentro da nossa span
    li.appendChild(spanLi) // Adiciona o span dentro do li

    var liRemoveBtn = document.createElement('button') // Cria um botão para a remoção da tarefa
    liRemoveBtn.appendChild(document.createTextNode('Excluir')) // Define o texto do botão como 'Excluir'
    liRemoveBtn.setAttribute('onclick', 'removeTodo(\"' + item.id + '\")') // Configura o onclick do botão de remoção de tarefas
    liRemoveBtn.setAttribute('class', 'danger todoBtn') // Define classes de estilização para o nosso botão de remoção
    li.appendChild(liRemoveBtn) // Adiciona o botão de remoção no li

    var liUpdateBtn = document.createElement('button') // Cria um botão para a atualização da tarefa
    liUpdateBtn.appendChild(document.createTextNode('Editar')) // Define o texto do botão como 'Editar'
    liUpdateBtn.setAttribute('onclick', 'updateTodo(\"' + item.id + '\")') // Configura o onclick do botão de atualização de tarefas
    liUpdateBtn.setAttribute('class', 'alternative todoBtn') // Define classes de estilização para o nosso botão de atualização
    li.appendChild(liUpdateBtn) // Adiciona o botão de atualização no li

    ulTodoList.appendChild(li) // Adiciona o li dentro da lista de tarefas
  })
}

// Remove tarefas 
function removeTodo(key) {
  var todoName = document.querySelector('#' + key + ' > span')
  var todoImg = document.querySelector('#' + key + ' > img')

  var confimation = confirm('Realmente deseja remover a tarefa \"' + todoName.innerHTML + '\"?')
  if (confimation) {
    dbFirestore.doc(firebase.auth().currentUser.uid).collection('tarefas').doc(key).delete().then(function () {
      console.log('Tarefa "' + todoName.innerHTML + '" removida com sucesso')
      removeFile(todoImg.src)
    }).catch(function (error) {
      showError('Falha ao remover tarefa: ', error)
    })

    // dbRefUsers.child(firebase.auth().currentUser.uid).child(key).remove().then(function () {
    //   console.log('Tarefa "' + todoName.innerHTML + '" removida com sucesso')
    //   removeFile(todoImg.src)
    // }).catch(function (error) {
    //   showError('Falha ao remover tarefa: ', error)
    // })
  }
}

// Remove arquivos
function removeFile(imgUrl) {
  console.log(imgUrl)
  // Veifica se imgUrl contém a imagem padrão de tarefas
  var result = imgUrl.indexOf('img/defaultTodo.png')
  console.log(result)
  if (result == -1) { // Se não for a imagem padrão de tarefas, faça...
    firebase.storage().refFromURL(imgUrl).delete().then(function () {
      console.log('Arquivo removido com sucesso')
    }).catch(function (error) {
      console.log('Falha ao remover arquivo')
      console.log(error)
    })
  } else { // Se imgUrl representa a imagem padrão de tarefas, faça...
    console.log('Nenhum arquivo removido')
  }
}

// Prepara a atualização de tarefas
var updateTodoKey = null
function updateTodo(key) {
  updateTodoKey = key // Atribui o conteúdo de key dentro de uma variável global
  var todoName = document.querySelector('#' + key + ' > span')
  // Altera o título do formulário de tarefas
  todoFormTitle.innerHTML = '<strong>Editar a tarefa:</strong> ' + todoName.innerHTML
  // Altera o texto da entrada de nome (coloca o nome da tarefa a ser atualizada)
  todoForm.name.value = todoName.innerHTML
  hideItem(todoForm.submitTodoForm)
  showItem(cancelUpdateTodo)
}

// Restaura o estado inicial do formulário de tarefas
function resetTodoForm() {
  todoFormTitle.innerHTML = 'Adicionar tarefa:'
  hideItem(cancelUpdateTodo)
  todoForm.submitTodoForm.style.display = 'initial'
  todoForm.name.value = ''
  todoForm.file.value = ''
}

// Confirma a atualização de tarefas
function comfirmTodoUpdate() {
  
  if (todoForm.name.value != '') {
    var todoImg = document.querySelector('#' + updateTodoKey + ' > img')
    var file = todoForm.file.files[0] // Seleciona o primeiro aquivo da seleção de aquivos
    if (file != null) { // Verifica se o arquivo foi selecionado

      if (file.size > 1024 * 1024 * 2) {
        alert('A imagem não pode ser maior do que 2MB. Imagem selecionada tem: ' + (file.size / 1024 / 1024).toFixed(3) + ' MB' )
        return
      }
      hideItem(cancelUpdateTodo)

      if (file.type.includes('image')) { // Verifica se o arquivo é uma imagem
        // Compõe o nome do arquivo
        var imgName = firebase.database().ref().push().updateTodoKey + '-' + file.name
        // Compõe o caminho do arquivo
        var imgPath = 'todoListFiles/' + firebase.auth().currentUser.uid + '/' + imgName
        // Cria uma referência de arquivo usando o caminho criado na linha acima
        var storageRef = firebase.storage().ref(imgPath)
        // Inicia o processo de upload
        var upload = storageRef.put(file)

        trackUpload(upload).then(function () {
          storageRef.getDownloadURL().then(function (downloadURL) {
            var data = {
              imgUrl: downloadURL,
              name: todoForm.name.value,
              nameLowerCase: todoForm.name.value.toLowerCase()
            }          

            completeTodoUpdate(data, todoImg.src) // Completa a atualização de tarefas
          })
        }).catch(function (error) {
          showError('Falha ao atualizar tarefa: ', error)
        })
      } else {
        alert('O arquivo selecionado precisa ser uma imagem!')
      }
    } else { // Nenhuma imagem selecionada...
      var data = {
        name: todoForm.name.value,
        nameLowerCase: todoForm.name.value.toLowerCase()
      }

      completeTodoUpdate(data) // Completa a atualização de tarefas
    }
  } else {
    alert('O nome da tarefa não pode ser vazio!')
  }
}

// Completa a atualização de tarefas (persiste as informações no banco de dados)
function completeTodoUpdate(data, imgUrl) {
  dbFirestore.doc(firebase.auth().currentUser.uid).collection('tarefas').doc(updateTodoKey).update(data).then(function() {
    console.log('Tarefa "' + data.name + '" atualizada com sucesso')
    if (imgUrl) {
      removeFile(imgUrl) // Remove a imagem antiga
    }
  }).catch(function (error) {
    showError('Falha ao atualizar tarefa: ', error)
  })

  // dbRefUsers.child(firebase.auth().currentUser.uid).child(updateTodoKey).update(data).then(function () {
  //   console.log('Tarefa "' + data.name + '" atualizada com sucesso')
  //   if (imgUrl) {
  //     removeFile(imgUrl) // Remove a imagem antiga
  //   }
  // }).catch(function (error) {
  //   showError('Falha ao atualizar tarefa: ', error)
  // })

  resetTodoForm() // Restaura o estado inicial do formulário de tarefas
}