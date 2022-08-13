import { CreateSessionResponse, CreateSessionResponseBody, isApiError } from "../types";

let timeout: NodeJS.Timeout;
let cachedSession: CreateSessionResponseBody | null = null;
const minDelta = 30 * 1000;

function requestToken() {
  emitNet("aiden:fivem_auth:request_token");
}

function scheduleRefresh() {
  if (!cachedSession) {
    return;
  }

  timeout && clearTimeout(timeout);
  let delta = minDelta;

  try {
    const nextTokenRequest = Math.max(minDelta, new Date(cachedSession.expires_at).getTime() - Date.now() - minDelta);
    console.log(`Scheduling token refresh in ${nextTokenRequest}ms.`);
    delta = nextTokenRequest;
  } catch (error) {
    console.error("Failed to parse expires_at.", error);
  }

  timeout = setTimeout(requestToken, delta);
}

setImmediate(() => {
  requestToken();
});

onNet("aiden:fivem_auth:request", (jsonifiedBody) => {
  try {
    const body: CreateSessionResponse = JSON.parse(jsonifiedBody);
    if (isApiError(body) || !body.token) {
      throw new Error(`Error while requesting token: ${jsonifiedBody}`);
    }

    console.log("Received session!");
    cachedSession = body;
    scheduleRefresh();
  } catch (error) {
    console.error("Failed to get token, retrying in 10s.", jsonifiedBody);
    timeout && clearTimeout(timeout);
    timeout = setTimeout(requestToken, 10 * 1000);
  }
});

// getSessionToken lets other scripts pull the active session token
global.exports("getSessionToken", () => cachedSession?.token || "");
