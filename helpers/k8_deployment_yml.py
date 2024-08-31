import os
import yaml


def create_service_deployments(template_path:str, output_dir:str, services:list):
    # Read the template YAML file
    with open(template_path, 'r') as file:
        template = yaml.safe_load(file)

    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)

    # Generate deployment files for each service
    for service in services:
        # Create a deep copy of the template
        deployment = yaml.safe_load(yaml.dump(template))

        # Replace service name in the deployment
        deployment['metadata']['name'] = service
        deployment['spec']['selector']['matchLabels']['app'] = service
        deployment['spec']['template']['metadata']['labels']['app'] = service
        deployment['spec']['template']['spec']['containers'][0]['name'] = service
        deployment['spec']['template']['spec']['containers'][0]['image'] = f"{service}:latest"

        # Write the new deployment file
        output_path = os.path.join(output_dir, f"{service}-deployment.yml")
        with open(output_path, 'w') as file:
            yaml.dump(deployment, file, default_flow_style=False)

        print(f"Created deployment file for {service}")


services_path = "./services"
k8_deployments_path = "./kubernetes/deployments"
docker_compose = "docker-compose.yml"
k8_deployment_template = 'service-deployment-template.yml'
k8_service_template = 'service-deployment-template.yml'
output_dir = 'deployments'

service_names = [name for name in os.listdir(services_path) 
                if os.path.isdir(os.path.join(services_path, name))]

create_service_deployments(template_path=k8_deployment_template, output_dir=k8_deployments_path, services=service_names)