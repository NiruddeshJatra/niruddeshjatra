interface Quote {
  text: string;
  attribution?: string;
  lang?: "bn";
}

export const QUOTES: Quote[] = [
  { text: "the obstacle is the path.", attribution: "old chinese saying" },
  { text: "the only honest answer is: 'i don't know.'", attribution: "bukowski" },
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
  { text: "in the end, it doesn't even matter.", attribution: "linkin park" },
  { text: "i tried so hard and got so far.", attribution: "linkin park" },
  { text: "i wanted to be the one in control.", attribution: "linkin park" },
  { text: "success is my only motherfuckin' option, failure's not.", attribution: "eminem" },
  { text: "you only get one shot, do not miss your chance to blow.", attribution: "eminem" },
  { text: "i am whatever you say i am.", attribution: "eminem" },
  { text: "অনিকেত প্রান্তর, আমি যেখানে দাঁড়িয়ে।", attribution: "artcell", lang: "bn" },
  { text: "এক বিন্দু আশা নিয়ে চলছি প্রতিদিন।", attribution: "artcell", lang: "bn" },
  { text: "never mind, i'll find someone like you.", attribution: "adele" },
  { text: "we could have had it all.", attribution: "adele" },
  { text: "এই শহরের গলিতে কত গল্প হারিয়ে যায়।", attribution: "meghdol", lang: "bn" },
  { text: "আমার আকাশ ছোঁয়ার গান।", attribution: "meghdol", lang: "bn" },
  { text: "you do not rise to the level of your goals. you fall to the level of your systems.", attribution: "james clear" },
  { text: "the cave you fear to enter holds the treasure you seek.", attribution: "campbell" },
  { text: "it is not death that a man should fear, but he should fear never beginning to live.", attribution: "marcus aurelius" },
  { text: "we are what we repeatedly do.", attribution: "paraphrased aristotle" },
  { text: "the body keeps the score." },
  { text: "read 100 books once. don't read one book 100 times." },
];

const dayIndex = () => {
  const now = new Date();
  const year = now.getFullYear();
  const startOfYear = Date.UTC(year, 0, 0);
  const dayOfYear = Math.floor((Date.now() - startOfYear) / 86400000);
  return year * 365 + dayOfYear;
};

export const getTodaysQuote = () => QUOTES[dayIndex() % QUOTES.length];
