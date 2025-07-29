export interface Client {
  id: string
  name: string
  email: string
  phone: string
  createdAt: Date
}

export interface ClientFormData {
  name: string
  email: string
  phone: string
}
