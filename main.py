from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import re

# Загрузка модели и векторизатора
model = joblib.load('toxic_classifier.joblib')
vectorizer = joblib.load('vectorizer.joblib')

app = FastAPI(title="Toxic Comment Classifier API")


class Comment(BaseModel):
    text: str


def clean_text(text):
    text = re.sub(r'[^а-яёА-ЯЁ\s]', '', text)
    text = text.lower()
    text = re.sub(r'\s+', ' ', text).strip()
    return text


@app.post("/predict")
def predict(comment: Comment):
    try:
        cleaned = clean_text(comment.text)
        vec = vectorizer.transform([cleaned])

        proba = model.predict_proba(vec)[0]  # Вероятности по классам
        prediction = model.predict(vec)[0]

        label_map = {0: "NORMAL", 1: "TOXIC"}
        predicted_label = label_map[int(prediction)]
        confidence = round(proba[int(prediction)], 4)  # Уверенность в выбранной метке

        return {
            "text": comment.text,
            "prediction": predicted_label,
            "confidence": confidence
        }
    except Exception as e:
        return {"error": str(e)}
