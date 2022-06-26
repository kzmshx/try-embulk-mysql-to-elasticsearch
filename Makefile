ifneq (,$(wildcard ./.env))
	include .env
	export
endif

.env:
	cp .env.defaults $@

.PHONY: build
build:
	docker compose -f docker-compose.yml build

.PHONY: up
up:
	docker compose -f docker-compose.yml up -d

.PHONY: down
down:
	docker compose -f docker-compose.yml down --remove-orphans

.PHONY: clean
clean: down up

.PHONY: login_mysql
login_mysql:
	docker exec -it mysql bash

.PHONY: setup_mysql
setup_mysql:
	docker exec -it mysql bash -c 'mysql --user=${MYSQL_USER} --password=${MYSQL_PASSWORD} ${MYSQL_DATABASE} </root/sql/setup.sql'

.PHONY: login_es
login_es:
	docker exec -it elasticsearch sh

.PHONY: login_kibana
login_kibana:
	docker exec -it kibana sh

.PHONY: login_embulk
login_embulk:
	docker exec -it embulk sh