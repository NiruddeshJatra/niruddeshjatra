export interface ChangelogEntry {
  hash: string;
  date: string;
  message: string;
}

export const CHANGELOG: ChangelogEntry[] = [
  { hash: "0000000", date: "2001-12", message: "boot sequence: human initialized" },
  { hash: "a4d8e21", date: "2018-08", message: "exit: stepped off the paved road" },
  { hash: "7e2c901", date: "2022-01", message: "reboot: started learning on my own terms" },
  { hash: "3f0a9b4", date: "2022-10", message: "body/start: first marathon training block" },
  { hash: "8c1d4f7", date: "2024-02", message: "body/proof: completed first 52K ultra, bandarban hills" },
  { hash: "b5e1d83", date: "2025-11", message: "body/break: ran a marathon injured. finished. then couldn't walk." },
  { hash: "5f8a3c1", date: "2025-12", message: "body/test: 26K of a 52K hill ultra walked with a stick. finished." },
  { hash: "2a8b3e5", date: "2026-04", message: "workshop/start: started building arczero" },
  { hash: "6e9f7c2", date: "2026-04", message: "exit: resigned. no more jobs." },
  { hash: "HEAD",    date: "2026-05", message: "current: shipping arczero, training for 100k" },
];
