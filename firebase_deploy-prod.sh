#!/usr/bin/env bash

npm run build;

firebase use tokenlandia-admin;

firebase target:apply hosting tokenlandia-admin videolatino-admin;

firebase deploy --only hosting:videolatino-admin
