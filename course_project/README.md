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