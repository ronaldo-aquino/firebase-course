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
    .then(() => {
      console.log('Cadastrou com sucesso')
      authForm.email.value = ''
      authForm.password.value = ''
    })
    .catch(error => {
      showError('Falha no acesso', error)
    })
  )
}

const createUser = () => {
  return (
    firebase.auth().signInWithEmailAndPassword(authForm.email.value, authForm.password.value)
    .then(() => {
      console.log('Acessou com sucesso')
      authForm.email.value = ''
      authForm.password.value = ''
      hideItem(loading)
    })
    .catch(error => {
      showError('Falha no cadastro', error)
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
    showError('Falha no sair da conta', error)
  });
}

const sendEmailVification= () => {
  showItem(loading)
  const user = firebase.auth().currentUser
  user.sendEmailVerification(actionCodeSettings)
    .then(() => {
      alert(`Email de verificação foi enviado para ${user.email}`)
    }).catch(function(error) {
      showError('Falha ao enviar mensagem de verificação de e-mail', error)
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
        showError('Falha ao enviar e-mail de redefinição de senha', error)
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
    .catch(error => {
      showError('Houve um erro ao autenticar com o google', error)
    })
}

const signInWithGithub = () => {
  showItem(loading)
  firebase.auth().signInWithRedirect(new firebase.auth.GithubAuthProvider())
    .catch(error => {
      showError('Houve um erro ao autenticar com o github', error)
    })
}

const signInWithFacebook = () => {
  showItem(loading)
  firebase.auth().signInWithRedirect(new firebase.auth.FacebookAuthProvider())
    .catch(error => {
      showError('Houve um erro ao autenticar com o facebook', error)
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
    }).catch(error => {
      showError('Houve um erro ao atualizar seu nome', error)
    }).finally(() => {
      hideItem(loading)
    })
  } else {
    alert('O nome de usuário não pode ser vazio.')
  }
}

const deleteUserAccount = () => {
  const confirmation = confirm('Realmente deseja excluir sua conta?')
  if(confirmation) {
    showItem(loading)
    const user = firebase.auth().currentUser
    user.delete().then(() => {
      alert('Conta Excluida Com Sucesso!')
    }).catch(error => {
      showError('Houve um erro ao excluir sua conta.', error)
    }).finally(() => {
      hideItem(loading)
    })
  }
}