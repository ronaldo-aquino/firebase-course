firebase.auth().languageCode = 'pt-BR'

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
      hideItem(loading)
    })
    .catch(error => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log('Falha no acesso', errorCode)
      console.log('Mensagem de erro', errorMessage)
      hideItem(loading)
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

const sendEmailVification= () => {
  showItem(loading)
  const user = firebase.auth().currentUser
  user.sendEmailVerification(actionCodeSettings)
    .then(() => {
      alert(`Email de verificação foi enviado para ${user.email}`)
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log('Falha na verificação', errorCode)
      console.log('Mensagem de erro', errorMessage)
  }).finally(() => {
    hideItem(loading)
  })
}

const sendPasswordResetEmail = () => {
  const email  = prompt('Redefinir Senha! Informe seu endereço de e-mail', authForm.email.value)
  if(email) {
    showItem(loading)
    firebase.auth().sendPasswordResetEmail(email, actionCodeSettings)
      .then(() => {
        alert(`Email de redefinição de senha foi enviado para ${email}.`)
      }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log('Falha na verificação', errorCode)
        console.log('Mensagem de erro', errorMessage)
      }).finally(() => {
        hideItem(loading)
      })
  }
  return alert('É preciso preencher o campo de e-mail para redefinir sua senha.')
}