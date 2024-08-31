import os
import yaml

def create_service_files(template_path, output_dir, services):
    # Read the template YAML file
    with open(template_path, 'r') as file:
        template = yaml.safe_load(file)

    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)

    # Generate service files for each service
    for service in services:
        # Create a deep copy of the template
        service_yaml = yaml.safe_load(yaml.dump(template))

        # Replace service name in the YAML
        service_yaml['metadata']['name'] = f"{service}-service"
        service_yaml['spec']['selector']['app'] = service

        # Write the new service file
        output_path = os.path.join(output_dir, f"{service}-service.yml")
        with open(output_path, 'w') as file:
            yaml.dump(service_yaml, file, default_flow_style=False)

        print(f"Created service file for {service}")

services_path = "./services"
template_path = 'service-template.yml'
k8_services_path = "./kubernetes/services"
service_names = [name for name in os.listdir(services_path) 
                if os.path.isdir(os.path.join(services_path, name))]


create_service_files(template_path=template_path, output_dir=k8_services_path, services=service_names)
