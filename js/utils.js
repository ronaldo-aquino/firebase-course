// Definindo referencias para elementos da página
const authForm = document.getElementById('authForm')
const authFormTitle = document.getElementById('authFormTitle')
const register = document.getElementById('register')
const access = document.getElementById('access')

// Alterar formulario de autenticação para o cadastro de novas contas
function toggleToRegister() {
  authForm.submitAuthForm.innerHTML = 'Cadastrar conta'
  authFormTitle.innerHTML = 'Insira seus dados para se cadastrar'
  hideItem(register)
  showItem(access)
}

// Alterar formulario de autenticação para o acesso contas já existentes
function toggleToAccess() {
  authForm.submitAuthForm.innerHTML = 'Acessar'
  authFormTitle.innerHTML = 'Acesse a sua conta para continuar'
  hideItem(access)
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