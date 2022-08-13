import fetch from "node-fetch";

import { ApiCode, CreateSessionResponse } from "../types";

onNet("aiden:fivem_auth:request_token", () => {
  const source = global.source;
  const respond = (body: CreateSessionResponse) => emitNet("aiden:fivem_auth:request", source, JSON.stringify(body));

  const serviceHost = GetConvar("aiden_fivem_auth_internal_addr", "");
  if (!serviceHost) {
    return respond({ code: ApiCode.Unknown, message: "[Config] No service host defined." });
  }

  const identifiers = getPlayerIdentifiers(source);

  fetch(serviceHost + "/v1/sessions", {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    method: "POST",
    body: JSON.stringify({
      identifiers: identifiers,
      metadata: {
        currentSource: source,
      },
    }),
  })
    .then((resp) => resp.json())
    .then((body: CreateSessionResponse) => {
      setImmediate(() => respond(body));
    });
});

const sleep = (duration: number) => new Promise((resolve) => setTimeout(resolve, duration));

const dropSession = async (identifiers: string[]) => {
  const serviceHost = GetConvar("aiden_fivem_auth_internal_addr", "");
  if (!serviceHost) {
    return;
  }

  const attempt = () =>
    fetch(serviceHost + "/v1/drop-session", {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      method: "POST",
      body: JSON.stringify({ identifiers }),
    })
      .then((resp) => {
        const success = resp.status === 200;

        !success &&
          console.error("Failed to drop session for identifiers", {
            status: resp.status,
            identifiers,
          });

        return success;
      })
      .catch((error) => {
        console.error("Failed to drop session for identifiers", {
          error: error.toString(),
          identifiers,
        });
        return false;
      });

  for (let i = 0; i < 10; i++) {
    if (await attempt()) {
      return;
    }

    await sleep(1000);
  }
};

on("playerDropped", () => {
  const source = global.source;
  const identifiers = getPlayerIdentifiers(source);
  dropSession(identifiers);
});
