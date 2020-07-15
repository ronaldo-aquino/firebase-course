// Definindo referencias para elementos da página
const authForm = document.getElementById('authForm')
const authFormTitle = document.getElementById('authFormTitle')
const register = document.getElementById('register')
const access = document.getElementById('access')
const loading = document.getElementById('loading')
const auth = document.getElementById('auth')
const userContent = document.getElementById('userContent')
const userEmail = document.getElementById('userEmail')
const sendEmailVerificationDiv = document.getElementById('sendEmailVerificationDiv')
const emailVerified = document.getElementById('emailVerified')
const passwordReset = document.getElementById('passwordReset')
const userImg = document.getElementById('userImg')
const userName = document.getElementById('userName')
const todoForm = document.getElementById('todoForm')
const todoCount = document.getElementById('todoCount')
const ulTodoList = document.getElementById('ulTodoList')

// Alterar formulario de autenticação para o cadastro de novas contas
function toggleToRegister() {
  authForm.submitAuthForm.innerHTML = 'Cadastrar conta'
  authFormTitle.innerHTML = 'Insira seus dados para se cadastrar'
  hideItem(register)
  hideItem(passwordReset)
  showItem(access)
}

// Alterar formulario de autenticação para o acesso contas já existentes
function toggleToAccess() {
  authForm.submitAuthForm.innerHTML = 'Acessar'
  authFormTitle.innerHTML = 'Acesse a sua conta para continuar'
  hideItem(access)
  showItem(passwordReset)
  showItem(register)
}

// Simplifica a execução de elementos da página
function showItem(element) {
  element.style.display = 'block'
}

// Simplifica a execução de elementos da página
function hideItem(element) {
  element.style.display = 'none'
}

function showUserContent(user) {
  console.log(user)
  if(user.providerData[0].providerId !== 'password') {
    emailVerified.innerHTML = 'Autenticação por provedor confiável.'
    hideItem(sendEmailVerificationDiv)
  } else {
    if(user.emailVerified) {
      emailVerified.innerHTML = 'E-mail verificado'
      hideItem(sendEmailVerificationDiv)
    } else {
      emailVerified.innerHTML = 'E-mail não verificado'
      showItem(sendEmailVerificationDiv)
    }
  }
  
  userImg.src = user.photoURL ? user.photoURL : './img/unknownUser.png'
  userName.innerHTML = user.displayName
  userEmail.innerHTML = user.email
  hideItem(auth)

  dbRefUsers.child(firebase.auth().currentUser.uid).on('value', dataSnapshot => {
    fillTodoList(dataSnapshot)
  })

  showItem(userContent)
}

function showAuth() {
  hideItem(userContent)
  showItem(auth)
}

const actionCodeSettings = {
  url: 'https://todolist-f0d5d.firebaseapp.com'
}

const showError = (prefix, error) => {
  console.log(error.code)
  hideItem(loading)

  switch(error.code) {
    case 'auth/invalid-email': 
      alert(`${prefix} E-mail ou senha inválidos`)
      break;

    case 'auth/wrong-password':
      alert(`${prefix} E-mail ou senha inválidos`)
      break;

    case 'auth/weak-password':
      alert(`${prefix} Senha deve ter ao menos 6 caracteres`)
      break;

    case 'auth/email-already-in-use':
      alert(`${prefix} E-mail já cadastrado`)
      break;

    default: alert(`${prefix} ${error.message}`)

  }

}

const database = firebase.database()
const dbRefUsers = database.ref('users')