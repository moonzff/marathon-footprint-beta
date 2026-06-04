import { connectLambda, getStore } from "@netlify/blobs";

const STORE_NAME = "marathon-beta";
const STATE_KEY = "state";
const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};

function betaStore() {
  return getStore(STORE_NAME);
}

function response(statusCode, body) {
  return {
    statusCode,
    headers: jsonHeaders,
    body: JSON.stringify(body)
  };
}

export async function handler(event) {
  try {
    connectLambda(event);
    const store = betaStore();

    if (event.httpMethod === "GET") {
      const state = await store.get(STATE_KEY, { type: "json" });
      return response(200, { ok: true, state: state || null });
    }

    if (event.httpMethod !== "POST") {
      return response(405, { ok: false, error: "method_not_allowed" });
    }

    const body = event.body ? JSON.parse(event.body) : {};

    if (body.action === "reset") {
      if (body.adminCode !== process.env.BETA_ADMIN_CODE && process.env.BETA_ADMIN_CODE) {
        return response(403, { ok: false, error: "invalid_admin_code" });
      }
      await store.delete(STATE_KEY);
      return response(200, { ok: true, state: null });
    }

    if (body.action !== "replace" || !body.state) {
      return response(400, { ok: false, error: "invalid_action" });
    }

    const nextState = {
      ...body.state,
      savedAt: new Date().toISOString()
    };
    await store.setJSON(STATE_KEY, nextState);
    return response(200, { ok: true, state: nextState });
  } catch (error) {
    return response(500, {
      ok: false,
      error: "server_error",
      message: error instanceof Error ? error.message : String(error)
    });
  }
}
