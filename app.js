(() => {
  const STORAGE_KEY = "hybrid-marathon-gym-tracker:v1";
  const SCHEMA_VERSION = 4;
  const APP_VERSION = "0.4.3";
  const BUILD_NUMBER = "27";
  const API_BASE = "/api";
  const IDB_NAME = "hybrid-tracker-v4";
  const IDB_STORE = "snapshots";
  const SYNC_DEBOUNCE_MS = 3000;
  const RACE_DATE = "2026-10-04";
  const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const DAY_INDEX = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };

  const PROFILE = {
    bodyweightKg: 108,
    heightCm: 192,
    location: "Jetts Albany Creek",
    runTime: "05:30",
    gymTime: "12:00-13:00",
    raceDate: RACE_DATE
  };

  const PLAN_WEEKS = [
    { week: 1, start: "2026-06-15", sessions: {} },
    {
      week: 2,
      start: "2026-06-22",
      sessions: {
        Monday: run("Tempo", "Over and Unders 1km", 4.5),
        Tuesday: run("Easy Run", "4km Easy Run", 4),
        Wednesday: run("Long Run", "8km Progressive Long Run", 8),
        Thursday: run("Easy Run", "6km Easy Run", 6),
        Friday: run("Intervals", "1km Repeats", 7.5)
      }
    },
    {
      week: 3,
      start: "2026-06-29",
      sessions: {
        Monday: run("Intervals", "Rolling 400s", 5.4),
        Tuesday: run("Easy Run", "4km Easy Run", 4),
        Wednesday: run("Long Run", "Progressive Repeat 10km Hilly Long Run", 10),
        Thursday: run("Easy Run", "6.5km Easy Run", 6.5),
        Friday: run("Hills", "Shorter Hill Repeats", 7.2)
      }
    },
    {
      week: 4,
      start: "2026-07-06",
      sessions: {
        Monday: run("Intervals", "Rolling 300s", 4),
        Tuesday: run("Easy Run", "5.5km Easy Run", 5.5),
        Wednesday: run("Long Run", "7km Long Run", 7),
        Friday: run("Hills", "Hill Repeats", 4.4)
      }
    },
    {
      week: 5,
      start: "2026-07-13",
      sessions: {
        Monday: run("Tempo", "Tempo 2km Repeats", 6.5),
        Tuesday: run("Easy Run", "5km Easy Run", 5),
        Wednesday: run("Long Run", "12km Long Run", 12),
        Thursday: run("Easy Run", "6.5km Easy Run", 6.5),
        Friday: run("Intervals", "Mile Repeats", 6.4)
      }
    },
    {
      week: 6,
      start: "2026-07-20",
      sessions: {
        Monday: run("Hills", "Shorter Hill Repeats", 5),
        Tuesday: run("Easy Run", "6.5km Easy Run", 6.5),
        Wednesday: run("Long Run", "14km Hilly Long Run", 14),
        Thursday: run("Easy Run", "6.5km Easy Run", 6.5),
        Friday: run("Tempo", "Tempo 6km", 8)
      }
    },
    {
      week: 7,
      start: "2026-07-27",
      sessions: {
        Monday: run("Hills", "Alternating Hill Reps", 5),
        Tuesday: run("Easy Run", "6.5km Easy Run", 6.5),
        Wednesday: run("Long Run", "17km Progressive Long Run", 17),
        Thursday: run("Easy Run", "7km Easy Run", 7),
        Friday: run("Tempo", "Tempo 5km", 8)
      }
    },
    {
      week: 8,
      start: "2026-08-03",
      sessions: {
        Monday: run("Intervals", "Mile Repeats", 5),
        Tuesday: run("Easy Run", "6km Easy Run", 6),
        Wednesday: run("Long Run", "10km Long Run", 10),
        Friday: run("Tempo", "Tempo 2-1", 5)
      }
    },
    {
      week: 9,
      start: "2026-08-10",
      sessions: {
        Monday: run("Hills", "Hill Repeats", 7),
        Tuesday: run("Easy Run", "6km Easy Run", 6),
        Wednesday: run("Long Run", "Progressive Repeat 20km Hilly Long Run", 20),
        Thursday: run("Easy Run", "6.5km Easy Run", 6.5),
        Friday: run("Tempo", "Over and Unders 1km", 7.5)
      }
    },
    {
      week: 10,
      start: "2026-08-17",
      sessions: {
        Monday: run("Hills", "Shorter Hill Repeats", 5.6),
        Tuesday: run("Easy Run", "5.5km Easy Run", 5.5),
        Wednesday: run("Long Run", "23km Long Run", 23),
        Thursday: run("Easy Run", "9km Easy Run", 9),
        Friday: run("Tempo", "Tempo 2km Repeats", 7.5)
      }
    },
    {
      week: 11,
      start: "2026-08-24",
      sessions: {
        Monday: run("Intervals", "800m Repeats", 5),
        Tuesday: run("Easy Run", "6km Easy Run", 6),
        Wednesday: run("Long Run", "Progressive 27km Hilly Long Run", 27),
        Thursday: run("Easy Run", "7.5km Easy Run", 7.5),
        Friday: run("Tempo", "Progressive Run", 9)
      }
    },
    {
      week: 12,
      start: "2026-08-31",
      sessions: {
        Monday: run("Hills", "Drop Set Hill Reps", 5.2),
        Tuesday: run("Easy Run", "6.5km Easy Run", 6.5),
        Wednesday: run("Long Run", "13km Long Run", 13),
        Friday: run("Intervals", "On Off Ks", 5)
      }
    },
    {
      week: 13,
      start: "2026-09-07",
      sessions: {
        Monday: run("Hills", "Hill Repeats", 6.4),
        Tuesday: run("Easy Run", "5.5km Easy Run", 5.5),
        Wednesday: run("Long Run", "33km Hilly Long Run", 33),
        Thursday: run("Easy Run", "8km Easy Run", 8),
        Friday: run("Tempo", "Tempo 3km", 7)
      }
    },
    {
      week: 14,
      start: "2026-09-14",
      sessions: {
        Monday: run("Intervals", "1km Repeats", 5),
        Tuesday: run("Easy Run", "6km Easy Run", 6),
        Wednesday: run("Long Run", "27km Block Long Run", 27),
        Thursday: run("Easy Run", "7.5km Easy Run", 7.5),
        Friday: run("Intervals", "Rolling 300s", 8.2)
      }
    },
    {
      week: 15,
      start: "2026-09-21",
      sessions: {
        Monday: run("Tempo", "Half Easy, Half Tempo", 6.5),
        Tuesday: run("Easy Run", "7km Easy Run", 7),
        Wednesday: run("Long Run", "17km Hilly Long Run", 17),
        Friday: run("Hills", "Alternating Hill Reps", 6.4)
      }
    },
    {
      week: 16,
      start: "2026-09-28",
      sessions: {
        Tuesday: run("Tempo", "Taper Two Miler", 6.8),
        Thursday: run("Easy Run", "5.5km Easy Run", 5.5),
        Sunday: run("Race", "Marathon Race", 42.2)
      }
    }
  ];

  const RUN_PLAN = PLAN_WEEKS.flatMap((week) =>
    DAY_ORDER.map((day, index) => {
      const session = week.sessions[day] || run("Rest", "Rest", 0);
      const date = addDays(week.start, index);
      return {
        id: `w${week.week}-${date}-${day.toLowerCase()}`,
        week: week.week,
        date,
        day,
        type: session.type,
        title: session.title,
        distanceKm: session.distanceKm
      };
    })
  );

  const GYM_TEMPLATES = {
    Monday: split("Chest", [
      ex("Flat Bench Press", 4, "6", "Chest"),
      ex("Incline Dumbbell Press", 4, "8", "Chest"),
      ex("Machine Chest Press", 3, "10", "Chest"),
      ex("Cable Fly", 3, "12", "Chest"),
      ex("Push-ups", 2, "Near failure", "Chest"),
      ex("Plank", 3, "60 sec", "Core", true),
      ex("Side Plank", 2, "30 sec each side", "Core", true),
      ex("Dead Bug", 3, "10", "Core", true)
    ]),
    Tuesday: split("Back", [
      ex("Weighted Pull-up or Assisted Pull-up", 4, "6-8", "Back"),
      ex("Chest Supported Row", 4, "8", "Back"),
      ex("Lat Pulldown", 3, "10", "Back"),
      ex("Cable Row", 3, "10", "Back"),
      ex("Single-Arm Dumbbell Row", 3, "10 each side", "Back", true),
      ex("Face Pull", 3, "15", "Back"),
      ex("Back Extension", 3, "12", "Back")
    ]),
    Wednesday: split("Legs", [
      ex("Front Squat", 3, "8", "Legs"),
      ex("Romanian Deadlift", 2, "8", "Posterior Chain"),
      ex("Deadlift", 1, "5", "Posterior Chain", true),
      ex("Bulgarian Split Squat", 2, "10 per leg", "Legs"),
      ex("Step-ups", 2, "8 each leg", "Legs"),
      ex("Hip Thrust / Glute Bridge", 2, "10", "Glutes"),
      ex("Hack Squat / Leg Press", 2, "10", "Legs", true),
      ex("Seated Hamstring Curl", 2, "12", "Hamstrings"),
      ex("Seated or Bent-Knee Calf Raise", 3, "12", "Calves"),
      ex("Tibialis Raises", 2, "15", "Lower Leg"),
      ex("Banded Lateral Walks", 2, "10 steps each way", "Glutes", true),
      ex("Wall Sits", 2, "40 sec", "Legs", true)
    ]),
    Thursday: split("Shoulders", [
      ex("Military Press / Overhead Press", 3, "8", "Shoulders"),
      ex("Seated Dumbbell Press", 3, "8", "Shoulders"),
      ex("Machine Shoulder Press", 3, "10", "Shoulders"),
      ex("Dumbbell Lateral Raise", 4, "15", "Shoulders"),
      ex("Rear Delt Fly", 3, "15", "Rear Delts"),
      ex("Cable Lateral Raise", 3, "15", "Shoulders"),
      ex("Pallof Press", 3, "12", "Core", true),
      ex("Hanging Leg Raise", 3, "12", "Core", true)
    ]),
    Friday: split("Arms", [
      ex("Close Grip Bench Press", 4, "8", "Triceps"),
      ex("EZ Bar Curl", 4, "8", "Biceps"),
      ex("Rope Pushdown", 4, "12", "Triceps"),
      ex("Incline Dumbbell Curl", 3, "12", "Biceps"),
      ex("Overhead Cable Extension", 3, "12", "Triceps"),
      ex("Hammer Curl", 3, "12", "Biceps"),
      ex("Reverse Curl", 3, "15", "Forearms")
    ])
  };

  const STRETCH_ROUTINE = [
    stretch("couch", "Couch stretch", 60, "each side"),
    stretch("hip-flexor", "Hip flexor stretch", 60, "each side"),
    stretch("hamstring-floss", "Hamstring floss", 0, "10 reps each side"),
    stretch("calf", "Calf stretch", 60, "each side"),
    stretch("pigeon", "Pigeon/glute stretch", 60, "each side"),
    stretch("thoracic", "Thoracic rotations", 0, "10 reps each side"),
    stretch("pass-throughs", "Shoulder pass-throughs", 0, "15 reps"),
    stretch("squat-hold", "Deep squat hold", 60, "")
  ];

  const DEFAULT_TARGETS = { calories: 3000, protein: 220, carbs: 350, fat: 80, fibre: 30, water: 0, caffeine: 0 };
  const DEFAULT_PRESETS = [
    food("International Protein WPI", 120, 27, 2, 1, 0, 0, 0, true),
    food("WPI Protein", 120, 27, 2, 1, 0),
    food("Woolworths Full Cream Milk", 195, 10, 15, 10, 0),
    food("WPI Protein Shake with 300 mL milk", 315, 37, 17, 11, 0),
    food("Zombie Labs Pre Workout", 10, 0, 2, 0, 0, 0, 250, true),
    food("BSC Energy Drink", 16, 0, 4, 0, 0, 0, 160, true),
    food("Dairy Farmers Protein Smoothie+", 316, 30, 34, 6, 1, 0, 0, true),
    food("White Sandwich Bread", 95, 3, 18, 1, 1),
    food("Devondale Extra Soft Butter", 74, 0, 0, 8, 0),
    food("Cottee's Strawberry Jam", 50, 0, 12, 0, 0),
    food("Pink Lady Apple", 95, 0, 25, 0, 4),
    food("Cavendish Banana", 105, 1, 27, 0, 3),
    food("Four'N Twenty Angus Beef Pie", 430, 16, 39, 24, 3),
    food("Your Spuds Hash Browns", 150, 2, 18, 8, 2),
    food("Thick Beef Sausage", 260, 14, 3, 21, 0),
    food("Chicken Pasta Salad", 520, 35, 55, 18, 5, 0, 0, true),
    food("Beef Stew", 480, 38, 42, 16, 6, 0, 0, true),
    food("Toast with Butter and Jam", 219, 3, 30, 9, 1),
    food("Crunchy Nut with Milk", 430, 15, 72, 9, 4, 0, 0, true),
    food("Milo High Protein Cereal with Milk", 410, 25, 62, 8, 7, 0, 0, true),
    food("Ajitas Vegetable Crisps", 210, 3, 18, 13, 3, 0, 0, true),
    food("Youfoodz Chipotle Chicken Bites", 360, 30, 25, 15, 4, 0, 0, true),
    food("Eggs Benedict Meal", 760, 38, 58, 42, 5, 0, 0, true),
    food("Porterhouse Steak", 420, 52, 0, 23, 0, 0, 0, true),
    food("Hungry Jack's Whopper and Medium Fries", 1180, 38, 128, 56, 10, 0, 0, true),
    food("Nature Valley Protein Peanut and Chocolate Bar", 190, 10, 15, 10, 5, 0, 0, true),
    food("Soul Origin Buffalo Schnitzel Slaw", 690, 42, 48, 34, 8, 0, 0, true),
    food("BBQ Chicken Pizza", 920, 46, 104, 32, 8, 0, 0, true),
    food("Mongolian Beef Noodles", 840, 44, 102, 26, 7, 0, 0, true),
    food("Cafe Big Breakfast", 1050, 52, 72, 61, 8, 0, 0, true)
  ];

  const DEFAULT_SUPPLEMENTS = [
    supplement("Creatine monohydrate", 5, "g", "Daily", "Any time", false, 0, "Keep it boring: 5 g daily."),
    supplement("Fish oil", 1, "serve", "Daily", "With food", false, 0, ""),
    supplement("Vitamin D3", 1, "capsule", "Daily", "Morning", false, 0, ""),
    supplement("Magnesium glycinate", 1, "serve", "Daily", "Evening", false, 0, ""),
    supplement("Electrolytes", 1, "serve", "As required", "Before or after run", false, 0, "Use around long, hot or sweaty sessions."),
    supplement("Pre-workout", 1, "serve", "As required", "Before gym", true, 250, "Avoid late day if sleep suffers.")
  ];

  const STARTING_WEIGHTS = {
    "flat bench press": 80,
    "barbell bench press": 80,
    "incline dumbbell press": 30,
    "cable fly": 22.7,
    "safety bar squat / hack squat": 90,
    "safety bar squat or hack squat": 90,
    "front squat": 55,
    "romanian deadlift": 60,
    "deadlift": 80,
    "seated hamstring curl": 35,
    "bulgarian split squat": 6,
    "step-ups": 10,
    "hip thrust / glute bridge": 60,
    "hack squat / leg press": 90,
    "seated or bent-knee calf raise": 40,
    "tibialis raises": 0,
    "banded lateral walks": 0,
    "wall sits": 0,
    "seated dumbbell press": 20,
    "machine shoulder press": 40,
    "military press / overhead press": 30,
    "lat pulldown": 63.6,
    "seated cable row": 40.9,
    "cable row": 40.9,
    "chest supported row": 80,
    "single-arm dumbbell row": 22.5,
    "ez bar curl": 30,
    "close grip bench press": 50,
    "rope pushdown": 31.8,
    "hammer curl": 12.5,
    "reverse curl": 27.5
  };

  const EXERCISE_LIBRARY = {
    default: {
      notes: "Controlled reps, clean range, leave one to three reps in reserve during heavy run weeks.",
      cues: ["Brace first", "Move smoothly", "Own the end range"],
      mistakes: ["Chasing load when tired", "Rushing the eccentric", "Letting form drift"],
      query: "exercise technique"
    },
    "front squat": lib("Front rack, tall torso, elbows high.", ["Brace before descent", "Knees track over toes", "Drive straight up"], ["Elbows dropping", "Collapsing forward"], "front squat technique"),
    "romanian deadlift": lib("Hip hinge for hamstrings and posterior chain without excessive knee bend.", ["Soft knees", "Hips back", "Lats tight"], ["Squatting the movement", "Rounding the back"], "romanian deadlift technique"),
    "deadlift": lib("Low-volume strength rotation only during running-heavy blocks.", ["Wedge into the bar", "Push the floor", "Lock out with glutes"], ["Yanking from the floor", "Overextending at lockout"], "deadlift technique"),
    "bulgarian split squat": lib("Single-leg strength and running durability.", ["Front foot planted", "Torso controlled", "Drive through midfoot"], ["Bouncing the bottom", "Knee collapsing in"], "bulgarian split squat technique"),
    "step-ups": lib("Durability work for climbs and late-race stability.", ["Whole foot on box", "Stand tall", "Control the descent"], ["Pushing off the back foot", "Rushing reps"], "dumbbell step up technique"),
    "hip thrust / glute bridge": lib("Glute strength with low spinal fatigue.", ["Ribs down", "Full hip extension", "Pause at top"], ["Overarching the back", "Feet too far away"], "hip thrust glute bridge technique"),
    "hack squat / leg press": lib("Quad hypertrophy option when axial fatigue needs managing.", ["Deep controlled reps", "Knees track", "No lockout slam"], ["Short reps", "Knees caving"], "hack squat leg press technique"),
    "tibialis raises": lib("Lower-leg durability for running volume.", ["Pull toes up", "Control down", "Keep heels planted"], ["Swinging", "Tiny range"], "tibialis raise technique"),
    "banded lateral walks": lib("Glute med activation for hip and knee control.", ["Stay low", "Toes forward", "Constant band tension"], ["Standing upright", "Feet snapping together"], "banded lateral walk technique"),
    "wall sits": lib("Isometric quad strength with simple fatigue control.", ["Back flat", "Knees about 90 degrees", "Breathe"], ["Hands pushing thighs", "Too shallow"], "wall sit technique"),
    "flat bench press": lib("Main upper-body strength anchor.", ["Shoulders set", "Leg drive", "Touch consistently"], ["Loose upper back", "Bouncing the bar"], "flat bench press technique"),
    "military press / overhead press": lib("Strict vertical press for shoulders and trunk.", ["Glutes tight", "Bar close", "Head through"], ["Leaning back", "Flaring ribs"], "standing overhead press technique"),
    "cable row": lib("Back volume with controlled fatigue.", ["Tall chest", "Pull elbows back", "Pause briefly"], ["Shrugging", "Jerking the stack"], "seated cable row technique"),
    "single-arm dumbbell row": lib("Unilateral back strength and trunk control.", ["Brace on bench", "Pull to hip", "Control down"], ["Twisting hard", "Half reps"], "single arm dumbbell row technique"),
    "plank": lib("Anti-extension trunk strength.", ["Ribs down", "Glutes tight", "Breathe"], ["Sagging hips", "Holding breath"], "plank technique"),
    "side plank": lib("Lateral trunk control for running posture.", ["Straight line", "Hips high", "Breathe"], ["Rotating forward", "Dropping hips"], "side plank technique")
  };

  let state = loadState();
  let ui = {
    tab: "today",
    selectedRunId: null,
    gymDate: todayISO(),
    stretchDate: todayISO(),
    foodDate: todayISO(),
    metricPhoto: "",
    nutritionSection: "quick",
    updateAvailable: null,
    barcodeStatus: "",
    photoEstimate: null
  };
  let restTimer = { endAt: Number(state.settings.restTimerEndAt) || 0, interval: null };
  let stretchTimer = { itemId: null, remaining: 0, interval: null };
  let syncTimer = null;
  let dbPromise = null;
  let refreshingForUpdate = false;

  const app = document.getElementById("app");
  document.addEventListener("click", handleClick);
  document.addEventListener("input", handleInput);
  document.addEventListener("change", handleChange);

  registerServiceWorker();
  window.addEventListener("online", () => syncNow("online"));
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      if (getRestRemaining()) startRestTicker();
      syncNow("foreground");
    }
  });

  render();
  refreshSession();
  if (getRestRemaining()) startRestTicker();

  function run(type, title, distanceKm) {
    return { type, title, distanceKm };
  }

  function split(muscleGroup, exercises) {
    return { muscleGroup, exercises };
  }

  function ex(name, sets, reps, muscleGroup, optional = false) {
    return { name, sets, reps, muscleGroup, optional };
  }

  function stretch(idValue, name, seconds, detail) {
    return { id: idValue, name, seconds, detail };
  }

  function food(name, calories, protein, carbs, fat, fibre, water = 0, caffeine = 0, estimated = false) {
    return { id: id("preset"), name, calories, protein, carbs, fat, fibre, water, caffeine, estimated };
  }

  function supplement(name, dose, unit, schedule, preferredTime, containsCaffeine, caffeineMg, notes) {
    return {
      id: id("supplement"),
      userId: "local",
      name,
      dose,
      unit,
      schedule,
      preferredTime,
      notes,
      active: true,
      containsCaffeine,
      caffeineMg
    };
  }

  function lib(notes, cues, mistakes, query) {
    return { notes, cues, mistakes, query };
  }

  function loadState() {
    let saved = {};
    try {
      saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (error) {
      console.warn("Could not read tracker data", error);
    }
    if ((saved.schemaVersion || saved.version || 0) < SCHEMA_VERSION && Object.keys(saved).length) {
      try {
        localStorage.setItem(`${STORAGE_KEY}:pre-v4-backup:${todayISO()}`, JSON.stringify(saved));
      } catch (_) {}
    }
    const migrated = migrateState(saved);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    return migrated;
  }

  function migrateState(saved) {
    const now = new Date().toISOString();
    const settings = saved.settings || {};
    const deviceId = settings.deviceId || saved.cloud?.deviceId || id("device");
    const starterMetric = {
      id: id("metric"),
      date: todayISO(),
      bodyweight: PROFILE.bodyweightKg,
      waist: "",
      chest: "",
      arm: "",
      thigh: "",
      sleepHours: "",
      soreness: "",
      fatigue: "",
      notes: "Starting bodyweight from build brief.",
      photo: ""
    };
    const runs = {};
    Object.entries(saved.runs || {}).forEach(([runId, log]) => {
      runs[runId] = {
        ...recordMeta(log, runId, now, deviceId),
        actualDistance: log.actualDistance || "",
        time: log.time || "",
        pace: log.pace || calculatePace(log.actualDistance, log.time) || "",
        notes: log.notes || "",
        status: normalizeStatus(log.status || (log.completed ? "completed" : "planned")),
        movedTo: log.movedTo || "",
        movedFrom: log.movedFrom || ""
      };
    });
    const gymLogs = {};
    Object.entries(saved.gymLogs || {}).forEach(([date, session]) => {
      gymLogs[date] = {
        ...session,
        ...recordMeta(session, session.id || `gym-${date}`, now, deviceId),
        status: normalizeStatus(session.status || (session.completed ? "completed" : "planned")),
        movedTo: session.movedTo || "",
        movedFrom: session.movedFrom || "",
        exercises: (session.exercises || []).map((exercise) => ({
          ...exercise,
          ...recordMeta(exercise, exercise.id || id("ex"), now, deviceId),
          sets: (exercise.sets || []).map((set) => ({
            ...recordMeta(set, set.id || id("set"), now, deviceId),
            id: set.id || id("set"),
            type: set.type || "working",
            reps: set.reps || "",
            weight: set.weight || "",
            notes: set.notes || "",
            completed: Boolean(set.completed),
            completedAt: set.completedAt || ""
          }))
        }))
      };
      delete gymLogs[date].completed;
    });
    const nutrition = saved.nutrition || {};
    const presets = cleanFoodPresets([...(nutrition.presets || []), ...DEFAULT_PRESETS]);
    const nutritionEntries = normalizeNutritionEntries(nutrition.entries || {}, now, deviceId);
    const metrics = Array.isArray(saved.metrics) && saved.metrics.length
      ? saved.metrics.map((metric) => ({ ...recordMeta(metric, metric.id || id("metric"), now, deviceId), ...metric }))
      : [{ ...recordMeta(starterMetric, starterMetric.id, now, deviceId), ...starterMetric }];
    const supplements = saved.supplements || {};
    return {
      schemaVersion: SCHEMA_VERSION,
      version: SCHEMA_VERSION,
      profile: { ...PROFILE, ...(saved.profile || {}) },
      profiles: saved.profiles || {
        active: "dave",
        list: {
          dave: { id: "dave", name: "Dave" },
          mate: { id: "mate", name: "Mate / Friend" }
        }
      },
      runs,
      gymLogs,
      metrics,
      stretchingLogs: normalizeStretchingLogs(saved.stretchingLogs || {}, now, deviceId),
      nutrition: {
        targets: { ...DEFAULT_TARGETS, ...(nutrition.targets || {}) },
        entries: nutritionEntries,
        presets,
        foods: cleanFoodPresets([...(nutrition.foods || []), ...presets]),
        recipes: nutrition.recipes || seedRecipes(),
        savedMeals: nutrition.savedMeals || seedSavedMeals(),
        favourites: nutrition.favourites || [],
        recent: nutrition.recent || [],
        frequent: nutrition.frequent || {},
        pantry: nutrition.pantry || [],
        barcodeCache: nutrition.barcodeCache || {},
        photoDrafts: nutrition.photoDrafts || [],
        mealPrep: nutrition.mealPrep || seedMealPrep()
      },
      supplements: {
        items: cleanSupplements([...(supplements.items || []), ...DEFAULT_SUPPLEMENTS]),
        logs: supplements.logs || {}
      },
      auth: {
        user: saved.auth?.user || null,
        email: saved.auth?.email || "",
        recoveryCode: saved.auth?.recoveryCode || "",
        friendCode: saved.auth?.friendCode || saved.auth?.user?.friendCode || "",
        status: saved.auth?.status || "signed-out",
        lastLoginAt: saved.auth?.lastLoginAt || ""
      },
      cloud: {
        deviceId,
        status: saved.cloud?.status || "local-only",
        lastSyncAt: saved.cloud?.lastSyncAt || "",
        lastError: saved.cloud?.lastError || "",
        outbox: saved.cloud?.outbox || [],
        pendingChanges: saved.cloud?.pendingChanges || 0,
        v3ImportStatus: saved.cloud?.v3ImportStatus || (saved.schemaVersion === 3 || saved.version === 3 ? "found" : "local"),
        migrationBackupKey: saved.cloud?.migrationBackupKey || "",
        dismissedMigration: saved.cloud?.dismissedMigration || false
      },
      friends: {
        items: saved.friends?.items || [],
        lastFetchedAt: saved.friends?.lastFetchedAt || "",
        lastError: saved.friends?.lastError || ""
      },
      insights: {
        feedback: saved.insights?.feedback || {},
        dismissed: saved.insights?.dismissed || {}
      },
      settings: {
        deviceId,
        lastBackupDate: settings.lastBackupDate || "",
        backupDismissedDate: settings.backupDismissedDate || "",
        lastImportDate: settings.lastImportDate || "",
        lastManualExportDate: settings.lastManualExportDate || settings.lastBackupDate || "",
        restTimerEndAt: settings.restTimerEndAt || 0,
        timerMessage: settings.timerMessage || "",
        activeProfile: settings.activeProfile || saved.profiles?.active || "dave",
        units: settings.units || "metric",
        timezone: settings.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "Australia/Brisbane",
        updateLaterUntil: settings.updateLaterUntil || ""
      }
    };
  }

  function saveState(options = {}) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    persistIndexedDbSnapshot();
    if (!options.skipSync) queueSync(options.reason || "local-change");
  }

  function recordMeta(source = {}, fallbackId, now, deviceId) {
    return {
      id: source.id || fallbackId || id("record"),
      userId: source.userId || "local",
      createdAt: source.createdAt || now,
      updatedAt: source.updatedAt || now,
      deletedAt: source.deletedAt || "",
      revision: Number(source.revision || 1),
      deviceId: source.deviceId || deviceId
    };
  }

  function normalizeNutritionEntries(entries, now, deviceId) {
    const normalized = {};
    Object.entries(entries || {}).forEach(([date, list]) => {
      normalized[date] = (list || []).map((entry) => ({
        ...recordMeta(entry, entry.id || id("food"), now, deviceId),
        ...entry,
        meal: entry.meal || mealForTime(),
        source: entry.source || "manual",
        estimated: Boolean(entry.estimated),
        caffeine: toNumber(entry.caffeine)
      }));
    });
    return normalized;
  }

  function normalizeStretchingLogs(logs, now, deviceId) {
    const normalized = {};
    Object.entries(logs || {}).forEach(([date, log]) => {
      normalized[date] = {
        ...recordMeta(log, log.id || `stretch-${date}`, now, deviceId),
        ...log,
        items: log.items || Object.fromEntries(STRETCH_ROUTINE.map((item) => [item.id, false])),
        status: normalizeStatus(log.status || "planned")
      };
    });
    return normalized;
  }

  function cleanSupplements(items) {
    const byName = new Map();
    items.forEach((item) => {
      const name = String(item.name || "").trim();
      if (!name) return;
      const key = normalizeName(name);
      if (!byName.has(key)) {
        byName.set(key, {
          id: item.id || id("supplement"),
          userId: item.userId || "local",
          name,
          dose: item.dose || "",
          unit: item.unit || "",
          schedule: item.schedule || "Daily",
          preferredTime: item.preferredTime || "",
          notes: item.notes || "",
          active: item.active !== false,
          containsCaffeine: Boolean(item.containsCaffeine),
          caffeineMg: toNumber(item.caffeineMg)
        });
      }
    });
    return [...byName.values()];
  }

  function cleanFoodPresets(presets) {
    const blocked = ["mcchicken", "quarter pounder", "medium fries", "coleslaw", "sausages", "pasta", "rice", "chicken breast", "strawberries", "porridge", "peanut butter", "white toast", "100 g bacon", "3 eggs", "protein shake"];
    const byName = new Map();
    presets.forEach((preset) => {
      const name = String(preset.name || "").trim();
      if (!name) return;
      const key = normalizeName(name);
      if (blocked.includes(key)) return;
      if (!byName.has(key)) byName.set(key, { ...preset, id: preset.id || id("preset"), name });
    });
    DEFAULT_PRESETS.forEach((preset) => {
      const key = normalizeName(preset.name);
      if (!byName.has(key)) byName.set(key, preset);
    });
    return [...byName.values()];
  }

  function seedMealPrep() {
    return [{
      id: id("prep"),
      name: "Beef Stew",
      madeDate: todayISO(),
      totalServes: 6,
      servesRemaining: 6,
      calories: 480,
      protein: 38,
      carbs: 42,
      fat: 16,
      fibre: 6,
      notes: "Fridge or freezer portions. Update use-by date if needed.",
      useBy: ""
    }];
  }

  function seedRecipes() {
    return [
      {
        id: id("recipe"),
        name: "Beef Stew",
        calories: 480,
        protein: 38,
        carbs: 42,
        fat: 16,
        fibre: 6,
        notes: "Estimated per serve. Replace with package-label or recipe-builder values when ready."
      },
      {
        id: id("recipe"),
        name: "Chicken Pasta Salad",
        calories: 520,
        protein: 35,
        carbs: 55,
        fat: 18,
        fibre: 5,
        notes: "Estimated nutrition."
      }
    ];
  }

  function seedSavedMeals() {
    return [
      {
        id: id("meal"),
        name: "WPI shake with 300 mL milk",
        items: ["International Protein WPI", "Woolworths Full Cream Milk"],
        calories: 315,
        protein: 37,
        carbs: 17,
        fat: 11,
        fibre: 0
      },
      {
        id: id("meal"),
        name: "Toast with Butter and Jam",
        items: ["White Sandwich Bread", "Devondale Extra Soft Butter", "Cottee's Strawberry Jam"],
        calories: 219,
        protein: 3,
        carbs: 30,
        fat: 9,
        fibre: 1
      }
    ];
  }

  function handleClick(event) {
    const tabButton = event.target.closest("[data-tab]");
    if (tabButton) {
      ui.tab = tabButton.dataset.tab;
      render();
      return;
    }
    const actionEl = event.target.closest("[data-action]");
    if (!actionEl) return;
    const action = actionEl.dataset.action;
    const date = actionEl.dataset.date || todayISO();
    const runId = actionEl.dataset.runId;
    const exerciseId = actionEl.dataset.exerciseId;
    const setId = actionEl.dataset.setId;
    const presetId = actionEl.dataset.presetId;
    const itemId = actionEl.dataset.itemId;

    if (action === "goto") {
      ui.tab = actionEl.dataset.target;
      render();
      return;
    }
    if (action === "export-data") return exportData();
    if (action === "dismiss-backup") {
      state.settings.backupDismissedDate = todayISO();
      saveState();
      render();
      return;
    }
    if (action === "update-now") return activateWaitingServiceWorker();
    if (action === "update-later") {
      state.settings.updateLaterUntil = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
      ui.updateAvailable = null;
      saveState({ skipSync: true });
      render();
      return;
    }
    if (action === "request-magic-link") {
      requestMagicLink();
      return;
    }
    if (action === "create-cloud-account") {
      createCloudAccount();
      return;
    }
    if (action === "restore-cloud-account") {
      restoreCloudAccount();
      return;
    }
    if (action === "copy-recovery-code") {
      copyText(state.auth.recoveryCode, "Recovery code copied.");
      return;
    }
    if (action === "copy-friend-code") {
      copyText(state.auth.friendCode || state.auth.user?.friendCode, "Friend code copied.");
      return;
    }
    if (action === "add-friend") {
      addFriend();
      return;
    }
    if (action === "refresh-friends") {
      refreshFriends();
      return;
    }
    if (action === "sign-out") {
      signOut();
      return;
    }
    if (action === "delete-account") {
      deleteAccountData();
      return;
    }
    if (action === "sync-now") {
      syncNow("manual");
      render();
      return;
    }
    if (action === "export-backup-first") {
      exportData();
      state.cloud.migrationBackupKey = `${STORAGE_KEY}:pre-v4-backup:${todayISO()}`;
      saveState({ skipSync: true });
      render();
      return;
    }
    if (action === "import-v3-cloud") {
      importLocalDataToCloud();
      render();
      return;
    }
    if (action === "dismiss-migration") {
      state.cloud.dismissedMigration = true;
      saveState({ skipSync: true });
      render();
      return;
    }
    if (action === "nutrition-section") {
      ui.nutritionSection = actionEl.dataset.section || "quick";
      render();
      return;
    }
    if (action === "select-run") {
      ui.selectedRunId = runId;
      render();
      return;
    }
    if (action === "save-run") {
      const log = ensureRunLog(runId);
      if (log.status === "planned") log.status = "completed";
      log.pace = calculatePace(log.actualDistance, log.time);
      saveState();
      render();
      return;
    }
    if (action === "move-run") {
      const movedTo = prompt("Move this run to date (YYYY-MM-DD)", todayISO());
      if (isISODate(movedTo)) {
        const log = ensureRunLog(runId);
        log.status = "moved";
        log.movedTo = movedTo;
        saveState();
        render();
      }
      return;
    }
    if (action === "start-gym") {
      startGymSession(date);
      saveState();
      render();
      return;
    }
    if (action === "finish-gym") {
      const session = state.gymLogs[date];
      if (session) session.status = "completed";
      saveState();
      render();
      return;
    }
    if (action === "move-gym") {
      const session = state.gymLogs[date] || createGymShell(date);
      const movedTo = prompt("Move this gym session to date (YYYY-MM-DD)", addDays(date, 1));
      if (isISODate(movedTo)) {
        session.status = "moved";
        session.movedTo = movedTo;
        state.gymLogs[date] = session;
        if (!state.gymLogs[movedTo]) state.gymLogs[movedTo] = { ...createGymShell(movedTo), movedFrom: date };
        saveState();
        render();
      }
      return;
    }
    if (action === "complete-set") {
      completeSet(date, exerciseId, setId);
      startRestTimer(60);
      saveState();
      render();
      return;
    }
    if (action === "undo-set") {
      undoSet(date, exerciseId, setId);
      saveState();
      render();
      return;
    }
    if (action === "complete-next-set") {
      completeNextSet(date, exerciseId);
      startRestTimer(60);
      saveState();
      render();
      return;
    }
    if (action === "add-set") {
      addSet(date, exerciseId);
      saveState();
      render();
      return;
    }
    if (action === "skip-rest") {
      stopRestTimer();
      render();
      return;
    }
    if (action === "restart-rest") {
      startRestTimer(60);
      render();
      return;
    }
    if (action === "start-stretch") {
      ensureStretchLog(date).status = "planned";
      saveState();
      render();
      return;
    }
    if (action === "toggle-stretch") {
      const log = ensureStretchLog(date);
      log.items[itemId] = !log.items[itemId];
      updateStretchStatus(log);
      saveState();
      render();
      return;
    }
    if (action === "stretch-timer") {
      const item = STRETCH_ROUTINE.find((routineItem) => routineItem.id === itemId);
      if (item) startStretchTimer(item.id, item.seconds || 60);
      render();
      return;
    }
    if (action === "stop-stretch-timer") {
      stopStretchTimer();
      render();
      return;
    }
    if (action === "complete-stretch") {
      const log = ensureStretchLog(date);
      STRETCH_ROUTINE.forEach((routineItem) => { log.items[routineItem.id] = true; });
      log.status = "completed";
      stopStretchTimer();
      saveState();
      render();
      return;
    }
    if (action === "move-stretch") {
      const log = ensureStretchLog(date);
      const movedTo = prompt("Move stretching to date (YYYY-MM-DD)", addDays(date, 1));
      if (isISODate(movedTo)) {
        log.status = "moved";
        log.movedTo = movedTo;
        ensureStretchLog(movedTo).movedFrom = date;
        saveState();
        render();
      }
      return;
    }
    if (action === "add-food") {
      addFoodFromForm();
      saveState();
      render();
      return;
    }
    if (action === "scan-barcode") {
      startBarcodeScan();
      render();
      return;
    }
    if (action === "barcode-manual") {
      ui.barcodeStatus = "Barcode lookup needs internet. Use manual entry or save the product after you have label values.";
      render();
      return;
    }
    if (action === "take-food-photo") {
      startFoodPhotoEstimate();
      render();
      return;
    }
    if (action === "confirm-photo-food") {
      confirmPhotoFood();
      saveState();
      render();
      return;
    }
    if (action === "cancel-photo-food") {
      ui.photoEstimate = null;
      render();
      return;
    }
    if (action === "add-saved-meal") {
      addSavedMeal(actionEl.dataset.mealId);
      saveState();
      render();
      return;
    }
    if (action === "copy-previous-meal") {
      copyPreviousMeal();
      saveState();
      render();
      return;
    }
    if (action === "add-preset") {
      addPresetToDay(presetId, ui.foodDate);
      saveState();
      render();
      return;
    }
    if (action === "save-preset") {
      savePresetFromForm();
      saveState();
      render();
      return;
    }
    if (action === "delete-food") {
      deleteFood(date, actionEl.dataset.entryId);
      saveState();
      render();
      return;
    }
    if (action === "delete-preset") {
      state.nutrition.presets = state.nutrition.presets.filter((preset) => preset.id !== presetId);
      saveState();
      render();
      return;
    }
    if (action === "edit-preset") {
      editPreset(presetId);
      saveState();
      render();
      return;
    }
    if (action === "log-meal-prep") {
      logMealPrep(actionEl.dataset.prepId);
      saveState();
      render();
      return;
    }
    if (action === "add-meal-prep") {
      addMealPrepFromForm();
      saveState();
      render();
      return;
    }
    if (action === "undo-meal-prep") {
      undoLastMealPrepServe(actionEl.dataset.prepId);
      saveState();
      render();
      return;
    }
    if (action === "mark-supplement") {
      markSupplement(actionEl.dataset.supplementId, date, actionEl.dataset.status);
      saveState();
      render();
      return;
    }
    if (action === "pause-supplement") {
      pauseSupplement(actionEl.dataset.supplementId);
      saveState();
      render();
      return;
    }
    if (action === "insight-feedback") {
      setInsightFeedback(actionEl.dataset.insightId, actionEl.dataset.feedback);
      saveState();
      render();
      return;
    }
    if (action === "save-targets") {
      saveTargetsFromForm();
      saveState();
      render();
      return;
    }
    if (action === "save-metrics") {
      saveMetricFromForm();
      saveState();
      render();
      return;
    }
    if (action === "delete-metric") {
      state.metrics = state.metrics.filter((metric) => metric.id !== actionEl.dataset.metricId);
      saveState();
      render();
      return;
    }
    if (action === "reset-data") {
      resetData();
      return;
    }
  }

  function handleInput(event) {
    const target = event.target;
    if (target.matches("[data-run-field]")) {
      const log = ensureRunLog(target.dataset.runId);
      log[target.dataset.runField] = target.value;
      log.pace = calculatePace(log.actualDistance, log.time);
      saveState();
      if (target.dataset.runField === "actualDistance" || target.dataset.runField === "time") {
        const pace = document.querySelector(`[data-pace-for="${target.dataset.runId}"]`);
        if (pace) pace.textContent = log.pace || "-";
      }
      return;
    }
    if (target.matches("[data-set-field]")) {
      const set = findSet(target.dataset.date, target.dataset.exerciseId, target.dataset.setId);
      if (set) set[target.dataset.setField] = target.type === "checkbox" ? target.checked : target.value;
      saveState();
      return;
    }
    if (target.matches("[data-exercise-field]")) {
      const exercise = findExercise(target.dataset.date, target.dataset.exerciseId);
      if (exercise) exercise[target.dataset.exerciseField] = target.value;
      saveState();
      return;
    }
  }

  function handleChange(event) {
    const target = event.target;
    if ((target.id === "import-file" || target.id === "import-file-settings") && target.files[0]) {
      importData(target.files[0]);
      target.value = "";
      return;
    }
    if (target.id === "gym-date") {
      ui.gymDate = target.value || todayISO();
      render();
      return;
    }
    if (target.id === "stretch-date") {
      ui.stretchDate = target.value || todayISO();
      render();
      return;
    }
    if (target.id === "food-date") {
      ui.foodDate = target.value || todayISO();
      render();
      return;
    }
    if (target.id === "profile-select") {
      state.settings.activeProfile = target.value;
      state.profiles.active = target.value;
      saveState();
      render();
      return;
    }
    if (target.id === "metric-photo" && target.files[0]) {
      readMetricPhoto(target.files[0]);
      return;
    }
    if (target.id === "food-photo-input" && target.files[0]) {
      startFoodPhotoEstimate(target.files[0]);
      target.value = "";
      render();
      return;
    }
    if (target.matches("[data-run-field]")) {
      const log = ensureRunLog(target.dataset.runId);
      log[target.dataset.runField] = target.value;
      if (target.dataset.runField === "status" && target.value === "moved" && !log.movedTo) log.movedTo = todayISO();
      log.pace = calculatePace(log.actualDistance, log.time);
      saveState();
      render();
      return;
    }
    if (target.matches("[data-session-status]")) {
      const session = state.gymLogs[target.dataset.date] || createGymShell(target.dataset.date);
      session.status = target.value;
      state.gymLogs[target.dataset.date] = session;
      saveState();
      render();
      return;
    }
    if (target.matches("[data-set-field]")) {
      const set = findSet(target.dataset.date, target.dataset.exerciseId, target.dataset.setId);
      if (set) {
        if (target.dataset.setField === "reps" && toNumber(target.value) > 50) {
          const ok = confirm(`${target.value} reps looks unusual. Save it anyway?`);
          if (!ok) {
            target.value = "";
            set.reps = "";
          } else {
            set.reps = target.value;
          }
        } else {
          set[target.dataset.setField] = target.type === "checkbox" ? target.checked : target.value;
          if (target.dataset.setField === "completed" && target.checked) {
            set.completedAt = new Date().toISOString();
            startRestTimer(60);
          }
        }
      }
      saveState();
      render();
    }
  }

  function render() {
    document.querySelectorAll(".tab").forEach((button) => button.classList.toggle("active", button.dataset.tab === ui.tab));
    let screen = "";
    if (ui.tab === "today") screen = renderToday();
    if (ui.tab === "plan") screen = renderPlan();
    if (ui.tab === "gym") screen = renderGym();
    if (ui.tab === "mobility") screen = renderMobility();
    if (ui.tab === "food") screen = renderFood();
    if (ui.tab === "metrics") screen = renderMetrics();
    if (ui.tab === "progress") {
      screen = renderProgress();
      app.innerHTML = renderUpdateBanner() + screen;
      requestAnimationFrame(drawCharts);
      updateTimerDom();
      return;
    }
    if (ui.tab === "settings") screen = renderSettings();
    app.innerHTML = renderUpdateBanner() + screen;
    updateTimerDom();
  }

  function renderUpdateBanner() {
    if (!ui.updateAvailable) return "";
    const laterUntil = Date.parse(state.settings.updateLaterUntil || "");
    if (laterUntil && laterUntil > Date.now()) return "";
    return `
      <article class="module-card update-card stack">
        <div>
          <h3>Hybrid Tracker v${APP_VERSION} is available</h3>
          <p class="subtle">A new version has been downloaded.</p>
        </div>
        <div class="actions">
          <button class="primary" data-action="update-now">Update Now</button>
          <button class="ghost" data-action="update-later">Later</button>
        </div>
      </article>
    `;
  }

  function renderToday() {
    const date = todayISO();
    const todayRuns = runsForDate(date).filter((session) => session.type !== "Rest");
    const primaryRun = todayRuns[0] || RUN_PLAN.find((session) => session.date === date);
    const gymTemplate = GYM_TEMPLATES[dayName(date)];
    const gymSession = state.gymLogs[date];
    const stretchLog = ensureStretchLog(date, false);
    const foodTotals = nutritionTotals(date);
    const targets = state.nutrition.targets;
    const weekly = weeklySummary(date);
    const backup = needsBackupReminder();
    const supplementDay = supplementStats(date);
    const insights = generateInsights(date).slice(0, 3);
    const runDone = !primaryRun || primaryRun.type === "Rest" || getRunLog(primaryRun.id).status === "completed";

    const tasks = [
      {
        title: "Today's run",
        primary: primaryRun ? primaryRun.title : "Rest",
        secondary: primaryRun ? `${formatNumber(primaryRun.distanceKm)} km - ${statusLabel(getRunLog(primaryRun.id).status)}` : "No run",
        tab: "plan",
        done: runDone
      },
      {
        title: "Today's workout",
        primary: gymTemplate ? gymTemplate.muscleGroup : "Rest",
        secondary: gymSession ? `${statusLabel(gymSession.status)} - ${formatNumber(gymSessionSummary(gymSession).volume)} kg` : "Template ready",
        tab: "gym",
        done: gymTemplate ? gymSession?.status === "completed" : true
      },
      {
        title: "Daily stretching",
        primary: "Mobility routine",
        secondary: stretchLog ? `${stretchPercent(stretchLog)}% complete - ${statusLabel(stretchLog.status)}` : "Not started",
        tab: "gym",
        done: stretchLog?.status === "completed"
      },
      {
        title: "Nutrition status",
        primary: `${formatNumber(Math.max(0, targets.calories - foodTotals.calories))} kcal left`,
        secondary: `${formatNumber(Math.max(0, targets.protein - foodTotals.protein))}g protein left`,
        tab: "food",
        done: foodTotals.calories > 0 && foodTotals.protein >= targets.protein * 0.9
      },
      {
        title: "Supplements",
        primary: `${supplementDay.taken} of ${supplementDay.planned} taken`,
        secondary: `${supplementDay.percent}% today - ${supplementStreak()} day streak`,
        tab: "settings",
        done: supplementDay.planned > 0 && supplementDay.taken >= supplementDay.planned
      }
    ].sort((a, b) => Number(a.done) - Number(b.done));

    return `
      <section class="screen">
        <article class="hero-card">
          <div class="hero-top">
            <div>
              <p class="eyebrow">${escapeHtml(formatLongDate(date))}</p>
              <h2>Dashboard</h2>
              <p class="subtle">${PROFILE.runTime} run - ${PROFILE.gymTime} lift - race ${formatShortDate(RACE_DATE)}</p>
            </div>
            <span class="badge race">${daysUntil(RACE_DATE)} days</span>
          </div>
          <div class="ring-grid">
            ${ring("Marathon", `${daysUntil(RACE_DATE)}d`, percentBetween("2026-06-15", RACE_DATE, date), "var(--blue)")}
            ${ring("Run week", `${formatNumber(weekly.completedKm)}/${formatNumber(weekly.plannedKm)}`, pct(weekly.completedKm, weekly.plannedKm), "var(--green)")}
            ${ring("Calories", `${formatNumber(Math.max(0, targets.calories - foodTotals.calories))}`, pct(foodTotals.calories, targets.calories), "var(--purple)")}
          </div>
          <div class="quick-grid">
            <button class="primary" data-action="goto" data-target="plan">Log Run</button>
            <button class="primary" data-action="goto" data-target="gym">Start Workout</button>
            <button class="secondary" data-action="goto" data-target="gym">Start Stretching</button>
            <button class="secondary" data-action="goto" data-target="food">Log Food</button>
            <button class="ghost" data-action="goto" data-target="settings">Add Body Metrics</button>
            <button class="ghost" data-action="sync-now">Sync Now</button>
          </div>
        </article>
        ${renderSyncStatusCard()}
        ${renderMigrationPrompt()}
        ${backup ? renderBackupReminder() : ""}
        <div class="grid-2">
          ${tasks.map((task) => todayModule(task)).join("")}
        </div>
        ${renderSupplementsSummary(date)}
        ${renderInsightsPanel(insights)}
        <article class="module-card stack">
          <div class="row-head">
            <h3>Weekly load</h3>
            <span class="badge">Week ${weekNumberForDate(date)}</span>
          </div>
          <div class="grid-2">
            <div class="mini-stat"><span>Planned km</span><strong>${formatNumber(weekly.plannedKm)}</strong></div>
            <div class="mini-stat"><span>Completed km</span><strong>${formatNumber(weekly.completedKm)}</strong></div>
            <div class="mini-stat"><span>Gym volume</span><strong>${formatNumber(weekly.gymVolume)} kg</strong></div>
            <div class="mini-stat"><span>Gym done</span><strong>${weekly.gymDone}/${weekly.gymPlanned}</strong></div>
          </div>
        </article>
      </section>
    `;
  }

  function todayModule(task) {
    return `
      <article class="module-card stack ${task.done ? "task-complete" : ""}">
        <div>
          <p class="eyebrow">${task.done ? "Done" : "Today"}</p>
          <h3>${task.done ? "Done: " : ""}${escapeHtml(task.primary)}</h3>
          <p class="subtle">${escapeHtml(task.title)} - ${escapeHtml(task.secondary)}</p>
        </div>
        <button class="${task.done ? "secondary" : "primary"}" data-action="goto" data-target="${task.tab}">${task.done ? "Completed" : "Open"}</button>
      </article>
    `;
  }

  function renderBackupReminder() {
    const cloudText = state.auth.user
      ? "Cloud sync is active. A portable JSON backup has not been exported in 7 days."
      : "It has been more than 7 days since your last portable JSON export.";
    return `
      <article class="module-card stack">
        <div class="row-head">
          <div>
            <h3>Backup reminder</h3>
            <p class="subtle">${escapeHtml(cloudText)}</p>
          </div>
          <span class="badge tempo">7d</span>
        </div>
        <div class="actions">
          <button class="primary" data-action="export-data">Export JSON</button>
          <button class="ghost" data-action="dismiss-backup">Dismiss today</button>
        </div>
      </article>
    `;
  }

  function renderSyncStatusCard() {
    const status = syncStatusLabel();
    const detail = state.cloud.lastSyncAt ? `Last sync ${new Date(state.cloud.lastSyncAt).toLocaleString()}` : "Local changes are kept on this device until an account is connected.";
    return `
      <article class="module-card compact-card">
        <div>
          <p class="eyebrow">Cloud sync</p>
          <h3>${escapeHtml(status)}</h3>
          <p class="subtle">${escapeHtml(state.cloud.lastError || detail)}</p>
        </div>
        <button class="secondary" data-action="sync-now">Sync Now</button>
      </article>
    `;
  }

  function renderMigrationPrompt() {
    if (!state.auth.user || state.cloud.v3ImportStatus === "imported" || state.cloud.dismissedMigration) return "";
    if (!["found", "ready"].includes(state.cloud.v3ImportStatus)) return "";
    return `
      <article class="module-card stack">
        <div>
          <h3>Existing Hybrid Tracker data was found on this device.</h3>
          <p class="subtle">Import it into your cloud account? A local backup is created first and repeated imports are ignored.</p>
        </div>
        <div class="actions">
          <button class="primary" data-action="import-v3-cloud">Import and Sync</button>
          <button class="secondary" data-action="export-backup-first">Export Backup First</button>
          <button class="ghost" data-action="dismiss-migration">Not Now</button>
        </div>
      </article>
    `;
  }

  function renderSupplementsSummary(date) {
    const stats = supplementStats(date);
    return `
      <article class="module-card stack">
        <div class="row-head">
          <div>
            <h3>Supplements</h3>
            <p class="subtle">${stats.taken} of ${stats.planned} taken - 7 day adherence ${supplementAdherence(7)}%</p>
          </div>
          <span class="badge ${stats.percent === 100 ? "completed" : ""}">${stats.percent}%</span>
        </div>
        <div class="day-list">
          ${activeSupplements().slice(0, 4).map((item) => renderSupplementRow(item, date)).join("")}
        </div>
      </article>
    `;
  }

  function renderSupplementRow(item, date) {
    const taken = supplementStatus(item.id, date) === "taken";
    return `
      <div class="day-item ${taken ? "set-complete" : ""}">
        <span class="day-date">${taken ? "Taken" : "Plan"}</span>
        <span><strong>${escapeHtml(item.name)}</strong><br><span class="subtle">${escapeHtml(item.dose)} ${escapeHtml(item.unit)} - ${escapeHtml(item.preferredTime || item.schedule)}</span></span>
        <span class="actions">
          <button class="${taken ? "secondary" : "primary"}" data-action="mark-supplement" data-supplement-id="${item.id}" data-date="${date}" data-status="taken">${taken ? "Taken" : "Take"}</button>
          <button class="ghost" data-action="mark-supplement" data-supplement-id="${item.id}" data-date="${date}" data-status="skipped">Skip</button>
        </span>
      </div>
    `;
  }

  function renderInsightsPanel(insights) {
    if (!insights.length) return "";
    return `
      <article class="module-card stack">
        <div class="row-head">
          <div>
            <h3>Insights</h3>
            <p class="subtle">Transparent notes from your logged training, nutrition and recovery data.</p>
          </div>
          <span class="badge">Local</span>
        </div>
        <div class="day-list">
          ${insights.map(renderInsightRow).join("")}
        </div>
      </article>
    `;
  }

  function renderInsightRow(insight) {
    return `
      <div class="insight-row">
        <div>
          <strong>${escapeHtml(insight.title)}</strong>
          <p class="subtle">${escapeHtml(insight.body)}</p>
          <p class="subtle">Based on: ${escapeHtml(insight.basis)}</p>
        </div>
        <div class="actions">
          <button class="ghost" data-action="insight-feedback" data-insight-id="${insight.id}" data-feedback="helpful">Helpful</button>
          <button class="ghost" data-action="insight-feedback" data-insight-id="${insight.id}" data-feedback="dismiss">Dismiss</button>
        </div>
      </div>
    `;
  }

  function renderPlan() {
    const selected = RUN_PLAN.find((session) => session.id === ui.selectedRunId) || runsForDate(todayISO()).find((session) => session.type !== "Rest");
    return `
      <section class="screen">
        <div class="section-title">
          <div>
            <h2>Runna plan</h2>
            <p>V2 plan with moved, skipped, completed and planned statuses.</p>
          </div>
        </div>
        ${selected ? renderRunCard(selected) : ""}
        ${PLAN_WEEKS.map((week) => renderWeek(week)).join("")}
      </section>
    `;
  }

  function renderWeek(week) {
    const sessions = RUN_PLAN.filter((session) => session.week === week.week);
    const plannedKm = sessions.reduce((sum, session) => sum + session.distanceKm, 0);
    const completedKm = sessions.reduce((sum, session) => sum + toNumber(getRunLog(session.id).actualDistance), 0);
    return `
      <article class="module-card stack">
        <div class="row-head">
          <div>
            <h3>Week ${week.week}</h3>
            <p class="subtle">${formatShortDate(week.start)} - ${formatShortDate(addDays(week.start, 6))}</p>
          </div>
          <span class="badge long">${formatNumber(completedKm)} / ${formatNumber(plannedKm)} km</span>
        </div>
        <div class="day-list">
          ${sessions.map(renderRunRow).join("")}
        </div>
      </article>
    `;
  }

  function renderRunRow(session) {
    const log = getRunLog(session.id);
    const statusClass = log.status === "completed" ? "completed" : log.status === "skipped" ? "skipped" : log.status === "moved" ? "moved" : badgeClass(session.type);
    const detail = log.status === "moved" && log.movedTo ? `Moved to ${formatShortDate(log.movedTo)}` : `${formatNumber(session.distanceKm)} km`;
    return `
      <button class="day-item" data-action="select-run" data-run-id="${session.id}">
        <span class="day-date">${session.day.slice(0, 3)}<br>${formatShortDate(session.date)}</span>
        <span><strong>${escapeHtml(session.title)}</strong><br><span class="subtle">${escapeHtml(detail)}</span></span>
        <span class="badge ${statusClass}">${escapeHtml(statusLabel(log.status || session.type))}</span>
      </button>
    `;
  }

  function renderRunCard(session) {
    const log = getRunLog(session.id);
    return `
      <article class="module-card stack">
        <div class="row-head">
          <div>
            <p class="eyebrow">${escapeHtml(session.day)} - ${formatLongDate(session.date)}</p>
            <h3>${escapeHtml(session.title)}</h3>
            <p class="subtle">${escapeHtml(session.type)} - planned ${formatNumber(session.distanceKm)} km ${log.movedTo ? `- moved to ${formatShortDate(log.movedTo)}` : ""}</p>
          </div>
          <span class="badge ${badgeClass(session.type)}">${escapeHtml(session.type)}</span>
        </div>
        <div class="form-grid">
          <div class="field">
            <label>Status</label>
            <select data-run-id="${session.id}" data-run-field="status">
              ${statusOptions(log.status)}
            </select>
          </div>
          <div class="field">
            <label>Moved to</label>
            <input type="date" value="${escapeAttr(log.movedTo || "")}" data-run-id="${session.id}" data-run-field="movedTo">
          </div>
          <div class="field">
            <label>Actual km</label>
            <input inputmode="decimal" type="number" step="0.01" min="0" value="${escapeAttr(log.actualDistance)}" data-run-id="${session.id}" data-run-field="actualDistance">
          </div>
          <div class="field">
            <label>Time</label>
            <input placeholder="HH:MM:SS" value="${escapeAttr(log.time)}" data-run-id="${session.id}" data-run-field="time">
          </div>
          <div class="field">
            <label>Pace</label>
            <input readonly value="${escapeAttr(log.pace)}" data-pace-for="${session.id}">
          </div>
          <div class="field full">
            <label>Notes</label>
            <textarea data-run-id="${session.id}" data-run-field="notes">${escapeHtml(log.notes)}</textarea>
          </div>
        </div>
        <div class="actions">
          <button class="primary" data-action="save-run" data-run-id="${session.id}">Save Run</button>
          <button class="secondary" data-action="move-run" data-run-id="${session.id}">Move</button>
        </div>
      </article>
    `;
  }

  function renderGym() {
    const date = ui.gymDate;
    const session = state.gymLogs[date];
    const template = GYM_TEMPLATES[dayName(date)];
    return `
      <section class="screen">
        <div class="section-title">
          <div>
            <h2>Workouts</h2>
            <p>Hybrid Athlete strength, hypertrophy, durability and injury prevention.</p>
          </div>
        </div>
        ${renderRestTimer()}
        <article class="module-card stack">
          <div class="field">
            <label>Date</label>
            <input id="gym-date" class="date-input" type="date" value="${date}">
          </div>
          <div class="badge-row">
            ${DAY_ORDER.map((day) => `<span class="badge ${day === dayName(date) ? "long" : ""}">${day.slice(0, 3)} ${GYM_TEMPLATES[day]?.muscleGroup || "Rest"}</span>`).join("")}
          </div>
          <p class="subtle">${escapeHtml(rotationNote(date))}</p>
        </article>
        ${template || session ? renderGymSession(date, template, session) : `<div class="empty">Rest day. No gym template scheduled.</div>`}
        ${renderMobilityPanel(date)}
      </section>
    `;
  }

  function renderMobilityPanel(date) {
    const log = ensureStretchLog(date, false);
    return `
      <article class="module-card stack">
        <div class="row-head">
          <div>
            <h3>Daily stretching</h3>
            <p class="subtle">${stretchPercent(log)}% complete - streak ${stretchStreak()} days</p>
          </div>
          <span class="badge ${log?.status === "completed" ? "completed" : ""}">${statusLabel(log?.status || "planned")}</span>
        </div>
        <div class="actions">
          <button class="primary" data-action="start-stretch" data-date="${date}">Start Stretching</button>
          <button class="secondary" data-action="complete-stretch" data-date="${date}">Mark Complete</button>
        </div>
        <div class="day-list">
          ${STRETCH_ROUTINE.map((item) => renderStretchItem(date, log, item)).join("")}
        </div>
      </article>
    `;
  }

  function renderGymSession(date, template, session) {
    if (!session) {
      return `
        <article class="module-card stack">
          <div class="row-head">
            <div>
              <h3>${escapeHtml(dayName(date))}: ${escapeHtml(template.muscleGroup)}</h3>
              <p class="subtle">${PROFILE.gymTime} at ${PROFILE.location}</p>
            </div>
            <span class="badge">Ready</span>
          </div>
          <div class="day-list">
            ${template.exercises.map((exercise) => `<div class="day-item"><span class="day-date">${exercise.optional ? "Opt" : "Main"}</span><span><strong>${escapeHtml(exercise.name)}</strong><br><span class="subtle">${exercise.sets} x ${escapeHtml(exercise.reps)}</span></span><span class="badge">${escapeHtml(exercise.muscleGroup)}</span></div>`).join("")}
          </div>
          <button class="primary" data-action="start-gym" data-date="${date}">Start Workout</button>
        </article>
      `;
    }
    const summary = gymSessionSummary(session);
    const inProgress = session.startedAt && session.status !== "completed";
    return `
      <article class="module-card stack">
        <div class="row-head">
          <div>
            <h3>${escapeHtml(session.day)}: ${escapeHtml(session.muscleGroup)}</h3>
            <p class="subtle">${session.movedFrom ? `Moved from ${formatShortDate(session.movedFrom)}. ` : ""}${session.movedTo ? `Moved to ${formatShortDate(session.movedTo)}. ` : ""}Session volume ${formatNumber(summary.volume)} kg.${inProgress ? ` Elapsed ${workoutElapsed(session)}.` : ""}</p>
          </div>
          <span class="badge ${session.status}">${statusLabel(session.status)}</span>
        </div>
        <div class="form-grid">
          <div class="field">
            <label>Status</label>
            <select data-session-status data-date="${date}">
              ${statusOptions(session.status)}
            </select>
          </div>
          <div class="field">
            <label>Volume</label>
            <input readonly value="${formatNumber(summary.volume)} kg">
          </div>
          <div class="field">
            <label>Completed sets</label>
            <input readonly value="${summary.completedSets}/${summary.totalSets}">
          </div>
        </div>
        <div class="actions">
          <button class="primary" data-action="start-gym" data-date="${date}">${session.startedAt ? "Resume Workout" : "Start Workout"}</button>
          <button class="primary" data-action="finish-gym" data-date="${date}">Finish Workout</button>
          <button class="secondary" data-action="move-gym" data-date="${date}">Move</button>
        </div>
      </article>
      ${session.exercises.map((exercise) => renderExercise(date, exercise)).join("")}
    `;
  }

  function renderExercise(date, exercise) {
    const stats = exerciseStats(exercise);
    return `
      <article class="exercise-card">
        <div class="row-head">
          <div>
            <input class="exercise-name-input" value="${escapeAttr(exercise.name)}" data-date="${date}" data-exercise-id="${exercise.id}" data-exercise-field="name">
            <p class="subtle">${escapeHtml(exercise.prescribedSets)} x ${escapeHtml(exercise.prescribedReps)} - ${escapeHtml(exercise.muscleGroup)}${exercise.optional ? " - optional" : ""}</p>
          </div>
          <span class="badge">${formatNumber(stats.e1rm)} kg estimated max</span>
        </div>
        <div class="grid-3">
          <div class="mini-stat"><span>Volume</span><strong>${formatNumber(stats.volume)}</strong></div>
          <div class="mini-stat"><span>Sets</span><strong>${stats.completedSets}/${exercise.sets.length}</strong></div>
          <div class="mini-stat"><span>Best</span><strong>${escapeHtml(stats.bestSet || "-")}</strong></div>
        </div>
        ${renderExerciseDemo(exercise.name)}
        <div class="set-list">
          ${exercise.sets.map((set, index) => renderSet(date, exercise, set, index)).join("")}
        </div>
        <div class="field full">
          <label>Exercise notes</label>
          <textarea data-date="${date}" data-exercise-id="${exercise.id}" data-exercise-field="notes">${escapeHtml(exercise.notes || "")}</textarea>
        </div>
        <div class="actions">
          <button class="primary" data-action="complete-next-set" data-date="${date}" data-exercise-id="${exercise.id}">Complete Set</button>
          <button class="secondary" data-action="add-set" data-date="${date}" data-exercise-id="${exercise.id}">Add Set</button>
        </div>
      </article>
    `;
  }

  function renderExerciseDemo(name) {
    const info = exerciseInfo(name);
    return `
      <div class="video-card">
        <div class="video-thumb">Play</div>
        <div>
          <strong>Technique notes</strong>
          <p class="subtle">${escapeHtml(info.notes)}</p>
          <p class="subtle"><strong>Cues:</strong> ${info.cues.map(escapeHtml).join(", ")}</p>
          <p class="subtle"><strong>Common mistakes:</strong> ${info.mistakes.map(escapeHtml).join(", ")}</p>
          <a class="secondary" href="${youtubeSearchUrl(info.query || name)}" target="_blank" rel="noopener">Watch Demo</a>
        </div>
      </div>
    `;
  }

  function renderSet(date, exercise, set, index) {
    const previous = previousSetText(date, exercise.name, index);
    const completed = Boolean(set.completed);
    return `
      <div class="set-row mobile-set ${completed ? "set-complete" : ""}">
        <div class="set-head">
          <strong>Set ${index + 1}</strong>
          <span class="previous">${escapeHtml(previous || "Previous: no matching set yet")}</span>
        </div>
        <div class="form-grid">
          <div class="field">
            <label>Weight</label>
            <input inputmode="decimal" type="number" step="0.5" min="0" value="${escapeAttr(set.weight)}" data-date="${date}" data-exercise-id="${exercise.id}" data-set-id="${set.id}" data-set-field="weight">
          </div>
          <div class="field">
            <label>Reps</label>
            <input inputmode="decimal" value="${escapeAttr(set.reps)}" data-date="${date}" data-exercise-id="${exercise.id}" data-set-id="${set.id}" data-set-field="reps">
          </div>
        </div>
        <div class="field">
          <label>Notes</label>
          <input value="${escapeAttr(set.notes || "")}" data-date="${date}" data-exercise-id="${exercise.id}" data-set-id="${set.id}" data-set-field="notes">
        </div>
        <button class="${completed ? "secondary" : "primary"}" data-action="${completed ? "undo-set" : "complete-set"}" data-date="${date}" data-exercise-id="${exercise.id}" data-set-id="${set.id}">${completed ? "Completed - Undo" : "Complete Set"}</button>
      </div>
    `;
  }

  function renderRestTimer() {
    const remaining = getRestRemaining();
    if (!remaining && !state.settings.timerMessage) return "";
    return `
      <article class="timer-card">
        <div class="timer-number" id="rest-timer">${remaining || "OK"}</div>
        <div>
          <strong>${escapeHtml(state.settings.timerMessage || "Rest timer")}</strong>
          <p class="subtle">${remaining ? "Next set in progress. Breathe, sip, reload." : "Lightweight! Timer complete."}</p>
        </div>
        <div class="actions">
          <button class="ghost" data-action="restart-rest">Restart</button>
          <button class="ghost" data-action="skip-rest">Skip</button>
        </div>
      </article>
    `;
  }

  function renderMobility() {
    const date = ui.stretchDate;
    const log = ensureStretchLog(date, false);
    const percentDone = stretchPercent(log);
    return `
      <section class="screen">
        <div class="section-title">
          <div>
            <h2>Mobility</h2>
            <p>Daily tissue maintenance. Streak: ${stretchStreak()} days.</p>
          </div>
        </div>
        <article class="module-card stack">
          <div class="field">
            <label>Date</label>
            <input id="stretch-date" type="date" value="${date}">
          </div>
          <div class="ring-grid">
            ${ring("Complete", `${percentDone}%`, percentDone, "var(--green)")}
            ${ring("Streak", `${stretchStreak()}d`, Math.min(100, stretchStreak() * 10), "var(--purple)")}
          </div>
          <div class="actions">
            <button class="primary" data-action="start-stretch" data-date="${date}">Start Routine</button>
            <button class="secondary" data-action="complete-stretch" data-date="${date}">Mark Complete</button>
            <button class="ghost" data-action="move-stretch" data-date="${date}">Move</button>
          </div>
        </article>
        ${renderStretchTimer()}
        <article class="module-card stack">
          <div class="row-head">
            <h3>Routine</h3>
            <span class="badge ${log?.status || "planned"}">${statusLabel(log?.status || "planned")}</span>
          </div>
          <div class="day-list">
            ${STRETCH_ROUTINE.map((item) => renderStretchItem(date, log, item)).join("")}
          </div>
        </article>
      </section>
    `;
  }

  function renderStretchItem(date, log, item) {
    const done = Boolean(log?.items?.[item.id]);
    return `
      <div class="day-item">
        <span class="day-date">${done ? "Done" : "Todo"}</span>
        <span><strong>${escapeHtml(item.name)}</strong><br><span class="subtle">${item.seconds ? `${item.seconds} sec` : escapeHtml(item.detail)} ${item.seconds && item.detail ? `- ${escapeHtml(item.detail)}` : ""}</span></span>
        <span class="actions">
          ${item.seconds ? `<button class="ghost" data-action="stretch-timer" data-item-id="${item.id}">Timer</button>` : ""}
          <button class="${done ? "secondary" : "primary"}" data-action="toggle-stretch" data-date="${date}" data-item-id="${item.id}">${done ? "Undo" : "Done"}</button>
        </span>
      </div>
    `;
  }

  function renderStretchTimer() {
    if (!stretchTimer.remaining) return "";
    const item = STRETCH_ROUTINE.find((routineItem) => routineItem.id === stretchTimer.itemId);
    return `
      <article class="timer-card">
        <div class="timer-number" id="stretch-timer">${stretchTimer.remaining}</div>
        <div>
          <strong>${escapeHtml(item?.name || "Stretch timer")}</strong>
          <p class="subtle">Hold position and keep breathing.</p>
        </div>
        <button class="ghost" data-action="stop-stretch-timer">Stop</button>
      </article>
    `;
  }

  function renderFood() {
    const date = ui.foodDate;
    const totals = nutritionTotals(date);
    const targets = state.nutrition.targets;
    const entries = foodEntries(date);
    return `
      <section class="screen">
        <div class="section-title">
          <div>
            <h2>Nutrition</h2>
            <p>Consumed, remaining, and fast logging.</p>
          </div>
        </div>
        <article class="module-card stack">
          <div class="field">
            <label>Date</label>
            <input id="food-date" type="date" value="${date}">
          </div>
          <div class="ring-grid">
            ${nutritionRing("Calories", totals.calories, targets.calories, "", "var(--blue)")}
            ${nutritionRing("Protein", totals.protein, targets.protein, "g", "var(--green)")}
            ${nutritionRing("Carbs", totals.carbs, targets.carbs, "g", "var(--purple)")}
          </div>
          ${macroBar("Fat", totals.fat, targets.fat)}
          ${macroBar("Fibre", totals.fibre, targets.fibre)}
          ${targets.caffeine ? macroBar("Caffeine", totals.caffeine, targets.caffeine) : ""}
        </article>
        ${renderNutritionActions()}
        <article class="module-card stack">
          <h3>Add food</h3>
          ${foodForm()}
          <div class="actions">
            <button class="primary" data-action="add-food">Log Food</button>
            <button class="secondary" data-action="save-preset">Save As Preset</button>
          </div>
        </article>
        ${renderNutritionQuickSections()}
        ${renderMealPrep(date)}
        ${renderNutritionTools(totals, targets)}
        <article class="module-card stack">
          <h3>Daily meal timeline</h3>
          ${entries.length ? renderMealTimeline(date, entries) : `<div class="empty">No food logged for this date.</div>`}
        </article>
        <article class="module-card stack">
          <h3>Editable targets</h3>
          <div class="form-grid" id="target-form">
            ${targetInput("calories", "Calories", targets.calories)}
            ${targetInput("protein", "Protein g", targets.protein)}
            ${targetInput("carbs", "Carbs g", targets.carbs)}
            ${targetInput("fat", "Fat g", targets.fat)}
            ${targetInput("fibre", "Fibre g", targets.fibre)}
            ${targetInput("caffeine", "Caffeine mg", targets.caffeine || 0)}
          </div>
          <button class="primary" data-action="save-targets">Save Targets</button>
        </article>
      </section>
    `;
  }

  function nutritionRing(label, value, target, unit, color) {
    const remaining = Math.max(0, toNumber(target) - toNumber(value));
    return `
      <div class="nutrition-ring">
        ${ring(label, `${formatNumber(value)}/${formatNumber(target)}${unit}`, pct(value, target), color)}
        <p class="subtle">${formatNumber(remaining)}${unit} remaining</p>
      </div>
    `;
  }

  function renderNutritionActions() {
    return `
      <article class="module-card stack">
        <div class="quick-grid">
          <button class="primary" data-action="add-food">Add Food</button>
          <button class="secondary" data-action="scan-barcode">Scan Barcode</button>
          <label class="secondary icon-button file-action">Take Food Photo<input class="sr-only" id="food-photo-input" type="file" accept="image/*" capture="environment"></label>
          <button class="secondary" data-action="nutrition-section" data-section="saved">Add Saved Meal</button>
          <button class="ghost" data-action="copy-previous-meal">Copy Previous Meal</button>
        </div>
        ${ui.barcodeStatus ? `<p class="subtle">${escapeHtml(ui.barcodeStatus)}</p>` : ""}
        ${renderPhotoEstimate()}
      </article>
    `;
  }

  function renderPhotoEstimate() {
    if (!ui.photoEstimate) {
      return `<p class="subtle">Photo-based nutrition is an estimate. Confirm foods and portions before logging.</p>`;
    }
    return `
      <div class="estimate-card stack">
        <strong>Photo estimate waiting for confirmation</strong>
        <p class="subtle">Photo-based nutrition is an estimate. Confirm foods and portions before logging.</p>
        <div class="day-list">
          ${ui.photoEstimate.items.map((item) => `<div class="food-row"><span><strong>${escapeHtml(item.name)}</strong><br><span class="subtle">Estimated ${escapeHtml(item.portion)} - ${formatNumber(item.calories)} kcal, ${formatNumber(item.protein)}g protein</span></span><span class="badge">${Math.round(item.confidence * 100)}%</span></div>`).join("")}
        </div>
        <div class="actions">
          <button class="primary" data-action="confirm-photo-food">Confirm and Log</button>
          <button class="secondary" data-action="take-food-photo">Retake Photo</button>
          <button class="ghost" data-action="cancel-photo-food">Cancel</button>
        </div>
      </div>
    `;
  }

  function renderNutritionQuickSections() {
    const section = ui.nutritionSection || "quick";
    return `
      <article class="module-card stack">
        <div class="segmented wrap">
          ${nutritionSectionButton("quick", "Frequently Eaten", section)}
          ${nutritionSectionButton("recent", "Recent", section)}
          ${nutritionSectionButton("saved", "Saved Meals", section)}
          ${nutritionSectionButton("foods", "Foods", section)}
          ${nutritionSectionButton("recipes", "Recipes", section)}
        </div>
        ${renderNutritionSection(section)}
      </article>
    `;
  }

  function nutritionSectionButton(key, label, current) {
    return `<button class="${key === current ? "primary" : "ghost"}" data-action="nutrition-section" data-section="${key}">${escapeHtml(label)}</button>`;
  }

  function renderNutritionSection(section) {
    if (section === "saved") return renderSavedMeals();
    if (section === "recipes") return renderRecipes();
    if (section === "recent") return renderPresetList(recentFoods(), "Recent");
    if (section === "foods") return renderPresetList(state.nutrition.foods || state.nutrition.presets, "Foods");
    return renderPresetList(frequentlyEatenFoods(), "Frequently Eaten");
  }

  function renderPresetList(items, label) {
    const list = (items && items.length ? items : state.nutrition.presets).slice(0, 12);
    return `
      <div class="stack">
        <div class="row-head">
          <h3>${escapeHtml(label)}</h3>
          <span class="badge">${list.length}</span>
        </div>
        <div class="preset-grid">
          ${list.map((preset) => `<button class="ghost" data-action="add-preset" data-preset-id="${preset.id}">${escapeHtml(preset.name)}</button>`).join("")}
        </div>
        <div class="day-list">
          ${list.slice(0, 6).map((preset) => `<div class="food-row"><span><strong>${escapeHtml(preset.name)}</strong><br><span class="subtle">${formatNumber(preset.calories)} kcal - ${formatNumber(preset.protein)}g protein${preset.estimated ? " - Estimated nutrition" : ""}</span></span><span class="actions"><button class="ghost" data-action="edit-preset" data-preset-id="${preset.id}">Edit</button><button class="ghost" data-action="delete-preset" data-preset-id="${preset.id}">Delete</button></span></div>`).join("")}
        </div>
      </div>
    `;
  }

  function renderSavedMeals() {
    const meals = state.nutrition.savedMeals || [];
    return `
      <div class="day-list">
        ${meals.map((meal) => `<div class="food-row"><span><strong>${escapeHtml(meal.name)}</strong><br><span class="subtle">${formatNumber(meal.calories)} kcal - ${formatNumber(meal.protein)}g protein</span></span><button class="primary" data-action="add-saved-meal" data-meal-id="${meal.id}">Log Meal</button></div>`).join("") || `<div class="empty">No saved meals yet.</div>`}
      </div>
    `;
  }

  function renderRecipes() {
    const recipes = state.nutrition.recipes || [];
    return `
      <div class="day-list">
        ${recipes.map((recipe) => `<div class="food-row"><span><strong>${escapeHtml(recipe.name)}</strong><br><span class="subtle">${formatNumber(recipe.calories)} kcal - ${formatNumber(recipe.protein)}g protein - ${escapeHtml(recipe.notes || "Recipe")}</span></span><span class="badge">Recipe</span></div>`).join("") || `<div class="empty">No recipes yet.</div>`}
      </div>
    `;
  }

  function renderMealTimeline(date, entries) {
    const meals = ["Breakfast", "Lunch", "Dinner", "Snacks"];
    return meals.map((meal) => {
      const items = entries.filter((entry) => (entry.meal || "Snacks") === meal);
      const totals = items.reduce((sum, item) => ({ calories: sum.calories + toNumber(item.calories), protein: sum.protein + toNumber(item.protein) }), { calories: 0, protein: 0 });
      return `
        <div class="meal-group">
          <div class="row-head">
            <h4>${meal}</h4>
            <span class="badge">${formatNumber(totals.calories)} kcal / ${formatNumber(totals.protein)}g protein</span>
          </div>
          <div class="food-list">
            ${items.length ? items.map((entry) => renderFoodRow(date, entry)).join("") : `<div class="empty small">Nothing logged.</div>`}
          </div>
        </div>
      `;
    }).join("");
  }

  function foodForm() {
    return `
      <div class="form-grid" id="food-form">
        ${foodInput("name", "Food", "text", "")}
        <div class="field">
          <label>Meal</label>
          <select data-food-input="meal">
            <option>Breakfast</option>
            <option>Lunch</option>
            <option>Dinner</option>
            <option selected>Snacks</option>
          </select>
        </div>
        ${foodInput("calories", "Calories", "number", "")}
        ${foodInput("protein", "Protein g", "number", "")}
        ${foodInput("carbs", "Carbs g", "number", "")}
        ${foodInput("fat", "Fat g", "number", "")}
        ${foodInput("fibre", "Fibre g", "number", "")}
        ${foodInput("caffeine", "Caffeine mg", "number", "")}
      </div>
    `;
  }

  function foodInput(name, label, type, value) {
    return `<div class="field"><label>${label}</label><input data-food-input="${name}" type="${type}" step="0.1" value="${escapeAttr(value)}"></div>`;
  }

  function targetInput(name, label, value) {
    return `<div class="field"><label>${label}</label><input data-target-input="${name}" type="number" step="1" value="${escapeAttr(value)}"></div>`;
  }

  function renderFoodRow(date, entry) {
    return `
      <div class="food-row">
        <span><strong>${escapeHtml(entry.name)}</strong><br><span class="subtle">${formatNumber(entry.calories)} kcal - P ${formatNumber(entry.protein)} / C ${formatNumber(entry.carbs)} / F ${formatNumber(entry.fat)} / fibre ${formatNumber(entry.fibre)}${entry.estimated ? " - Estimated nutrition" : ""}</span></span>
        <button class="ghost" data-action="delete-food" data-date="${date}" data-entry-id="${entry.id}">Delete</button>
      </div>
    `;
  }

  function renderMealPrep(date) {
    const batches = state.nutrition.mealPrep || [];
    return `
      <article class="module-card stack">
        <div class="row-head">
          <h3>Meal prep</h3>
          <span class="badge">Batch recipes</span>
        </div>
        <div class="day-list">
          ${batches.map((batch) => `
            <div class="food-row">
              <span><strong>${escapeHtml(batch.name)}</strong><br><span class="subtle">Made ${formatShortDate(batch.madeDate)} - ${batch.servesRemaining}/${batch.totalServes} serves left - ${formatNumber(batch.calories)} kcal, ${formatNumber(batch.protein)}g protein per serve</span></span>
              <span class="actions">
                <button class="primary" data-action="log-meal-prep" data-prep-id="${batch.id}" data-date="${date}">Log Serve</button>
                <button class="ghost" data-action="undo-meal-prep" data-prep-id="${batch.id}">Undo</button>
              </span>
            </div>
          `).join("")}
        </div>
        <div class="form-grid" id="meal-prep-form">
          ${foodInput("prepName", "Meal name", "text", "")}
          ${foodInput("prepServes", "Total serves", "number", "")}
          ${foodInput("prepCalories", "Calories per serve", "number", "")}
          ${foodInput("prepProtein", "Protein per serve", "number", "")}
          ${foodInput("prepCarbs", "Carbs per serve", "number", "")}
          ${foodInput("prepFat", "Fat per serve", "number", "")}
        </div>
        <button class="secondary" data-action="add-meal-prep">Save Meal Prep</button>
      </article>
    `;
  }

  function renderNutritionTools(totals, targets) {
    const proteinGap = Math.max(0, targets.protein - totals.protein);
    const calorieGap = Math.max(0, targets.calories - totals.calories);
    const suggestion = proteinGap > 25 ? "WPI Protein Shake with 300 mL milk" : calorieGap > 400 ? "Beef Stew" : "Pink Lady Apple";
    return `
      <article class="module-card stack">
        <h3>Food tools</h3>
        <div class="grid-2">
          <div class="mini-stat"><span>Foods</span><strong>${state.nutrition.presets.length}</strong></div>
          <div class="mini-stat"><span>Suggestion</span><strong>${escapeHtml(suggestion)}</strong></div>
          <div class="mini-stat"><span>Recipes</span><strong>${(state.nutrition.recipes || []).length}</strong></div>
          <div class="mini-stat"><span>Meal prep</span><strong>${(state.nutrition.mealPrep || []).length}</strong></div>
        </div>
        <p class="subtle">Barcode lookup uses cloud/Open Food Facts when available. Photo logging always requires review before anything is saved.</p>
      </article>
    `;
  }

  function macroBar(label, value, target) {
    return `
      <div class="stack">
        <div class="row-head"><span class="subtle">${escapeHtml(label)}</span><strong>${formatNumber(value)} / ${formatNumber(target)}</strong></div>
        <div class="progress-bar"><span style="--pct:${pct(value, target)}%"></span></div>
      </div>
    `;
  }

  function renderMetrics() {
    const latest = latestMetric();
    const recent = [...state.metrics].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10);
    return `
      <section class="screen">
        <div class="section-title">
          <div>
            <h2>Body metrics</h2>
            <p>Bodyweight, measurements, sleep, soreness, fatigue and notes.</p>
          </div>
        </div>
        <article class="module-card stack">
          <div class="form-grid" id="metric-form">
            ${metricInput("date", "Date", "date", todayISO())}
            ${metricInput("bodyweight", "Bodyweight kg", "number", latest.bodyweight || PROFILE.bodyweightKg)}
            ${metricInput("waist", "Waist cm", "number", latest.waist || "")}
            ${metricInput("chest", "Chest cm", "number", latest.chest || "")}
            ${metricInput("arm", "Arm cm", "number", latest.arm || "")}
            ${metricInput("thigh", "Thigh cm", "number", latest.thigh || "")}
            ${metricInput("sleepHours", "Sleep hours", "number", latest.sleepHours || "")}
            ${metricInput("soreness", "Soreness 1-10", "number", latest.soreness || "")}
            ${metricInput("fatigue", "Fatigue 1-10", "number", latest.fatigue || "")}
            <div class="field full"><label>Daily notes</label><textarea data-metric-input="notes">${escapeHtml(latest.notes || "")}</textarea></div>
            <div class="field full"><label>Progress photo</label><input id="metric-photo" type="file" accept="image/*"></div>
          </div>
          <button class="primary" data-action="save-metrics">Save Metrics</button>
        </article>
        <article class="module-card stack">
          <h3>Recent metrics</h3>
          ${recent.map(renderMetricRow).join("")}
        </article>
      </section>
    `;
  }

  function metricInput(name, label, type, value) {
    return `<div class="field"><label>${label}</label><input data-metric-input="${name}" type="${type}" step="0.1" value="${escapeAttr(value)}"></div>`;
  }

  function renderMetricRow(metric) {
    return `
      <div class="food-row">
        <span><strong>${formatLongDate(metric.date)}</strong><br><span class="subtle">${metric.bodyweight || "-"} kg - sleep ${metric.sleepHours || "-"} h - soreness ${metric.soreness || "-"} - fatigue ${metric.fatigue || "-"}</span></span>
        <button class="ghost" data-action="delete-metric" data-metric-id="${metric.id}">Delete</button>
      </div>
    `;
  }

  function renderProgress() {
    return `
      <section class="screen">
        <div class="section-title">
          <div>
            <h2>Progress graphs</h2>
            <p>Visual trends from your local data.</p>
          </div>
        </div>
        ${renderFriendsProgressCard()}
        ${chartCard("bodyweight-chart", "Bodyweight trend")}
        ${chartCard("run-km-chart", "Weekly running kilometres")}
        ${chartCard("planned-completed-chart", "Planned km vs completed km")}
        ${chartCard("gym-volume-chart", "Weekly gym volume")}
        ${chartCard("one-rm-chart", "Estimated max strength")}
        ${chartCard("calories-chart", "Daily calories")}
        ${chartCard("protein-chart", "Daily protein")}
        ${chartCard("adherence-chart", "Nutrition adherence")}
        ${chartCard("stretch-chart", "Stretching completion streak")}
        ${chartCard("completion-chart", "Workout completion percentage")}
      </section>
    `;
  }

  function chartCard(canvasId, title) {
    return `<article class="chart-card"><h3>${title}</h3><canvas id="${canvasId}" height="220"></canvas></article>`;
  }

  function renderFriendsProgressCard() {
    return `
      <article class="module-card stack">
        <div class="row-head">
          <div>
            <h3>Training Circle</h3>
            <p class="subtle">${state.friends.lastFetchedAt ? `Last refreshed ${new Date(state.friends.lastFetchedAt).toLocaleString()}` : "Compare progress with mates using friend codes."}</p>
          </div>
          <button class="secondary" data-action="refresh-friends" ${state.auth.user ? "" : "disabled"}>Refresh</button>
        </div>
        <div class="day-list">
          ${state.friends.items.length ? state.friends.items.map(renderFriendProgressRow).join("") : `<div class="empty">Add mates from More to see their weekly progress here.</div>`}
        </div>
      </article>
    `;
  }

  function renderSettings() {
    return `
      <section class="screen">
        <div class="section-title">
          <div>
            <h2>More</h2>
            <p>Account, sync, supplements, body metrics and data controls.</p>
          </div>
        </div>
        ${renderAccountSettings()}
        ${renderCloudSettings()}
        ${renderFriendsSettings()}
        ${renderSupplementsSettings(todayISO())}
        <article class="module-card stack">
          <h3>Profile</h3>
          <div class="field">
            <label>Active profile</label>
            <select id="profile-select">
              ${Object.values(state.profiles.list).map((profile) => `<option value="${profile.id}" ${profile.id === state.settings.activeProfile ? "selected" : ""}>${escapeHtml(profile.name)}</option>`).join("")}
            </select>
          </div>
          <p class="subtle">Simple local profile switching for Dave and a mate. Exercise and food libraries stay shared.</p>
        </article>
        ${renderMetricsInline()}
        ${renderExerciseLibrary()}
        ${renderDataSettings()}
        ${renderApplicationSettings()}
      </section>
    `;
  }

  function renderAccountSettings() {
    const user = state.auth.user;
    const recoveryCode = state.auth.recoveryCode || "";
    const friendCode = state.auth.friendCode || user?.friendCode || "";
    return `
      <article class="module-card stack">
        <div class="row-head">
          <div>
            <h3>Account</h3>
            <p class="subtle">${user ? `${escapeHtml(user.displayName || "Hybrid athlete")} - recovery-code cloud sync` : "No email account required. Create a private recovery code to turn on cloud backup and sharing."}</p>
          </div>
          <span class="badge">${user ? "Signed in" : "Local only"}</span>
        </div>
        ${user ? `
          <div class="metric-grid">
            <div class="mini-stat"><span>Private recovery code</span><strong>${escapeHtml(recoveryCode || "Saved when created")}</strong></div>
            <div class="mini-stat"><span>Friend code</span><strong>${escapeHtml(friendCode || "-")}</strong></div>
          </div>
          <p class="subtle">Keep the recovery code private. Share only the friend code with mates you want in your training circle.</p>
          <div class="actions">
            <button class="secondary" data-action="copy-recovery-code" ${recoveryCode ? "" : "disabled"}>Copy Recovery Code</button>
            <button class="secondary" data-action="copy-friend-code" ${friendCode ? "" : "disabled"}>Copy Friend Code</button>
            <button class="secondary" data-action="sign-out">Sign Out</button>
            <button class="danger" data-action="delete-account">Delete Account</button>
          </div>
        ` : `
          <div class="form-grid" id="auth-form">
            <div class="field full">
              <label>Display name</label>
              <input id="account-display-name" type="text" autocomplete="name" value="${escapeAttr(state.profiles.list[state.settings.activeProfile]?.name || "Dave")}" placeholder="Dave">
            </div>
          </div>
          <div class="actions">
            <button class="primary" data-action="create-cloud-account">Create Cloud Backup</button>
            <button class="secondary" data-action="restore-cloud-account">Restore with Recovery Code</button>
          </div>
        `}
      </article>
    `;
  }

  function renderFriendsSettings() {
    const friendCode = state.auth.friendCode || state.auth.user?.friendCode || "";
    return `
      <article class="module-card stack">
        <div class="row-head">
          <div>
            <h3>Training Circle</h3>
            <p class="subtle">${state.auth.user ? "Add a mate's friend code to see each other's progress summaries." : "Create a cloud backup first, then add mates with friend codes."}</p>
          </div>
          <span class="badge">${state.friends.items.length} mates</span>
        </div>
        ${friendCode ? `<p class="subtle">Your friend code: <strong>${escapeHtml(friendCode)}</strong></p>` : ""}
        ${state.friends.lastError ? `<p class="subtle error-text">${escapeHtml(state.friends.lastError)}</p>` : ""}
        <div class="actions">
          <button class="primary" data-action="add-friend" ${state.auth.user ? "" : "disabled"}>Add Mate</button>
          <button class="secondary" data-action="refresh-friends" ${state.auth.user ? "" : "disabled"}>Refresh Progress</button>
          <button class="ghost" data-action="copy-friend-code" ${friendCode ? "" : "disabled"}>Copy Friend Code</button>
        </div>
        <div class="day-list">
          ${state.friends.items.length ? state.friends.items.map(renderFriendProgressRow).join("") : `<div class="empty">No mates added yet.</div>`}
        </div>
      </article>
    `;
  }

  function renderFriendProgressRow(friend) {
    const progress = friend.progress || {};
    return `
      <div class="food-row">
        <span>
          <strong>${escapeHtml(friend.displayName || "Mate")}</strong><br>
          <span class="subtle">
            ${progress.hasData ? `${formatNumber(progress.weeklyRunKm || 0)} km this week - ${progress.gymSessions || 0} gym sessions - ${formatNumber(progress.gymVolume || 0)} kg volume` : "No synced progress yet"}
          </span>
        </span>
        <span class="badge">${progress.latestBodyweight ? `${formatNumber(progress.latestBodyweight)} kg` : "Progress"}</span>
      </div>
    `;
  }

  function renderCloudSettings() {
    return `
      <article class="module-card stack">
        <div class="row-head">
          <div>
            <h3>Cloud Sync</h3>
            <p class="subtle">${escapeHtml(syncStatusLabel())}${state.cloud.lastSyncAt ? ` - ${new Date(state.cloud.lastSyncAt).toLocaleString()}` : ""}</p>
          </div>
          <span class="badge">${state.cloud.pendingChanges || 0} pending</span>
        </div>
        ${state.cloud.lastError ? `<p class="subtle error-text">${escapeHtml(state.cloud.lastError)}</p>` : ""}
        <div class="actions">
          <button class="primary" data-action="sync-now">Sync Now</button>
          <button class="ghost" data-action="import-v3-cloud">Import Local Data</button>
        </div>
      </article>
    `;
  }

  function renderSupplementsSettings(date) {
    const stats = supplementStats(date);
    return `
      <article class="module-card stack">
        <div class="row-head">
          <div>
            <h3>Supplements</h3>
            <p class="subtle">${stats.taken} of ${stats.planned} taken today - 30 day adherence ${supplementAdherence(30)}%</p>
          </div>
          <span class="badge">${supplementStreak()} day streak</span>
        </div>
        <div class="day-list">
          ${state.supplements.items.map((item) => `
            <div class="food-row ${item.active ? "" : "muted-row"}">
              <span><strong>${escapeHtml(item.name)}</strong><br><span class="subtle">${escapeHtml(item.dose)} ${escapeHtml(item.unit)} - ${escapeHtml(item.schedule)} - ${escapeHtml(item.preferredTime || "")}${item.containsCaffeine ? ` - ${formatNumber(item.caffeineMg)} mg caffeine` : ""}</span></span>
              <span class="actions">
                <button class="primary" data-action="mark-supplement" data-supplement-id="${item.id}" data-date="${date}" data-status="taken">Taken</button>
                <button class="ghost" data-action="pause-supplement" data-supplement-id="${item.id}">${item.active ? "Pause" : "Resume"}</button>
              </span>
            </div>
          `).join("")}
        </div>
      </article>
    `;
  }

  function renderDataSettings() {
    return `
      <article class="module-card stack">
        <h3>Data</h3>
        <p class="subtle">Last export: ${state.settings.lastBackupDate ? formatLongDate(state.settings.lastBackupDate) : "Never"}. JSON export/import remains portable even with cloud sync.</p>
        <div class="actions">
          <button class="primary" data-action="export-data">Export JSON</button>
          <label class="secondary icon-button file-action">Import<input class="sr-only" id="import-file-settings" type="file" accept="application/json"></label>
          <button class="secondary" data-action="sync-now">Download Account Data</button>
        </div>
        <p class="subtle">Reset local cache keeps the cloud account intact once sync is configured. Full delete requires account confirmation in the Cloudflare API.</p>
        <button class="danger" data-action="reset-data">Reset Local Data</button>
      </article>
    `;
  }

  function renderApplicationSettings() {
    return `
      <article class="module-card stack">
        <h3>Application</h3>
        <div class="grid-2">
          <div class="mini-stat"><span>Version</span><strong>${APP_VERSION}</strong></div>
          <div class="mini-stat"><span>Build</span><strong>${BUILD_NUMBER}</strong></div>
          <div class="mini-stat"><span>Units</span><strong>${escapeHtml(state.settings.units)}</strong></div>
          <div class="mini-stat"><span>Timezone</span><strong>${escapeHtml(state.settings.timezone)}</strong></div>
        </div>
        <p class="subtle">Install on iPhone from Safari using Share, then Add to Home Screen. Offline workouts, saved foods, supplements and recent history are available without reception.</p>
        <button class="secondary" data-action="sync-now">Check for Update</button>
      </article>
    `;
  }

  function renderMetricsInline() {
    const latest = latestMetric();
    return `
      <article class="module-card stack">
        <h3>Body metrics</h3>
        <div class="form-grid" id="metric-form">
          ${metricInput("date", "Date", "date", todayISO())}
          ${metricInput("bodyweight", "Bodyweight kg", "number", latest.bodyweight || PROFILE.bodyweightKg)}
          ${metricInput("waist", "Waist cm", "number", latest.waist || "")}
          ${metricInput("chest", "Chest cm", "number", latest.chest || "")}
          ${metricInput("arm", "Arm cm", "number", latest.arm || "")}
          ${metricInput("thigh", "Thigh cm", "number", latest.thigh || "")}
          ${metricInput("sleepHours", "Sleep hours", "number", latest.sleepHours || "")}
          ${metricInput("soreness", "Soreness 1-10", "number", latest.soreness || "")}
          ${metricInput("fatigue", "Fatigue 1-10", "number", latest.fatigue || "")}
          <div class="field full"><label>Daily notes</label><textarea data-metric-input="notes">${escapeHtml(latest.notes || "")}</textarea></div>
        </div>
        <button class="primary" data-action="save-metrics">Save Metrics</button>
      </article>
    `;
  }

  function renderExerciseLibrary() {
    const names = [...new Set(Object.values(GYM_TEMPLATES).flatMap((template) => template.exercises.map((exercise) => exercise.name)))];
    return `
      <article class="module-card stack">
        <h3>Exercise video library</h3>
        <p class="subtle">Lightweight YouTube links. No videos are stored in the app.</p>
        <div class="day-list">
          ${names.slice(0, 18).map((name) => renderLibraryRow(name)).join("")}
        </div>
      </article>
    `;
  }

  function renderLibraryRow(name) {
    const info = exerciseInfo(name);
    return `
      <div class="day-item">
        <span class="day-date">Demo</span>
        <span><strong>${escapeHtml(name)}</strong><br><span class="subtle">${escapeHtml(info.notes)}</span></span>
        <a class="secondary" href="${youtubeSearchUrl(info.query || name)}" target="_blank" rel="noopener">Watch Demo</a>
      </div>
    `;
  }

  function ring(label, value, percent, color) {
    const safePct = clamp(percent, 0, 100);
    return `
      <div class="ring" style="--value:${safePct}%;--ring-color:${color}">
        <div class="ring-core"><strong>${escapeHtml(value)}</strong></div>
        <label>${escapeHtml(label)}</label>
      </div>
    `;
  }

  function ensureRunLog(runId) {
    if (!state.runs[runId]) {
      state.runs[runId] = { actualDistance: "", time: "", pace: "", notes: "", status: "planned", movedTo: "", movedFrom: "" };
    }
    return state.runs[runId];
  }

  function getRunLog(runId) {
    const log = state.runs[runId] || {};
    return {
      actualDistance: log.actualDistance || "",
      time: log.time || "",
      pace: log.pace || calculatePace(log.actualDistance, log.time) || "",
      notes: log.notes || "",
      status: normalizeStatus(log.status || (log.completed ? "completed" : "planned")),
      movedTo: log.movedTo || "",
      movedFrom: log.movedFrom || ""
    };
  }

  function runsForDate(date) {
    const base = RUN_PLAN.filter((session) => session.date === date);
    const movedIn = RUN_PLAN.filter((session) => getRunLog(session.id).status === "moved" && getRunLog(session.id).movedTo === date)
      .map((session) => ({ ...session, date, movedFrom: session.date, id: session.id }));
    return [...base, ...movedIn];
  }

  function createGymShell(date) {
    return {
      id: id("gym"),
      date,
      day: dayName(date),
      muscleGroup: GYM_TEMPLATES[dayName(date)]?.muscleGroup || "Moved",
      status: "planned",
      movedTo: "",
      movedFrom: "",
      exercises: []
    };
  }

  function startGymSession(date) {
    const existing = state.gymLogs[date];
    if (existing?.exercises?.length) {
      existing.startedAt = existing.startedAt || new Date().toISOString();
      return;
    }
    const day = dayName(date);
    const template = GYM_TEMPLATES[day];
    if (!template) return;
    const taper = weekNumberForDate(date) === 16;
    state.gymLogs[date] = {
      ...createGymShell(date),
      startedAt: new Date().toISOString(),
      muscleGroup: template.muscleGroup,
      exercises: template.exercises.map((exercise) => {
        const setCount = taper ? Math.max(1, Math.ceil(exercise.sets / 2)) : exercise.sets;
        return {
          id: id("ex"),
          name: exercise.name,
          muscleGroup: exercise.muscleGroup,
          optional: exercise.optional,
          prescribedSets: setCount,
          prescribedReps: exercise.reps,
          notes: taper ? "Week 16 taper: 50% volume, no heavy leg work." : "",
          sets: Array.from({ length: setCount }, () => makeSet(repSeed(exercise.reps), startingWeightForExercise(exercise.name)))
        };
      })
    };
  }

  function makeSet(reps = "", weight = "") {
    return { id: id("set"), type: "working", reps, weight, notes: "", completed: false };
  }

  function addSet(date, exerciseId) {
    const exercise = findExercise(date, exerciseId);
    if (!exercise) return;
    const last = exercise.sets[exercise.sets.length - 1] || {};
    exercise.sets.push({ ...makeSet(last.reps || repSeed(exercise.prescribedReps), last.weight || startingWeightForExercise(exercise.name)) });
  }

  function completeNextSet(date, exerciseId) {
    const exercise = findExercise(date, exerciseId);
    if (!exercise) return;
    const next = exercise.sets.find((set) => !set.completed) || exercise.sets[exercise.sets.length - 1];
    if (next) {
      next.completed = true;
      next.completedAt = new Date().toISOString();
    }
  }

  function completeSet(date, exerciseId, setId) {
    const set = findSet(date, exerciseId, setId);
    if (set) {
      set.completed = true;
      set.completedAt = new Date().toISOString();
    }
  }

  function undoSet(date, exerciseId, setId) {
    const set = findSet(date, exerciseId, setId);
    if (set) {
      set.completed = false;
      set.completedAt = "";
    }
  }

  function workoutElapsed(session) {
    const start = Date.parse(session.startedAt || "");
    if (!start) return "0:00";
    const seconds = Math.max(0, Math.floor((Date.now() - start) / 1000));
    const mins = Math.floor(seconds / 60);
    const hrs = Math.floor(mins / 60);
    const sec = String(seconds % 60).padStart(2, "0");
    const rem = String(mins % 60).padStart(2, "0");
    return hrs ? `${hrs}:${rem}:${sec}` : `${mins}:${sec}`;
  }

  function findExercise(date, exerciseId) {
    return state.gymLogs[date]?.exercises?.find((exercise) => exercise.id === exerciseId);
  }

  function findSet(date, exerciseId, setId) {
    return findExercise(date, exerciseId)?.sets?.find((set) => set.id === setId);
  }

  function exerciseStats(exercise) {
    const completed = (exercise.sets || []).filter((set) => set.completed);
    const volume = completed.reduce((sum, set) => sum + setVolume(set), 0);
    const best = completed.sort((a, b) => estimatedOneRm(b) - estimatedOneRm(a))[0];
    return {
      volume,
      completedSets: completed.length,
      e1rm: best ? estimatedOneRm(best) : 0,
      bestSet: best ? `${best.weight || 0} kg x ${best.reps || 0}` : ""
    };
  }

  function gymSessionSummary(session) {
    const exercises = session?.exercises || [];
    const stats = exercises.map(exerciseStats);
    return {
      volume: stats.reduce((sum, stat) => sum + stat.volume, 0),
      completedSets: stats.reduce((sum, stat) => sum + stat.completedSets, 0),
      totalSets: exercises.reduce((sum, exercise) => sum + (exercise.sets?.length || 0), 0)
    };
  }

  function previousSetText(date, exerciseName, setIndex) {
    const match = Object.values(state.gymLogs)
      .filter((session) => session.date < date)
      .sort((a, b) => b.date.localeCompare(a.date))
      .flatMap((session) => session.exercises || [])
      .find((exercise) => normalizeName(exercise.name) === normalizeName(exerciseName) && exercise.sets?.[setIndex]?.completed);
    const set = match?.sets?.[setIndex];
    return set ? `Previous: ${set.weight || 0} kg x ${set.reps || 0} reps` : "";
  }

  function startingWeightForExercise(exerciseName) {
    const normalized = normalizeName(exerciseName);
    let best = null;
    Object.values(state.gymLogs || {}).forEach((session) => {
      (session.exercises || []).forEach((exercise) => {
        if (normalizeName(exercise.name) === normalized || normalized.includes(normalizeName(exercise.name)) || normalizeName(exercise.name).includes(normalized.split("/")[0].trim())) {
          (exercise.sets || []).forEach((set) => {
            if (set.completed && toNumber(set.weight) > 0) best = set.weight;
          });
        }
      });
    });
    if (best) return best;
    const key = Object.keys(STARTING_WEIGHTS).find((candidate) => normalized === candidate || normalized.includes(candidate) || candidate.includes(normalized.split("/")[0].trim()));
    return key ? STARTING_WEIGHTS[key] : "";
  }

  function exerciseInfo(name) {
    const normalized = normalizeName(name);
    const exact = EXERCISE_LIBRARY[normalized];
    if (exact) return exact;
    const key = Object.keys(EXERCISE_LIBRARY).find((candidate) => normalized.includes(candidate) || candidate.includes(normalized.split("/")[0].trim()));
    return EXERCISE_LIBRARY[key] || { ...EXERCISE_LIBRARY.default, query: `${name} technique` };
  }

  function youtubeSearchUrl(query) {
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  }

  function startRestTimer(seconds) {
    stopRestTimer();
    restTimer.endAt = Date.now() + seconds * 1000;
    state.settings.restTimerEndAt = restTimer.endAt;
    state.settings.timerMessage = "";
    saveState();
    startRestTicker();
  }

  function stopRestTimer() {
    if (restTimer.interval) clearInterval(restTimer.interval);
    restTimer = { endAt: 0, interval: null };
    state.settings.restTimerEndAt = 0;
    state.settings.timerMessage = "";
    saveState();
  }

  function startRestTicker() {
    if (restTimer.interval) clearInterval(restTimer.interval);
    restTimer.interval = setInterval(() => {
      updateTimerDom();
      if (!getRestRemaining()) {
        if (restTimer.interval) clearInterval(restTimer.interval);
        restTimer.interval = null;
        state.settings.restTimerEndAt = 0;
        notifyTimerDone();
        saveState();
        render();
      }
    }, 1000);
  }

  function getRestRemaining() {
    const endAt = Number(restTimer.endAt || state.settings.restTimerEndAt || 0);
    return Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
  }

  function startStretchTimer(itemId, seconds) {
    stopStretchTimer();
    stretchTimer = { itemId, remaining: seconds, interval: null };
    stretchTimer.interval = setInterval(() => {
      stretchTimer.remaining -= 1;
      updateTimerDom();
      if (stretchTimer.remaining <= 0) {
        stopStretchTimer();
        notifyTimerDone();
        render();
      }
    }, 1000);
  }

  function stopStretchTimer() {
    if (stretchTimer.interval) clearInterval(stretchTimer.interval);
    stretchTimer = { itemId: null, remaining: 0, interval: null };
  }

  function updateTimerDom() {
    const rest = document.getElementById("rest-timer");
    if (rest) rest.textContent = getRestRemaining() || "OK";
    const stretchEl = document.getElementById("stretch-timer");
    if (stretchEl) stretchEl.textContent = stretchTimer.remaining;
  }

  function notifyTimerDone() {
    state.settings.timerMessage = "Lightweight!";
    if (navigator.vibrate) navigator.vibrate([120, 60, 120]);
    try {
      const AudioCtor = typeof window !== "undefined" && (window.AudioContext || window.webkitAudioContext);
      if (!AudioCtor) return;
      const audio = new AudioCtor();
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.connect(gain);
      gain.connect(audio.destination);
      osc.frequency.value = 660;
      gain.gain.value = 0.025;
      osc.start();
      osc.stop(audio.currentTime + 0.16);
    } catch (_) {}
  }

  function ensureStretchLog(date, create = true) {
    if (!state.stretchingLogs[date] && create) {
      state.stretchingLogs[date] = {
        id: id("stretch"),
        date,
        status: "planned",
        movedTo: "",
        movedFrom: "",
        items: Object.fromEntries(STRETCH_ROUTINE.map((item) => [item.id, false]))
      };
    }
    return state.stretchingLogs[date] || null;
  }

  function updateStretchStatus(log) {
    if (!log) return;
    log.status = STRETCH_ROUTINE.every((item) => log.items[item.id]) ? "completed" : "planned";
  }

  function stretchPercent(log) {
    if (!log) return 0;
    const done = STRETCH_ROUTINE.filter((item) => log.items?.[item.id]).length;
    return Math.round((done / STRETCH_ROUTINE.length) * 100);
  }

  function stretchStreak() {
    let streak = 0;
    let cursor = todayISO();
    while (state.stretchingLogs[cursor]?.status === "completed") {
      streak += 1;
      cursor = addDays(cursor, -1);
    }
    return streak;
  }

  function foodEntries(date) {
    return state.nutrition.entries[date] || [];
  }

  function nutritionTotals(date) {
    return foodEntries(date).reduce((sum, item) => {
      ["calories", "protein", "carbs", "fat", "fibre", "water", "caffeine"].forEach((key) => { sum[key] += toNumber(item[key]); });
      return sum;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, fibre: 0, water: 0, caffeine: 0 });
  }

  function addFoodFromForm() {
    const entry = readFoodForm();
    if (!entry.name) return;
    if (!state.nutrition.entries[ui.foodDate]) state.nutrition.entries[ui.foodDate] = [];
    state.nutrition.entries[ui.foodDate].push({ ...entry, ...newRecordMeta(id("food")), source: "manual" });
    updateFoodUsage(entry.name);
  }

  function savePresetFromForm() {
    const preset = readFoodForm();
    if (!preset.name) return;
    state.nutrition.presets.push({ ...preset, id: id("preset") });
    state.nutrition.foods = cleanFoodPresets([...(state.nutrition.foods || []), ...state.nutrition.presets]);
  }

  function editPreset(presetId) {
    const preset = state.nutrition.presets.find((item) => item.id === presetId);
    if (!preset) return;
    const name = prompt("Food name", preset.name);
    if (!name) return;
    preset.name = name.trim();
    preset.calories = toNumber(prompt("Calories", preset.calories));
    preset.protein = toNumber(prompt("Protein g", preset.protein));
    preset.carbs = toNumber(prompt("Carbs g", preset.carbs));
    preset.fat = toNumber(prompt("Fat g", preset.fat));
    preset.fibre = toNumber(prompt("Fibre g", preset.fibre));
  }

  function readFoodForm() {
    const entry = { name: "", meal: mealForTime(), calories: 0, protein: 0, carbs: 0, fat: 0, fibre: 0, water: 0, caffeine: 0 };
    document.querySelectorAll("#food-form [data-food-input]").forEach((input) => {
      const key = input.dataset.foodInput;
      entry[key] = key === "name" || key === "meal" ? input.value.trim() : toNumber(input.value);
    });
    return entry;
  }

  function addPresetToDay(presetId, date) {
    const preset = state.nutrition.presets.find((item) => item.id === presetId);
    if (!preset) return;
    if (!state.nutrition.entries[date]) state.nutrition.entries[date] = [];
    state.nutrition.entries[date].push({ ...preset, ...newRecordMeta(id("food")), meal: mealForTime(), source: "preset" });
    updateFoodUsage(preset.name);
  }

  function deleteFood(date, entryId) {
    state.nutrition.entries[date] = foodEntries(date).filter((entry) => entry.id !== entryId);
  }

  function logMealPrep(prepId) {
    const batch = (state.nutrition.mealPrep || []).find((item) => item.id === prepId);
    if (!batch || batch.servesRemaining <= 0) return;
    if (!state.nutrition.entries[ui.foodDate]) state.nutrition.entries[ui.foodDate] = [];
    state.nutrition.entries[ui.foodDate].push({
      ...newRecordMeta(id("food")),
      name: `${batch.name} serve`,
      meal: mealForTime(),
      calories: batch.calories,
      protein: batch.protein,
      carbs: batch.carbs,
      fat: batch.fat,
      fibre: batch.fibre || 0,
      water: 0,
      source: "meal-prep"
    });
    batch.servesRemaining = Math.max(0, toNumber(batch.servesRemaining) - 1);
    batch.lastLoggedAt = new Date().toISOString();
    updateFoodUsage(batch.name);
  }

  function addMealPrepFromForm() {
    const form = {};
    document.querySelectorAll("#meal-prep-form [data-food-input]").forEach((input) => {
      form[input.dataset.foodInput] = input.value;
    });
    if (!form.prepName) return;
    state.nutrition.mealPrep.push({
      id: id("prep"),
      name: form.prepName.trim(),
      madeDate: todayISO(),
      totalServes: toNumber(form.prepServes) || 1,
      servesRemaining: toNumber(form.prepServes) || 1,
      calories: toNumber(form.prepCalories),
      protein: toNumber(form.prepProtein),
      carbs: toNumber(form.prepCarbs),
      fat: toNumber(form.prepFat),
      fibre: 0,
      notes: "",
      useBy: ""
    });
  }

  function saveTargetsFromForm() {
    document.querySelectorAll("[data-target-input]").forEach((input) => {
      state.nutrition.targets[input.dataset.targetInput] = toNumber(input.value);
    });
  }

  function saveMetricFromForm() {
    const metric = { id: id("metric"), photo: ui.metricPhoto || "" };
    document.querySelectorAll("[data-metric-input]").forEach((input) => {
      metric[input.dataset.metricInput] = input.value;
    });
    if (!metric.date) metric.date = todayISO();
    state.metrics.push(metric);
    state.metrics.sort((a, b) => a.date.localeCompare(b.date));
    ui.metricPhoto = "";
  }

  function readMetricPhoto(file) {
    if (file.size > 1400000) {
      alert("Photo is too large for reliable localStorage. Choose a smaller image.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => { ui.metricPhoto = reader.result; };
    reader.readAsDataURL(file);
  }

  function latestMetric() {
    return [...state.metrics].sort((a, b) => b.date.localeCompare(a.date))[0] || {};
  }

  function weeklySummary(date) {
    const bounds = weekBounds(date);
    const runs = RUN_PLAN.filter((session) => session.date >= bounds.start && session.date <= bounds.end && session.type !== "Rest");
    const plannedKm = runs.reduce((sum, session) => sum + session.distanceKm, 0);
    const completedKm = runs.reduce((sum, session) => sum + toNumber(getRunLog(session.id).actualDistance), 0);
    const gymSessions = Object.values(state.gymLogs).filter((session) => session.date >= bounds.start && session.date <= bounds.end);
    return {
      plannedKm,
      completedKm,
      gymVolume: gymSessions.reduce((sum, session) => sum + gymSessionSummary(session).volume, 0),
      gymDone: gymSessions.filter((session) => session.status === "completed").length,
      gymPlanned: DAY_ORDER.filter((day) => GYM_TEMPLATES[day]).length
    };
  }

  function drawCharts() {
    const weekly = PLAN_WEEKS.map((week) => {
      const sessions = RUN_PLAN.filter((session) => session.week === week.week && session.type !== "Rest");
      return {
        label: `W${week.week}`,
        planned: sessions.reduce((sum, session) => sum + session.distanceKm, 0),
        completed: sessions.reduce((sum, session) => sum + toNumber(getRunLog(session.id).actualDistance), 0)
      };
    });
    drawArea("bodyweight-chart", state.metrics.map((metric) => ({ label: shortDate(metric.date), value: toNumber(metric.bodyweight) })).filter((item) => item.value), "kg", "#64d2ff");
    drawArea("run-km-chart", weekly.map((item) => ({ label: item.label, value: item.completed || item.planned })), "km", "#30d158");
    drawDualArea("planned-completed-chart", weekly.map((item) => ({ label: item.label, planned: item.planned, completed: item.completed })), "km");
    drawArea("gym-volume-chart", weeklyGymVolumes(), "kg", "#bf9bff");
    drawMultiLine("one-rm-chart", oneRmSeries(), "kg");
    drawArea("calories-chart", datedNutritionSeries("calories"), "kcal", "#64d2ff");
    drawArea("protein-chart", datedNutritionSeries("protein"), "g", "#30d158");
    drawArea("adherence-chart", nutritionAdherenceSeries(), "%", "#ffd60a");
    drawArea("stretch-chart", stretchSeries(), "%", "#bf9bff");
    drawArea("completion-chart", completionSeries(), "%", "#ff7abf");
  }

  function weeklyGymVolumes() {
    return PLAN_WEEKS.map((week) => {
      const end = addDays(week.start, 6);
      const value = Object.values(state.gymLogs).filter((session) => session.date >= week.start && session.date <= end).reduce((sum, session) => sum + gymSessionSummary(session).volume, 0);
      return { label: `W${week.week}`, value };
    });
  }

  function oneRmSeries() {
    const targets = {
      Bench: ["barbell bench press", "flat bench press"],
      "Squat/Hack": ["front squat", "safety bar squat", "hack squat", "leg press"],
      RDL: ["romanian deadlift"],
      Press: ["seated dumbbell press", "machine shoulder press", "military press", "overhead press"]
    };
    const series = Object.fromEntries(Object.keys(targets).map((key) => [key, []]));
    Object.values(state.gymLogs).sort((a, b) => a.date.localeCompare(b.date)).forEach((session) => {
      Object.entries(targets).forEach(([label, needles]) => {
        let best = 0;
        (session.exercises || []).forEach((exercise) => {
          const name = normalizeName(exercise.name);
          if (needles.some((needle) => name.includes(needle))) {
            (exercise.sets || []).forEach((set) => { if (set.completed) best = Math.max(best, estimatedOneRm(set)); });
          }
        });
        if (best) series[label].push({ label: shortDate(session.date), value: best });
      });
    });
    return series;
  }

  function datedNutritionSeries(key) {
    return Object.keys(state.nutrition.entries).sort().slice(-21).map((date) => ({ label: shortDate(date), value: nutritionTotals(date)[key] || 0 }));
  }

  function nutritionAdherenceSeries() {
    return Object.keys(state.nutrition.entries).sort().slice(-21).map((date) => {
      const totals = nutritionTotals(date);
      const targets = state.nutrition.targets;
      const score = (pct(totals.calories, targets.calories) + pct(totals.protein, targets.protein) + pct(totals.carbs, targets.carbs) + pct(totals.fat, targets.fat) + pct(totals.fibre, targets.fibre)) / 5;
      return { label: shortDate(date), value: Math.min(100, score) };
    });
  }

  function stretchSeries() {
    return Object.keys(state.stretchingLogs).sort().slice(-21).map((date) => ({ label: shortDate(date), value: stretchPercent(state.stretchingLogs[date]) }));
  }

  function completionSeries() {
    return PLAN_WEEKS.map((week) => {
      const runs = RUN_PLAN.filter((session) => session.week === week.week && session.type !== "Rest");
      const runDone = runs.filter((session) => getRunLog(session.id).status === "completed").length;
      const gymDates = DAY_ORDER.filter((day) => GYM_TEMPLATES[day]).map((_, index) => addDays(week.start, index));
      const gymDone = gymDates.filter((date) => state.gymLogs[date]?.status === "completed").length;
      const stretchDone = Array.from({ length: 7 }, (_, index) => addDays(week.start, index)).filter((date) => state.stretchingLogs[date]?.status === "completed").length;
      const total = runs.length + gymDates.length + 7;
      return { label: `W${week.week}`, value: total ? ((runDone + gymDone + stretchDone) / total) * 100 : 0 };
    });
  }

  function drawLine(canvasId, points, unit, color) {
    const chart = setupChart(canvasId);
    if (!chart) return;
    const { canvas, ctx } = chart;
    if (!points.length) return noData(ctx, canvas);
    const range = rangeFor(points.map((point) => point.value));
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    points.forEach((point, index) => {
      const x = chartX(index, points.length, canvas);
      const y = chartY(point.value, range, canvas);
      if (index) ctx.lineTo(x, y); else ctx.moveTo(x, y);
    });
    ctx.stroke();
    drawLegend(ctx, canvas, `${formatNumber(range.max)} ${unit}`);
  }

  function drawArea(canvasId, points, unit, color) {
    const chart = setupChart(canvasId);
    if (!chart) return;
    const { canvas, ctx } = chart;
    if (!points.length || points.every((point) => !point.value)) return noData(ctx, canvas);
    const range = rangeFor(points.map((point) => point.value));
    const coords = points.map((point, index) => ({ x: chartX(index, points.length, canvas), y: chartY(point.value, range, canvas) }));
    const bottom = canvas.height - 32;
    ctx.beginPath();
    coords.forEach((point, index) => index ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y));
    ctx.lineTo(coords[coords.length - 1].x, bottom);
    ctx.lineTo(coords[0].x, bottom);
    ctx.closePath();
    const gradient = ctx.createLinearGradient(0, 18, 0, bottom);
    gradient.addColorStop(0, `${color}88`);
    gradient.addColorStop(1, `${color}08`);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    coords.forEach((point, index) => index ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y));
    ctx.stroke();
    drawLegend(ctx, canvas, `${formatNumber(range.max)} ${unit}`);
  }

  function drawDualArea(canvasId, points, unit) {
    const planned = points.map((point) => ({ label: point.label, value: point.planned }));
    const completed = points.map((point) => ({ label: point.label, value: point.completed }));
    const chart = setupChart(canvasId);
    if (!chart) return;
    const { canvas, ctx } = chart;
    const all = [...planned, ...completed].map((point) => point.value);
    if (!all.some(Boolean)) return noData(ctx, canvas);
    const range = rangeFor(all);
    drawSeriesLine(ctx, canvas, planned, range, "#64d2ff");
    drawSeriesLine(ctx, canvas, completed, range, "#30d158");
    ctx.fillStyle = "#9aa8bd";
    ctx.font = "12px system-ui";
    ctx.fillText(`Planned / completed ${formatNumber(range.max)} ${unit}`, 8, 16);
  }

  function drawSeriesLine(ctx, canvas, points, range, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    points.forEach((point, index) => {
      const x = chartX(index, points.length, canvas);
      const y = chartY(point.value, range, canvas);
      if (index) ctx.lineTo(x, y); else ctx.moveTo(x, y);
    });
    ctx.stroke();
  }

  function drawBars(canvasId, bars, unit, color) {
    const chart = setupChart(canvasId);
    if (!chart) return;
    const { canvas, ctx } = chart;
    if (!bars.length || bars.every((bar) => !bar.value)) return noData(ctx, canvas);
    const max = Math.max(...bars.map((bar) => bar.value), 1);
    const slot = (canvas.width - 46) / bars.length;
    const bottom = canvas.height - 30;
    const height = canvas.height - 54;
    bars.forEach((bar, index) => {
      const h = height * (bar.value / max);
      ctx.fillStyle = color;
      ctx.fillRect(34 + index * slot + slot * 0.18, bottom - h, Math.max(5, slot * 0.62), h);
      if (index % Math.ceil(bars.length / 6) === 0) {
        ctx.fillStyle = "#9aa8bd";
        ctx.font = "11px system-ui";
        ctx.fillText(bar.label, 32 + index * slot, canvas.height - 8);
      }
    });
    drawLegend(ctx, canvas, `${formatNumber(max)} ${unit}`);
  }

  function drawGroupedBars(canvasId, bars, unit) {
    const chart = setupChart(canvasId);
    if (!chart) return;
    const { canvas, ctx } = chart;
    if (!bars.length) return noData(ctx, canvas);
    const max = Math.max(...bars.map((bar) => Math.max(bar.a, bar.b)), 1);
    const slot = (canvas.width - 46) / bars.length;
    const bottom = canvas.height - 30;
    const height = canvas.height - 54;
    bars.forEach((bar, index) => {
      const x = 34 + index * slot + slot * 0.15;
      const w = Math.max(4, slot * 0.28);
      ctx.fillStyle = "rgba(55,217,255,0.75)";
      ctx.fillRect(x, bottom - height * (bar.a / max), w, height * (bar.a / max));
      ctx.fillStyle = "rgba(86,243,154,0.85)";
      ctx.fillRect(x + w + 2, bottom - height * (bar.b / max), w, height * (bar.b / max));
    });
    drawLegend(ctx, canvas, `${formatNumber(max)} ${unit}`);
  }

  function drawMultiLine(canvasId, series, unit) {
    const chart = setupChart(canvasId);
    if (!chart) return;
    const { canvas, ctx } = chart;
    const all = Object.values(series).flat();
    if (!all.length) return noData(ctx, canvas);
    const colors = ["#37d9ff", "#56f39a", "#a778ff", "#ff5cc8"];
    const range = rangeFor(all.map((point) => point.value));
    Object.entries(series).forEach(([label, points], index) => {
      if (!points.length) return;
      ctx.strokeStyle = colors[index % colors.length];
      ctx.lineWidth = 2;
      ctx.beginPath();
      points.forEach((point, pointIndex) => {
        const x = chartX(pointIndex, points.length, canvas);
        const y = chartY(point.value, range, canvas);
        if (pointIndex) ctx.lineTo(x, y); else ctx.moveTo(x, y);
      });
      ctx.stroke();
      ctx.fillStyle = colors[index % colors.length];
      ctx.font = "11px system-ui";
      ctx.fillText(label, 38 + index * 74, 18);
    });
    drawLegend(ctx, canvas, `${formatNumber(range.max)} ${unit}`);
  }

  function setupChart(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(280, rect.width);
    canvas.height = 220;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(154,168,189,0.22)";
    ctx.beginPath();
    ctx.moveTo(30, 12);
    ctx.lineTo(30, canvas.height - 30);
    ctx.lineTo(canvas.width - 10, canvas.height - 30);
    ctx.stroke();
    return { canvas, ctx };
  }

  function noData(ctx, canvas) {
    ctx.fillStyle = "#9aa8bd";
    ctx.font = "14px system-ui";
    ctx.fillText("No logged data yet", 42, canvas.height / 2);
  }

  function drawLegend(ctx, canvas, text) {
    ctx.fillStyle = "#9aa8bd";
    ctx.font = "12px system-ui";
    ctx.fillText(text, 8, 16);
  }

  function chartX(index, count, canvas) {
    return count === 1 ? canvas.width / 2 : 34 + index * ((canvas.width - 48) / (count - 1));
  }

  function chartY(value, range, canvas) {
    const top = 22;
    const bottom = canvas.height - 34;
    return bottom - ((value - range.min) / (range.max - range.min || 1)) * (bottom - top);
  }

  function rangeFor(values) {
    const min = Math.min(...values);
    const max = Math.max(...values);
    if (min === max) return { min: Math.max(0, min - 1), max: max + 1 };
    const pad = (max - min) * 0.12;
    return { min: Math.max(0, min - pad), max: max + pad };
  }

  function newRecordMeta(recordId) {
    const now = new Date().toISOString();
    return {
      id: recordId || id("record"),
      userId: state.auth.user?.id || "local",
      createdAt: now,
      updatedAt: now,
      deletedAt: "",
      revision: 1,
      deviceId: state.cloud.deviceId || state.settings.deviceId
    };
  }

  function mealForTime() {
    const hour = new Date().getHours();
    if (hour < 10) return "Breakfast";
    if (hour < 15) return "Lunch";
    if (hour < 20) return "Dinner";
    return "Snacks";
  }

  function updateFoodUsage(name) {
    const key = normalizeName(name);
    if (!key) return;
    state.nutrition.frequent[key] = (state.nutrition.frequent[key] || 0) + 1;
    state.nutrition.recent = [name, ...(state.nutrition.recent || []).filter((item) => normalizeName(item) !== key)].slice(0, 20);
  }

  function frequentlyEatenFoods() {
    const byName = new Map((state.nutrition.presets || []).map((preset) => [normalizeName(preset.name), preset]));
    return Object.entries(state.nutrition.frequent || {})
      .sort((a, b) => b[1] - a[1])
      .map(([key]) => byName.get(key))
      .filter(Boolean);
  }

  function recentFoods() {
    const byName = new Map((state.nutrition.presets || []).map((preset) => [normalizeName(preset.name), preset]));
    return (state.nutrition.recent || []).map((name) => byName.get(normalizeName(name))).filter(Boolean);
  }

  function addSavedMeal(mealId) {
    const meal = (state.nutrition.savedMeals || []).find((item) => item.id === mealId);
    if (!meal) return;
    if (!state.nutrition.entries[ui.foodDate]) state.nutrition.entries[ui.foodDate] = [];
    state.nutrition.entries[ui.foodDate].push({
      ...newRecordMeta(id("food")),
      name: meal.name,
      meal: mealForTime(),
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      fibre: meal.fibre || 0,
      water: 0,
      caffeine: 0,
      source: "saved-meal"
    });
    updateFoodUsage(meal.name);
  }

  function copyPreviousMeal() {
    const previousDate = addDays(ui.foodDate, -1);
    const entries = foodEntries(previousDate);
    if (!entries.length) {
      alert("No food logged yesterday to copy.");
      return;
    }
    if (!state.nutrition.entries[ui.foodDate]) state.nutrition.entries[ui.foodDate] = [];
    entries.forEach((entry) => {
      state.nutrition.entries[ui.foodDate].push({ ...entry, ...newRecordMeta(id("food")), date: ui.foodDate });
      updateFoodUsage(entry.name);
    });
  }

  function undoLastMealPrepServe(prepId) {
    const batch = (state.nutrition.mealPrep || []).find((item) => item.id === prepId);
    if (!batch) return;
    const name = `${batch.name} serve`;
    const entries = state.nutrition.entries[ui.foodDate] || [];
    const index = [...entries].reverse().findIndex((entry) => entry.name === name && entry.source === "meal-prep");
    if (index === -1) return;
    entries.splice(entries.length - 1 - index, 1);
    batch.servesRemaining = Math.min(toNumber(batch.totalServes), toNumber(batch.servesRemaining) + 1);
  }

  async function startBarcodeScan() {
    ui.barcodeStatus = "Starting scanner...";
    if (!navigator.onLine) {
      ui.barcodeStatus = "Barcode database lookup is unavailable offline. Use manual entry and it will sync later.";
      return;
    }
    if ("BarcodeDetector" in window && navigator.mediaDevices?.getUserMedia) {
      try {
        const detector = new window.BarcodeDetector({ formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128"] });
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        const video = document.createElement("video");
        const overlay = document.createElement("div");
        overlay.className = "scanner-overlay";
        overlay.innerHTML = `<div class="scanner-box"><p>Point camera at barcode</p><button class="secondary" type="button">Cancel</button></div>`;
        overlay.querySelector("button").addEventListener("click", () => stopScanner(stream, overlay));
        video.setAttribute("playsinline", "true");
        video.srcObject = stream;
        overlay.querySelector(".scanner-box").prepend(video);
        document.body.appendChild(overlay);
        await video.play();
        const deadline = Date.now() + 15000;
        const scan = async () => {
          if (!document.body.contains(overlay)) return;
          const codes = await detector.detect(video).catch(() => []);
          if (codes.length) {
            const value = codes[0].rawValue;
            stopScanner(stream, overlay);
            await lookupBarcode(value);
            render();
            return;
          }
          if (Date.now() < deadline) requestAnimationFrame(scan);
          else {
            stopScanner(stream, overlay);
            ui.barcodeStatus = "No barcode detected. Try again or enter the food manually.";
            render();
          }
        };
        scan();
        return;
      } catch (error) {
        ui.barcodeStatus = `Camera scanner unavailable: ${error.message}`;
      }
    }
    const code = prompt("Enter barcode number");
    if (code) await lookupBarcode(code.trim());
  }

  function stopScanner(stream, overlay) {
    stream.getTracks().forEach((track) => track.stop());
    overlay.remove();
  }

  async function lookupBarcode(code) {
    if (!code) return;
    ui.barcodeStatus = `Looking up barcode ${code}...`;
    try {
      const cached = state.nutrition.barcodeCache[code];
      const product = cached || await fetchOpenFoodFacts(code);
      if (!product) {
        ui.barcodeStatus = "Barcode not found. Take a label photo or enter it manually, then save it to your foods.";
        return;
      }
      state.nutrition.barcodeCache[code] = product;
      const ok = confirm(`${product.name}\n${formatNumber(product.calories)} kcal, ${formatNumber(product.protein)}g protein per serving.\nSource: ${product.source || "Open Food Facts"}\n\nLog this now?`);
      if (ok) {
        if (!state.nutrition.entries[ui.foodDate]) state.nutrition.entries[ui.foodDate] = [];
        state.nutrition.entries[ui.foodDate].push({ ...product, ...newRecordMeta(id("food")), meal: mealForTime(), source: "barcode" });
        state.nutrition.presets = cleanFoodPresets([...state.nutrition.presets, { ...product, id: id("preset") }]);
        state.nutrition.foods = cleanFoodPresets([...(state.nutrition.foods || []), ...state.nutrition.presets]);
        updateFoodUsage(product.name);
        saveState({ reason: "barcode-log" });
      }
      ui.barcodeStatus = `Resolved ${product.name}. Verify serving and macros from the label if they look off.`;
    } catch (error) {
      ui.barcodeStatus = `Barcode lookup failed: ${error.message}`;
    }
  }

  async function fetchOpenFoodFacts(code) {
    const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(code)}.json`, {
      headers: { "Accept": "application/json" }
    });
    if (!response.ok) throw new Error("Product lookup unavailable");
    const data = await response.json();
    if (!data.product) return null;
    const nutriments = data.product.nutriments || {};
    return {
      id: id("preset"),
      barcode: code,
      name: data.product.product_name || data.product.generic_name || `Barcode ${code}`,
      brand: data.product.brands || "",
      calories: toNumber(nutriments["energy-kcal_serving"] || nutriments["energy-kcal_100g"]),
      protein: toNumber(nutriments.proteins_serving || nutriments.proteins_100g),
      carbs: toNumber(nutriments.carbohydrates_serving || nutriments.carbohydrates_100g),
      fat: toNumber(nutriments.fat_serving || nutriments.fat_100g),
      fibre: toNumber(nutriments.fiber_serving || nutriments.fiber_100g),
      water: 0,
      caffeine: 0,
      estimated: false,
      source: "Open Food Facts",
      lastVerified: data.product.last_modified_t ? new Date(data.product.last_modified_t * 1000).toISOString() : ""
    };
  }

  async function startFoodPhotoEstimate(file) {
    ui.photoEstimate = {
      source: "local-estimate",
      confidence: 0.35,
      edited: false,
      items: [
        { name: "Meal photo estimate", portion: "1 plate", calories: 650, protein: 35, carbs: 70, fat: 22, fibre: 6, confidence: 0.35 }
      ]
    };
    if (!file || !navigator.onLine) return;
    try {
      const form = new FormData();
      form.append("image", file);
      const response = await fetch(`${API_BASE}/nutrition/photo/analyse`, { method: "POST", body: form, credentials: "include" });
      if (!response.ok) return;
      const result = await response.json();
      if (Array.isArray(result.items) && result.items.length) {
        ui.photoEstimate = {
          source: "cloud-ai",
          confidence: toNumber(result.confidence) || 0.5,
          edited: false,
          imageId: result.imageId || "",
          items: result.items
        };
      }
    } catch (_) {}
  }

  function confirmPhotoFood() {
    if (!ui.photoEstimate) return;
    if (!state.nutrition.entries[ui.foodDate]) state.nutrition.entries[ui.foodDate] = [];
    ui.photoEstimate.items.forEach((item) => {
      state.nutrition.entries[ui.foodDate].push({
        ...newRecordMeta(id("food")),
        name: item.name,
        meal: mealForTime(),
        calories: toNumber(item.calories),
        protein: toNumber(item.protein),
        carbs: toNumber(item.carbs),
        fat: toNumber(item.fat),
        fibre: toNumber(item.fibre),
        water: 0,
        caffeine: 0,
        source: "photo",
        estimated: true,
        aiConfidence: item.confidence || ui.photoEstimate.confidence,
        userEditedEstimate: Boolean(ui.photoEstimate.edited)
      });
      updateFoodUsage(item.name);
    });
    ui.photoEstimate = null;
  }

  function activeSupplements() {
    return (state.supplements.items || []).filter((item) => item.active);
  }

  function supplementLog(supplementId, date) {
    const key = `${date}:${supplementId}`;
    if (!state.supplements.logs[key]) {
      state.supplements.logs[key] = {
        id: id("supp-log"),
        supplementId,
        date,
        status: "planned",
        takenAt: "",
        doseTaken: "",
        notes: ""
      };
    }
    return state.supplements.logs[key];
  }

  function supplementStatus(supplementId, date) {
    return state.supplements.logs[`${date}:${supplementId}`]?.status || "planned";
  }

  function markSupplement(supplementId, date, status) {
    const item = state.supplements.items.find((supplementItem) => supplementItem.id === supplementId);
    if (!item) return;
    const log = supplementLog(supplementId, date);
    log.status = status === "skipped" ? "skipped" : "taken";
    log.takenAt = log.status === "taken" ? new Date().toISOString() : "";
    log.doseTaken = log.status === "taken" ? `${item.dose} ${item.unit}` : "";
  }

  function pauseSupplement(supplementId) {
    const item = state.supplements.items.find((supplementItem) => supplementItem.id === supplementId);
    if (item) item.active = !item.active;
  }

  function supplementStats(date) {
    const planned = activeSupplements();
    const taken = planned.filter((item) => supplementStatus(item.id, date) === "taken").length;
    return { planned: planned.length, taken, percent: planned.length ? Math.round((taken / planned.length) * 100) : 0 };
  }

  function supplementAdherence(days) {
    let planned = 0;
    let taken = 0;
    for (let index = 0; index < days; index += 1) {
      const date = addDays(todayISO(), -index);
      const stats = supplementStats(date);
      planned += stats.planned;
      taken += stats.taken;
    }
    return planned ? Math.round((taken / planned) * 100) : 0;
  }

  function supplementStreak() {
    let streak = 0;
    let cursor = todayISO();
    while (supplementStats(cursor).percent === 100 && supplementStats(cursor).planned > 0) {
      streak += 1;
      cursor = addDays(cursor, -1);
    }
    return streak;
  }

  function generateInsights(date) {
    const items = [];
    const totals = nutritionTotals(date);
    const targets = state.nutrition.targets;
    const proteinRemaining = Math.max(0, targets.protein - totals.protein);
    items.push({
      id: `protein-${date}`,
      title: `${formatNumber(proteinRemaining)} g protein remaining today`,
      body: proteinRemaining ? "Prioritise lean protein or a WPI shake if dinner is still open." : "Protein target is effectively covered for the day.",
      basis: `Consumed ${formatNumber(totals.protein)} g against ${formatNumber(targets.protein)} g target.`
    });
    const weekly = weeklySummary(date);
    const previous = weeklySummary(addDays(weekBounds(date).start, -1));
    items.push({
      id: `run-load-${weekBounds(date).start}`,
      title: `Running load is ${formatNumber(weekly.completedKm - previous.completedKm)} km vs last week`,
      body: "This is a factual comparison, not a recovery diagnosis. Keep long-run fueling boring and repeatable.",
      basis: `This week ${formatNumber(weekly.completedKm)} km completed, previous week ${formatNumber(previous.completedKm)} km.`
    });
    const currentGym = state.gymLogs[date];
    if (currentGym) {
      const previousGym = previousMatchingGym(currentGym);
      if (previousGym) {
        const nowVolume = gymSessionSummary(currentGym).volume;
        const prevVolume = gymSessionSummary(previousGym).volume;
        const change = prevVolume ? ((nowVolume - prevVolume) / prevVolume) * 100 : 0;
        items.push({
          id: `gym-${date}`,
          title: `Today's gym volume is ${formatNumber(Math.abs(change))}% ${change >= 0 ? "higher" : "lower"} than the previous ${currentGym.muscleGroup} workout`,
          body: "Use this as context during marathon build weeks rather than a reason to chase personal bests.",
          basis: `${formatNumber(nowVolume)} kg today vs ${formatNumber(prevVolume)} kg previously.`
        });
      }
    }
    const tomorrowRun = runsForDate(addDays(date, 1)).find((session) => session.type === "Long Run");
    if (tomorrowRun && totals.carbs < targets.carbs * 0.7) {
      items.push({
        id: `carbs-${date}`,
        title: "Tomorrow includes a long run and carbs are below target",
        body: "Consider a simple carb-heavy dinner or breakfast if it suits your usual routine.",
        basis: `${formatNumber(totals.carbs)} g carbs consumed against ${formatNumber(targets.carbs)} g target.`
      });
    }
    if (supplementStreak()) {
      items.push({
        id: "supplement-streak",
        title: `Creatine and supplement routine streak: ${supplementStreak()} days`,
        body: "Consistency is the win here. No need to complicate it.",
        basis: "Daily supplement logs marked taken."
      });
    }
    if (state.settings.lastBackupDate && daysBetween(state.settings.lastBackupDate, date) >= 7) {
      items.push({
        id: "backup",
        title: `Portable backup is ${daysBetween(state.settings.lastBackupDate, date)} days old`,
        body: "Cloud sync is routine backup, but JSON export remains useful if you ever move devices.",
        basis: `Last JSON export: ${state.settings.lastBackupDate}.`
      });
    }
    const trend = bodyweightTrend();
    if (trend) {
      items.push({
        id: "bodyweight-trend",
        title: `14 day bodyweight change: ${formatNumber(trend)} kg`,
        body: "This is a rolling logged-data comparison, not a body composition assessment.",
        basis: "Latest bodyweight compared with the oldest metric in the last 14 days."
      });
    }
    return items.filter((item) => state.insights.feedback[item.id] !== "dismiss");
  }

  function setInsightFeedback(insightId, feedback) {
    state.insights.feedback[insightId] = feedback;
  }

  function previousMatchingGym(session) {
    return Object.values(state.gymLogs)
      .filter((candidate) => candidate.date < session.date && normalizeName(candidate.muscleGroup) === normalizeName(session.muscleGroup))
      .sort((a, b) => b.date.localeCompare(a.date))[0];
  }

  function bodyweightTrend() {
    const recent = state.metrics.filter((metric) => metric.date >= addDays(todayISO(), -14) && toNumber(metric.bodyweight)).sort((a, b) => a.date.localeCompare(b.date));
    if (recent.length < 2) return 0;
    return toNumber(recent[recent.length - 1].bodyweight) - toNumber(recent[0].bodyweight);
  }

  function queueSync(reason) {
    state.cloud.status = navigator.onLine ? "saving" : "offline";
    const last = state.cloud.outbox[state.cloud.outbox.length - 1];
    const change = { id: id("change"), reason, kind: "snapshot", createdAt: new Date().toISOString(), revision: Date.now() };
    if (last?.kind === "snapshot") state.cloud.outbox[state.cloud.outbox.length - 1] = change;
    else state.cloud.outbox.push(change);
    state.cloud.pendingChanges = state.cloud.outbox.length;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {}
    if (syncTimer) clearTimeout(syncTimer);
    syncTimer = setTimeout(() => syncNow("debounced"), SYNC_DEBOUNCE_MS);
  }

  async function syncNow(reason = "manual") {
    if (!state.auth.user) {
      state.cloud.status = navigator.onLine ? "local-only" : "offline";
      state.cloud.lastError = "";
      saveState({ skipSync: true });
      return;
    }
    if (!navigator.onLine) {
      state.cloud.status = "offline";
      state.cloud.lastError = "Offline - changes saved locally.";
      saveState({ skipSync: true });
      return;
    }
    state.cloud.status = "saving";
    state.cloud.lastError = "";
    saveState({ skipSync: true });
    try {
      const response = await fetch(`${API_BASE}/sync/push`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          schemaVersion: SCHEMA_VERSION,
          version: SCHEMA_VERSION,
          reason,
          deviceId: state.cloud.deviceId,
          outbox: state.cloud.outbox,
          snapshot: state
        })
      });
      if (!response.ok) throw new Error(`Sync failed (${response.status})`);
      const result = await response.json().catch(() => ({}));
      state.cloud.status = "synced";
      state.cloud.lastSyncAt = result.syncedAt || new Date().toISOString();
      state.cloud.pendingChanges = 0;
      state.cloud.outbox = [];
      state.cloud.lastError = "";
    } catch (error) {
      state.cloud.status = "error";
      state.cloud.lastError = error.message || "Sync error - tap to retry.";
    }
    saveState({ skipSync: true });
  }

  function syncStatusLabel() {
    if (state.cloud.status === "synced") return "Synced";
    if (state.cloud.status === "saving") return "Saving...";
    if (state.cloud.status === "offline") return "Offline - changes saved locally";
    if (state.cloud.status === "error") return "Sync error - tap to retry";
    return state.auth.user ? "Ready to sync" : "Local only";
  }

  function persistIndexedDbSnapshot() {
    if (!("indexedDB" in window)) return;
    openDb().then((db) => {
      const tx = db.transaction(IDB_STORE, "readwrite");
      tx.objectStore(IDB_STORE).put({ key: "state", value: state, updatedAt: new Date().toISOString() });
    }).catch(() => {});
  }

  function openDb() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(IDB_NAME, 1);
      request.onupgradeneeded = () => request.result.createObjectStore(IDB_STORE, { keyPath: "key" });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    return dbPromise;
  }

  async function requestMagicLink() {
    const input = document.getElementById("auth-email");
    const email = input?.value?.trim() || state.auth.email;
    if (!email) {
      alert("Enter your email first.");
      return;
    }
    state.auth.email = email;
    state.auth.status = "requesting-link";
    saveState({ skipSync: true });
    render();
    try {
      const response = await fetch(`${API_BASE}/auth/magic-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, timezone: state.settings.timezone, units: state.settings.units })
      });
      if (!response.ok) throw new Error(`Magic link unavailable (${response.status})`);
      state.auth.status = "link-sent";
      alert("Magic link sent. Open it on this device to finish signing in.");
    } catch (error) {
      state.auth.status = "signed-out";
      alert(`Magic-link backend is not connected yet: ${error.message}`);
    }
    saveState({ skipSync: true });
    render();
  }

  async function createCloudAccount() {
    if (!navigator.onLine) {
      alert("You need internet once to create the cloud backup account.");
      return;
    }
    const input = document.getElementById("account-display-name");
    const displayName = (input?.value || state.profiles.list[state.settings.activeProfile]?.name || "Dave").trim();
    state.auth.status = "creating-account";
    saveState({ skipSync: true });
    render();
    try {
      const response = await fetch(`${API_BASE}/device/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ displayName, timezone: state.settings.timezone, units: state.settings.units })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || `Create account failed (${response.status})`);
      applySignedInUser(result.user, result.recoveryCode, result.friendCode);
      alert(`Cloud backup created.\n\nPrivate recovery code:\n${result.recoveryCode}\n\nSave this somewhere safe. Share your friend code instead, not this recovery code.`);
      queueSync("cloud-account-created");
      await syncNow("cloud-account-created");
      await refreshFriends({ silent: true });
    } catch (error) {
      state.auth.status = "signed-out";
      state.cloud.status = "local-only";
      alert(`Could not create cloud backup: ${error.message}`);
    }
    saveState({ skipSync: true });
    render();
  }

  async function restoreCloudAccount() {
    if (!navigator.onLine) {
      alert("You need internet to restore a cloud backup.");
      return;
    }
    const recoveryCode = prompt("Enter your private Hybrid Tracker recovery code.");
    if (!recoveryCode) return;
    state.auth.status = "restoring-account";
    saveState({ skipSync: true });
    render();
    try {
      const response = await fetch(`${API_BASE}/device/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ recoveryCode })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || `Restore failed (${response.status})`);
      applySignedInUser(result.user, result.recoveryCode || recoveryCode, result.friendCode);
      const pulled = await pullCloudSnapshot();
      if (pulled?.snapshot) {
        const replace = confirm("Cloud data was found. Restore it onto this device?");
        if (replace) applyPulledSnapshot(pulled.snapshot, result.user, result.recoveryCode || recoveryCode, result.friendCode);
      } else {
        queueSync("cloud-account-restored");
        await syncNow("cloud-account-restored");
      }
      await refreshFriends({ silent: true });
    } catch (error) {
      state.auth.status = "signed-out";
      alert(`Could not restore cloud backup: ${error.message}`);
    }
    saveState({ skipSync: true });
    render();
  }

  function applySignedInUser(user, recoveryCode = "", friendCode = "") {
    state.auth.user = user;
    state.auth.status = "signed-in";
    state.auth.recoveryCode = recoveryCode || state.auth.recoveryCode || "";
    state.auth.friendCode = friendCode || user?.friendCode || state.auth.friendCode || "";
    state.auth.email = "";
    state.cloud.status = "ready";
    state.cloud.lastError = "";
    if (state.cloud.v3ImportStatus === "local") state.cloud.v3ImportStatus = "ready";
  }

  async function pullCloudSnapshot() {
    const response = await fetch(`${API_BASE}/sync/pull`, { credentials: "include" });
    if (!response.ok) return null;
    return response.json().catch(() => null);
  }

  function applyPulledSnapshot(snapshot, user, recoveryCode, friendCode) {
    const deviceId = state.cloud.deviceId || state.settings.deviceId;
    const restored = migrateState(snapshot);
    restored.settings.deviceId = deviceId;
    restored.cloud.deviceId = deviceId;
    restored.auth.user = user;
    restored.auth.status = "signed-in";
    restored.auth.recoveryCode = recoveryCode || "";
    restored.auth.friendCode = friendCode || user?.friendCode || "";
    restored.cloud.status = "synced";
    restored.cloud.lastSyncAt = new Date().toISOString();
    state = restored;
  }

  async function addFriend() {
    if (!state.auth.user) {
      alert("Create or restore a cloud backup first.");
      return;
    }
    const friendCode = prompt("Enter your mate's friend code. It starts with FR-.");
    if (!friendCode) return;
    try {
      const response = await fetch(`${API_BASE}/friends/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ friendCode })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || `Add mate failed (${response.status})`);
      await refreshFriends({ silent: true });
      alert(`${result.friend?.displayName || "Mate"} added to your training circle.`);
    } catch (error) {
      state.friends.lastError = error.message;
      alert(`Could not add mate: ${error.message}`);
    }
    saveState({ skipSync: true });
    render();
  }

  async function refreshFriends(options = {}) {
    if (!state.auth.user || !navigator.onLine) return;
    try {
      const response = await fetch(`${API_BASE}/friends/progress`, { credentials: "include" });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || `Refresh failed (${response.status})`);
      state.friends.items = result.friends || [];
      state.friends.lastFetchedAt = result.fetchedAt || new Date().toISOString();
      state.friends.lastError = "";
    } catch (error) {
      state.friends.lastError = error.message || "Could not refresh mates.";
      if (!options.silent) alert(state.friends.lastError);
    }
    saveState({ skipSync: true });
    if (!options.silent) render();
  }

  async function copyText(value, successMessage) {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      alert(successMessage);
    } catch (_) {
      prompt("Copy this code:", value);
    }
  }

  async function refreshSession() {
    if (location.protocol === "file:" || !navigator.onLine) return;
    try {
      const response = await fetch(`${API_BASE}/session`, { credentials: "include" });
      if (!response.ok) return;
      const result = await response.json();
      if (result.user && (!state.auth.user || state.auth.user.id !== result.user.id)) {
        applySignedInUser(result.user, state.auth.recoveryCode, result.user.friendCode || state.auth.friendCode);
        state.cloud.status = state.cloud.status === "local-only" ? "ready" : state.cloud.status;
        saveState({ skipSync: true });
        render();
      }
    } catch (_) {}
  }

  function signOut() {
    state.auth.user = null;
    state.auth.recoveryCode = "";
    state.auth.friendCode = "";
    state.auth.status = "signed-out";
    state.cloud.status = "local-only";
    state.cloud.lastError = "";
    saveState({ skipSync: true });
    render();
  }

  async function deleteAccountData() {
    const first = prompt("Delete all account data? Type DELETE to continue.");
    if (first !== "DELETE") return;
    const second = confirm("Second confirmation: this requests deletion of cloud account data and signs this device out.");
    if (!second) return;
    try {
      await fetch(`${API_BASE}/account/delete`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ confirmation: "DELETE" }) });
    } catch (_) {}
    signOut();
  }

  function importLocalDataToCloud() {
    if (!state.auth.user) {
      alert("Sign in before importing local data to cloud.");
      return;
    }
    try {
      const backupKey = `${STORAGE_KEY}:pre-cloud-import:${todayISO()}`;
      localStorage.setItem(backupKey, JSON.stringify(state));
      state.cloud.migrationBackupKey = backupKey;
    } catch (_) {}
    if (state.cloud.v3ImportStatus === "imported") return;
    state.cloud.v3ImportStatus = "imported";
    queueSync("v3-import");
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator) || location.protocol === "file:") return;
    navigator.serviceWorker.register("sw.js").then((registration) => {
      if (registration.waiting) {
        ui.updateAvailable = registration.waiting;
        render();
      }
      registration.addEventListener("updatefound", () => {
        const worker = registration.installing;
        if (!worker) return;
        worker.addEventListener("statechange", () => {
          if (worker.state === "installed" && navigator.serviceWorker.controller) {
            ui.updateAvailable = worker;
            render();
          }
        });
      });
    }).catch(() => {});
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshingForUpdate) return;
      refreshingForUpdate = true;
      location.reload();
    });
  }

  function activateWaitingServiceWorker() {
    const worker = ui.updateAvailable;
    if (!worker) {
      location.reload();
      return;
    }
    worker.postMessage({ type: "SKIP_WAITING" });
  }

  function exportData() {
    state.settings.lastBackupDate = todayISO();
    state.settings.lastManualExportDate = todayISO();
    saveState();
    const payload = { app: "Hybrid Tracker", exportedAt: new Date().toISOString(), state, runPlan: RUN_PLAN };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `hybrid-tracker-backup-${todayISO()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    render();
  }

  function importData(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        const incoming = parsed.state || parsed;
        if (!incoming || typeof incoming !== "object") throw new Error("Invalid backup");
        if (!confirm("Import this JSON backup and replace current local data?")) return;
        state = migrateState(incoming);
        state.settings.lastImportDate = todayISO();
        saveState();
        render();
      } catch (error) {
        alert(`Import failed: ${error.message}`);
      }
    };
    reader.readAsText(file);
  }

  function resetData() {
    const warning = "This will permanently delete all workout, run, nutrition, stretching and body metric data stored on this device.";
    const response = prompt(`${warning}\n\nType DELETE to confirm.`);
    if (response !== "DELETE") return;
    state = migrateState({});
    saveState();
    render();
  }

  function needsBackupReminder() {
    if (state.settings.backupDismissedDate === todayISO()) return false;
    if (!state.settings.lastBackupDate) return true;
    return daysBetween(state.settings.lastBackupDate, todayISO()) >= 7;
  }

  function statusOptions(current) {
    return ["planned", "completed", "skipped", "moved"].map((status) => `<option value="${status}" ${status === current ? "selected" : ""}>${statusLabel(status)}</option>`).join("");
  }

  function statusLabel(status) {
    const clean = normalizeStatus(status);
    return clean.charAt(0).toUpperCase() + clean.slice(1);
  }

  function normalizeStatus(status) {
    return ["planned", "completed", "skipped", "moved"].includes(status) ? status : "planned";
  }

  function badgeClass(type) {
    const value = normalizeName(type);
    if (value.includes("easy")) return "easy";
    if (value.includes("interval")) return "intervals";
    if (value.includes("tempo")) return "tempo";
    if (value.includes("hill")) return "hills";
    if (value.includes("long")) return "long";
    if (value.includes("race")) return "race";
    return "";
  }

  function calculatePace(distance, time) {
    const km = toNumber(distance);
    const seconds = parseTime(time);
    if (!km || !seconds) return "";
    const pace = seconds / km;
    const mins = Math.floor(pace / 60);
    const secs = Math.round(pace % 60).toString().padStart(2, "0");
    return `${mins}:${secs}/km`;
  }

  function parseTime(value) {
    if (!value) return 0;
    const text = String(value).trim();
    if (/^\d+(\.\d+)?$/.test(text)) return Number(text) * 60;
    const parts = text.split(":").map(Number);
    if (parts.some(Number.isNaN)) return 0;
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return 0;
  }

  function setVolume(set) {
    return toNumber(set.weight) * toNumber(set.reps);
  }

  function estimatedOneRm(set) {
    const weight = toNumber(set.weight);
    const reps = toNumber(set.reps);
    return weight && reps ? weight * (1 + reps / 30) : 0;
  }

  function repSeed(reps) {
    const match = String(reps).match(/\d+/);
    return match ? match[0] : "";
  }

  function weekNumberForDate(date) {
    return PLAN_WEEKS.find((week) => date >= week.start && date <= addDays(week.start, 6))?.week || 1;
  }

  function rotationNote(date) {
    const block = Math.floor((weekNumberForDate(date) - 1) / 5) + 1;
    return `Rotation block ${block}: keep staples, rotate accessories every 4-6 weeks, avoid excessive leg fatigue after long runs.`;
  }

  function weekBounds(date) {
    const parsed = parseISO(date);
    const offset = (parsed.getDay() + 6) % 7;
    const start = new Date(parsed);
    start.setDate(start.getDate() - offset);
    return { start: toISO(start), end: addDays(toISO(start), 6) };
  }

  function dayName(date) {
    return DAY_ORDER.find((day) => DAY_INDEX[day] === parseISO(date).getDay()) || "Monday";
  }

  function todayISO() {
    return toISO(new Date());
  }

  function addDays(date, days) {
    const parsed = parseISO(date);
    parsed.setDate(parsed.getDate() + days);
    return toISO(parsed);
  }

  function parseISO(value) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  function toISO(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  function isISODate(value) {
    return /^\d{4}-\d{2}-\d{2}$/.test(value || "");
  }

  function formatShortDate(date) {
    return parseISO(date).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }

  function formatLongDate(date) {
    return parseISO(date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  }

  function shortDate(date) {
    return parseISO(date).toLocaleDateString(undefined, { month: "numeric", day: "numeric" });
  }

  function daysUntil(date) {
    return Math.max(0, daysBetween(todayISO(), date));
  }

  function daysBetween(start, end) {
    return Math.round((parseISO(end) - parseISO(start)) / 86400000);
  }

  function percentBetween(start, end, current) {
    return pct(daysBetween(start, current), daysBetween(start, end));
  }

  function pct(value, total) {
    return total ? clamp((toNumber(value) / toNumber(total)) * 100, 0, 100) : 0;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, Number.isFinite(value) ? value : 0));
  }

  function toNumber(value) {
    const number = Number.parseFloat(value);
    return Number.isFinite(number) ? number : 0;
  }

  function formatNumber(value) {
    const number = toNumber(value);
    return Math.abs(number - Math.round(number)) < 0.05 ? String(Math.round(number)) : number.toFixed(1);
  }

  function normalizeName(value) {
    return String(value || "").toLowerCase().trim();
  }

  function id(prefix) {
    return `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  function escapeAttr(value) {
    return escapeHtml(value);
  }
})();
