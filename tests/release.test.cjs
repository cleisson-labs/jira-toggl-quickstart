"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { releaseNotes } = require("../scripts/release-notes.cjs");

test("GitHub releases prepend only the matching changelog section to generated notes", () => {
  const changelog =
    "# Changelog\n\n## Unreleased\n\n## 2.0.0 — today\n\n- Current\n\n## 1.0.0\n\n- Earlier";
  assert.equal(
    releaseNotes(changelog, "2.0.0"),
    "## 2.0.0 — today\n\n- Current",
  );
  assert.throws(() => releaseNotes(changelog, "0.1.0"), /Missing changelog/);
  const workflow = fs.readFileSync(
    path.join(__dirname, "../.github/workflows/release.yml"),
    "utf8",
  );
  assert.match(
    workflow,
    /notes: \$\{\{ fromJSON\(needs\.build\.outputs\.notes\) \}\}/,
  );
  assert.match(workflow, /generate-notes: true/);
});
