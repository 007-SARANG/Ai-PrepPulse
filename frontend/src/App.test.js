import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import App from "./App";
jest.mock("axios", () => ({ post: jest.fn() }));
const result = {
  overallScore: 0,
  readinessLevel: "Beginner",
  analysisMethod: "rule-based",
  breakdown: {
    technicalSkills: 0,
    resumeQuality: 50,
    communication: 50,
    portfolio: 0,
  },
  strengths: ["Clear target role"],
  gaps: ["Add a project"],
  actionableSteps: ["Build a small project"],
  timelineEstimate: "2–3 weeks",
  keyRecommendation: "Start with one focused project.",
  processingTime: "0.01s",
};
function fillRequired() {
  fireEvent.change(screen.getByLabelText(/Target role/), {
    target: { value: "ML Engineer" },
  });
  fireEvent.change(screen.getByLabelText(/Education/), {
    target: { value: "Bachelor's Degree" },
  });
}
beforeEach(() => {
  jest.clearAllMocks();
  window.scrollTo = jest.fn();
});
test("submits the profile, renders a zero-score fallback report and restarts", async () => {
  axios.post.mockResolvedValue({ data: result });
  render(<App />);
  fillRequired();
  fireEvent.change(screen.getByLabelText(/Technical skills/), {
    target: { value: "Python, SQL" },
  });
  fireEvent.click(screen.getByRole("button", { name: /Generate my report/ }));
  await waitFor(() =>
    expect(
      screen.getByRole("heading", { name: "Your preparation report" }),
    ).toHaveFocus(),
  );
  expect(screen.getByText("Rule-based assessment")).toBeInTheDocument();
  expect(
    screen.getByRole("progressbar", { name: "Technical skills" }),
  ).toHaveAttribute("aria-valuenow", "0");
  const data = axios.post.mock.calls[0][1];
  expect(data.get("targetRole")).toBe("ML Engineer");
  expect(data.get("technicalSkills")).toBe("Python, SQL");
  fireEvent.click(
    screen.getByRole("button", { name: "Start a new assessment" }),
  );
  expect(screen.getByLabelText(/Target role/)).toHaveValue("");
});
test("retains input and announces a failed request", async () => {
  axios.post.mockRejectedValue({
    response: { data: { error: "Service unavailable" } },
  });
  render(<App />);
  fillRequired();
  fireEvent.click(screen.getByRole("button", { name: /Generate my report/ }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Service unavailable",
  );
  expect(screen.getByLabelText(/Target role/)).toHaveValue("ML Engineer");
  expect(
    screen.getByRole("button", { name: /Generate my report/ }),
  ).toBeEnabled();
});
test("prevents repeat submissions while analyzing", () => {
  axios.post.mockReturnValue(new Promise(() => {}));
  render(<App />);
  fillRequired();
  fireEvent.click(screen.getByRole("button", { name: /Generate my report/ }));
  expect(
    screen.getByRole("button", { name: /Analyzing your profile/ }),
  ).toBeDisabled();
  expect(
    screen.getByRole("status", { name: "Analysis progress" }),
  ).toHaveTextContent("Analyzing");
});
test("invalid replacement clears the previously selected resume", async () => {
  axios.post.mockResolvedValue({ data: result });
  render(<App />);
  fillRequired();
  const input = screen.getByLabelText(/Attach your resume/);
  fireEvent.change(input, {
    target: {
      files: [new File(["resume"], "resume.txt", { type: "text/plain" })],
    },
  });
  expect(screen.getByText("resume.txt")).toBeInTheDocument();
  fireEvent.change(input, {
    target: {
      files: [
        new File(["bad"], "bad.exe", { type: "application/octet-stream" }),
      ],
    },
  });
  expect(screen.getByRole("alert")).toHaveTextContent("PDF or TXT");
  fireEvent.click(screen.getByRole("button", { name: /Generate my report/ }));
  await waitFor(() => expect(axios.post).toHaveBeenCalled());
  expect(axios.post.mock.calls[0][1].get("resume")).toBeNull();
});
test("prints the report", async () => {
  axios.post.mockResolvedValue({ data: result });
  window.print = jest.fn();
  render(<App />);
  fillRequired();
  fireEvent.click(screen.getByRole("button", { name: /Generate my report/ }));
  fireEvent.click(
    await screen.findByRole("button", { name: "Print or save PDF" }),
  );
  expect(window.print).toHaveBeenCalledTimes(1);
});

test("malformed reports leave the form available for retry", async () => {
  axios.post.mockResolvedValue({ data: { ...result, strengths: null } });
  render(<App />);
  fillRequired();
  fireEvent.click(screen.getByRole("button", { name: /Generate my report/ }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "incomplete report",
  );
  expect(screen.getByLabelText(/Target role/)).toHaveValue("ML Engineer");
});
