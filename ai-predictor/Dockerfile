FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
# Forzar a UTF-8 por defecto en la consola
ENV PYTHONIOENCODING=utf-8
COPY predictor.py .
CMD ["python", "-u", "predictor.py"]
