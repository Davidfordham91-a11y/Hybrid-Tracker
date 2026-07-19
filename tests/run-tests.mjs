import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { APP_VERSION, BUILD_NUMBER, SCHEMA_VERSION } from "../src/core/version.js";
import { setLooksUnusual } from "../src/utils/validation.js";

const root = new URL("../", import.meta.url);

assert.equal(APP_VERSION, "0.5.0");
assert.equal(BUILD_NUMBER, "28");
assert.equal(SCHEMA_VERSION, 5);

assert.deepEqual(setLooksUnusual({ reps: 80, weight: 60 }, "Machine Chest Press"), {
  highReps: true,
  highWeight: false,
  timedWork: false
});
assert.equal(setLooksUnusual({ reps: 60, weight: 0 }, "Plank").highReps, false);
assert.equal(setLooksUnusual({ reps: 8, weight: 400 }, "Front Squat").highWeight, true);

const serviceWorker = await readFile(new URL("sw.js", root), "utf8");
assert.match(serviceWorker, /hybrid-tracker-v5-0/);
assert.match(serviceWorker, /\.\/src\/core\/version\.js/);
assert.match(serviceWorker, /\.\/src\/utils\/validation\.js/);
assert.match(serviceWorker, /!response\.redirected/);

const worker = await readFile(new URL("cloudflare/worker.js", root), "utf8");
assert.match(worker, /\/api\/friends\/requests/);
assert.match(worker, /status = 'accepted'/);
assert.doesNotMatch(worker, /publicUserPayload/);
assert.match(worker, /Origin not allowed/);
assert.match(worker, /Too many requests/);

const v3Fixture = JSON.parse(await readFile(new URL("tests/fixtures/v3-export-sample.json", root), "utf8"));
assert.equal(v3Fixture.schemaVersion, 3);
assert.equal(v3Fixture.profile.raceDate, "2026-10-04");

console.log("Hybrid Tracker v0.5 tests passed.");
