const E_PAGELOAD = "pageload";
const E_PAGELEAVE = "pageleave";
const E_KEYDOWN = "keydown";
const E_CLICK = "click";
const E_MOUSEMOVE = "mousemove";

const url = new URL(document.location).href;
let userActivityData = [];

function addUserActivityEvent(eventType, element, data) {
  const el = element ? element.tagName + (element.id ? "#" + element.id : "") : undefined;
  // NOTE: We stringify data as its schema can vary based on events
  userActivityData.push({
    url,
    eventType,
    timestamp: Date.now(),
    data: JSON.stringify({ data, element }),
  });
  if (eventType == E_PAGELEAVE || eventType == E_PAGELOAD) sendDataToServer();
}

async function sendDataToServer() {
  if (userActivityData.length <= 0) return;
  const body = userActivityData.map((r) => JSON.stringify(r)).join("\n"); // NDJSON
  userActivityData = [];
  const headers = { "Content-Type": "application/x-ndjson", "x-bd-authorization": TAP_TOKEN };
  const res = await fetch(TAP_URL, { method: "POST", headers, body });
  if (!res.ok) console.error(res);
}

function getDeviceInfo() {
  return {
    ua: navigator.userAgent,
    width: screen.width,
    height: screen.height,
    referrer: document.referrer,
  };
}

const add = document.addEventListener;
const addW = window.addEventListener;
addUserActivityEvent(E_PAGELOAD, null, getDeviceInfo());
add("keydown", (event) => addUserActivityEvent(E_KEYDOWN, null, { key: event.key }));
add("click", (event) => addUserActivityEvent(E_CLICK, event.target));
add("mousemove", ({ clientX: x, clientY: y }) => addUserActivityEvent(E_MOUSEMOVE, null, { x, y }));
addW("beforeunload", () => addUserActivityEvent(E_PAGELEAVE));
setInterval(sendDataToServer, 5000);
