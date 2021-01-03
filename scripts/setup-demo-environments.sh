#!/bin/bash

echo "Creating katla-utv environment ..."
curl -XPOST -H 'Content-Type: application/json' http://localhost:3000/environments -d '{
  "name": "katla-utv",
  "rank": 1000,
  "ocp_tenant_domain": "test.ocp.github.org",
  "ocp_namespace_front": "katla-front-utv",
  "ocp_namespace_backend": "katla-backend-utv",
  "ocp_namespace_restricted": "katla-restricted-utv",
  "mq_url": null,
  "mq_namespace": null,
  "db_url": null,
  "default_spring_profiles": "test",
  "login_url": "https://honeypots-for-free.dot.com",
  "gateway_url": "https://post-credentials-here.i-am-a-gateway.co.uk",
  "comment": "Mats was here"
}'

echo ""
echo "Creating katla-slarvkatterna-utv environment ..."
curl -XPOST -H 'Content-Type: application/json' http://localhost:3000/environments -d '{
  "name": "katla-slarvkatterna-utv",
  "rank": 903,
  "ocp_tenant_domain": "test.ocp.github.org",
  "ocp_namespace_front": "katla-slarvkatterna-utv",
  "ocp_namespace_backend": "katla-slarvkatterna-utv",
  "ocp_namespace_restricted": "katla-slarvkatterna-utv",
  "mq_url": null,
  "mq_namespace": null,
  "db_url": null,
  "default_spring_profiles": "test",
  "login_url": "https://frontend-kattla-slarvkatterna-utv.test.ocp.github.org"
}'

echo ""
echo "Creating katla-drakryttarna-utv environment ..."
curl -XPOST -H 'Content-Type: application/json' http://localhost:3000/environments -d '{
  "name": "katla-drakryttarna-utv",
  "rank": 903,
  "ocp_tenant_domain": "test.ocp.github.org",
  "ocp_namespace_front": "katla-drakryttarna-utv",
  "ocp_namespace_backend": "katla-drakryttarna-utv",
  "ocp_namespace_restricted": "katla-drakryttarna-utv",
  "mq_url": null,
  "mq_namespace": null,
  "db_url": null,
  "default_spring_profiles": "test",
  "login_url": "https://frontend-kattla-drakryttarna-utv.test.ocp.github.org",
  "gateway_url": "https://api-gw-kattla-drakryttarna-utv.test.ocp.github.org"
}'

echo ""
echo "Creating katla-sys environment ..."
curl -XPOST -H 'Content-Type: application/json' http://localhost:3000/environments -d '{
  "name": "katla-sys",
  "rank": 800,
  "ocp_tenant_domain": "test.ocp.github.org",
  "ocp_namespace_front": "katla-front-sys",
  "ocp_namespace_backend": "katla-backend-sys",
  "ocp_namespace_restricted": "katla-restricted-sys",
  "mq_url": null,
  "mq_namespace": null,
  "db_url": null,
  "default_spring_profiles": "test",
  "login_url": "https://work-it.system-integration-tests.dot.com/login/unauthenticated",
  "gateway_url": "https://here-i-come.openapi.com",
  "comment": "Nothing gets past here."
}'

## DONE ####
echo ""
echo "----"
