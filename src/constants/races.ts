export type RaceEntry = {
  date: string;
  dist: string;
  event: string;
  time: string;
  note?: string;
  flag?: boolean;
  skip?: boolean;
};

export const races: RaceEntry[] = [
  {
    date: "2023-01-20", dist: "21.1K", event: "Bangabandhu International Marathon", time: "2h 07m",
    note: "got to the race point 5 minutes late, still managed\na better-than-expected time. nobody knew i was running.",
  },
  {
    date: "2023-02-23", dist: "25K", event: "Run Bangladesh CU", time: "2h 53m",
    note: "misty winter morning. ran the first 30 minutes chatting\nwith a foreign participant. cramped a few times.\nmy father came to watch.",
  },
  {
    date: "2023-03-17", dist: "21.1K", event: "Rajshahi Half Marathon", time: "2h 04m",
    note: "first time in rajshahi. saw the padma. my father ran\na 3K event with me — first time we raced together.",
  },
  {
    date: "2023-09-29", dist: "10K", event: "Mirpur 10K", time: "1h 02m",
    flag: true,
    note: "restart event after a gap. walked dhaka for 4 hours\nafterwards — left foot started hurting.\nbecame an injury later.",
  },
  {
    date: "2023-10-04", dist: "21.1K", event: "UCR Half Marathon", time: "2h 45m",
    flag: true,
    note: "ran injured. pain hit at 7K. finished anyway.",
  },
  {
    date: "2023-10-20", dist: "21.1K", event: "Sunamganj Half Marathon", time: "2h 20m",
    note: "first time in sunamganj. stayed two days. tanguar haor,\nniladri lake. wanted a better timing, didn't get it.",
  },
  {
    date: "2023-11-02", dist: "25K", event: "Run Bangladesh Sylhet", time: "3h 10m",
    note: "family trip to sylhet. cramped hard near the end.",
  },
  {
    date: "2023-11-17", dist: "10K", event: "CR 10K", time: "57m",
    note: "hometown race in chattogram. finished strong.\nmy friend also participated for the first time.",
  },
  {
    date: "2024-01-10", dist: "42.2K", event: "Bangabandhu International Marathon", time: "5h 30m",
    note: "first full marathon. cramps everywhere.\nwent to dhaka with the friend who ran 21.1K in that event.",
  },
  {
    date: "2024-02-24", dist: "52K", event: "Vertical Dreamers Ultra (bandarban)", time: "8h 20m",
    flag: true,
    note: "first hill ultra. ~1000m elevation gain.\nat the end i wished i'd stopped. didn't.",
  },
  {
    date: "2024-03-07", dist: "25K", event: "Run Bangladesh Dhaka", time: "2h 36m",
    note: "reached late, missed the baggage drop, ran the first\n5K carrying my bag. still my strongest, fastest finish.",
  },
];

export const racesAfterGap: RaceEntry[] = [
  {
    date: "2025-10-18", dist: "21.1K", event: "Bandarban Hill Half Marathon", time: "2h 30m",
    note: "back on track. tough. no injury.",
  },
  {
    date: "2025-11-01", dist: "42.2K", event: "Cox's Bazar Full Marathon", time: "5h 30m",
    note: "family came on the trip. roamed the seabeach.\nran sick, finished strong. foot injury appeared after.",
  },
  {
    date: "2025-11-08", dist: "42.2K", event: "Comilla Full Marathon", time: "6h 20m",
    flag: true,
    note: "back-to-back full a week later. shouldn't have run.\nwent anyway. first time in comilla. finished slow.\ninjury kept worsening.",
  },
  {
    date: "2025-12-05", dist: "52K", event: "Vertical Dreamers Ultra (bandarban)", time: "~9h 00m",
    flag: true,
    note: "the toughest event i've run. side tendons blew at\n26K. walked the rest with a stick. 6h for the last 26K.\nfinished.",
  },
  {
    date: "2026-01-03", dist: "21.1K", event: "Bhatiyari Half Marathon", time: "3h 05m",
    flag: true,
    note: "walked most of it. running triggered the injury.",
  },
  {
    date: "2026-06-19", dist: "25K", event: "Dhaka Run 25K", time: "2h 32m",
    flag: true,
    note: "first race back after the injury months. even splits —\nsecond half matched the first. right glute gave out at km 18.\n68th of 942. strongest comeback i could've asked for.",
  },
  {
    date: "2026-08-21", dist: "21.1K", event: "Chatto Metro Half Marathon", time: "2h 10m",
    note: "first race off the summer injury. the watch said 20 km —\nshort course or short gps, not sure which. 68th of 340.",
  },
  {
    date: "2026-09-18", dist: "10K", event: "Sports Bangla Men's Run", time: "55m 52s",
    note: "a new 10k best, by about a minute. 38th of 803.",
  },
];

