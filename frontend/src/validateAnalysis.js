// Shared with the API: a malformed provider response must never reach the report UI.
function isValidAnalysis(value) {
  const score = (v) => Number.isFinite(v) && v >= 0 && v <= 100;
  const text = (v) => typeof v === "string";
  return (
    !!value &&
    score(value.overallScore) &&
    text(value.readinessLevel) &&
    !!value.breakdown &&
    ["technicalSkills", "resumeQuality", "communication", "portfolio"].every(
      (key) => score(value.breakdown[key]),
    ) &&
    ["strengths", "gaps", "actionableSteps"].every(
      (key) => Array.isArray(value[key]) && value[key].every(text),
    ) &&
    text(value.timelineEstimate) &&
    text(value.keyRecommendation)
  );
}
module.exports = { isValidAnalysis };
