export type NowSnapshot = {
  date: string;                                   // date of the commit that published it
  sections: { label: string; text: string }[];    // label without the "// " prefix
};

// newest-first. Snapshots are history: never edit their text.
export const nowArchive: NowSnapshot[] = [
  {
    date: "2026-11-02",
    sections: [
      { label: "tutoring", text: "Tutoring still pays the bills. It's the ground everything else stands on, so it stays." },
      { label: "training", text: "The marathon on October 16 went better than I had any right to expect: 4:58, my first under five hours, 32 minutes off my best. Since then the body has asked for a break, and I'm trying to actually give it one. The Comilla 50K on November 6 gets decided the day before, against a list I wrote while calm. Two November races were postponed by their organisers, which made the month quieter than planned." },
      { label: "races", text: "What's left: Satkania half (December), Dhaka (December), Coastal Ultra (December), Dhaka 25K (January). The one that matters is the Coastal Ultra on December 18 — the 100K, if I'm selected. Full calendar's on the running page." },
      { label: "learning", text: "Module two: networking, from the wire up. About halfway — TCP and TLS right now. It closes by the end of November, and the test is an HTTP server written on a raw socket, without AI. Chess: my first tournament was on October 24 — eight games, 29th of 212. Now it's puzzles or one game a day." },
      { label: "building", text: "The Machine Beneath Your Code is finished and out in the world: eight articles, in Bangla and English. The board-exam rankings site was updated for the HSC 2026 results on October 31. The registration portal I built for Triathlon Bangladesh runs two events. ArcZero is still live." },
      { label: "this month", text: "Doing less, on purpose. One focused task at a time. The phone goes away after the last tuition. Fewer races, more reading." },
    ],
  },
  {
    date: "2026-10-06",
    sections: [
      { label: "tutoring", text: "Tutoring still pays the bills. It's the ground everything else stands on, so it stays." },
      { label: "training", text: "Active Pulse Marathon on October 16 is the next start line, so this is taper — less volume, more rest, trying not to fill the space with something new. On October 2 I ran 35 kilometres, the longest training run I've done. In September: a 10K in 55m 52s, my best at that distance. Full calendar's on the running page." },
      { label: "races", text: "After that the autumn gets crowded: RRC half (October), Comilla 50K (November), Cox's Bazar (November), Bandarban 52K (November), Satkania half (December), Dhaka (December), Coastal Ultra (December). Not all of them will happen; each one gets decided two weeks out. The one that matters is the Coastal Ultra on December 18 — the 100K, if I get in." },
      { label: "learning", text: "Networking, from the ground up — how a request actually crosses the wire. The test at the end is an HTTP server written on a raw socket, without AI. And chess, properly this time: started in September, first one-day tournament on October 24." },
      { label: "building", text: "The Machine Beneath Your Code is finished: eight articles, in Bangla and English. The registration portal I built for Triathlon Bangladesh now runs two events. The board-exam rankings site served the SSC results in August, and a lot of students checked where they stood on it. ArcZero is still live. From here it's one thing at a time." },
    ],
  },
  {
    date: "2026-07-03",
    sections: [
      { label: "tutoring", text: "Tutoring still pays the bills — around fourteen of them now, and most of my daylight. It's the ground everything else stands on, so it stays, even when it crowds the rest." },
      { label: "training", text: "Seven days out from the Chatto Metro Half Marathon, so this is taper week — less volume, more rest, trying not to invent new work to fill the space. The base is real now: I ran Dhaka 25K in 2:32 in June, even splits, first race back after a long injury stretch. The schedule shifted this month — tuitions moved to 7am, so training is a post-Fajr window now, roughly 5:15 to 6:45. Full calendar's on the running page." },
      { label: "races", text: "Chatto Metro Half Marathon on July 10 is next — targeting 2:05 to 2:10. After that, Sylhet International Marathon in August, then a heavier autumn: Chattogram in October, the Albatross Ultrail, Cox's Bazar in November. The 100K is still the line I'm walking toward, not across, yet." },
      { label: "building", text: "This site, which you're reading — finally current, finally announced. ArcZero shipped and now has an online leaderboard. There's a second game in my head and a rebuild of an older project (a rental marketplace) taking most of my building hours right now. Tech writing is queued — the first piece is drafting. Priority stays where it's been: income, the body, and shipping the things I actually mean to finish." },
    ],
  },
  {
    date: "2026-05-10",
    sections: [
      { label: "tutoring", text: "Lately, tutoring has taken over most of my schedule. I picked up a couple of new ones this month too. Most mornings, afternoons and even late evenings are gone now, and the gaps in between are used for catching up with everything else. It’s financially necessary right now, but it’s cutting into the time I want for training, studying, and the website." },
      { label: "training", text: "Training has finally become structured again after a long inconsistent stretch. Right now it’s a mix of running, strength work, and swimming. Still trying to rebuild rhythm and consistency. The heat knocked me off balance for a few days last week, so the body feels a bit rusty at the moment, but things are moving again." },
      { label: "races", text: "registered for dhaka run 25k on june 19. first race back. not pushing for a time — just want to finish without re-aggravating anything. the calendar after that is in the running page." },
      { label: "building", text: "this site, mostly. arczero shipped, second game is in head only. reading nexus when i can. the cs course on the side has slowed down. priority right now is income and the body." },
    ],
  },
];
