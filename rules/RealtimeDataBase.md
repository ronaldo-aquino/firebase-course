# Padrão
{
  "rules": {
    ".read": false,
    ".write": false
  }
}

# Mode de teste público
{
  "rules": {
    ".read": true,
    ".write": true
  }
}

# Usuários Autenticados
{
  "rules": {
    ".read": "auth !== null",
    ".write": "auth !== null"
  }
}

# Acesso restrito ao dono dos dados
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
    		".write": "$uid === auth.uid"
      }
    }
  }
}

# Inclui regras de validação de dados
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
    		".write": "$uid === auth.uid",
        "$tid": {
          ".validate": "newData.child('name').isString() && newData.child('name').val().length <= 30"
        }
      }
    }
  }
}

# Inclui regras de validação de dados (Filtragem e ordenação de dados)
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
    		".write": "$uid === auth.uid",
        ".indexOn": "nameLowerCase",
        "$tid": {
          ".validate": "newData.child('name').isString() && newData.child('name').val().length <= 30 && newData.child('nameLowerCase').isString() && newData.child('nameLowerCase').val().length <= 30"
        }
      }
    }
  }
}