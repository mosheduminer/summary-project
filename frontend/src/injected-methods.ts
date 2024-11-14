export type ArticleContent = {
  el: HTMLElement;
  sentence: string;
  paragraphIndex: number;
  startOffset: number;
  endOffset: number;
}[];

// Any change to this function needs to be copied over to `createHighlights`.
export function parseArticleContent(): ArticleContent {
  return (Array.from(document.querySelectorAll("p")) as HTMLElement[]).flatMap(
    (el, paragraphIndex) => {
      const text = el.innerText;
      const split = text.split(/\.[^a-zA-Z]*\s/);
      for (let i = 0; i < split.length - 1; i++) {
        split[i] = `${split[i]}.`;
      }
      return split.map((sentence) => {
        const startOffset = text.indexOf(sentence);
        return {
          el,
          sentence,
          paragraphIndex,
          startOffset,
          endOffset: startOffset + sentence.length,
        };
      });
    }
  );
}

export async function createHighlights([start, end]: [number, number]) {
  // This needs to be nested here because we can't access other declarations when using `chrome.scripting.executeScript`.
  function parseArticleContent(): ArticleContent {
    return (
      Array.from(document.querySelectorAll("p")) as HTMLElement[]
    ).flatMap((el, paragraphIndex) => {
      const text = el.innerText;
      const split = text.split(/\.[^a-zA-Z]*\s/);
      for (let i = 0; i < split.length - 1; i++) {
        split[i] = `${split[i]}.`;
      }
      return split.map((sentence) => {
        const startOffset = text.indexOf(sentence);
        return {
          el,
          sentence,
          paragraphIndex,
          startOffset,
          endOffset: startOffset + sentence.length,
        };
      });
    });
  }
  const sentences = parseArticleContent();
  const getEl = (el: HTMLElement, offset: number) => {
    for (const child of el.childNodes) {
      const length = child.textContent?.length || 0;
      if (length <= offset) {
        offset = offset - length;
      } else {
        return [child, offset] as const;
      }
    }
    throw Error();
  };
  try {
    const range = new Range();
    const rangeStartArgs = getEl(
      sentences[start].el,
      sentences[start].startOffset
    );
    const rangeEndArgs = getEl(sentences[end].el, sentences[end].endOffset);
    range.setStart(...rangeStartArgs);
    range.setEnd(...rangeEndArgs);
    const highlight = new Highlight(range);
    CSS.highlights.set("summary-project-show", highlight);
  } catch (e) {
    console.error(e);
  }
}

export async function createHighlightCSS() {
  const style = document.createElement("style");
  style.innerHTML = `*::highlight(summary-project-show) {
  background-color: yellow;
}`;
  document.head.append(style);
}
