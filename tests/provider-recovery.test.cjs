const { test } = require("node:test");
const assert = require("node:assert/strict");
process.env.GEMINI_API_KEY = "test-only-placeholder";
const sdk = require.resolve("../backend/node_modules/@google/generative-ai");
let observedTimeout;
require.cache[sdk] = {
  id: sdk,
  filename: sdk,
  loaded: true,
  exports: {
    GoogleGenerativeAI: class {
      getGenerativeModel() {
        return {
          generateContent: async (_, options) => {
            observedTimeout = options?.timeout;
            throw new Error("Provider unavailable");
          },
        };
      }
    },
  },
};
const { analyzeProfile } = require("../backend/services/geminiService");
test("provider requests have a deadline and recover with a labelled report", async () => {
  const report = await analyzeProfile({
    technicalSkills: "Python",
    yearsOfExperience: 0,
    projectsCompleted: 1,
    communicationConfidence: 5,
  });
  assert.equal(observedTimeout, 15000);
  assert.equal(report.analysisMethod, "rule-based");
  assert.ok(Array.isArray(report.actionableSteps));
});
