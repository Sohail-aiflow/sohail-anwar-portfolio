import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { getProjectCliClient } from "@sanity/cli-core";

// Uses the existing local CLI login. Never prints or persists credentials.
const client = await getProjectCliClient({
  projectId: "xc6vvvsv",
  dataset: "production",
  apiVersion: "2026-10-13",
  perspective: "raw",
  useCdn: false,
  requireUser: true,
});
const seed = readFileSync(new URL("./seed.ndjson", import.meta.url), "utf8")
  .trim()
  .split(/\r?\n/)
  .map(JSON.parse);
assert.equal(seed.length, 32);
const mapping = new Map();
// Source IDs retain their original dotted naming convention.
for (const d of seed) {
  if (d._type === "project") mapping.set(`project.${d.slug.current}`, d._id);
  if (d._type === "education") mapping.set("education.aptech", d._id);
  if (d._type === "skill")
    mapping.set(d._id.replace(/^skill-([^-]+)-/, "skill.$1."), d._id);
}
assert.equal(mapping.size, 30);
assert.equal(new Set(mapping.values()).size, 30);
assert.ok([...mapping.values()].every((id) => !id.includes(".")));
const before = await client.fetch("*[]");
assert.equal(
  before.filter(
    (d) => d._id.startsWith("drafts.") || d._id.startsWith("versions."),
  ).length,
  0,
);
const allowed = new Set([...seed.map((d) => d._id), ...mapping.keys()]);
assert.ok(
  before.every((d) => d._id.startsWith("_.") || allowed.has(d._id)),
  "Unexpected records",
);
assert.equal(before.filter((d) => d._id.startsWith("_.")).length, 12);
const content = (d) =>
  Object.fromEntries(
    Object.entries(d).filter(
      ([k]) => !["_rev", "_createdAt", "_updatedAt"].includes(k),
    ),
  );
function rewrite(value) {
  if (Array.isArray(value)) return value.map(rewrite);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value).map(([k, v]) => [
      k,
      k === "_ref" ? (mapping.get(v) ?? v) : rewrite(v),
    ]),
  );
}
const copies = [...mapping].map(([source, destination]) => {
  const original = before.find((d) => d._id === source);
  assert.ok(original, `Missing source ${source}`);
  const copy = rewrite({ ...content(original), _id: destination });
  const existing = before.find((d) => d._id === destination);
  if (existing)
    assert.deepEqual(
      content(existing),
      copy,
      `Conflicting destination ${destination}`,
    );
  return copy;
});
const missing = copies.filter((d) => !before.some((x) => x._id === d._id));
assert.ok(missing.length <= 30);
console.log(
  JSON.stringify({
    preMigrationTotal: before.length,
    systemDocuments: 12,
    missingDestinations: missing.length,
    conflicts: 0,
  }),
);
if (!process.argv.includes("--apply")) process.exit(0);
if (missing.length) {
  let transaction = client.transaction();
  for (const doc of missing) transaction = transaction.createIfNotExists(doc);
  await transaction.commit();
}
const after = await client.fetch("*[]");
assert.equal(after.length, 74);
for (const original of before)
  assert.deepEqual(
    after.find((d) => d._id === original._id),
    original,
    `Original changed ${original._id}`,
  );
for (const copy of copies)
  assert.deepEqual(content(after.find((d) => d._id === copy._id)), copy);
console.log(
  JSON.stringify({
    created: missing.length,
    total: after.length,
    allOriginalDocumentsAndRevisionsUnchanged: true,
    canonicalCopiesVerified: 30,
  }),
);
