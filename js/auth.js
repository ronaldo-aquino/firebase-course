authForm.onsubmit = event => {
  showItem(loading)
  event.preventDefault()
  if(authForm.submitAuthForm.innerHTML === 'Cadastrar conta') {
    return loginUser()
  }
  return createUser()
}

const loginUser = () => {
  return (
    firebase.auth().createUserWithEmailAndPassword(authForm.email.value, authForm.password.value)
    .then(user => {
      console.log('Cadastrou com sucesso')
      console.log(user)
      authForm.email.value = ''
      authForm.password.value = ''
    })
    .catch(error => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log('Falha no cadastro', errorCode)
      console.log('Mensagem de erro', errorMessage)
    })
  )
}

const createUser = () => {
  return (
    firebase.auth().signInWithEmailAndPassword(authForm.email.value, authForm.password.value)
    .then(user => {
      console.log('Acessou com sucesso')
      console.log(user)
      authForm.email.value = ''
      authForm.password.value = ''
    })
    .catch(error => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log('Falha no acesso', errorCode)
      console.log('Mensagem de erro', errorMessage)
    })
  )
}

const observerUser = () => {
  firebase.auth().onAuthStateChanged(user => {
    hideItem(loading)
    if (user) {
      return showUserContent(user)
    }
    return showAuth()
  });
}

const signOut = () => {
  firebase.auth().signOut()
    .then(function() {

  }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log('Falha no sair da conta', errorCode)
    console.log('Mensagem de erro', errorMessage)
  });
}