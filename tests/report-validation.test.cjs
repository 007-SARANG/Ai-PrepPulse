const { test } = require("node:test");
const assert = require("node:assert/strict");
const { isValidAnalysis } = require("../backend/utils/validateAnalysis");
const valid = {
  overallScore: 0,
  readinessLevel: "Beginner",
  breakdown: {
    technicalSkills: 0,
    resumeQuality: 0,
    communication: 0,
    portfolio: 0,
  },
  strengths: [],
  gaps: [],
  actionableSteps: [],
  timelineEstimate: "1 month",
  keyRecommendation: "Practice",
};
test("zero is a valid score", () => assert.equal(isValidAnalysis(valid), true));
test("rejects malformed provider arrays, fields and scores", () => {
  for (const change of [
    { strengths: null },
    { gaps: [{}] },
    { actionableSteps: "practice" },
    { breakdown: {} },
    { overallScore: NaN },
    { overallScore: 101 },
    { keyRecommendation: {} },
    { timelineEstimate: [] },
  ])
    assert.equal(isValidAnalysis({ ...valid, ...change }), false);
});
