/* ===== INTERACTIVE TERMINAL SIMULATOR ===== */
class DevOpsTerminal {
  constructor(containerId, context = 'docker') {
    this.container = document.getElementById(containerId);
    this.context = context;
    this.history = [];
    this.historyIndex = -1;
    this.output = [];
    this.render();
    this.bindEvents();
  }

  commands = {
    // ===== DOCKER COMMANDS =====
    'docker version': () => [
      { t: 'info', v: 'Client: Docker Engine - Community' },
      { t: 'out', v: ' Version:           24.0.7' },
      { t: 'out', v: ' API version:        1.43' },
      { t: 'out', v: ' Go version:         go1.20.10' },
      { t: 'out', v: ' Git commit:         afdd53b' },
      { t: 'out', v: ' Built:              Fri Oct 27 00:00:00 2023' },
      { t: 'out', v: ' OS/Arch:            linux/amd64' },
      { t: 'info', v: 'Server: Docker Engine - Community' },
      { t: 'out', v: '  Engine:' },
      { t: 'out', v: '   Version:          24.0.7' },
      { t: 'out', v: '   API version:      1.43 (minimum version 1.12)' },
      { t: 'success', v: 'Docker is running correctly!' },
    ],
    'docker info': () => [
      { t: 'out', v: 'Client: Docker Engine - Community' },
      { t: 'out', v: ' Context:    default' },
      { t: 'out', v: ' Debug Mode: false' },
      { t: 'out', v: 'Server:' },
      { t: 'out', v: ' Containers: 3' },
      { t: 'out', v: '  Running: 2' },
      { t: 'out', v: '  Paused: 0' },
      { t: 'out', v: '  Stopped: 1' },
      { t: 'out', v: ' Images: 12' },
      { t: 'out', v: ' Server Version: 24.0.7' },
      { t: 'out', v: ' Storage Driver: overlay2' },
      { t: 'out', v: ' Memory: 7.67GiB' },
      { t: 'out', v: ' CPUs: 4' },
    ],
    'docker pull nginx': () => [
      { t: 'out', v: 'Using default tag: latest' },
      { t: 'out', v: 'latest: Pulling from library/nginx' },
      { t: 'out', v: 'a803b930a20b: Pull complete' },
      { t: 'out', v: '8b625c47d697: Pull complete' },
      { t: 'out', v: '4d3239651a63: Pull complete' },
      { t: 'out', v: 'Digest: sha256:10d1f5b58f74683ad34eb29287e07dab1e90f10af243f151bb50aa5dbb4d62ee' },
      { t: 'out', v: 'Status: Downloaded newer image for nginx:latest' },
      { t: 'success', v: 'docker.io/library/nginx:latest' },
    ],
    'docker pull node:18': () => [
      { t: 'out', v: '18: Pulling from library/node' },
      { t: 'out', v: '167b8a53cd9d: Pull complete' },
      { t: 'out', v: 'b47a222d28fa: Pull complete' },
      { t: 'out', v: ''},
      { t: 'out', v: 'Digest: sha256:b2f9... (truncated)' },
      { t: 'success', v: 'Status: Downloaded newer image for node:18' },
    ],
    'docker pull python:3.11': () => [
      { t: 'out', v: '3.11: Pulling from library/python' },
      { t: 'out', v: 'bc0734b949dc: Pull complete' },
      { t: 'success', v: 'Status: Downloaded newer image for python:3.11' },
    ],
    'docker images': () => [
      { t: 'out', v: 'REPOSITORY          TAG       IMAGE ID       CREATED        SIZE' },
      { t: 'out', v: 'myapp               latest    a1b2c3d4e5f6   2 minutes ago  142MB' },
      { t: 'out', v: 'nginx               latest    605c77e624dd   2 years ago    141MB' },
      { t: 'out', v: 'node                18        b5a2d14b... 3 months ago   991MB' },
      { t: 'out', v: 'python              3.11      fc50d34b...   4 months ago   920MB' },
      { t: 'out', v: 'redis               7         7614ae9453d1   2 years ago    113MB' },
      { t: 'out', v: 'postgres            15        75282fa4...   3 months ago   379MB' },
    ],
    'docker ps': () => [
      { t: 'out', v: 'CONTAINER ID   IMAGE     COMMAND                  CREATED         STATUS         PORTS                  NAMES' },
      { t: 'out', v: 'a1b2c3d4e5f6   nginx     "/docker-entrypoint.…"   5 minutes ago   Up 5 minutes   0.0.0.0:80->80/tcp     webserver' },
      { t: 'out', v: 'f6e5d4c3b2a1   redis     "docker-entrypoint.s…"   10 minutes ago  Up 10 minutes  0.0.0.0:6379->6379/tcp cache' },
    ],
    'docker ps -a': () => [
      { t: 'out', v: 'CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS                      PORTS                  NAMES' },
      { t: 'out', v: 'a1b2c3d4e5f6   nginx     "/docker-entrypoint.…"   5 minutes ago    Up 5 minutes                0.0.0.0:80->80/tcp     webserver' },
      { t: 'out', v: 'f6e5d4c3b2a1   redis     "docker-entrypoint.s…"   10 minutes ago   Up 10 minutes               0.0.0.0:6379->6379/tcp cache' },
      { t: 'out', v: 'b2c3d4e5f6a1   postgres  "docker-entrypoint.s…"   1 hour ago       Exited (0) 30 minutes ago                          db-old' },
    ],
    'docker run hello-world': () => [
      { t: 'out', v: 'Unable to find image \'hello-world:latest\' locally' },
      { t: 'out', v: 'latest: Pulling from library/hello-world' },
      { t: 'out', v: 'c1ec31eb5944: Pull complete' },
      { t: 'out', v: 'Digest: sha256:4bd78111b6914a99dbc560e6a20eab57ff6655aea4a80c50b0c5491968cbc2e6' },
      { t: 'out', v: 'Status: Downloaded newer image for hello-world:latest' },
      { t: 'out', v: '' },
      { t: 'success', v: 'Hello from Docker!' },
      { t: 'out', v: 'This message shows that your installation appears to be working correctly.' },
    ],
    'docker run -d -p 80:80 nginx': () => [
      { t: 'success', v: 'a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef12345678' },
      { t: 'info', v: '✓ Container started! Visit http://localhost to see nginx.' },
    ],
    'docker run -d -p 3000:3000 --name myapp myapp:latest': () => [
      { t: 'success', v: 'b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234' },
      { t: 'info', v: '✓ App running at http://localhost:3000' },
    ],
    'docker run -d --name redis -p 6379:6379 redis:7': () => [
      { t: 'success', v: 'c3d4e5f67890123456789012345678901234abcdef1234567890abcdef12' },
      { t: 'info', v: '✓ Redis running on port 6379' },
    ],
    'docker stop webserver': () => [{ t: 'out', v: 'webserver' }],
    'docker start webserver': () => [{ t: 'out', v: 'webserver' }],
    'docker rm webserver': () => [{ t: 'out', v: 'webserver' }],
    'docker rmi nginx': () => [
      { t: 'out', v: 'Untagged: nginx:latest' },
      { t: 'out', v: 'Deleted: sha256:605c77e624ddb75e6110f997c58876baa13f8754486b461117934b24a9dc3a85' },
    ],
    'docker logs webserver': () => [
      { t: 'out', v: '/docker-entrypoint.sh: /docker-entrypoint.d/ is not empty, will attempt to perform configuration' },
      { t: 'out', v: '/docker-entrypoint.sh: Looking for shell scripts in /docker-entrypoint.d/' },
      { t: 'out', v: '10.0.0.1 - - [01/Jan/2024:12:00:00 +0000] "GET / HTTP/1.1" 200 615 "-" "Mozilla/5.0"' },
      { t: 'out', v: '10.0.0.1 - - [01/Jan/2024:12:00:01 +0000] "GET /favicon.ico HTTP/1.1" 404 153 "-" "Mozilla/5.0"' },
    ],
    'docker logs -f webserver': () => [
      { t: 'out', v: '10.0.0.1 - - [01/Jan/2024:12:00:00 +0000] "GET / HTTP/1.1" 200 615' },
      { t: 'out', v: '10.0.0.1 - - [01/Jan/2024:12:00:05 +0000] "GET /api/data HTTP/1.1" 200 312' },
      { t: 'info', v: '(streaming logs... press Ctrl+C to stop)' },
    ],
    'docker exec -it webserver bash': () => [
      { t: 'success', v: 'root@a1b2c3d4e5f6:/# ' },
      { t: 'info', v: '(You are now inside the container shell)' },
    ],
    'docker build -t myapp .': () => [
      { t: 'out', v: '[+] Building 12.3s (10/10) FINISHED' },
      { t: 'out', v: ' => [internal] load build definition from Dockerfile              0.0s' },
      { t: 'out', v: ' => [internal] load .dockerignore                                 0.0s' },
      { t: 'out', v: ' => [internal] load metadata for docker.io/library/node:18-alpine 1.2s' },
      { t: 'out', v: ' => [1/5] FROM docker.io/library/node:18-alpine@sha256:...        3.4s' },
      { t: 'out', v: ' => [2/5] WORKDIR /app                                            0.1s' },
      { t: 'out', v: ' => [3/5] COPY package*.json ./                                   0.0s' },
      { t: 'out', v: ' => [4/5] RUN npm ci --only=production                            5.8s' },
      { t: 'out', v: ' => [5/5] COPY . .                                                0.1s' },
      { t: 'out', v: ' => exporting to image                                            0.2s' },
      { t: 'success', v: ' => => writing image sha256:a1b2c3d4e5f6...                  0.0s' },
      { t: 'success', v: ' => => naming to docker.io/library/myapp:latest               0.0s' },
    ],
    'docker build -t myapp:v1 .': () => [
      { t: 'out', v: '[+] Building 8.1s (10/10) FINISHED (cached layers)' },
      { t: 'out', v: ' => [1/5] FROM docker.io/library/node:18-alpine  (cache)         0.0s' },
      { t: 'out', v: ' => [2/5] WORKDIR /app                           (cache)         0.0s' },
      { t: 'out', v: ' => [3/5] COPY package*.json ./                  (cache)         0.0s' },
      { t: 'out', v: ' => [4/5] RUN npm ci --only=production           (cache)         0.0s' },
      { t: 'out', v: ' => [5/5] COPY . .                                               0.3s' },
      { t: 'success', v: 'Successfully tagged myapp:v1' },
    ],
    'docker network ls': () => [
      { t: 'out', v: 'NETWORK ID     NAME              DRIVER    SCOPE' },
      { t: 'out', v: 'a1b2c3d4e5f6   bridge            bridge    local' },
      { t: 'out', v: 'b2c3d4e5f6a1   host              host      local' },
      { t: 'out', v: 'c3d4e5f6a1b2   none              null      local' },
      { t: 'out', v: 'd4e5f6a1b2c3   myapp_network     bridge    local' },
    ],
    'docker network create myapp-net': () => [
      { t: 'success', v: 'e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4' },
    ],
    'docker volume ls': () => [
      { t: 'out', v: 'DRIVER    VOLUME NAME' },
      { t: 'out', v: 'local     myapp_db_data' },
      { t: 'out', v: 'local     myapp_redis_data' },
    ],
    'docker volume create db-data': () => [{ t: 'success', v: 'db-data' }],
    'docker stats': () => [
      { t: 'out', v: 'CONTAINER ID   NAME        CPU %   MEM USAGE / LIMIT     MEM %   NET I/O       BLOCK I/O' },
      { t: 'out', v: 'a1b2c3d4e5f6   webserver   0.00%   5.324MiB / 7.67GiB   0.07%   648B / 0B     0B / 0B' },
      { t: 'out', v: 'f6e5d4c3b2a1   cache       0.22%   2.816MiB / 7.67GiB   0.04%   1.02MB / 1MB  0B / 0B' },
    ],
    'docker system prune': () => [
      { t: 'warn', v: 'WARNING! This will remove:' },
      { t: 'warn', v: '  - all stopped containers' },
      { t: 'warn', v: '  - all networks not used by at least one container' },
      { t: 'warn', v: '  - all dangling images' },
      { t: 'warn', v: '  - all dangling build cache' },
      { t: 'out', v: '' },
      { t: 'out', v: 'Total reclaimed space: 1.23GB' },
    ],
    'docker inspect webserver': () => [
      { t: 'out', v: '[' },
      { t: 'out', v: '  {' },
      { t: 'out', v: '    "Id": "a1b2c3d4e5f6...", ' },
      { t: 'out', v: '    "State": { "Status": "running", "Running": true },' },
      { t: 'out', v: '    "Image": "nginx:latest",' },
      { t: 'out', v: '    "NetworkSettings": {' },
      { t: 'out', v: '      "IPAddress": "172.17.0.2",' },
      { t: 'out', v: '      "Ports": { "80/tcp": [{"HostPort": "80"}] }' },
      { t: 'out', v: '    }' },
      { t: 'out', v: '  }' },
      { t: 'out', v: ']' },
    ],
    'docker compose up -d': () => [
      { t: 'out', v: '[+] Running 4/4' },
      { t: 'success', v: ' ✔ Network myapp_default       Created' },
      { t: 'success', v: ' ✔ Container myapp-db-1        Started' },
      { t: 'success', v: ' ✔ Container myapp-redis-1     Started' },
      { t: 'success', v: ' ✔ Container myapp-web-1       Started' },
    ],
    'docker compose down': () => [
      { t: 'out', v: '[+] Running 4/4' },
      { t: 'out', v: ' ✔ Container myapp-web-1       Removed' },
      { t: 'out', v: ' ✔ Container myapp-redis-1     Removed' },
      { t: 'out', v: ' ✔ Container myapp-db-1        Removed' },
      { t: 'out', v: ' ✔ Network myapp_default        Removed' },
    ],
    'docker compose ps': () => [
      { t: 'out', v: 'NAME              IMAGE             COMMAND                  SERVICE   CREATED         STATUS         PORTS' },
      { t: 'out', v: 'myapp-db-1        postgres:15       "docker-entrypoint.s…"   db        2 minutes ago   Up 2 minutes   5432/tcp' },
      { t: 'out', v: 'myapp-redis-1     redis:7           "docker-entrypoint.s…"   redis     2 minutes ago   Up 2 minutes   6379/tcp' },
      { t: 'out', v: 'myapp-web-1       myapp:latest      "node server.js"          web       2 minutes ago   Up 2 minutes   0.0.0.0:3000->3000/tcp' },
    ],
    'docker compose logs -f': () => [
      { t: 'out', v: 'web-1   | Server listening on port 3000' },
      { t: 'out', v: 'db-1    | database system is ready to accept connections' },
      { t: 'out', v: 'redis-1 | Ready to accept connections' },
      { t: 'info', v: '(streaming... Ctrl+C to stop)' },
    ],
    'docker tag myapp:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/myapp:latest': () => [
      { t: 'success', v: 'Image tagged for ECR successfully' },
    ],
    'docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/myapp:latest': () => [
      { t: 'out', v: 'The push refers to repository [123456789.dkr.ecr.us-east-1.amazonaws.com/myapp]' },
      { t: 'out', v: '5f70bf18a086: Pushed' },
      { t: 'out', v: 'a1b2c3d4e5f6: Pushed' },
      { t: 'success', v: 'latest: digest: sha256:abc123... size: 1234' },
    ],

    // ===== KUBECTL COMMANDS =====
    'kubectl version': () => [
      { t: 'out', v: 'Client Version: v1.28.0' },
      { t: 'out', v: 'Kustomize Version: v5.0.4-0.20230601165947-6ce0bf390ce3' },
      { t: 'out', v: 'Server Version: v1.28.3' },
    ],
    'kubectl get nodes': () => [
      { t: 'out', v: 'NAME                                          STATUS   ROLES    AGE   VERSION' },
      { t: 'out', v: 'ip-10-0-1-100.us-east-1.compute.internal     Ready    <none>   3d    v1.28.3' },
      { t: 'out', v: 'ip-10-0-1-101.us-east-1.compute.internal     Ready    <none>   3d    v1.28.3' },
      { t: 'out', v: 'ip-10-0-1-102.us-east-1.compute.internal     Ready    <none>   3d    v1.28.3' },
    ],
    'kubectl get pods': () => [
      { t: 'out', v: 'NAME                         READY   STATUS    RESTARTS   AGE' },
      { t: 'out', v: 'myapp-deployment-7d9c-abc12   1/1     Running   0          5m' },
      { t: 'out', v: 'myapp-deployment-7d9c-def34   1/1     Running   0          5m' },
      { t: 'out', v: 'myapp-deployment-7d9c-ghi56   1/1     Running   0          5m' },
    ],
    'kubectl get pods -A': () => [
      { t: 'out', v: 'NAMESPACE     NAME                                     READY   STATUS    RESTARTS   AGE' },
      { t: 'out', v: 'default       myapp-deployment-7d9c-abc12               1/1     Running   0          5m' },
      { t: 'out', v: 'kube-system   coredns-565d847f94-abc12                  1/1     Running   0          3d' },
      { t: 'out', v: 'kube-system   aws-node-xyz12                            1/1     Running   0          3d' },
      { t: 'out', v: 'monitoring    prometheus-server-0                       2/2     Running   0          2d' },
    ],
    'kubectl get pods -o wide': () => [
      { t: 'out', v: 'NAME                         READY   STATUS    RESTARTS   AGE   IP            NODE' },
      { t: 'out', v: 'myapp-deployment-7d9c-abc12   1/1     Running   0          5m    10.0.1.15    ip-10-0-1-100...' },
      { t: 'out', v: 'myapp-deployment-7d9c-def34   1/1     Running   0          5m    10.0.1.16    ip-10-0-1-101...' },
      { t: 'out', v: 'myapp-deployment-7d9c-ghi56   1/1     Running   0          5m    10.0.1.17    ip-10-0-1-102...' },
    ],
    'kubectl get deployments': () => [
      { t: 'out', v: 'NAME               READY   UP-TO-DATE   AVAILABLE   AGE' },
      { t: 'out', v: 'myapp-deployment   3/3     3            3           10m' },
    ],
    'kubectl get services': () => [
      { t: 'out', v: 'NAME         TYPE           CLUSTER-IP      EXTERNAL-IP                        PORT(S)        AGE' },
      { t: 'out', v: 'kubernetes   ClusterIP      10.100.0.1      <none>                             443/TCP        3d' },
      { t: 'out', v: 'myapp-svc    LoadBalancer   10.100.44.12    a1b2c3.us-east-1.elb.amazonaws.com 80:31234/TCP   10m' },
    ],
    'kubectl get ingress': () => [
      { t: 'out', v: 'NAME           CLASS   HOSTS              ADDRESS                              PORTS   AGE' },
      { t: 'out', v: 'myapp-ingress  nginx   myapp.example.com  a1b2c3.us-east-1.elb.amazonaws.com   80      5m' },
    ],
    'kubectl apply -f deployment.yaml': () => [
      { t: 'success', v: 'deployment.apps/myapp-deployment created' },
    ],
    'kubectl apply -f service.yaml': () => [
      { t: 'success', v: 'service/myapp-service created' },
    ],
    'kubectl apply -f .': () => [
      { t: 'success', v: 'deployment.apps/myapp-deployment created' },
      { t: 'success', v: 'service/myapp-service created' },
      { t: 'success', v: 'configmap/myapp-config created' },
      { t: 'success', v: 'ingress.networking.k8s.io/myapp-ingress created' },
    ],
    'kubectl delete -f deployment.yaml': () => [
      { t: 'out', v: 'deployment.apps "myapp-deployment" deleted' },
    ],
    'kubectl describe pod myapp-deployment-7d9c-abc12': () => [
      { t: 'out', v: 'Name:             myapp-deployment-7d9c-abc12' },
      { t: 'out', v: 'Namespace:        default' },
      { t: 'out', v: 'Node:             ip-10-0-1-100.us-east-1.compute.internal/10.0.1.100' },
      { t: 'out', v: 'Start Time:       Tue, 01 Jan 2024 12:00:00 +0000' },
      { t: 'out', v: 'Labels:           app=myapp' },
      { t: 'out', v: 'Status:           Running' },
      { t: 'out', v: 'IP:               10.0.1.15' },
      { t: 'out', v: 'Containers:' },
      { t: 'out', v: '  myapp:' },
      { t: 'out', v: '    Image:    123456789.dkr.ecr.us-east-1.amazonaws.com/myapp:latest' },
      { t: 'out', v: '    Port:     3000/TCP' },
      { t: 'out', v: '    State:    Running' },
      { t: 'out', v: 'Events:' },
      { t: 'out', v: '  Normal  Pulled     5m    Successfully pulled image' },
      { t: 'out', v: '  Normal  Created    5m    Created container myapp' },
      { t: 'success', v: '  Normal  Started    5m    Started container myapp' },
    ],
    'kubectl logs myapp-deployment-7d9c-abc12': () => [
      { t: 'out', v: 'Server listening on port 3000' },
      { t: 'out', v: 'Connected to PostgreSQL database' },
      { t: 'out', v: 'Connected to Redis cache' },
      { t: 'out', v: 'GET /health 200 - 2ms' },
    ],
    'kubectl logs -f myapp-deployment-7d9c-abc12': () => [
      { t: 'out', v: 'GET /api/users 200 - 12ms' },
      { t: 'out', v: 'POST /api/orders 201 - 45ms' },
      { t: 'info', v: '(streaming... Ctrl+C to stop)' },
    ],
    'kubectl exec -it myapp-deployment-7d9c-abc12 -- sh': () => [
      { t: 'success', v: '/ # ' },
      { t: 'info', v: '(You are now inside the pod shell)' },
    ],
    'kubectl scale deployment myapp-deployment --replicas=5': () => [
      { t: 'success', v: 'deployment.apps/myapp-deployment scaled' },
      { t: 'info', v: 'Scaling from 3 → 5 replicas...' },
    ],
    'kubectl rollout status deployment/myapp-deployment': () => [
      { t: 'out', v: 'Waiting for deployment "myapp-deployment" rollout to finish: 1 of 3 updated replicas are available...' },
      { t: 'out', v: 'Waiting for deployment "myapp-deployment" rollout to finish: 2 of 3 updated replicas are available...' },
      { t: 'success', v: 'deployment "myapp-deployment" successfully rolled out' },
    ],
    'kubectl rollout undo deployment/myapp-deployment': () => [
      { t: 'out', v: 'deployment.apps/myapp-deployment rolled back' },
      { t: 'success', v: 'Successfully rolled back to previous version' },
    ],
    'kubectl rollout history deployment/myapp-deployment': () => [
      { t: 'out', v: 'REVISION  CHANGE-CAUSE' },
      { t: 'out', v: '1         Initial deploy v1.0.0' },
      { t: 'out', v: '2         Updated to v1.1.0' },
      { t: 'out', v: '3         Updated to v1.2.0 (current)' },
    ],
    'kubectl get namespaces': () => [
      { t: 'out', v: 'NAME              STATUS   AGE' },
      { t: 'out', v: 'default           Active   3d' },
      { t: 'out', v: 'kube-system       Active   3d' },
      { t: 'out', v: 'kube-public       Active   3d' },
      { t: 'out', v: 'monitoring        Active   2d' },
      { t: 'out', v: 'production        Active   1d' },
      { t: 'out', v: 'staging           Active   1d' },
    ],
    'kubectl create namespace production': () => [
      { t: 'success', v: 'namespace/production created' },
    ],
    'kubectl get configmaps': () => [
      { t: 'out', v: 'NAME               DATA   AGE' },
      { t: 'out', v: 'myapp-config       4      5m' },
      { t: 'out', v: 'kube-root-ca.crt   1      3d' },
    ],
    'kubectl get secrets': () => [
      { t: 'out', v: 'NAME              TYPE                                  DATA   AGE' },
      { t: 'out', v: 'myapp-secret      Opaque                                3      5m' },
      { t: 'out', v: 'default-token     kubernetes.io/service-account-token   3      3d' },
    ],
    'kubectl get hpa': () => [
      { t: 'out', v: 'NAME       REFERENCE                     TARGETS   MINPODS   MAXPODS   REPLICAS   AGE' },
      { t: 'out', v: 'myapp-hpa  Deployment/myapp-deployment   23%/70%   2         10        3          5m' },
    ],
    'kubectl top pods': () => [
      { t: 'out', v: 'NAME                         CPU(cores)   MEMORY(bytes)' },
      { t: 'out', v: 'myapp-deployment-7d9c-abc12   12m          128Mi' },
      { t: 'out', v: 'myapp-deployment-7d9c-def34   8m           115Mi' },
      { t: 'out', v: 'myapp-deployment-7d9c-ghi56   15m          132Mi' },
    ],
    'kubectl top nodes': () => [
      { t: 'out', v: 'NAME                                      CPU(cores)   CPU%   MEMORY(bytes)   MEMORY%' },
      { t: 'out', v: 'ip-10-0-1-100.us-east-1.compute.internal   312m         7%     2.1Gi           54%' },
      { t: 'out', v: 'ip-10-0-1-101.us-east-1.compute.internal   289m         7%     1.9Gi           49%' },
    ],
    'kubectl get pv': () => [
      { t: 'out', v: 'NAME       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM                    STORAGECLASS   AGE' },
      { t: 'out', v: 'myapp-pv   20Gi       RWO            Retain           Bound    default/myapp-pvc        gp2            5m' },
    ],
    'kubectl get pvc': () => [
      { t: 'out', v: 'NAME        STATUS   VOLUME     CAPACITY   ACCESS MODES   STORAGECLASS   AGE' },
      { t: 'out', v: 'myapp-pvc   Bound    myapp-pv   20Gi       RWO            gp2            5m' },
    ],
    'kubectl get events': () => [
      { t: 'out', v: 'LAST SEEN   TYPE      REASON             OBJECT                            MESSAGE' },
      { t: 'out', v: '5m          Normal    Scheduled          pod/myapp-deployment-7d9c-abc12   Successfully assigned default/myapp-deployment-7d9c-abc12 to ip-10-0-1-100' },
      { t: 'out', v: '5m          Normal    Pulling            pod/myapp-deployment-7d9c-abc12   Pulling image "myapp:latest"' },
      { t: 'success', v: '4m          Normal    Started            pod/myapp-deployment-7d9c-abc12   Started container myapp' },
    ],
    // Helm
    'helm install myapp ./myapp-chart': () => [
      { t: 'out', v: 'NAME: myapp' },
      { t: 'out', v: 'LAST DEPLOYED: Tue Jan 01 12:00:00 2024' },
      { t: 'out', v: 'NAMESPACE: default' },
      { t: 'out', v: 'STATUS: deployed' },
      { t: 'out', v: 'REVISION: 1' },
      { t: 'success', v: '✓ Helm release deployed successfully' },
    ],
    'helm list': () => [
      { t: 'out', v: 'NAME    NAMESPACE  REVISION  UPDATED                  STATUS    CHART          APP VERSION' },
      { t: 'out', v: 'myapp   default    3         2024-01-01 12:00:00 UTC  deployed  myapp-1.2.0    1.2.0' },
    ],
    'helm upgrade myapp ./myapp-chart': () => [
      { t: 'out', v: 'Release "myapp" has been upgraded. Happy Helming!' },
      { t: 'success', v: 'STATUS: deployed  REVISION: 4' },
    ],
    // AWS Commands
    'aws eks list-clusters': () => [
      { t: 'out', v: '{' },
      { t: 'out', v: '    "clusters": [' },
      { t: 'out', v: '        "production-cluster",' },
      { t: 'out', v: '        "staging-cluster"' },
      { t: 'out', v: '    ]' },
      { t: 'out', v: '}' },
    ],
    'aws eks update-kubeconfig --name production-cluster --region us-east-1': () => [
      { t: 'success', v: 'Added new context arn:aws:eks:us-east-1:123456789:cluster/production-cluster to /root/.kube/config' },
    ],
    'aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com': () => [
      { t: 'success', v: 'Login Succeeded' },
    ],
    'aws ecr create-repository --repository-name myapp --region us-east-1': () => [
      { t: 'out', v: '{' },
      { t: 'out', v: '    "repository": {' },
      { t: 'out', v: '        "repositoryUri": "123456789.dkr.ecr.us-east-1.amazonaws.com/myapp",' },
      { t: 'out', v: '        "repositoryName": "myapp",' },
      { t: 'out', v: '        "imageTagMutability": "MUTABLE"' },
      { t: 'out', v: '    }' },
      { t: 'out', v: '}' },
    ],
    'eksctl create cluster --name prod-cluster --region us-east-1 --nodes 3': () => [
      { t: 'info', v: '[ℹ]  eksctl version 0.163.0' },
      { t: 'info', v: '[ℹ]  using region us-east-1' },
      { t: 'out', v: '[ℹ]  setting availability zones to [us-east-1a us-east-1b us-east-1c]' },
      { t: 'out', v: '[ℹ]  subnets for us-east-1a: private:10.0.0.0/19 public:10.0.64.0/19' },
      { t: 'out', v: '[ℹ]  creating EKS cluster "prod-cluster" in "us-east-1" region with managed nodes' },
      { t: 'out', v: '[ℹ]  will create 1 managed nodegroup(s) in cluster "prod-cluster"' },
      { t: 'out', v: '[ℹ]  building managed nodegroup stack "eksctl-prod-cluster-nodegroup-ng-1"' },
      { t: 'out', v: '...(takes ~15 minutes)...' },
      { t: 'success', v: '[✓]  EKS cluster "prod-cluster" in "us-east-1" region is ready' },
    ],
    // ===== LINUX COMMANDS =====
    'pwd': () => [{ t: 'out', v: '/home/devops' }],
    'whoami': () => [{ t: 'out', v: 'devops' }],
    'id': () => [{ t: 'out', v: 'uid=1001(devops) gid=1001(devops) groups=1001(devops),27(sudo),998(docker)' }],
    'uname -a': () => [{ t: 'out', v: 'Linux devops-lab 5.15.0-1057-aws #61-Ubuntu SMP Fri Feb 2 15:48:44 UTC 2024 x86_64 x86_64 x86_64 GNU/Linux' }],
    'uname -r': () => [{ t: 'out', v: '5.15.0-1057-aws' }],
    'uptime': () => [{ t: 'out', v: ' 14:32:10 up 3 days,  2:14,  1 user,  load average: 0.12, 0.08, 0.05' }],
    'date': () => [{ t: 'out', v: new Date().toString() }],
    'hostname': () => [{ t: 'out', v: 'devops-lab' }],
    'ls': () => [{ t: 'out', v: 'app.log  backup  config.conf  deploy.sh  Dockerfile  logs  scripts' }],
    'ls -la': () => [
      { t: 'out', v: 'total 52' },
      { t: 'out', v: 'drwxr-xr-x 5 devops devops 4096 Apr 30 09:00 .' },
      { t: 'out', v: 'drwxr-xr-x 3 root   root   4096 Apr 28 12:00 ..' },
      { t: 'out', v: '-rw------- 1 devops devops  220 Apr 28 12:00 .bash_history' },
      { t: 'out', v: '-rw-r--r-- 1 devops devops 3526 Apr 28 12:00 .bashrc' },
      { t: 'out', v: '-rw-r--r-- 1 devops devops 1234 Apr 30 08:55 app.log' },
      { t: 'out', v: 'drwxr-xr-x 2 devops devops 4096 Apr 30 08:00 backup' },
      { t: 'out', v: '-rw-r--r-- 1 devops devops  512 Apr 30 09:00 config.conf' },
      { t: 'out', v: '-rwxr-xr-x 1 devops devops 2048 Apr 29 14:00 deploy.sh' },
      { t: 'out', v: '-rw-r--r-- 1 devops devops  384 Apr 29 10:00 Dockerfile' },
      { t: 'out', v: 'drwxr-xr-x 2 devops devops 4096 Apr 30 09:00 logs' },
      { t: 'out', v: 'drwxr-xr-x 3 devops devops 4096 Apr 29 12:00 scripts' },
    ],
    'ls -lh': () => [
      { t: 'out', v: 'total 52K' },
      { t: 'out', v: '-rw-r--r-- 1 devops devops 1.2K Apr 30 08:55 app.log' },
      { t: 'out', v: 'drwxr-xr-x 2 devops devops 4.0K Apr 30 08:00 backup' },
      { t: 'out', v: '-rw-r--r-- 1 devops devops  512 Apr 30 09:00 config.conf' },
      { t: 'out', v: '-rwxr-xr-x 1 devops devops 2.0K Apr 29 14:00 deploy.sh' },
    ],
    'cat app.log': () => [
      { t: 'out', v: '2024-04-30 09:00:01 INFO  Server started on port 3000' },
      { t: 'out', v: '2024-04-30 09:00:05 INFO  Connected to database' },
      { t: 'out', v: '2024-04-30 09:01:12 ERROR Failed to connect to cache: timeout' },
      { t: 'out', v: '2024-04-30 09:01:13 WARN  Retrying cache connection (1/3)' },
      { t: 'out', v: '2024-04-30 09:01:14 INFO  Cache connection established' },
      { t: 'out', v: '2024-04-30 09:05:33 ERROR Disk usage at 89% on /dev/sda1' },
      { t: 'out', v: '2024-04-30 09:10:00 INFO  Health check passed' },
    ],
    'cat /etc/os-release': () => [
      { t: 'out', v: 'NAME="Ubuntu"' },
      { t: 'out', v: 'VERSION="22.04.3 LTS (Jammy Jellyfish)"' },
      { t: 'out', v: 'ID=ubuntu' },
      { t: 'out', v: 'ID_LIKE=debian' },
      { t: 'out', v: 'PRETTY_NAME="Ubuntu 22.04.3 LTS"' },
      { t: 'out', v: 'VERSION_ID="22.04"' },
    ],
    'cat /etc/passwd': () => [
      { t: 'out', v: 'root:x:0:0:root:/root:/bin/bash' },
      { t: 'out', v: 'daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin' },
      { t: 'out', v: 'www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin' },
      { t: 'out', v: 'devops:x:1001:1001:DevOps User:/home/devops:/bin/bash' },
      { t: 'out', v: 'nginx:x:1002:1002::/var/www:/usr/sbin/nologin' },
    ],
    'grep "ERROR" app.log': () => [
      { t: 'out', v: '2024-04-30 09:01:12 ERROR Failed to connect to cache: timeout' },
      { t: 'out', v: '2024-04-30 09:05:33 ERROR Disk usage at 89% on /dev/sda1' },
    ],
    'grep -c "ERROR" app.log': () => [{ t: 'out', v: '2' }],
    'grep -v "INFO" app.log': () => [
      { t: 'out', v: '2024-04-30 09:01:12 ERROR Failed to connect to cache: timeout' },
      { t: 'out', v: '2024-04-30 09:01:13 WARN  Retrying cache connection (1/3)' },
      { t: 'out', v: '2024-04-30 09:05:33 ERROR Disk usage at 89% on /dev/sda1' },
    ],
    'grep -i "error" app.log': () => [
      { t: 'out', v: '2024-04-30 09:01:12 ERROR Failed to connect to cache: timeout' },
      { t: 'out', v: '2024-04-30 09:05:33 ERROR Disk usage at 89% on /dev/sda1' },
    ],
    'ps aux': () => [
      { t: 'out', v: 'USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND' },
      { t: 'out', v: 'root         1  0.0  0.1 168456 10820 ?        Ss   Apr27   0:08 /sbin/init' },
      { t: 'out', v: 'root       823  0.0  0.2 103952 18200 ?        Ss   Apr27   0:00 /usr/sbin/sshd' },
      { t: 'out', v: 'www-data  1204  0.1  0.8 456120 68400 ?        S    09:00   0:12 nginx: worker process' },
      { t: 'out', v: 'devops    1890  0.0  0.0  14224  1024 pts/0    Ss   09:30   0:00 bash' },
      { t: 'out', v: 'root      2341  5.2  2.1 812400 172800 ?       Sl   09:05   3:21 node /opt/app/server.js' },
      { t: 'out', v: 'postgres  2890  0.0  1.4 312456 115200 ?       S    Apr27   2:14 postgres: devops app' },
    ],
    'ps aux | grep nginx': () => [
      { t: 'out', v: 'root      1203  0.0  0.1  55348  8404 ?        Ss   09:00   0:00 nginx: master process /usr/sbin/nginx' },
      { t: 'out', v: 'www-data  1204  0.1  0.8 456120 68400 ?        S    09:00   0:12 nginx: worker process' },
      { t: 'out', v: 'www-data  1205  0.1  0.8 456120 68400 ?        S    09:00   0:11 nginx: worker process' },
    ],
    'ps -ef --forest': () => [
      { t: 'out', v: 'UID        PID  PPID  C STIME TTY          TIME CMD' },
      { t: 'out', v: 'root         1     0  0 Apr27 ?        00:00:08 /sbin/init' },
      { t: 'out', v: 'root       823     1  0 Apr27 ?        00:00:00  \\_ /usr/sbin/sshd' },
      { t: 'out', v: 'root      1902   823  0 09:30 ?        00:00:00      \\_ sshd: devops' },
      { t: 'out', v: 'devops    1890  1902  0 09:30 pts/0    00:00:00          \\_ bash' },
      { t: 'out', v: 'root      1203     1  0 09:00 ?        00:00:00  \\_ nginx: master' },
      { t: 'out', v: 'www-data  1204  1203  0 09:00 ?        00:00:12      \\_ nginx: worker' },
    ],
    'top': () => [
      { t: 'info', v: 'top - 14:32:10 up 3 days, 2:14, 1 user, load avg: 0.12, 0.08, 0.05' },
      { t: 'out', v: 'Tasks: 128 total,   1 running, 127 sleeping,   0 stopped' },
      { t: 'out', v: '%Cpu(s):  5.2 us,  1.3 sy,  0.0 ni, 92.8 id,  0.5 wa,  0.0 hi' },
      { t: 'out', v: 'MiB Mem :   7862.4 total,   2134.8 free,   3892.1 used,   1835.5 buff/cache' },
      { t: 'out', v: '' },
      { t: 'out', v: '  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND' },
      { t: 'out', v: ' 2341 root      20   0  812400 172800  12400 S   5.2   2.1   3:21.44 node' },
      { t: 'out', v: ' 2890 postgres  20   0  312456 115200   8200 S   0.3   1.4   2:14.12 postgres' },
      { t: 'out', v: ' 1204 www-data  20   0  456120  68400   4800 S   0.1   0.9   0:12.33 nginx' },
      { t: 'info', v: '(press q to quit — this is a static snapshot)' },
    ],
    'kill 2341': () => [{ t: 'out', v: '' }, { t: 'info', v: 'SIGTERM sent to PID 2341 (node process). Use kill -9 2341 if it doesn\'t stop.' }],
    'kill -9 2341': () => [{ t: 'out', v: '' }, { t: 'success', v: 'PID 2341 forcefully terminated (SIGKILL). Process removed immediately.' }],
    'kill -9 999': () => [{ t: 'error', v: 'bash: kill: (999) - No such process' }],
    'killall nginx': () => [{ t: 'out', v: '' }, { t: 'success', v: 'Sent SIGTERM to all nginx processes.' }],
    'df -h': () => [
      { t: 'out', v: 'Filesystem      Size  Used Avail Use% Mounted on' },
      { t: 'out', v: '/dev/sda1        50G   43G  4.3G  91% /'  },
      { t: 'out', v: 'tmpfs           3.9G     0  3.9G   0% /dev/shm' },
      { t: 'out', v: '/dev/sdb        100G   22G   78G  22% /data' },
      { t: 'warn', v: 'WARNING: / filesystem at 91% — consider cleanup!' },
    ],
    'du -sh /var/log': () => [{ t: 'out', v: '2.1G\t/var/log' }],
    'du -sh /var/log/*': () => [
      { t: 'out', v: '124M\t/var/log/app' },
      { t: 'out', v: '1.8G\t/var/log/nginx' },
      { t: 'out', v: '48M\t/var/log/syslog' },
      { t: 'out', v: '12M\t/var/log/auth.log' },
    ],
    'free -h': () => [
      { t: 'out', v: '               total        used        free      shared  buff/cache   available' },
      { t: 'out', v: 'Mem:           7.7Gi       3.8Gi       2.1Gi       124Mi       1.8Gi       3.6Gi' },
      { t: 'out', v: 'Swap:          2.0Gi          0B       2.0Gi' },
    ],
    'chmod 644 config.conf': () => [{ t: 'success', v: 'Permissions set to rw-r--r-- on config.conf' }],
    'chmod 755 deploy.sh': () => [{ t: 'success', v: 'Permissions set to rwxr-xr-x on deploy.sh' }],
    'chmod 600 id_rsa': () => [{ t: 'success', v: 'Permissions set to rw------- on id_rsa (SSH key is now secure)' }],
    'chmod u+x deploy.sh': () => [{ t: 'success', v: 'Execute permission added for owner on deploy.sh' }],
    'chmod +x deploy.sh': () => [{ t: 'success', v: 'Execute permission added for all on deploy.sh' }],
    'chown devops:devops config.conf': () => [{ t: 'success', v: 'Owner changed to devops:devops on config.conf' }],
    'chown -R www-data:www-data /var/www': () => [{ t: 'success', v: 'Recursively changed ownership of /var/www to www-data:www-data' }],
    'useradd -m -s /bin/bash alice': () => [{ t: 'success', v: 'User alice created with home directory /home/alice' }],
    'passwd alice': () => [
      { t: 'info', v: 'New password: (hidden)' },
      { t: 'info', v: 'Retype new password: (hidden)' },
      { t: 'success', v: 'passwd: password updated successfully' },
    ],
    'usermod -ag sudo alice': () => [{ t: 'success', v: 'User alice added to sudo group' }],
    'usermod -ag docker alice': () => [{ t: 'success', v: 'User alice added to docker group' }],
    'usermod -ag sudo devops': () => [{ t: 'success', v: 'User devops added to sudo group' }],
    'groups devops': () => [{ t: 'out', v: 'devops : devops sudo docker' }],
    'sudo apt update': () => [
      { t: 'out', v: 'Hit:1 http://us-east-1.ec2.archive.ubuntu.com/ubuntu jammy InRelease' },
      { t: 'out', v: 'Hit:2 http://security.ubuntu.com/ubuntu jammy-security InRelease' },
      { t: 'out', v: 'Fetched 4.2 MB in 3s (1.4 MB/s)' },
      { t: 'success', v: 'Reading package lists... Done' },
      { t: 'out', v: 'Building dependency tree... Done' },
      { t: 'out', v: '24 packages can be upgraded. Run \'apt list --upgradable\' to see them.' },
    ],
    'sudo apt install nginx -y': () => [
      { t: 'out', v: 'Reading package lists... Done' },
      { t: 'out', v: 'Building dependency tree... Done' },
      { t: 'out', v: 'The following packages will be installed: nginx nginx-common nginx-core' },
      { t: 'out', v: 'Unpacking nginx (1.24.0-1ubuntu1) ...' },
      { t: 'out', v: 'Setting up nginx (1.24.0-1ubuntu1) ...' },
      { t: 'success', v: 'Created symlink /etc/systemd/system/multi-user.target.wants/nginx.service' },
    ],
    'systemctl status nginx': () => [
      { t: 'success', v: '● nginx.service - A high performance web server and a reverse proxy server' },
      { t: 'out', v: '     Loaded: loaded (/lib/systemd/system/nginx.service; enabled; preset: enabled)' },
      { t: 'success', v: '     Active: active (running) since Wed 2024-04-30 09:00:01 UTC; 5h 32min ago' },
      { t: 'out', v: '       Docs: man:nginx(8)' },
      { t: 'out', v: '    Process: 1200 ExecStartPre=/usr/sbin/nginx -t (code=exited, status=0/SUCCESS)' },
      { t: 'out', v: '   Main PID: 1203 (nginx)' },
      { t: 'out', v: '      Tasks: 3 (limit: 4654)' },
      { t: 'out', v: '     Memory: 8.2M' },
      { t: 'out', v: '        CPU: 120ms' },
    ],
    'systemctl status nginx --no-pager': () => [
      { t: 'success', v: '● nginx.service - Active: active (running)' },
      { t: 'out', v: '   Main PID: 1203 (nginx)  Tasks: 3  Memory: 8.2M' },
    ],
    'systemctl stop nginx': () => [{ t: 'out', v: '' }, { t: 'info', v: 'nginx.service stopped.' }],
    'systemctl start nginx': () => [{ t: 'success', v: 'nginx.service started.' }],
    'systemctl restart nginx': () => [{ t: 'success', v: 'nginx.service restarted.' }],
    'systemctl enable nginx': () => [
      { t: 'success', v: 'Created symlink /etc/systemd/system/multi-user.target.wants/nginx.service → /lib/systemd/system/nginx.service.' },
    ],
    'systemctl disable nginx': () => [{ t: 'out', v: 'Removed /etc/systemd/system/multi-user.target.wants/nginx.service.' }],
    'systemctl list-units --type=service': () => [
      { t: 'out', v: 'UNIT                    LOAD   ACTIVE SUB     DESCRIPTION' },
      { t: 'out', v: 'cron.service            loaded active running Regular background program processing daemon' },
      { t: 'out', v: 'docker.service          loaded active running Docker Application Container Engine' },
      { t: 'out', v: 'nginx.service           loaded active running A high performance web server' },
      { t: 'out', v: 'ssh.service             loaded active running OpenBSD Secure Shell server' },
      { t: 'out', v: 'ufw.service             loaded active exited  Uncomplicated firewall' },
    ],
    'journalctl -u nginx -n 20': () => [
      { t: 'out', v: 'Apr 30 09:00:01 devops-lab nginx[1200]: nginx: the configuration file /etc/nginx/nginx.conf syntax is ok' },
      { t: 'out', v: 'Apr 30 09:00:01 devops-lab nginx[1200]: nginx: configuration file /etc/nginx/nginx.conf test is successful' },
      { t: 'success', v: 'Apr 30 09:00:01 devops-lab systemd[1]: Started A high performance web server.' },
      { t: 'out', v: 'Apr 30 09:00:01 devops-lab nginx[1203]: 10.0.1.5 - - [30/Apr/2024:09:01:12] "GET / HTTP/1.1" 200 615' },
    ],
    'journalctl -p err -n 10': () => [
      { t: 'error', v: 'Apr 30 09:01:12 devops-lab app[2341]: Failed to connect to cache: timeout after 5000ms' },
      { t: 'error', v: 'Apr 30 09:05:33 devops-lab kernel: EXT4-fs warning: /dev/sda1 reaching 89% capacity' },
    ],
    'tail -f /var/log/nginx/access.log': () => [
      { t: 'out', v: '10.0.1.5 - - [30/Apr/2024:14:32:01 +0000] "GET / HTTP/1.1" 200 615' },
      { t: 'out', v: '10.0.1.8 - - [30/Apr/2024:14:32:03 +0000] "GET /api/users HTTP/1.1" 200 2048' },
      { t: 'out', v: '10.0.1.5 - - [30/Apr/2024:14:32:05 +0000] "POST /api/orders HTTP/1.1" 201 312' },
      { t: 'info', v: '(streaming... Ctrl+C to stop)' },
    ],
    'tail -50 app.log': () => [
      { t: 'out', v: '2024-04-30 09:01:12 ERROR Failed to connect to cache: timeout' },
      { t: 'out', v: '2024-04-30 09:01:13 WARN  Retrying cache connection (1/3)' },
      { t: 'out', v: '2024-04-30 09:01:14 INFO  Cache connection established' },
      { t: 'out', v: '2024-04-30 09:05:33 ERROR Disk usage at 89% on /dev/sda1' },
      { t: 'out', v: '2024-04-30 09:10:00 INFO  Health check passed' },
    ],
    'crontab -l': () => [
      { t: 'out', v: '# Crontab for devops user' },
      { t: 'out', v: '0 2 * * *     /opt/backup.sh >> /var/log/backup.log 2>&1' },
      { t: 'out', v: '*/5 * * * *   /opt/healthcheck.sh' },
      { t: 'out', v: '0 9 * * 1-5   /opt/weekly-report.sh' },
    ],
    'lsblk': () => [
      { t: 'out', v: 'NAME    MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS' },
      { t: 'out', v: 'sda       8:0    0   50G  0 disk' },
      { t: 'out', v: '├─sda1    8:1    0   49G  0 part /' },
      { t: 'out', v: '└─sda2    8:2    0    1G  0 part [SWAP]' },
      { t: 'out', v: 'sdb       8:16   0  100G  0 disk /data' },
    ],
    'env': () => [
      { t: 'out', v: 'HOME=/home/devops' },
      { t: 'out', v: 'USER=devops' },
      { t: 'out', v: 'PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin' },
      { t: 'out', v: 'SHELL=/bin/bash' },
      { t: 'out', v: 'AWS_REGION=us-east-1' },
      { t: 'out', v: 'APP_ENV=production' },
      { t: 'out', v: 'NODE_ENV=production' },
    ],
    'history': () => [
      { t: 'out', v: '  1  sudo apt update' },
      { t: 'out', v: '  2  sudo apt install nginx -y' },
      { t: 'out', v: '  3  systemctl status nginx' },
      { t: 'out', v: '  4  tail -f /var/log/nginx/access.log' },
      { t: 'out', v: '  5  ps aux | grep nginx' },
      { t: 'out', v: '  6  df -h' },
      { t: 'out', v: '  7  history' },
    ],
    'docker system prune -af': () => [
      { t: 'out', v: 'Deleted Images:' },
      { t: 'out', v: 'deleted: sha256:abc123...' },
      { t: 'out', v: 'deleted: sha256:def456...' },
      { t: 'success', v: 'Total reclaimed space: 3.42GB' },
    ],

    // ===== NETWORKING COMMANDS =====
    'ip addr': () => [
      { t: 'out', v: '1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN' },
      { t: 'out', v: '    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00' },
      { t: 'out', v: '    inet 127.0.0.1/8 scope host lo' },
      { t: 'out', v: '2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 9001 qdisc mq state UP' },
      { t: 'out', v: '    link/ether 02:42:ac:11:00:02 brd ff:ff:ff:ff:ff:ff' },
      { t: 'out', v: '    inet 10.0.1.50/24 brd 10.0.1.255 scope global dynamic eth0' },
      { t: 'out', v: '    inet6 fe80::42:acff:fe11:2/64 scope link' },
    ],
    'ip addr show eth0': () => [
      { t: 'out', v: '2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 9001 qdisc mq state UP group default qlen 1000' },
      { t: 'out', v: '    link/ether 02:42:ac:11:00:02 brd ff:ff:ff:ff:ff:ff' },
      { t: 'out', v: '    inet 10.0.1.50/24 brd 10.0.1.255 scope global dynamic eth0' },
      { t: 'out', v: '       valid_lft 3587sec preferred_lft 3587sec' },
    ],
    'ip route': () => [
      { t: 'out', v: 'default via 10.0.1.1 dev eth0 proto dhcp src 10.0.1.50 metric 100' },
      { t: 'out', v: '10.0.1.0/24 dev eth0 proto kernel scope link src 10.0.1.50' },
    ],
    'ip route show': () => [
      { t: 'out', v: 'default via 10.0.1.1 dev eth0 proto dhcp src 10.0.1.50 metric 100' },
      { t: 'out', v: '10.0.1.0/24 dev eth0 proto kernel scope link src 10.0.1.50' },
    ],
    'ping 8.8.8.8': () => [
      { t: 'out', v: 'PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.' },
      { t: 'out', v: '64 bytes from 8.8.8.8: icmp_seq=1 ttl=118 time=1.23 ms' },
      { t: 'out', v: '64 bytes from 8.8.8.8: icmp_seq=2 ttl=118 time=1.18 ms' },
      { t: 'out', v: '64 bytes from 8.8.8.8: icmp_seq=3 ttl=118 time=1.31 ms' },
      { t: 'out', v: '64 bytes from 8.8.8.8: icmp_seq=4 ttl=118 time=1.19 ms' },
      { t: 'out', v: '--- 8.8.8.8 ping statistics ---' },
      { t: 'success', v: '4 packets transmitted, 4 received, 0% packet loss, time 3004ms' },
      { t: 'out', v: 'rtt min/avg/max/mdev = 1.183/1.228/1.311/0.048 ms' },
    ],
    'ping -c 4 google.com': () => [
      { t: 'out', v: 'PING google.com (142.250.80.46) 56(84) bytes of data.' },
      { t: 'out', v: '64 bytes from 142.250.80.46: icmp_seq=1 ttl=118 time=2.14 ms' },
      { t: 'out', v: '64 bytes from 142.250.80.46: icmp_seq=2 ttl=118 time=2.08 ms' },
      { t: 'out', v: '--- google.com ping statistics ---' },
      { t: 'success', v: '4 packets transmitted, 4 received, 0% packet loss' },
    ],
    'ping -c 3 192.168.1.1': () => [
      { t: 'error', v: 'PING 192.168.1.1 (192.168.1.1) 56(84) bytes of data.' },
      { t: 'error', v: 'From 10.0.1.50 icmp_seq=1 Destination Host Unreachable' },
      { t: 'error', v: '--- 192.168.1.1 ping statistics ---' },
      { t: 'error', v: '3 packets transmitted, 0 received, 100% packet loss' },
    ],
    'traceroute google.com': () => [
      { t: 'out', v: 'traceroute to google.com (142.250.80.46), 30 hops max, 60 byte packets' },
      { t: 'out', v: ' 1  10.0.1.1 (10.0.1.1)  0.412 ms  0.388 ms  0.375 ms' },
      { t: 'out', v: ' 2  100.64.0.1 (100.64.0.1)  0.921 ms  0.912 ms  0.899 ms' },
      { t: 'out', v: ' 3  * * *' },
      { t: 'out', v: ' 4  52.95.48.130 (52.95.48.130)  1.234 ms  1.198 ms' },
      { t: 'out', v: ' 5  72.14.232.85 (72.14.232.85)  1.456 ms  1.423 ms' },
      { t: 'success', v: ' 6  142.250.80.46 (142.250.80.46)  2.134 ms  2.108 ms' },
    ],
    'ss -tulpn': () => [
      { t: 'out', v: 'Netid  State   Recv-Q Send-Q  Local Address:Port  Peer Address:Port  Process' },
      { t: 'out', v: 'tcp    LISTEN  0      128     0.0.0.0:22         0.0.0.0:*          users:("sshd",pid=823)' },
      { t: 'out', v: 'tcp    LISTEN  0      511     0.0.0.0:80         0.0.0.0:*          users:("nginx",pid=1203)' },
      { t: 'out', v: 'tcp    LISTEN  0      511     0.0.0.0:443        0.0.0.0:*          users:("nginx",pid=1203)' },
      { t: 'out', v: 'tcp    LISTEN  0      128     0.0.0.0:3000       0.0.0.0:*          users:("node",pid=2341)' },
      { t: 'out', v: 'tcp    LISTEN  0      128     127.0.0.1:5432     0.0.0.0:*          users:("postgres",pid=2890)' },
    ],
    'netstat -tulpn': () => [
      { t: 'out', v: 'Active Internet connections (only servers)' },
      { t: 'out', v: 'Proto Recv-Q Send-Q Local Address     Foreign Address   State    PID/Program' },
      { t: 'out', v: 'tcp        0      0 0.0.0.0:22        0.0.0.0:*         LISTEN   823/sshd' },
      { t: 'out', v: 'tcp        0      0 0.0.0.0:80        0.0.0.0:*         LISTEN   1203/nginx' },
      { t: 'out', v: 'tcp        0      0 0.0.0.0:443       0.0.0.0:*         LISTEN   1203/nginx' },
      { t: 'out', v: 'tcp        0      0 0.0.0.0:3000      0.0.0.0:*         LISTEN   2341/node' },
      { t: 'out', v: 'tcp        0      0 127.0.0.1:5432    0.0.0.0:*         LISTEN   2890/postgres' },
    ],
    'dig google.com': () => [
      { t: 'out', v: '; <<>> DiG 9.18.18-0ubuntu0.22.04.2-Ubuntu <<>> google.com' },
      { t: 'out', v: ';; Got answer:' },
      { t: 'out', v: ';; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 12345' },
      { t: 'out', v: ';; QUESTION SECTION:' },
      { t: 'out', v: ';google.com.   IN  A' },
      { t: 'out', v: ';; ANSWER SECTION:' },
      { t: 'success', v: 'google.com.  299  IN  A  142.250.80.46' },
      { t: 'out', v: ';; Query time: 2 msec' },
      { t: 'out', v: ';; SERVER: 10.0.1.1#53(10.0.1.1) (UDP)' },
    ],
    'dig google.com +short': () => [{ t: 'success', v: '142.250.80.46' }],
    'dig google.com MX': () => [
      { t: 'out', v: ';; ANSWER SECTION:' },
      { t: 'success', v: 'google.com.  600  IN  MX  10 smtp.google.com.' },
    ],
    'dig google.com NS': () => [
      { t: 'out', v: ';; ANSWER SECTION:' },
      { t: 'success', v: 'google.com.  21599  IN  NS  ns1.google.com.' },
      { t: 'success', v: 'google.com.  21599  IN  NS  ns2.google.com.' },
      { t: 'success', v: 'google.com.  21599  IN  NS  ns3.google.com.' },
      { t: 'success', v: 'google.com.  21599  IN  NS  ns4.google.com.' },
    ],
    'dig @8.8.8.8 google.com': () => [
      { t: 'out', v: ';; SERVER: 8.8.8.8#53(8.8.8.8) (UDP)' },
      { t: 'success', v: 'google.com.  299  IN  A  142.250.80.46' },
      { t: 'out', v: ';; Query time: 8 msec' },
    ],
    'nslookup google.com': () => [
      { t: 'out', v: 'Server:         10.0.1.1' },
      { t: 'out', v: 'Address:        10.0.1.1#53' },
      { t: 'out', v: '' },
      { t: 'success', v: 'Non-authoritative answer:' },
      { t: 'success', v: 'Name:    google.com' },
      { t: 'success', v: 'Address: 142.250.80.46' },
    ],
    'curl -I https://google.com': () => [
      { t: 'out', v: 'HTTP/2 301' },
      { t: 'out', v: 'location: https://www.google.com/' },
      { t: 'out', v: 'content-type: text/html; charset=UTF-8' },
      { t: 'out', v: 'server: gws' },
      { t: 'out', v: 'x-xss-protection: 0' },
      { t: 'out', v: 'x-frame-options: SAMEORIGIN' },
    ],
    'curl -I https://example.com': () => [
      { t: 'out', v: 'HTTP/2 200' },
      { t: 'out', v: 'content-type: text/html; charset=UTF-8' },
      { t: 'out', v: 'content-length: 1256' },
      { t: 'out', v: 'server: ECS (dcb/7F37)' },
      { t: 'out', v: 'cache-control: max-age=604800' },
      { t: 'success', v: 'Status: 200 OK' },
    ],
    'curl https://example.com': () => [
      { t: 'out', v: '<!doctype html><html><head><title>Example Domain</title></head>' },
      { t: 'out', v: '<body><h1>Example Domain</h1><p>This domain is for use in examples.</p>' },
      { t: 'success', v: '(200 OK — page content received)' },
    ],
    'curl -v https://example.com 2>&1 | head -20': () => [
      { t: 'out', v: '* Trying 93.184.216.34:443...' },
      { t: 'out', v: '* Connected to example.com (93.184.216.34) port 443' },
      { t: 'out', v: '* ALPN: curl offers h2,http/1.1' },
      { t: 'out', v: '* TLSv1.3 (OUT), TLS handshake, Client hello' },
      { t: 'out', v: '* TLSv1.3 (IN),  TLS handshake, Server hello' },
      { t: 'out', v: '* SSL certificate verify ok.' },
      { t: 'out', v: '> GET / HTTP/2' },
      { t: 'out', v: '> Host: example.com' },
      { t: 'out', v: '< HTTP/2 200' },
      { t: 'success', v: '< content-type: text/html; charset=UTF-8' },
    ],
    'iptables -l -n -v': () => [
      { t: 'out', v: 'Chain INPUT (policy DROP 0 packets, 0 bytes)' },
      { t: 'out', v: ' pkts bytes target  prot opt in  out  source    destination' },
      { t: 'out', v: '  124  8320 ACCEPT  tcp  --  *   *   0.0.0.0/0  0.0.0.0/0   tcp dpt:22' },
      { t: 'out', v: ' 8234 542K ACCEPT  tcp  --  *   *   0.0.0.0/0  0.0.0.0/0   tcp dpt:80' },
      { t: 'out', v: ' 6123 404K ACCEPT  tcp  --  *   *   0.0.0.0/0  0.0.0.0/0   tcp dpt:443' },
      { t: 'out', v: 'Chain OUTPUT (policy ACCEPT)' },
    ],
    'ufw status': () => [
      { t: 'out', v: 'Status: active' },
      { t: 'out', v: '' },
      { t: 'out', v: 'To                         Action      From' },
      { t: 'out', v: '--                         ------      ----' },
      { t: 'success', v: '22/tcp                     ALLOW       Anywhere' },
      { t: 'success', v: '80/tcp                     ALLOW       Anywhere' },
      { t: 'success', v: '443/tcp                    ALLOW       Anywhere' },
    ],
    'ufw allow 8080': () => [{ t: 'success', v: 'Rule added: allow 8080/tcp from anywhere' }],
    'ufw deny 23': () => [{ t: 'success', v: 'Rule added: deny 23/tcp (Telnet blocked)' }],

    // ===== CLEAR & HELP =====
    'clear': () => { this.clearOutput(); return []; },
    'help': () => [
      { t: 'info', v: '=== DevOps Academy Terminal ===' },
      { t: 'out', v: '' },
      { t: 'info', v: 'Available command categories:' },
      { t: 'success', v: '  Linux:     ls, ls -la, pwd, whoami, ps aux, top, df -h, free -h' },
      { t: 'success', v: '             chmod, chown, grep, tail -f, systemctl, journalctl' },
      { t: 'success', v: '             useradd, sudo apt update, sudo apt install nginx -y' },
      { t: 'success', v: '  Network:   ping, traceroute, ss -tulpn, ip addr, ip route' },
      { t: 'success', v: '             dig, nslookup, curl -I, curl -v, ufw status' },
      { t: 'success', v: '  Docker:    docker version, docker ps, docker images, docker run...' },
      { t: 'success', v: '  Kubectl:   kubectl get pods, kubectl apply, kubectl describe...' },
      { t: 'success', v: '  AWS:       aws eks, aws ecr, eksctl...' },
      { t: 'out', v: '' },
      { t: 'out', v: 'Use ↑↓ arrows for command history. Type any command above to try it.' },
    ],
  };

