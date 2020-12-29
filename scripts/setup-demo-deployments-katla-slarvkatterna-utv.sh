#!/bin/bash

## Slarvkatterna-UTV ####
echo "Creating api-gateway in Slarvkatterna-UTV"
curl -XPOST -H 'Content-Type: application/json' http://localhost:3000/environments/katla-slarvkatterna-utv/deployments -d '{
  "name": "api-gateway",
  "ocp_namespace": "katla-slarvkatterna-utv",
  "memory_min": "200mb",
  "memory_max": "800mb",
  "cpu_min": "50m",
  "cpu_max": "200m",
  "replicas_target": 1,
  "replicas_current": null
}'
echo ""
echo "Creating frontend in Slarvkatterna-UTV"
curl -XPOST -H 'Content-Type: application/json' http://localhost:3000/environments/katla-slarvkatterna-utv/deployments -d '{
  "name": "frontend",
  "ocp_namespace": "katla-slarvkatterna-utv",
  "replicas_target": 1
}'

## Slarvkatterna-UTV ####
echo ""
echo "Creating backend-gateway in Slarvkatterna-UTV"
curl -XPOST -H 'Content-Type: application/json' http://localhost:3000/environments/katla-slarvkatterna-utv/deployments -d '{
  "name": "backend-gateway",
  "ocp_namespace": "katla-slarvkatterna-utv",
  "memory_min": "200mb",
  "memory_max": "800mb",
  "cpu_min": "50m",
  "cpu_max": "200m",
  "replicas_target": 1,
  "replicas_current": null
}'
echo ""
echo "Creating munkfabriken in Slarvkatterna-UTV"
curl -XPOST -H 'Content-Type: application/json' http://localhost:3000/environments/katla-slarvkatterna-utv/deployments -d '{
  "name": "munkfabriken",
  "ocp_namespace": "katla-slarvkatterna-utv",
  "replicas_target": 1
}'
echo ""
echo "Creating surgrisen in Slarvkatterna-UTV"
curl -XPOST -H 'Content-Type: application/json' http://localhost:3000/environments/katla-slarvkatterna-utv/deployments -d '{
  "name": "surgrisen",
  "ocp_namespace": "katla-slarvkatterna-utv"
}'
echo ""
echo "Creating kalorikossan in Slarvkatterna-UTV"
curl -XPOST -H 'Content-Type: application/json' http://localhost:3000/environments/katla-slarvkatterna-utv/deployments -d '{
  "name": "kalorikossan",
  "ocp_namespace": "katla-slarvkatterna-utv"
}'

## Slarvkatterna-UTV ####
echo ""
echo "Creating restricted-gateway in Slarvkatterna-UTV"
curl -XPOST -H 'Content-Type: application/json' http://localhost:3000/environments/katla-slarvkatterna-utv/deployments -d '{
  "name": "restricted-gateway",
  "ocp_namespace": "katla-slarvkatterna-utv",
  "memory_min": "200mb",
  "memory_max": "800mb",
  "cpu_min": "50m",
  "cpu_max": "200m"
}'

echo ""
echo "Creating rattighetsadministration in Slarvkatterna-UTV"
curl -XPOST -H 'Content-Type: application/json' http://localhost:3000/environments/katla-slarvkatterna-utv/deployments -d '{
  "name": "rattighetsadministration",
  "ocp_namespace": "katla-slarvkatterna-utv"
}'

## DONE ####
echo ""
echo "----"
