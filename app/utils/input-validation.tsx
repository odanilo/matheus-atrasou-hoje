export function validateEmailField(email: string) {
  if (email.length <= 3) {
    return "O e-mail precisa ter mais que 3 caracteres.";
  }

  if (!email.includes("@")) {
    return "O e-mail precisa incluir um @.";
  }

  return null;
}

export function validatePasswordField(password: string) {
  if (password.length === 0) {
    return "A senha é obrigatória.";
  }

  if (password.length < 6) {
    return "Senha muito curta.";
  }

  return null;
}

export function validateFirstNameField(firstName: string) {
  if (firstName.length === 0) {
    return "O nome é obrigatório.";
  }

  if (firstName.length <= 3) {
    return "O nome precisa ter mais que 3 caracteres.";
  }

  return null;
}
