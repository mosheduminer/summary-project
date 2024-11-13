from pydantic import BaseModel


class Region(BaseModel):
    start: int
    end: int
    keywords: list[str]
