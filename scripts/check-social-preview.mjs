import assert from "node:assert/strict";

const target = process.argv[2] ?? "http://127.0.0.1:3001";
const html = await fetch(target).then((response) => response.text());

const ogImage = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i)?.[1];
const twitterImage = html.match(/<meta[^>]+name="twitter:image"[^>]+content="([^"]+)"/i)?.[1];

assert.ok(ogImage, "Missing og:image meta tag");
assert.ok(twitterImage, "Missing twitter:image meta tag");
assert.match(
  ogImage,
  /(social-preview|opengraph-image|logo)/i,
  `Expected og:image to point at a branded asset, got: ${ogImage}`,
);
assert.match(
  twitterImage,
  /(social-preview|opengraph-image|twitter-image|logo)/i,
  `Expected twitter:image to point at a branded asset, got: ${twitterImage}`,
);

console.log("Social preview metadata looks correct.");
