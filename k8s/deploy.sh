#!/usr/bin/env bash
# Deploy backend + frontend to minikube.
# Re-runnable: rebuilds images, reloads them, re-applies manifests.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HOST="template.local"
API_URL="http://${HOST}/api/v1"
WS_URL="ws://${HOST}/api/v1/ws"

echo "==> Enabling ingress addon (idempotent)"
minikube addons enable ingress

echo "==> Patching ingress-nginx-controller to LoadBalancer (required for minikube tunnel)"
kubectl -n ingress-nginx patch svc ingress-nginx-controller \
  -p '{"spec":{"type":"LoadBalancer"}}'

echo "==> Building backend image (template-backend:latest)"
docker build -t template-backend:latest "${ROOT}/backend"

echo "==> Building frontend image (template-frontend:latest)"
docker build \
  --build-arg NEXT_PUBLIC_API_URL="${API_URL}" \
  --build-arg NEXT_PUBLIC_WS_URL="${WS_URL}" \
  -t template-frontend:latest "${ROOT}/frontend"

# Multi-node cluster: load images onto every node (docker-env only covers one).
echo "==> Loading images into minikube nodes"
minikube image load template-backend:latest
minikube image load template-frontend:latest

echo "==> Applying manifests"
kubectl apply -f "${ROOT}/k8s/00-namespace.yaml"
kubectl apply -f "${ROOT}/k8s/10-backend-secret.yaml"
kubectl apply -f "${ROOT}/k8s/20-backend.yaml"
kubectl apply -f "${ROOT}/k8s/30-frontend.yaml"
kubectl apply -f "${ROOT}/k8s/40-ingress.yaml"

# Force pods to pick up freshly loaded images (same :latest tag).
echo "==> Restarting deployments to pull new images"
kubectl -n template rollout restart deploy/backend deploy/frontend
kubectl -n template rollout status deploy/backend --timeout=180s
kubectl -n template rollout status deploy/frontend --timeout=180s

echo
echo "Done. Next:"
echo "  1) Add hosts entry (once):   echo \"\$(minikube ip) ${HOST}\" | sudo tee -a /etc/hosts"
echo "  2) Open a tunnel (keep running, needs sudo):   minikube tunnel"
echo "  3) Browse:   http://${HOST}"
