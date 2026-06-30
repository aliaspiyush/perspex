FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies if any are needed for sentence-transformers
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install them
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download the sentence-transformers model so it doesn't need internet at runtime
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"

# Copy application files
COPY rank.py .
COPY public/sample_jd.txt ./sample_jd.txt
COPY public/sample_candidates.jsonl ./sample_candidates.jsonl

# Entrypoint for the ranking pipeline
ENTRYPOINT ["python", "rank.py"]
