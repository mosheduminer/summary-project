import {
  ArticleContent,
  createHighlightCSS,
  createHighlights,
  parseArticleContent,
} from "./injected-methods";

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

export async function getPageData(): Promise<string[] | null> {
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

export async function setupHighlighting() {
  const tabId = await getTabId();
  (
    await chrome.scripting.executeScript<[], Promise<void>>({
      target: { tabId },
      world: "ISOLATED",
      func: createHighlightCSS,
    })
  )[0].result;
}

export async function setCurrentHighlight(boundaries: [number, number]) {
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
