# 1.1: Getting Started

## Instructions
Exercises can be done with any language and framework you want.

Create an application that generates a random string on startup, stores this string into memory, and outputs it every 5 seconds with a timestamp. e.g.

```
2020-03-30T12:15:17.705Z: 8523ecb1-c716-4cb6-a044-b9e83bb98e43
2020-03-30T12:15:22.705Z: 8523ecb1-c716-4cb6-a044-b9e83bb98e43
```

Deploy it into your Kubernetes cluster and confirm that it's running with kubectl logs ...

You will keep building this application in future exercises. This application will be called Log output.

## Solution

```
# Create Cluster
k3d cluster create -a 2

# Export kubeconfig or merge
unset KUBECONFIG
export KUBECONFIG=$(k3d kubeconfig get k3s-default)
k3d kubeconfig merge k3s-default --kubeconfig-merge-default

# Get contexts
kubectl config get-contexts
kubectl config current-context

# Set context
kubectl config use-context k3d-k3s-default

# List the running containers
docker ps
CONTAINER ID   IMAGE                            COMMAND                  CREATED          STATUS          PORTS                             NAMES
dbd7b95d7d22   ghcr.io/k3d-io/k3d-proxy:5.4.1   "/bin/sh -c nginx-pr…"   11 minutes ago   Up 11 minutes   80/tcp, 0.0.0.0:40011->6443/tcp   k3d-k3s-default-serverlb
d37310e2f71c   rancher/k3s:v1.22.7-k3s1         "/bin/k3s agent"         11 minutes ago   Up 11 minutes                                     k3d-k3s-default-agent-1
45b503c44fd5   rancher/k3s:v1.22.7-k3s1         "/bin/k3s agent"         11 minutes ago   Up 11 minutes                                     k3d-k3s-default-agent-0
9a26584649f2   rancher/k3s:v1.22.7-k3s1         "/bin/k3s server --t…"   11 minutes ago   Up 11 minutes                                     k3d-k3s-default-server-0


# Build image
docker build -t paulajuliabalza/log-output:1.0.0 .

# Push image to Registry https://hub.docker.com/repository/docker/paulajuliabalza/log-output/general 
docker push paulajuliabalza/log-output:1.0.0

# Deployment
kubectl create deployment logoutput --image=paulajuliabalza/log-output:1.0.0
deployment.apps/logoutput created

# Get Object ReplicaSet
kubectl get rs
NAME                   DESIRED   CURRENT   READY   AGE
logoutput-86898fdb7c   1         1         1       7m35s

# Get object deployment
kubectl get deployment
NAME        READY   UP-TO-DATE   AVAILABLE   AGE
logoutput   1/1     1            1           5m56s

# Get pods
kubectl get pods
NAME                         READY   STATUS    RESTARTS      AGE
logoutput-86898fdb7c-522t7   1/1     Running   1 (77s ago)   6m18s


# Get Logs
kubectl logs
kubectl logs logoutput-86898fdb7c-522t7
2025-06-24T00:29:48.818Z: aaf3f7e0-5d68-4b49-9af3-013dda88b8ef
2025-06-24T00:29:53.820Z: aaf3f7e0-5d68-4b49-9af3-013dda88b8ef
2025-06-24T00:29:58.823Z: aaf3f7e0-5d68-4b49-9af3-013dda88b8ef
2025-06-24T00:30:03.829Z: aaf3f7e0-5d68-4b49-9af3-013dda88b8ef
2025-06-24T00:30:08.833Z: aaf3f7e0-5d68-4b49-9af3-013dda88b8ef
2025-06-24T00:30:13.835Z: aaf3f7e0-5d68-4b49-9af3-013dda88b8ef
2025-06-24T00:30:18.839Z: aaf3f7e0-5d68-4b49-9af3-013dda88b8ef
2025-06-24T00:30:23.844Z: aaf3f7e0-5d68-4b49-9af3-013dda88b8ef


# Describe 
kubectl describe <objects>
```
# 1.3: Declarative approach

## Instructions
In your "Log output" application, create a folder for manifests and move your deployment into a declarative file.

Make sure everything still works by restarting and following logs.

