#!/bin/bash

## UTV-Front ####
echo "Creating api-gateway in UTV-Front"
curl -XPOST -H 'Content-Type: application/json' http://localhost:3000/environments/katla-utv/deployments -d '{
  "name": "api-gateway",
  "ocp_namespace": "katla-front-utv",
  "memory_min": "200mb",
  "memory_max": "800mb",
  "cpu_min": "50m",
  "cpu_max": "200m",
  "replicas_target": 2,
  "replicas_current": null
}'
echo ""
echo "Creating frontend in UTV-Front"
curl -XPOST -H 'Content-Type: application/json' http://localhost:3000/environments/katla-utv/deployments -d '{
  "name": "frontend",
  "ocp_namespace": "katla-front-utv",
  "replicas_target": 2
}'

## UTV-Backend ####
echo ""
echo "Creating backend-gateway in UTV-Backend"
curl -XPOST -H 'Content-Type: application/json' http://localhost:3000/environments/katla-utv/deployments -d '{
  "name": "backend-gateway",
  "ocp_namespace": "katla-backend-utv",
  "memory_min": "200mb",
  "memory_max": "800mb",
  "cpu_min": "50m",
  "cpu_max": "200m",
  "replicas_target": 2,
  "replicas_current": null
}'
echo ""
echo "Creating munkfabriken in UTV-Backend"
curl -XPOST -H 'Content-Type: application/json' http://localhost:3000/environments/katla-utv/deployments -d '{
  "name": "munkfabriken",
  "ocp_namespace": "katla-backend-utv",
  "replicas_target": 2
}'
echo ""
echo "Creating surgrisen in UTV-Backend"
curl -XPOST -H 'Content-Type: application/json' http://localhost:3000/environments/katla-utv/deployments -d '{
  "name": "surgrisen",
  "ocp_namespace": "katla-backend-utv"
}'
echo ""
echo "Creating kalorikossan in UTV-Backend"
curl -XPOST -H 'Content-Type: application/json' http://localhost:3000/environments/katla-utv/deployments -d '{
  "name": "kalorikossan",
  "ocp_namespace": "katla-backend-utv"
}'

## UTV-Restricted ####
echo ""
echo "Creating restricted-gateway in UTV-Restricted"
curl -XPOST -H 'Content-Type: application/json' http://localhost:3000/environments/katla-utv/deployments -d '{
  "name": "restricted-gateway",
  "ocp_namespace": "katla-restricted-utv",
  "memory_min": "200mb",
  "memory_max": "800mb",
  "cpu_min": "50m",
  "cpu_max": "200m"
}'

echo ""
echo "Creating rattighetsadministration in UTV-Restricted"
curl -XPOST -H 'Content-Type: application/json' http://localhost:3000/environments/katla-utv/deployments -d '{
  "name": "rattighetsadministration",
  "ocp_namespace": "katla-restricted-utv"
}'

## DONE ####
echo ""
echo "----"
