lendsqr-up:
	docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml up -d
lendsqr-down:
	docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml down
lendsqr-up-build:
	docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml up -d --build
lendsqr-logs:
	docker logs -f lendsqr-api
lendsqr-cli:
	docker exec -it lendsqr-api /bin/sh
lendsqr-prod-build:
	docker-compose -f docker-compose.yaml -f docker-compose.prod.yaml build
 