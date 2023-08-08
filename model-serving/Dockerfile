# Use a Python base image
FROM python:3.8
    

WORKDIR /app

# Install Python dependencies
COPY requirements.txt ./
RUN pip install -r requirements.txt

# Copy Flask app files
COPY . .

# Expose Flask app port
EXPOSE 5001

# Start the Flask app
CMD ["python", "app.py"]
