const DATA_TAP_URL = "https://3fcfopyadbzm24pe6rypswozyq0wbghs.lambda-url.eu-west-1.on.aws/";
const TAP_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlRhcFRva2VuIn0.eyJlbWFpbCI6ImRlbW9AYm9pbGluZ2RhdGEuY29tIiwidXNlcm5hbWUiOiIyMTM0NmJmMi02YzMxLTRjYWYtOGU3ZS05ODMyMjA1ZmZkZWUiLCJpYXQiOjE3MTIyOTU1NzksImV4cCI6MTcxMjM4MTk3OSwiYXVkIjpbIjIxMzQ2YmYyLTZjMzEtNGNhZi04ZTdlLTk4MzIyMDVmZmRlZSIsImRlbW9AYm9pbGluZ2RhdGEuY29tIiwiZGVtb0Bib2lsaW5nZGF0YS5jb20iXSwiaXNzIjoiQm9pbGluZ0RhdGEifQ.8-Q_3U5bxDMa7JntqRLNADTgk1X_xURdcYBHxNc3wE4";
const E_PAGELOAD = "pageload";
const E_PAGELEAVE = "pageleave";
const E_KEYDOWN = "keydown";
const E_CLICK = "click";
const E_MOUSEMOVE = "mousemove";

const url = new URL(document.location).href;
let userActivityData = [];

function addUserActivityEvent(eventType, element, data) {
  const el = element ? element.tagName + (element.id ? "#" + element.id : "") : undefined;
  userActivityData.push({ url, eventType, timestamp: Date.now(), element: el, data });
  if (eventType == E_PAGELEAVE) sendDataToServer();
}

async function sendDataToServer() {
  if (userActivityData.length <= 0) return;
  const method = "POST";
  const body = userActivityData.map((r) => JSON.stringify(r)).join("\n"); // NDJSON
  const headers = { "Content-Type": "application/x-ndjson", "x-bd-authorization": TAP_TOKEN };
  const res = await fetch(DATA_TAP_URL, { method, headers, body });
  if (!res.ok) console.error(res);
  userActivityData = [];
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
