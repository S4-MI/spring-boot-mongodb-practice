# Minikube deployment

Deploys `backend` + `frontend` into minikube behind a single ingress host
(`template.local`), so the browser talks to one origin and the backend's CORS /
WebSocket origin checks are satisfied without `localhost:3000`.

MongoDB is **external** — pods reach the host machine's Mongo via
`host.minikube.internal:27017` (see `10-backend-secret.yaml`).

## Files

| File | What |
|------|------|
| `00-namespace.yaml`     | `template` namespace |
| `10-backend-secret.yaml`| Mongo URI + JWT secret (override before prod) |
| `20-backend.yaml`       | Backend Deployment + Service (port 8080) |
| `30-frontend.yaml`      | Frontend Deployment + Service (port 3000) |
| `40-ingress.yaml`       | Ingress: `/api` → backend, `/` → frontend |
| `deploy.sh`             | Build → load → apply → rollout |

## One-time setup

```bash
# host entry so template.local resolves to the cluster
echo "$(minikube ip) template.local" | sudo tee -a /etc/hosts
```

## Deploy

```bash
./k8s/deploy.sh
```

The script enables the ingress addon, builds both Docker images, loads them into
**all** minikube nodes (cluster is multi-node, so `docker-env` alone is not
enough), applies the manifests, and restarts the deployments.

## Reach the apps

On the docker driver (macOS), the ingress IP is not directly routable, so run a
tunnel in a separate terminal and keep it open:

```bash
minikube tunnel   # needs sudo
```

Then open **http://template.local**. API calls go to `http://template.local/api/v1`,
WebSocket to `ws://template.local/api/v1/ws` — same origin.

## Notes / gotchas

- **`NEXT_PUBLIC_*` is baked at build time.** Changing the host means rebuilding
  the frontend image (the script passes them as `--build-arg`).
- **External Mongo must allow remote connections.** If Mongo is bound to
  `127.0.0.1` only, pods can't reach it. Bind it to `0.0.0.0` (or at least the
  minikube bridge) and ensure the `admin:secret` credentials + `Blue-App` db match.
- **`:latest` tag** — the script does a `rollout restart` so pods pick up the
  freshly loaded image even though the tag didn't change.
- **CORS/WS origins** are now env-driven via `APP_CORS_ALLOWED_ORIGINS`
  (defaults to `http://localhost:3000` for local dev).

## Teardown

```bash
kubectl delete namespace template
```
