import { createResource, type Component, createSignal, For } from "solid-js";

import styles from "./App.module.css";
import { Configuration, DefaultApi } from "./client";
import {
  getPageData,
  setCurrentHighlight,
  setupHighlighting,
} from "./extension-methods";

const App: Component = () => {
  const [pageData, setPageData] = createSignal<string[] | null>();
  const [data] = createResource(pageData, async (pageData) => {
    pageData = pageData.map((paragraph) =>
      paragraph.replaceAll(/\[[0-9+]\]/g, "")
    );
    const response = await new DefaultApi(
      new Configuration({ basePath: "http://localhost:8000" })
    ).analyzeAnalyzePost({ requestBody: pageData });
    setupHighlighting();
    return response;
  });
  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <button onClick={async () => setPageData(await getPageData())}>
          Segment
        </button>
        <For each={data()}>
          {(region) => (
            <p
              onPointerOver={() =>
                setCurrentHighlight([region.start, region.end])
              }
            >
              <For each={region.keywords}>
                {(sentence) => (
                  <span>
                    {sentence}
                    <br />
                  </span>
                )}
              </For>
            </p>
          )}
        </For>
      </header>
    </div>
  );
};

export default App;
