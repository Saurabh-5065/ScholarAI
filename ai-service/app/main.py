from fastapi import FastAPI

app = FastAPI(
    title="ScholarAI Internal AI Service",
    version="1.0.0"
)

@app.get("/")
async def root():
    return {"message": "ScholarAI AI Service is running"}