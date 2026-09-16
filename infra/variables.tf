variable "environment" {
  type    = string
  default = "staging"
}

variable "frontend_url" {
  type        = string
  description = "URL publica del frontend."
}

variable "backend_url" {
  type        = string
  description = "URL publica de NestJS."
}

variable "python_service_url" {
  type        = string
  description = "URL interna de FastAPI."
}
