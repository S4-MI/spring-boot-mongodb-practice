

docker build \
    --build-arg NEXT_PUBLIC_API_URL="http://localhost:8080/api/v1" \
    --build-arg NEXT_PUBLIC_WS_URL="ws://localhost:8080/api/v1/ws" \
    -t template-frontend:test . 

docker run --rm -p 3000:3000 template-frontend:test



docker build -t template-backend:test .

docker run --rm -p 8080:8080 \
    -e SPRING_MONGODB_URI="mongodb://admin:secret@host.docker.internal:27017/Blue-App?authSource=admin" \
    template-backend:test