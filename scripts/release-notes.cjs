"use strict";

const fs = require("node:fs");

function releaseNotes(changelog, version) {
  const section = changelog
    .split(/^(?=## )/m)
    .find((text) => text.split(/\s+/, 2)[1] === version);
  if (!section) throw new Error(`Missing changelog for version ${version}`);
  return section.trim();
}

module.exports = { releaseNotes };

if (require.main === module) {
  const { version } = JSON.parse(fs.readFileSync("manifest.json", "utf8"));
  const notes = releaseNotes(fs.readFileSync("CHANGELOG.md", "utf8"), version);
  // A single JSON string safely transports multiline Markdown through GitHub job outputs.
  console.log(`notes=${JSON.stringify(notes)}`);
}
