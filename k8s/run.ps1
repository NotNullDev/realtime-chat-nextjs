# kubectl kustomize | tee-object  out.yaml
# kubectl kustomize | tee-object -append out.yaml
kubectl delete -f out.yaml
kubectl kustomize | out-file out.yaml
kubectl apply -f out.yaml