const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
process.env.GEMINI_API_KEY = "";
const app = require("../api/assessment/analyze");
let server, url;
before(async () => {
  server = await new Promise((resolve) => {
    const s = app.listen(0, "127.0.0.1", () => resolve(s));
  });
  url = `http://127.0.0.1:${server.address().port}/api/assessment/analyze`;
});
after(() => new Promise((resolve) => server.close(resolve)));
test("the deployed route rejects a missing required profile", async () => {
  const r = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  assert.equal(r.status, 400);
});
test("missing Gemini configuration returns a labelled fallback report", async () => {
  const form = new FormData();
  form.set("targetRole", "ML Engineer");
  form.set("education", "Bachelor's Degree");
  form.set("technicalSkills", "Python, SQL");
  form.set("communicationConfidence", "5");
  const r = await fetch(url, { method: "POST", body: form });
  assert.equal(r.status, 200);
  const data = await r.json();
  assert.equal(data.analysisMethod, "rule-based");
  assert.equal(typeof data.overallScore, "number");
  assert.ok(data.overallScore >= 0 && data.overallScore <= 100);
  assert.ok(Array.isArray(data.actionableSteps));
});
test("resume uploads still pass through the production adapter", async () => {
  const form = new FormData();
  form.set("targetRole", "Engineer");
  form.set("education", "Bachelor's Degree");
  form.set(
    "resume",
    new Blob(["Example resume. Python projects."], { type: "text/plain" }),
    "resume.txt",
  );
  const r = await fetch(url, { method: "POST", body: form });
  assert.equal(r.status, 200);
  assert.equal((await r.json()).breakdown.resumeQuality, 80);
});

test("rejects files beyond the deployment-safe upload limit", async () => {
  const form = new FormData();
  form.set("targetRole", "Engineer");
  form.set("education", "Bachelor's Degree");
  form.set(
    "resume",
    new Blob([new Uint8Array(4 * 1024 * 1024 + 1)], { type: "text/plain" }),
    "large.txt",
  );
  const response = await fetch(url, { method: "POST", body: form });
  assert.equal(response.status, 413);
});
