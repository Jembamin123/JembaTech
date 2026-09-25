terraform {
  required_version = ">= 1.6.0"

  required_providers {
    local = {
      source  = "hashicorp/local"
      version = "~> 2.5"
    }
  }
}

provider "local" {}

# EP1: contrato reproducible del staging. EP2 reemplazara este recurso
# por infraestructura del proveedor cloud elegido por el equipo.
resource "local_file" "staging_manifest" {
  filename = "${path.module}/generated/staging-manifest.json"
  content = jsonencode({
    environment = var.environment
    frontend    = var.frontend_url
    backend     = var.backend_url
    python      = var.python_service_url
    database    = "postgresql"
  })
}
