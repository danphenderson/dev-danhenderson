# pull official base image
FROM python:3.10.9-slim-buster

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PIP_NO_CACHE_DIR off
ENV PIP_DISABLE_PIP_VERSION_CHECK on
ENV PIP_DEFAULT_TIMEOUT 100

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
        netcat gcc \
        git \
    && apt-get clean 

# install python dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install -r requirements.txt

# add app
COPY . /app/

# Run server with uvicorn for hot-reloading during local development
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8004", "--reload"]