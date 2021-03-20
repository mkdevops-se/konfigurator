#!/bin/bash

if [ -z $ACCESS_TOKEN ]; then
  echo "Environment variable ACCESS_TOKEN missing, exiting."
  exit 1
else
  export AUTH_HEADER='Authorization: Bearer '$ACCESS_TOKEN
fi

bash scripts/setup-demo-environments.sh
bash scripts/setup-demo-deployments-katla-utv.sh
bash scripts/setup-demo-deployments-katla-drakryttarna-utv.sh
bash scripts/setup-demo-deployments-katla-slarvkatterna-utv.sh
bash scripts/setup-demo-deployments-katla-sys.sh