export const skipped: RaceEntry[] = [
  {
    date: "2025-12-25", dist: "6h", event: "Stadium Run", time: "did not run",
    note: "knee hadn't recovered. consulted a doctor. wasn't\ngoing to make 6 hours. one of my dream events.",
  },
  {
    date: "2026-02-05", dist: "50K", event: "Bhawal Ultra Marathon", time: "did not run",
    note: "registered months ahead. by the date, i knew the leg\nwouldn't finish. didn't go.",
  },
  {
    date: "2026-08-08", dist: "42.2K", event: "Sylhet International Marathon", time: "did not run",
    note: "toe hurt at football in taper week. i'd written down,\na week before, when i wouldn't start. it held.\nthe sylhet trip went with it.",
  },
];

export type CalEntry = {
  date: string;
  dist: string;
  event: string;
  weight: "phosphor" | "body" | "dim";
  /** casual short name for prose references (e.g. now page) — falls back to `event` with any trailing year stripped */
  short?: string;
};

export const cal: CalEntry[] = [
  { date: "2026-10-16", dist: "42.2K", event: "Active Pulse Chattogram Marathon", weight: "phosphor", short: "Active Pulse Marathon" },
  { date: "2026-10-23", dist: "21.1K", event: "BM LP Gas RRC Half Marathon", weight: "body", short: "RRC half" },
  { date: "2026-11-06", dist: "50K", event: "Comilla Trail Ultra", weight: "phosphor", short: "Comilla 50K" },
  { date: "2026-11-14", dist: "42.2K", event: "Cox's Bazar International Marathon", weight: "body", short: "Cox's Bazar" },
  { date: "2026-11-27", dist: "52K", event: "Vertical Dreamers Ultra (bandarban)", weight: "dim", short: "Bandarban 52K" },
  { date: "2026-12-04", dist: "21.1K", event: "MSDO Satkania Half Marathon", weight: "dim", short: "Satkania half" },
  { date: "2026-12-12", dist: "21.1K / 42.2K", event: "Dhaka International Marathon", weight: "dim", short: "Dhaka" },
  { date: "2026-12-18", dist: "100K", event: "Coastal Ultra 2026", weight: "phosphor", short: "Coastal Ultra" },
];

// last completed race — source of truth for the "most recent result" facts referenced on the now page
export const lastRace = racesAfterGap[racesAfterGap.length - 1];

// next race on the calendar — source of truth for "what's next" facts referenced on the now page
export const nextRace = cal[0];

// races after the next one, in calendar order
export const upcomingRaces = cal.slice(1);

export function formatRaceDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const monthName = new Date(year, month - 1, day).toLocaleString("en-US", { month: "long" });
  return `${monthName} ${day}`;
}

export function formatRaceMonth(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleString("en-US", { month: "long" });
}

export function displayName(entry: Pick<CalEntry, "event" | "short">): string {
  return entry.short ?? entry.event.replace(/\s\d{4}$/, "");
}
