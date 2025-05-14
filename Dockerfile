# ===== FRONTEND BUILD STAGE =====
FROM node:18-alpine as frontend-builder

WORKDIR /app/frontend

COPY services/frontend/package*.json ./
RUN npm install

COPY services/frontend/ ./
RUN npm run build --prod

# ===== BACKEND STAGE =====
FROM python:3.10-slim

WORKDIR /app

# Установка системных зависимостей
RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*

# Установка Python зависимостей
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем backend и модель
COPY main.py .
COPY toxic_classifier.joblib .
COPY vectorizer.joblib .

# Копируем собранный frontend из предыдущего stage
COPY --from=frontend-builder /app/frontend/dist /app/frontend

# Открываем порт FastAPI
EXPOSE 5000

# Запуск через Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000"]
