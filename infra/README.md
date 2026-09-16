# Staging preliminar

La EP1 usa Terraform para validar un contrato reproducible de ambiente. No aprovisiona aun nube real: EP2 elegira proveedor y reemplazara `local_file` por red, ejecucion, almacenamiento y reglas de acceso.

```bash
cp terraform.tfvars.example terraform.tfvars
terraform init
terraform fmt -check
terraform validate
terraform plan
```
