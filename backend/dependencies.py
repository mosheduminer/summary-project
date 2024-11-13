from functools import lru_cache
from sentence_transformers import SentenceTransformer
from rake_nltk import Rake


@lru_cache
def get_embedding_model():
    return SentenceTransformer("all-MiniLM-L6-v2")


def get_rake():
    # Shouldn't cache the output because `Rake` is stateful
    return Rake(max_length=3)
