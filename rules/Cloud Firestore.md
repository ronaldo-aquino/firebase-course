# Regras de segurança e validação de dados - acesso aos dados é restrito aos donos dos dados
# Validação de dados (name, nameLowerCase): devem ser string e possuir até 30 caracteres
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/{document=**} {
      allow read, delete: if request.auth.uid == uid;
      allow create, update: if request.auth.uid == uid
      		&& request.resource.data.name is string
          && request.resource.data.name.size() <= 30
          && request.resource.data.nameLowerCase is string
          && request.resource.data.nameLowerCase.size() <= 30;
    }
  }
}