RELEASE = latest

.PHONY: publish
publish:
	docker buildx build --platform linux/arm/v7,linux/amd64 -t tseho/netatmo-multi-relays:$(RELEASE) . --push
