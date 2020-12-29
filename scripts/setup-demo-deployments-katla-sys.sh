#!/bin/bash

## SYS-Front ####
echo "Creating api-gateway in SYS-Front"
curl -XPOST -H 'Content-Type: application/json' http://localhost:3000/environments/katla-sys/deployments -d '{
  "name": "api-gateway",
  "ocp_namespace": "katla-front-sys",
  "memory_min": "200mb",
  "memory_max": "800mb",
  "cpu_min": "50m",
  "cpu_max": "200m",
  "replicas_target": 2,
  "replicas_current": null
}'
echo ""
echo "Creating frontend in SYS-Front"
curl -XPOST -H 'Content-Type: application/json' http://localhost:3000/environments/katla-sys/deployments -d '{
  "name": "frontend",
  "ocp_namespace": "katla-front-sys",
  "replicas_target": 2
}'

## SYS-Backend ####
echo ""
echo "Creating backend-gateway in SYS-Backend"
curl -XPOST -H 'Content-Type: application/json' http://localhost:3000/environments/katla-sys/deployments -d '{
  "name": "backend-gateway",
  "ocp_namespace": "katla-backend-sys",
  "memory_min": "200mb",
  "memory_max": "800mb",
  "cpu_min": "50m",
  "cpu_max": "200m",
  "replicas_target": 2,
  "replicas_current": null
}'
echo ""
echo "Creating surgrisen in SYS-Backend"
curl -XPOST -H 'Content-Type: application/json' http://localhost:3000/environments/katla-sys/deployments -d '{
  "name": "surgrisen",
  "ocp_namespace": "katla-backend-sys"
}'
echo ""
echo "Creating kalorikossan in SYS-Backend"
curl -XPOST -H 'Content-Type: application/json' http://localhost:3000/environments/katla-sys/deployments -d '{
  "name": "kalorikossan",
  "ocp_namespace": "katla-backend-sys"
}'

## SYS-Restricted ####
echo ""
echo "Creating restricted-gateway in SYS-Restricted"
curl -XPOST -H 'Content-Type: application/json' http://localhost:3000/environments/katla-sys/deployments -d '{
  "name": "restricted-gateway",
  "ocp_namespace": "katla-restricted-sys",
  "memory_min": "200mb",
  "memory_max": "800mb",
  "cpu_min": "50m",
  "cpu_max": "200m"
}'

echo ""
echo "Creating rattighetsadministration in SYS-Restricted"
curl -XPOST -H 'Content-Type: application/json' http://localhost:3000/environments/katla-sys/deployments -d '{
  "name": "rattighetsadministration",
  "ocp_namespace": "katla-restricted-sys"
}'

## DONE ####
echo ""
echo "----"
