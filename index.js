import { request, gql, resolveRequestDocument } from "graphql-request";
import HmacSHA256 from "crypto-js/hmac-sha256.js";
import Base64 from "crypto-js/enc-base64.js";

const YOUR_API_KEY = "";
const YOUR_API_SECRET = "";

async function main() {
  if (!YOUR_API_KEY) throw Error("You need to give API key in index.js");
  if (!YOUR_API_SECRET) throw Error("You need to give API secret in index.js");

  // CREATOR - Secure Usage
  const url = "https://creator.qubic.app/admin/graphql";

  const urlObj = new URL(url);
  const resource = `${urlObj.pathname}${urlObj.search}`; // output: /admin/graphql

  const document = gql`
    query shop {
      shop {
        id
      }
    }
  `;

  const { operationName, query } = resolveRequestDocument(document);

  const body = JSON.stringify({
    query,
    operationName,
  });

  const now = Date.now();
  const msg = `${now}POST${resource}${body}`;
  const sig = HmacSHA256(msg, YOUR_API_SECRET).toString(Base64);

  const requestHeaders = {
    "x-qubic-api-key": YOUR_API_KEY,
    "x-qubic-ts": now.toString(),
    "X-qubic-sign": sig,
  };

  const result = await request({
    url,
    document,
    requestHeaders,
  });

  console.log(result);
}

main();
