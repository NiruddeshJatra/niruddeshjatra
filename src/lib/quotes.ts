interface Quote {
  text: string;
  attribution?: string;
  lang?: "bn";
}

export const QUOTES: Quote[] = [
  { text: "the obstacle is the path.", attribution: "old chinese saying" },
  { text: "the only honest answer is: 'i don't know.'", attribution: "bukowski" },
  { text: "my dear, find what you love and let it kill you.", attribution: "bukowski" },
  { text: "every history is the history of disagreement.", attribution: "harari" },
  { text: "all the world's a chessboard. and i still play e4." },
  { text: "the shortest distance between two points is the long way home." },
  { text: "order without truth rots. truth without order collapses." },
  { text: "what we do every day matters more than what we do once in a while." },
  { text: "finished is better than perfect, and walked is better than quit." },
  { text: "the slow part is the point." },
  { text: "i'm 27 and i don't know yet." },
  { text: "you can't out-run a bad diet, but you can run with one." },
  { text: "the best move makes your opponent uncomfortable.", attribution: "kasparov" },
  { text: "i bleed it out, diggin' deeper just to throw it away.", attribution: "linkin park" },
  { text: "i tried so hard and got so far.", attribution: "linkin park" },
  { text: "cover up your face, you can't run the race, the pace is too fast, you just won't last.", attribution: "linkin park" },
  { text: "in the land of the killers, a sinner's mind is a sanctum.", attribution: "eminem" },
  { text: "i'm doin' this for me, so fuck the world, feed it beans.", attribution: "eminem" },
  { text: "he's nervous, but on the surface, he looks calm and ready.", attribution: "eminem" },
  { text: "never mind, i'll find someone like you.", attribution: "adele" },
  { text: "we could have had it all.", attribution: "adele" },
  { text: "it is not death that a man should fear, but he should fear never beginning to live.", attribution: "marcus aurelius" },
  { text: "we are what we repeatedly do.", attribution: "paraphrased aristotle" },
  { text: "the body keeps the score." },
  { text: "The Gods envy us. They envy us because we're mortal, because any moment might be our last.", attribution: "achilles" },
  { text: "my mama always said you've got to put the past behind you before you can move on.", attribution: "forrest gump" },
];

const dayIndex = () => {
  const now = new Date();
  const year = now.getFullYear();
  const startOfYear = Date.UTC(year, 0, 0);
  const dayOfYear = Math.floor((Date.now() - startOfYear) / 86400000);
  return year * 365 + dayOfYear;
};

export const getTodaysQuote = () => QUOTES[dayIndex() % QUOTES.length];
