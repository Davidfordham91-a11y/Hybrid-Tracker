export function setLooksUnusual(set = {}, exerciseName = "") {
  const reps = numericValue(set.reps);
  const weight = numericValue(set.weight);
  const timedWork = /plank|wall sit|hold|stretch/i.test(exerciseName) || /sec|min/i.test(String(set.reps || ""));
  return {
    highReps: !timedWork && reps > 50,
    highWeight: weight > 350,
    timedWork
  };
}

export function numericValue(value) {
  const number = Number.parseFloat(value);
  return Number.isFinite(number) ? number : 0;
}
