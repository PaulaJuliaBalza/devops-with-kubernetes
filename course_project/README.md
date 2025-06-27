# 1.2 The Project, Step 1
The course project is a simple todo application with the familiar features of create, read, update, and delete (CRUD). Todo is a text like "I need to clean the house" that can be in the state of not-done or done.
![Course Project](./course-project.png "Course Project")
## Instructions
Create a web server that outputs "Server started in port NNNN" when it is started and deploy it into your Kubernetes cluster. Please make it so that an environment variable PORT can be used to choose the used port. You may call the server todo app since it will, amongst other things, provide the functionality of a todo application pretty soon.

You will not have access to the port when it is running in Kubernetes yet. We will configure the access when we get to networking.

## Solution
```
# Build the Docker image 
docker build -t paulajuliabalza/todo-app:1.0 .

# Push image to Docker Hub Repository
docker push paulajuliabalza/todo-app:1.0

# Deploy to Kubernetes
kubectl create deployment todo-app --image=paulajuliabalza/todo-app:1.0 --port=3000
deployment.apps/todo-app created

# Get pods
kubectl get pods
NAME                        READY   STATUS    RESTARTS   AGE
todo-app-7b5b7df79b-6cb5b   1/1     Running   0          65s

# Get Logs
kubectl logs todo-app-7b5b7df79b-6cb5b
Server started in port 3000
[2025-06-26T23:32:23.375Z] Todo App heartbeat on port 3000
[2025-06-26T23:32:28.379Z] Todo App heartbeat on port 3000
[2025-06-26T23:32:33.383Z] Todo App heartbeat on port 3000
[2025-06-26T23:32:38.388Z] Todo App heartbeat on port 3000

# Cleanup
kubectl delete deployment todo-app
```

# 1.4: The project, step 2

## Instructions
Create a deployment.yaml for the course project (that you started in Exercise 1.2.)

You won't have access to the port yet but that'll come soon.

## Solution
```
# Apply manifest
kubectl apply -f manifests/deployment-todoapp.yaml
deployment.apps/todo-app created

```

# 1.5: The project, step 3

## Instructions
Make the project respond something to a GET request sent to the / url of the project. A simple HTML page is good, or you can deploy something more complex, like a single-page application.

Define Environment Variables for a Container
https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/ 

Use kubectl port-forward to confirm that the project is accessible and works in the cluster by using a browser to access the project.

## Solution
```
# Build Docker Image
docker build -t paulajuliabalza/todo-app:1.5 .

# Push the image to Docker Hub
docker push paulajuliabalza/todo-app:1.5

# Apply the deployment
kubectl apply -f course_project/manifests/deployment-todoapp.yaml
deployment.apps/todo-app configured

# Get pods
kubectl get pos
todo-app-7bfbdb5f99-lwbv8    1/1     Running   0              86s

# Get Logs
kubectl logs todo-app-7bfbdb5f99-lwbv8
Server started in port 3000
[2025-06-27T13:35:26.655Z] Todo App heartbeat on port 3000
[2025-06-27T13:35:31.659Z] Todo App heartbeat on port 3000
[2025-06-27T13:35:36.663Z] Todo App heartbeat on port 3000


# Port Forward to access the application
kubectl port-forward deployment/todo-app 8080:3000
Forwarding from 127.0.0.1:8080 -> 3000
Forwarding from [::1]:8080 -> 3000

# Access the application
Open your browser and go to http://localhost:8080 
curl http://localhost:8080

      <!DOCTYPE html>
      <html>
        <head>
          <title>Todo App</title>
        </head>
        <body>
          <h1>Todo App</h1>
          <p>This is a simple todo application.</p>
        </body>
      </html>


# List pod env vars
kubectl exec <pod-name> -- printenv
kubectl exec todo-app-7bfbdb5f99-lwbv8 -- printenv
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
HOSTNAME=todo-app-7bfbdb5f99-lwbv8
NODE_VERSION=18.20.8
YARN_VERSION=1.22.22
PORT=3000
KUBERNETES_SERVICE_PORT=443
KUBERNETES_SERVICE_PORT_HTTPS=443
KUBERNETES_PORT=tcp://10.43.0.1:443
KUBERNETES_PORT_443_TCP=tcp://10.43.0.1:443
KUBERNETES_PORT_443_TCP_PROTO=tcp
KUBERNETES_PORT_443_TCP_PORT=443
KUBERNETES_PORT_443_TCP_ADDR=10.43.0.1
KUBERNETES_SERVICE_HOST=10.43.0.1
HOME=/root

```