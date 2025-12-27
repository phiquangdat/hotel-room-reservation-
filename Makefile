# Load environment variables from the .env file
include .env
# Dynamically set LOCAL_DB_HOST based on environment
LOCAL_DB_HOST := $(shell if [ "$$(docker compose ps -q db 2>/dev/null)" != "" ]; then echo "db"; else echo "localhost"; fi)

# Get the current directory to mount for backups
CURRENT_DIR := $(CURDIR)
BACKUP_FILE := db_snapshot.dump

# Define phony targets to prevent conflicts with file names
.PHONY: help db/snapshot db/restore db/recreate

# Default help command
help:
	@echo "Available commands:"
	@echo "  make db/snapshot    - Dumps a backup of the remote (Render) database to $(BACKUP_FILE)"
	@echo "  make db/restore     - Restores $(BACKUP_FILE) to the local database without dropping it first"
	@echo "  make db/recreate    - Drops, creates, and then restores the local database from $(BACKUP_FILE)"
	@echo "  make db/reset       - Wipes, creates, and seeds the local database (Use this for a fresh start)"

# --- Database Commands ---

# Dumps a backup of the remote database to a local file
db/snapshot:
	@echo "--> Creating snapshot of remote database..."
	@docker run --rm \
		--network=host \
		-e PGPASSWORD=$(REMOTE_DB_PASSWORD) \
		-v "$(CURRENT_DIR)":/backups \
		postgres:17 \
		pg_dump -h $(REMOTE_DB_HOST) -p $(REMOTE_DB_PORT) -U $(REMOTE_DB_USER) -F c -b -v -f /backups/$(BACKUP_FILE) $(REMOTE_DB_NAME)
	@echo "--> Snapshot saved to $(BACKUP_FILE)"

# Restores a backup to the local database
db/restore:
	@echo "--> Restoring snapshot to local database..."
	@docker run --rm \
		--network=host \
		-e PGPASSWORD=$(LOCAL_DB_PASSWORD) \
		-v "$(CURRENT_DIR)":/backups \
		postgres:17 \
		pg_restore --no-owner --no-privileges -h localhost -p $(LOCAL_DB_PORT) -U $(LOCAL_DB_USER) -d $(LOCAL_DB_NAME) -v /backups/$(BACKUP_FILE) || true
	@echo "--> Restore complete."

# Drops, creates, and restores the local database from a snapshot
db/recreate: db/snapshot
	@echo "--> Recreating local database..."
	# Terminate any active connections to the local database
	@docker run --rm --network=host -e PGPASSWORD=$(LOCAL_DB_PASSWORD) postgres:17 \
		psql -h $(LOCAL_DB_HOST) -p $(LOCAL_DB_PORT) -U $(LOCAL_DB_USER) -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='$(LOCAL_DB_NAME)';" || true
	# Drop the local database if it exists
	@docker run --rm --network=host -e PGPASSWORD=$(LOCAL_DB_PASSWORD) postgres:17 \
		psql -h $(LOCAL_DB_HOST) -p $(LOCAL_DB_PORT) -U $(LOCAL_DB_USER) -d postgres -c "DROP DATABASE IF EXISTS $(LOCAL_DB_NAME);" || true
	# Create a fresh local database
	@docker run --rm --network=host -e PGPASSWORD=$(LOCAL_DB_PASSWORD) postgres:17 \
		psql -h $(LOCAL_DB_HOST) -p $(LOCAL_DB_PORT) -U $(LOCAL_DB_USER) -d postgres -c "CREATE DATABASE $(LOCAL_DB_NAME);" || true
	# Restore the snapshot
	$(MAKE) db/restore

# Seeds the local database with mock_data.sql
db/seed:
	@echo "--> Seeding local database..."
	@docker compose cp mock_data.sql db:/tmp/mock_data.sql
	@docker compose exec -T -e PGPASSWORD=$(LOCAL_DB_PASSWORD) db psql -U $(LOCAL_DB_USER) -d $(LOCAL_DB_NAME) -f /tmp/mock_data.sql
	@echo "--> Seeding complete."

# Drops, creates, and seeds the local database (Purely local, no remote connection)
db/reset:
	@echo "--> Recreating local database with mock data..."
	# Terminate any active connections to the local database
	@docker compose exec -T -e PGPASSWORD=$(LOCAL_DB_PASSWORD) db psql -U $(LOCAL_DB_USER) -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='$(LOCAL_DB_NAME)';" || true
	# Drop the local database if it exists
	@docker compose exec -T -e PGPASSWORD=$(LOCAL_DB_PASSWORD) db psql -U $(LOCAL_DB_USER) -d postgres -c "DROP DATABASE IF EXISTS $(LOCAL_DB_NAME);" || true
	# Create a fresh local database
	@docker compose exec -T -e PGPASSWORD=$(LOCAL_DB_PASSWORD) db psql -U $(LOCAL_DB_USER) -d postgres -c "CREATE DATABASE $(LOCAL_DB_NAME);" || true
	# Seed the database
	$(MAKE) db/seed

clean:
	@rm -rf db_snapshot.dump db-data