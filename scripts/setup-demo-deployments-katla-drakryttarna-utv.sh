#!/bin/bash

## Drakryttarna-UTV ####
echo "Creating api-gateway in Drakryttarna-UTV"
curl -XPOST -H 'Content-Type: application/json' http://localhost:3000/environments/katla-drakryttarna-utv/deployments -d '{
  "name": "api-gateway",
  "ocp_namespace": "katla-drakryttarna-utv",
  "is_gateway": true,
  "memory_min": "200mb",
  "memory_max": "800mb",
  "cpu_min": "50m",
  "cpu_max": "200m",
  "replicas_target": 1,
  "replicas_current": null
}'
echo ""
echo "Creating frontend in Drakryttarna-UTV"
curl -XPOST -H 'Content-Type: application/json' http://localhost:3000/environments/katla-drakryttarna-utv/deployments -d '{
  "name": "frontend",
  "ocp_namespace": "katla-drakryttarna-utv",
  "replicas_target": 1
}'

## Drakryttarna-UTV ####
echo ""
echo "Creating backend-gateway in Drakryttarna-UTV"
curl -XPOST -H 'Content-Type: application/json' http://localhost:3000/environments/katla-drakryttarna-utv/deployments -d '{
  "name": "backend-gateway",
  "ocp_namespace": "katla-drakryttarna-utv",
  "is_gateway": true,
  "memory_min": "200mb",
  "memory_max": "800mb",
  "cpu_min": "50m",
  "cpu_max": "200m",
  "replicas_target": 1,
  "replicas_current": null
}'
echo ""
echo "Creating munkfabriken in Drakryttarna-UTV"
curl -XPOST -H 'Content-Type: application/json' http://localhost:3000/environments/katla-drakryttarna-utv/deployments -d '{
  "name": "munkfabriken",
  "ocp_namespace": "katla-drakryttarna-utv",
  "is_gateway": false,
  "replicas_target": 1
}'
echo ""
echo "Creating surgrisen in Drakryttarna-UTV"
curl -XPOST -H 'Content-Type: application/json' http://localhost:3000/environments/katla-drakryttarna-utv/deployments -d '{
  "name": "surgrisen",
  "ocp_namespace": "katla-drakryttarna-utv",
  "is_gateway": false
}'
echo ""
echo "Creating kalorikossan in Drakryttarna-UTV"
curl -XPOST -H 'Content-Type: application/json' http://localhost:3000/environments/katla-drakryttarna-utv/deployments -d '{
  "name": "kalorikossan",
  "ocp_namespace": "katla-drakryttarna-utv"
}'

## Drakryttarna-UTV ####
echo ""
echo "Creating restricted-gateway in Drakryttarna-UTV"
curl -XPOST -H 'Content-Type: application/json' http://localhost:3000/environments/katla-drakryttarna-utv/deployments -d '{
  "name": "restricted-gateway",
  "ocp_namespace": "katla-drakryttarna-utv",
  "is_gateway": true,
  "memory_min": "200mb",
  "memory_max": "800mb",
  "cpu_min": "50m",
  "cpu_max": "200m"
}'

echo ""
echo "Creating rattighetsadministration in Drakryttarna-UTV"
curl -XPOST -H 'Content-Type: application/json' http://localhost:3000/environments/katla-drakryttarna-utv/deployments -d '{
  "name": "rattighetsadministration",
  "ocp_namespace": "katla-drakryttarna-utv",
  "is_gateway": false
}'

## DONE ####
echo ""
echo "----"
