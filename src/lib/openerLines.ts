type OpenerLine = string;

export const OPENER_LINES: OpenerLine[] = [
  "training, building, writing.",
  "mostly tutoring this week.",
  "between two long things.",
  "tired in a way that means it's working.",
  "recovery week. easy miles only.",
  "coding more than running this stretch.",
  "mid-essay. sitting still longer than usual.",
  "catching up on everything at once.",
  "cleaner week than most.",
  "thinking about mountains more than i should be.",
  "reading nexus, between everything else.",
  "restless. typical.",
  "planning more than doing, lately.",
  "the heat is winning today.",
  "learning to swim, badly.",
  "chai over coffee.",
  "running into walls, gently.",
  "fixing what i shipped yesterday.",
  "tired but not done.",
  "one more chapter, then sleep.",
  "updating in small bursts.",
  "building one room at a time.",
  "between drafts.",
  "trying to want less.",
  "trying to do hard things slowly.",
  "quiet day. that's enough.",
  "small steps. several of them.",
];

export const getTodaysOpenerLine = (): OpenerLine => {
  const dayOfYear = Math.floor((Date.now() - Date.UTC(new Date().getFullYear(), 0, 0)) / 86400000);
  return OPENER_LINES[dayOfYear % OPENER_LINES.length];
};
