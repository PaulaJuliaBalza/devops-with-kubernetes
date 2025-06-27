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