# Solution
```
# Apply manifest
kubectl apply -f manifests/deployment-log-output.yaml
deployment.apps/log-output created


# Update image
docker build -t <image>:<new_tag>


# Push to repository
docker push <image>:<new_tag>
docker push paulajuliabalza/log-output:1.0.1

# Get pod
NAME                         READY   STATUS    RESTARTS   AGE
log-output-8d6469f9d-hq2ng   1/1     Running   0          2m53s

# Get logs
 kubectl logs log-output-8d6469f9d-hq2ng
2025-06-27T00:55:55.487Z: 3801bd19-50ec-48fb-b442-64bc62a3739c
2025-06-27T00:56:00.491Z: 3801bd19-50ec-48fb-b442-64bc62a3739c
2025-06-27T00:56:05.495Z: 3801bd19-50ec-48fb-b442-64bc62a3739c
2025-06-27T00:56:10.499Z: 3801bd19-50ec-48fb-b442-64bc62a3739c
2025-06-27T00:56:15.504Z: 3801bd19-50ec-48fb-b442-64bc62a3739c
2025-06-27T00:56:20.507Z: 3801bd19-50ec-48fb-b442-64bc62a3739c
2025-06-27T00:56:25.511Z: 3801bd19-50ec-48fb-b442-64bc62a3739c
2025-06-27T00:56:30.515Z: 3801bd19-50ec-48fb-b442-64bc62a3739c
```

# 1.7: External access with Ingress

## Instructions
"Log output" application currently outputs a timestamp and a random string (that it creates on startup) to the logs.

Add an endpoint to request the current status (timestamp and the random string) and an Ingress so that you can access it with a browser.

You can just store the random string to the memory.

# Solution
```
# Create cluster k3d
k3d cluster create -p "8081:80@loadbalancer" --agents 2
"map port 8081 from the host to port 80 on the container which matches the nodefilter loadbalancer" - the loadbalancer nodefilter matches only the serverlb that's deployed in front of a cluster's server nodes - all ports exposed on the serverlb will be proxied to the same ports on all server nodes in the cluster.

# Update image
docker build -t <image>:<new_tag>
docker build -t paulajuliabalza/log-output:1.7.3 .

# Push to repository
docker push <image>:<new_tag>
docker push paulajuliabalza/log-output:1.7.3

# Apply the deployment
kubectl apply -f log_output/manifests/deployment-log-output.yaml
deployment.apps/log-output created

# Apply the service
kubectl apply -f log_output/manifests/service-log-output.yaml
service/log-output-service created

# Apply the Ingress
kubectl apply -f log_output/manifests/ingress-log-output.yaml
ingress.networking.k8s.io/log-output-ingress created

# Get svc, ingress
kubectl get svc,ing
NAME                         TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
service/kubernetes           ClusterIP   10.43.0.1       <none>        443/TCP    18m
service/log-output-service   ClusterIP   10.43.211.169   <none>        3001/TCP   10m

NAME                                           CLASS    HOSTS   ADDRESS                            PORTS   AGE
ingress.networking.k8s.io/log-output-ingress   <none>   *       172.18.0.2,172.18.0.3,172.18.0.4   80      10m

# Get pod
kubectl get pods
NAME                          READY   STATUS    RESTARTS   AGE
log-output-6647b45b7c-cfc84   1/1     Running   0          5m37s


# Get logs
kubectl logs log-output-6647b45b7c-cfc84
Server running on port 3001
2025-06-27T17:28:34.464Z: 5b1aaa02-4d94-4bc8-8d11-a6006fbadf8c
2025-06-27T17:28:39.465Z: 5b1aaa02-4d94-4bc8-8d11-a6006fbadf8c
2025-06-27T17:28:44.467Z: 5b1aaa02-4d94-4bc8-8d11-a6006fbadf8c
2025-06-27T17:28:49.471Z: 5b1aaa02-4d94-4bc8-8d11-a6006fbadf8c
2025-06-27T17:28:54.475Z: 5b1aaa02-4d94-4bc8-8d11-a6006fbadf8c
2025-06-27T17:28:59.475Z: 5b1aaa02-4d94-4bc8-8d11-a6006fbadf8c


# Curl 
curl http://localhost:8081/log-status
{"timestamp":"2025-06-27T18:02:28.267Z","uuid":"2eafeca0-e389-45e6-96ec-9bc261cabbbf"}
curl http://localhost:8081/
Log Output app is running


# Debug
kubectl describe pod $(kubectl get pods -l app=log-output -o jsonpath='{.items[0].metadata.name}')

kubectl describe ingress log-output-ingress
Name:             log-output-ingress
Labels:           <none>
Namespace:        default
Address:          172.18.0.2,172.18.0.3,172.18.0.4
Ingress Class:    <none>
Default backend:  <default>
Rules:
  Host        Path  Backends
  ----        ----  --------
  *           
              /log-status   log-output-service:3001 (10.42.2.4:3001)
Annotations:  nginx.ingress.kubernetes.io/rewrite-target: /
Events:       <none>

```
