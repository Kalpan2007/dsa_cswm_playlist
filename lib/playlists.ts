// All playlists from codestorywithMIK, in the FINAL ORDER.
//
// videos: number[]  -> one checkbox per video number
// videos: "all"     -> the playlist is done as a whole, so it gets ONE checkbox
//
// Tip: when you know how many videos an "all" playlist has, replace "all"
// with range(1, N) to get one checkbox per video instead.

export type Playlist = {
  slug: string;
  name: string;
  group: string;
  videos: number[] | "all";
  url?: string; // optional: paste the real YouTube playlist link here
};

const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i);

type Raw = Omit<Playlist, "slug">;

const raw: Raw[] = [
  // ── Foundations
  { group: "Foundations", name: "C++ STL / Java JCF", videos: [1, 2, 3, 4, 5, 6, 9] },
  {
    group: "Foundations",
    name: "Arrays (1-D & 2-D)",
    videos: [1, 2, 3, 4, 7, 8, 9, 10, 15, 18, 19, 22, 23, 29, 31, 32, 33, 34, 39, 40, 44, 46, 47, 48, 50, 55, 58, 62, 63, 64, 72, 73, 80, 82, 85, 86, 87, 88, 95, 97, 100, 105, 107, 110, 112, 115, 120, 124, 126, 128, 131, 132, 134, 137, 143, 144, 145, 147, 149, 150, 153, 160, 167, 181, 189],
  },
  { group: "Foundations", name: "Hash Map / Set", videos: [1, 2, 3, 4, 6, 7, 9, 10, 11, 13, 16, 17, 18, 19, 21, 23, 25, 31, 32, 34] },

  // ── Core techniques
  { group: "Core techniques", name: "Sorting", videos: range(1, 10) },
  { group: "Core techniques", name: "Two Pointers", videos: range(1, 15) },
  {
    group: "Core techniques",
    name: "Sliding Window",
    videos: [1, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 19, 21, 23, 24, 25, 26, 27, 30, 31, 32, 33, 36, 37, 38, 39, 40, 43, 44, 48, 50],
  },
  { group: "Core techniques", name: "Difference Array Technique", videos: range(1, 10) },
  {
    group: "Core techniques",
    name: "Binary Search",
    videos: [1, 2, 3, 4, 6, 7, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21, 22, 23, 24, 26, 27, 29, 30, 31, 32, 34, 35, 37, 38, 39, 40, 41, 42, 45, 46, 47, 48, 50],
  },
  { group: "Core techniques", name: "Stack", videos: [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29] },
  { group: "Core techniques", name: "Queue Popular Interview Problems", videos: "all" },
  { group: "Core techniques", name: "Monotonic Data Structures", videos: "all" },
  { group: "Core techniques", name: "Heap", videos: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28] },

  // ── Recursion & trees
  { group: "Recursion & trees", name: "Linked List", videos: [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29] },
  { group: "Recursion & trees", name: "Recursion Concepts and Questions", videos: "all" },
  { group: "Recursion & trees", name: "Recursion: Popular Interview Problems", videos: "all" },
  { group: "Recursion & trees", name: "Backtracking", videos: [1, 2, 3, 4, 5, 6, 7, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24] },
  {
    group: "Recursion & trees",
    name: "Binary Tree",
    videos: [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 38, 40, 41, 42, 43],
  },
  { group: "Recursion & trees", name: "Binary Search Tree (BST)", videos: "all" },
  { group: "Recursion & trees", name: "N-Ary Tree", videos: "all" },
  { group: "Recursion & trees", name: "Bit Manipulation", videos: [1, 2, 3, 4, 5, 7, 8, 11, 12, 13, 15, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28] },
  { group: "Recursion & trees", name: "Trie", videos: "all" },

  // ── Graphs, greedy & DP
  {
    group: "Graphs, greedy & DP",
    name: "Graph Concepts & Qns: Convert Story To Code",
    videos: [1, 2, 3, 4, 5, 6, 7, 8, 9, 16, 17, 18, 19, 20, 21, 24, 25, 26, 27, 28, 30, 31, 32, 33, 34, 36, 38, 43, 46, 49],
  },
  {
    group: "Graphs, greedy & DP",
    name: "Graphs",
    videos: [1, 3, 5, 7, 8, 14, 15, 17, 19, 20, 21, 26, 27, 29, 30, 31, 34, 35, 36, 40, 44, 47, 48, 49, 51, 52, 54, 56, 59, 60, 62, 65, 68, 73],
  },
  {
    group: "Graphs, greedy & DP",
    name: "Greedy",
    videos: [1, 2, 4, 5, 6, 7, 12, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 26, 27, 28, 31, 34, 35, 36, 37, 38, 39, 40, 41, 43, 45, 47, 49, 51, 52, 55, 57, 59, 63, 64, 68],
  },
  {
    group: "Graphs, greedy & DP",
    name: "DP Concepts & Qns: Convert Story To Code",
    videos: [1, 2, 3, 4, 5, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19, 20, 22, 23, 25, 27, 28, 29, 30, 31, 32, 33, 34, 36, 38, 39, 41, 42, 43, 44],
  },
  {
    group: "Graphs, greedy & DP",
    name: "Dynamic Programming",
    videos: [1, 2, 3, 4, 5, 6, 8, 11, 12, 13, 14, 17, 18, 19, 20, 22, 23, 25, 26, 28, 29, 30, 31, 33, 34, 35, 36, 37, 38, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 55, 56, 58, 59, 60, 61, 62, 64, 66, 67, 69, 70, 71, 73, 74, 75, 76, 77, 80, 81, 82, 83, 85, 88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 100, 103, 104, 105, 107, 109, 110, 112, 113, 114, 115, 116, 117, 120, 123, 124, 125, 126, 127, 128, 129, 131, 133, 134, 135, 136, 137, 138, 139, 140, 143, 144, 145, 146, 147, 148, 150, 151, 152, 153, 154, 155, 156, 157],
  },

  // ── Advanced
  { group: "Advanced", name: "Binary Lifting & DP on Trees", videos: "all" },
  { group: "Advanced", name: "Segment Tree Concepts and Questions", videos: [...range(1, 16), 19, 20] },
  { group: "Advanced", name: "String Algorithms", videos: "all" },
  {
    group: "Advanced",
    name: "Strings",
    videos: [1, 3, 4, 6, 9, 11, 13, 14, 15, 16, 18, 21, 23, 24, 26, 27, 28, 29, 30, 31, 32, 35, 36, 37, 38, 39, 41, 42, 44, 47, 48, 49, 51, 52, 53, 54, 56, 57, 58, 59, 61, 62, 63, 66],
  },
  { group: "Advanced", name: "Maths Concepts & Qns", videos: "all" },
  {
    group: "Advanced",
    name: "Maths",
    videos: [1, 2, 3, 4, 5, 7, 8, 11, 12, 13, 14, 16, 17, 18, 21, 22, 23, 24, 25, 27, 28, 29, 30, 31, 32, 33, 34, 35, 37, 38, 39, 40, 42, 48],
  },

  // ── Patterns
  { group: "Patterns", name: "Line Sweep Technique", videos: "all" },
  { group: "Patterns", name: "Meet In The Middle", videos: "all" },
  { group: "Patterns", name: "Top K from Sorted Structures Pattern", videos: "all" },
  { group: "Patterns", name: "Design Data Structure", videos: "all" },
];

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/\+/g, "p")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const playlists: Playlist[] = raw.map((p) => ({ ...p, slug: slugify(p.name) }));

export const groups = Array.from(new Set(playlists.map((p) => p.group)));

export const getPlaylist = (slug: string) => playlists.find((p) => p.slug === slug);

/** The ids that can be ticked. An "all" playlist has a single item: 0. */
export const itemsOf = (p: Playlist) => (p.videos === "all" ? [0] : p.videos);

export const youtubeLink = (p: Playlist) =>
  p.url ??
  `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `codestorywithMIK ${p.name} playlist`
  )}`;
