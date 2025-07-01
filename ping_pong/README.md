# 1.9: More services

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
docker build -t paulajuliabalza/ping-pong:1.9 .

# Push to repository
docker push <image>:<new_tag>
docker push paulajuliabalza/ping-pong:1.9

# Apply the deployment of ping-pong and log-output
kubectl apply -f log_output/manifests/deployment-log-output.yaml
deployment.apps/log-output created

kubectl apply -f ping_pong/manifests/deployment-ping-pong.yaml
deployment.apps/ping-pong-app created

# Apply the service for ping-pong and log-output
kubectl apply -f ping_pong/manifests/service-ping-pong.yaml
service/ping-pong-service created
kubectl apply -f log_output/manifests/service-log-output.yaml
service/log-output-service created

# Apply the Ingress
kubectl apply -f log_output/manifests/ingress-log-output.yaml
ingress.networking.k8s.io/log-output-ingress created

# Get svc, ingress
kubectl get svc,ing
NAME                         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
service/kubernetes           ClusterIP   10.43.0.1      <none>        443/TCP    20m
service/ping-pong-service    ClusterIP   10.43.8.209    <none>        3002/TCP   2m
service/log-output-service   ClusterIP   10.43.181.60   <none>        3001/TCP   25s

NAME                                           CLASS    HOSTS   ADDRESS                            PORTS   AGE
ingress.networking.k8s.io/log-output-ingress   <none>   *       172.18.0.2,172.18.0.3,172.18.0.4   80      11s

# Get pod
kubectl get pods
NAME                             READY   STATUS    RESTARTS   AGE
log-output-64bb9b5796-mgld5      1/1     Running   0          11m
ping-pong-app-6864b6dc75-ckmnl   1/1     Running   0          2m8s


# Get logs
kubectl logs 

# Curl 
administrator@ASC:~/Escritorio/devops-with-kubernetes$ curl http://localhost:8081/ping-pong
pong 3
administrator@ASC:~/Escritorio/devops-with-kubernetes$ curl http://localhost:8081/ping-pong
pong 4
administrator@ASC:~/Escritorio/devops-with-kubernetes$ curl http://localhost:8081/ping-pong
pong 5

curl http://localhost:8081/log-status
{"timestamp":"2025-07-01T04:33:47.083Z","uuid":"e0200032-6c7a-4528-94a1-46ea5017628b"}

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
              /log-status   log-output-service:3001 (10.42.0.5:3001)
              /ping-pong    ping-pong-service:3002 (10.42.1.7:3002)
Annotations:  <none>
Events:       <none>
```
