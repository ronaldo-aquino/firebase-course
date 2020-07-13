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
  } else {
    alert('É preciso preencher o campo de e-mail para redefinir sua senha.')
  }
}

const signInWithGoogle = () => {
  showItem(loading)
  firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider())
    .catch(e => {
      alert('Houve um erro ao autenticar com o google')
      console.log(e)
      hideItem(loading)
    })
}

const signInWithGithub = () => {
  showItem(loading)
  firebase.auth().signInWithRedirect(new firebase.auth.GithubAuthProvider())
    .catch(e => {
      alert('Houve um erro ao autenticar com o github')
      console.log(e)
      hideItem(loading)
    })
}

const signInWithFacebook = () => {
  showItem(loading)
  firebase.auth().signInWithRedirect(new firebase.auth.FacebookAuthProvider())
    .catch(e => {
      alert('Houve um erro ao autenticar com o facebook')
      console.log(e)
      hideItem(loading)
    })
}

const updateUserName = () => {
  const user = firebase.auth().currentUser;
  const newUserName = prompt('Informe um novo nome de usuário.', userName.innerHTML)
  if(newUserName && newUserName !== '') {
    userName.innerHTML = newUserName
    showItem(loading)
    user.updateProfile({
      displayName: newUserName
    }).catch(e => {
      alert('Houve um erro ao atualizar seu nome')
      console.lof(e)
    }).finally(() => {
      hideItem(loading)
    })
  } else {
    alert('O nome de usuário não pode ser vazio.')
  }
}