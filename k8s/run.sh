#!/bin/bash

kubectl delete -f out.yaml
kubectl kustomize > out.yaml
kubectl apply -f out.yaml