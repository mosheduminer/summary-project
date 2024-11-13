import { createResource, type Component, createSignal, For } from "solid-js";

import styles from "./App.module.css";
import { Configuration, DefaultApi } from "./client";
import {
  ArticleContent,
  createHighlightCSS,
  createHighlights,
  parseArticleContent,
} from "./parser";

async function getTabId() {
  const currentTab = (
    await chrome.tabs.query({ active: true, currentWindow: true })
  )[0];
  if (typeof currentTab === "undefined") throw Error("currentTab is undefined");
  const tabId = currentTab.id;
  const tabUrl = currentTab.url;
  if (typeof tabId === "undefined") throw Error("current tabId is undefined");
  if (typeof tabUrl === "undefined") throw Error("current tabUrl is undefined");
  return tabId;
}

async function getPageData(): Promise<string[] | null> {
  const tabId = await getTabId();
  const executionResult = (
    await chrome.scripting.executeScript<[], ArticleContent>({
      target: { tabId },
      world: "ISOLATED",
      func: parseArticleContent,
    })
  )[0].result;
  return executionResult!.map((item) => item.sentence);
}

async function setupHighlighting() {
  const tabId = await getTabId();
  (
    await chrome.scripting.executeScript<[], Promise<void>>({
      target: { tabId },
      world: "ISOLATED",
      func: createHighlightCSS,
    })
  )[0].result;
}

async function setCurrentHighlight(boundaries: [number, number]) {
  const tabId = await getTabId();
  return (
    await chrome.scripting.executeScript<[[number, number]], Promise<void>>({
      target: { tabId },
      world: "ISOLATED",
      args: [boundaries],
      func: createHighlights,
    })
  )[0].result;
}

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
