# Bloqueado
{
  "rules": {
    ".read": false,
    ".write": false
  }
}

# Testes
{
  "rules": {
    ".read": true,
    ".write": true
  }
}

# Usuários autenticados
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}

# Acesso restrito ao dono dos dados
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid == auth.uid",
    		".write": "$uid == auth.uid"
      }
    }
  }
}

# Incluindo regras de validação para as tarefas
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid == auth.uid",
    		".write": "$uid == auth.uid",
        "$tid": {
          ".validate": "newData.child('name').isString() && newData.child('name').val().length <= 30"
        }
      }
    }
  }
}

# Incluindo regras de validação para as tarefas (filtragem e ordaneção de dados)
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid == auth.uid",
    		".write": "$uid == auth.uid",
        ".indexOn": "nameLowerCase",
        "$tid": {
          ".validate": "newData.child('name').isString() && newData.child('name').val().length <= 30 && newData.child('nameLowerCase').isString() && newData.child('nameLowerCase').val().length <= 30"
        }
      }
    }
  }
}