export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/[\s\-$$$$]/g, ""))
}

export const validateClientForm = (data: { name: string; email: string; phone: string }) => {
  const errors: { [key: string]: string } = {}

  if (!data.name.trim()) {
    errors.name = "Name is required"
  }

  if (!data.email.trim()) {
    errors.email = "Email is required"
  } else if (!validateEmail(data.email)) {
    errors.email = "Please enter a valid email address"
  }

  if (!data.phone.trim()) {
    errors.phone = "Phone number is required"
  } else if (!validatePhone(data.phone)) {
    errors.phone = "Please enter a valid phone number"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
