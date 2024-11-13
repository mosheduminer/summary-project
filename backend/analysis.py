from sentence_transformers import SentenceTransformer
from schemas import Region
import ruptures as rpt
from rake_nltk import Rake
from sklearn.decomposition import PCA


def get_boundaries(sentences: list[str], embedding_model: SentenceTransformer):
    embeddings = embedding_model.encode(sentences)

    # results: list[int] = rpt.Pelt(min_size=1, jump=1).fit_predict(embeddings, 0.98)

    embeddings = PCA(16).fit_transform(embeddings)
    results: list[int] = rpt.Pelt(min_size=1, jump=1).fit_predict(embeddings, 0.7)

    boundaries: list[tuple[int, int]] = []

    last = 0
    for item in results:
        boundaries.append((last, item))
        last = item
    return boundaries


def get_keywords(
    sentences: list[str], rake_model: Rake, boundaries: list[tuple[int, int]]
):
    regions: list[Region] = []

    for start_boundary, end_boundary in boundaries:
        rake_model.extract_keywords_from_sentences(
            sentences[start_boundary:end_boundary]
        )
        keywords = rake_model.get_ranked_phrases()
        regions.append(
            Region(
                start=start_boundary,
                end=end_boundary - 1,
                keywords=keywords[:2],
            )
        )

    return regions
