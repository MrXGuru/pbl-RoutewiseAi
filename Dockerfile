# Use official Python lightweight image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install dependencies required for psycopg2 or other packages if needed
RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY new_requirement.txt .

# Install Python requirements
RUN pip install --no-cache-dir -r new_requirement.txt

# Copy the rest of the application
COPY . .

# Expose port (default FastAPI/uvicorn port is 8000)
EXPOSE 8000

# Command to run the application, listening on 0.0.0.0
# If deploying to a platform that passes $PORT, we can use that, otherwise default to 8000.
CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
