import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const file = new URL("../.github/main-ruleset.json", import.meta.url);
const workflow = readFileSync(new URL("../.github/workflows/verify-pr.yml", import.meta.url), "utf8");

test("staged branch ruleset requires a real PR and the existing verify CI", () => {
  const policy = JSON.parse(readFileSync(file, "utf8"));
  assert.equal(policy.enforcement, "active", "staged policy must describe its intended active state");
  assert.deepEqual(policy.conditions.ref_name.include, ["~DEFAULT_BRANCH"]);
  assert.deepEqual(policy.bypass_actors, [], "no silent bypass");
  assert.ok(policy.rules.some((rule) => rule.type === "non_fast_forward"));
  assert.ok(policy.rules.some((rule) => rule.type === "deletion"));

  const pr = policy.rules.find((rule) => rule.type === "pull_request");
  assert.equal(pr.parameters.required_approving_review_count, 0, "solo owner must not deadlock");
  assert.ok(pr.parameters.allowed_merge_methods.includes("squash"));

  const required = policy.rules.find((rule) => rule.type === "required_status_checks");
  assert.deepEqual(required.parameters.required_status_checks, [{ context: "verify" }]);
  assert.match(workflow, /\n\s+verify:\n/, "required job must exist");
  assert.match(workflow, /pull_request:/, "required job must run on PRs");
  assert.doesNotMatch(workflow, /\n\s+if:\s*github\.head_ref/, "required job must not be branch-specific");
});

test("ruleset file is only a proposal: no workflow applies admin settings", () => {
  const workflowPaths = [".github/workflows/verify-pr.yml", ".github/workflows/agent-sync-pilot.yml"];
  for (const path of workflowPaths) {
    const content = readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
    assert.doesNotMatch(content, /gh api\s+.*rulesets|rulesets.*-X POST/);
  }
});
