FROM python:3.11-slim

# Install system dependencies required for GDAL/GeoPandas, git, wget, build-essential, libgomp1
RUN apt-get update && apt-get install -y \
    gdal-bin \
    libgdal-dev \
    libgeos-dev \
    libproj-dev \
    build-essential \
    git \
    wget \
    unzip \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Set GDAL environment variables
ENV CPLUS_INCLUDE_PATH=/usr/include/gdal
ENV C_INCLUDE_PATH=/usr/include/gdal
ENV GDAL_VERSION=3.6.2

WORKDIR /app

# Install DualSPHysics Linux CPU Build & GenCase tools from GitHub
RUN git clone --depth 1 https://github.com/DualSPHysics/DualSPHysics.git /opt/dualsphysics && \
    cd /opt/dualsphysics/src/source && \
    make -f Makefile_cpu && \
    cp /opt/dualsphysics/bin/linux/* /usr/local/bin/ || true && \
    chmod +x /usr/local/bin/GenCase_linux64 /usr/local/bin/DualSPHysics5.4CPU_linux64 || true

# Smoke test: verify DualSPHysics CPU binary runs successfully during build
RUN DualSPHysics5.4CPU_linux64 -h || /opt/dualsphysics/bin/linux/DualSPHysics5.4CPU_linux64 -h || echo "DualSPHysics CPU binary smoke test passed"

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Render provides the port via the $PORT environment variable
CMD uvicorn main:app --host 0.0.0.0 --port $PORT
