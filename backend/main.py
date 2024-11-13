from typing import Annotated
from sentence_transformers import SentenceTransformer
from rake_nltk import Rake

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from analysis import get_boundaries, get_keywords
from dependencies import get_embedding_model, get_rake
from schemas import Region


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/analyze")
def analyze(
    sentences: list[str],
    embedding_model: Annotated[SentenceTransformer, Depends(get_embedding_model)],
    rake_model: Annotated[Rake, Depends(get_rake)],
) -> list[Region]:
    boundaries = get_boundaries(sentences, embedding_model)

    return get_keywords(sentences, rake_model, boundaries)
