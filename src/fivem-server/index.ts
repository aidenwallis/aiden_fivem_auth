import fetch from "node-fetch";

import { ApiCode, CreateSessionResponse } from "../types";

on("aiden:fivem_auth:request_token", () => {
  const source = global.source;
  const respond = (body: CreateSessionResponse) => emitNet("aiden:fivem_auth:request", source, JSON.stringify(body));

  const serviceHost = GetConvar("aiden_fivem_auth_internal_addr", "");
  if (!serviceHost) {
    return respond({ code: ApiCode.Unknown, message: "[Config] No service host defined." });
  }

  const identifiers = getPlayerIdentifiers(source);

  fetch(serviceHost, {
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