  clearOutput() {
    this.outputEl.innerHTML = '';
    this.output = [];
  }

  render() {
    this.container.innerHTML = `
      <div class="terminal">
        <div class="terminal-bar">
          <div class="terminal-dots">
            <div class="terminal-dot dot-red"></div>
            <div class="terminal-dot dot-yellow"></div>
            <div class="terminal-dot dot-green"></div>
          </div>
          <div class="terminal-title">devops-academy — bash</div>
        </div>
        <div class="terminal-body" id="${this.container.id}-body">
          <div class="terminal-output info">DevOps Academy Interactive Terminal — type 'help' to see available commands</div>
          <div id="${this.container.id}-output"></div>
          <div class="terminal-input-row">
            <span class="terminal-prompt">user@devops-lab:~$&nbsp;</span>
            <input type="text" class="terminal-input" id="${this.container.id}-input"
              placeholder="type a command..." autocomplete="off" spellcheck="false">
          </div>
        </div>
      </div>
    `;
    this.outputEl = document.getElementById(`${this.container.id}-output`);
    this.inputEl = document.getElementById(`${this.container.id}-input`);
    this.bodyEl = document.getElementById(`${this.container.id}-body`);
  }

  bindEvents() {
    this.inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = this.inputEl.value.trim();
        if (!cmd) return;
        this.history.unshift(cmd);
        this.historyIndex = -1;
        this.inputEl.value = '';
        this.executeCommand(cmd);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.historyIndex = Math.min(this.historyIndex + 1, this.history.length - 1);
        this.inputEl.value = this.history[this.historyIndex] || '';
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.historyIndex = Math.max(this.historyIndex - 1, -1);
        this.inputEl.value = this.historyIndex >= 0 ? this.history[this.historyIndex] : '';
      }
    });

    this.container.addEventListener('click', () => this.inputEl.focus());
  }

  executeCommand(cmd) {
    // Show the entered command
    const cmdLine = document.createElement('div');
    cmdLine.className = 'terminal-line';
    cmdLine.innerHTML = `<span class="terminal-prompt">user@devops-lab:~$&nbsp;</span><span class="terminal-cmd">${this.escapeHtml(cmd)}</span>`;
    this.outputEl.appendChild(cmdLine);

    // Find matching command
    const handler = this.commands[cmd.toLowerCase()] || this.commands[cmd];
    let lines;

    if (handler) {
      lines = handler();
    } else if (cmd.toLowerCase().startsWith('docker ') || cmd.toLowerCase().startsWith('kubectl ') ||
               cmd.toLowerCase().startsWith('helm ') || cmd.toLowerCase().startsWith('aws ') ||
               cmd.toLowerCase().startsWith('eksctl ')) {
      lines = this.fuzzyMatch(cmd);
    } else if (cmd === 'ls' || cmd === 'pwd' || cmd === 'whoami') {
      lines = this.basicShell(cmd);
    } else {
      lines = [{ t: 'error', v: `bash: ${cmd}: command not found. Try 'help' for available commands.` }];
    }

    if (lines && lines.length) {
      lines.forEach(line => {
        const el = document.createElement('div');
        el.className = `terminal-output ${line.t === 'success' ? 'success' : line.t === 'error' ? 'error' : line.t === 'warn' ? 'warn' : line.t === 'info' ? 'info' : ''}`;
        el.textContent = line.v;
        this.outputEl.appendChild(el);
      });
    }

    // Scroll to bottom
    this.bodyEl.scrollTop = this.bodyEl.scrollHeight;
  }

  fuzzyMatch(cmd) {
    const suggestions = Object.keys(this.commands).filter(k =>
      k.startsWith(cmd.split(' ')[0])
    ).slice(0, 3);

    return [
      { t: 'error', v: `Command not in demo database: ${cmd}` },
      { t: 'warn', v: 'Similar commands you can try:' },
      ...suggestions.map(s => ({ t: 'info', v: `  → ${s}` })),
    ];
  }

  basicShell(cmd) {
    const map = {
      'ls': [{ t: 'out', v: 'Dockerfile  docker-compose.yml  k8s/  src/  package.json  README.md' }],
      'pwd': [{ t: 'out', v: '/home/user/myapp' }],
      'whoami': [{ t: 'out', v: 'devops-user' }],
    };
    return map[cmd] || [];
  }

  escapeHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
}

// Auto-init all terminals on page
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-terminal]').forEach(el => {
    new DevOpsTerminal(el.id, el.dataset.terminal);
  });
});
