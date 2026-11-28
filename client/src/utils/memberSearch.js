export const DEPARTMENT_LIST = [
  {
    name: "Computer Science and Engineering",
    short: "CSE",
    aliases: ["cse", "cs", "comp", "computer science"],
  },
  {
    name: "Electrical Engineering",
    short: "EE",
    aliases: ["ee", "ece", "elec", "electrical"],
  },
  {
    name: "Mechanical Engineering",
    short: "ME",
    aliases: ["me", "mech", "mechanical"],
  },
  {
    name: "Civil Engineering",
    short: "CE",
    aliases: ["ce", "civil"],
  },
  {
    name: "Metallurgical Engineering and Materials Science",
    short: "MEMS",
    aliases: ["mems", "mme", "meta", "metallurgy", "metallurgical", "materials"],
  },
  {
    name: "Astronomy, Astrophysics and Space Engineering",
    short: "AASE / SSE",
    aliases: ["aase", "sse", "space", "space science", "astronomy", "astrophysics"],
  },
  {
    name: "Biosciences and Biomedical Engineering",
    short: "BSBE",
    aliases: ["bsbe", "bbe", "bio", "biosciences", "biomedical"],
  },
  {
    name: "Chemistry",
    short: "CH",
    aliases: ["ch", "chem", "chemistry"],
  },
  {
    name: "Chemical Engineering",
    short: "ChE",
    aliases: ["che", "cl", "chemical"],
  },
  {
    name: "Electric Vehicle Technology",
    short: "EVT",
    aliases: ["evt", "ev", "electric vehicle"],
  },
  {
    name: "Humanities and Social Sciences",
    short: "HSS",
    aliases: ["hss", "humanities", "social sciences"],
  },
  {
    name: "Mathematics",
    short: "MA / MnC",
    aliases: ["ma", "mth", "mnc", "mc", "math", "maths", "mathematics", "computing"],
  },
  {
    name: "Physics",
    short: "PH / EP",
    aliases: ["ph", "phy", "ep", "physics", "engineering physics"],
  },
  {
    name: "MS-DSM",
    short: "MS-DSM",
    aliases: ["msdsm", "ms-dsm", "dsm", "ds", "data science"],
  },
  {
    name: "Center of Futuristic Defense and Space Technology(CFDST)",
    short: "CFDST",
    aliases: ["cfdst", "defense", "defence", "futuristic defense"],
  },
];

export const findDeptMeta = (deptName = "") => {
  const lower = deptName.toLowerCase().replace(/&/g, "and").trim();
  return DEPARTMENT_LIST.find(
    (d) =>
      d.name.toLowerCase() === lower ||
      (lower.includes("metallurg") && d.short === "MEMS") ||
      ((lower.includes("space") || lower.includes("astronomy")) &&
        d.short === "AASE / SSE"),
  );
};

export const deptMatchesToken = (deptName, token) => {
  const lower = (deptName || "").toLowerCase();
  const meta = findDeptMeta(deptName);
  if (
    meta &&
    meta.aliases.some(
      (alias) => alias === token || (token.length >= 2 && alias.startsWith(token)),
    )
  ) {
    return true;
  }
  const words = lower.split(/[\s,()/-]+/).filter(Boolean);
  if (token.length <= 3) {
    return words.some((w) => w.startsWith(token));
  }
  return lower.includes(token);
};

export const matchesMemberQuery = (member, query) => {
  const normalized = (query || "").trim().toLowerCase();
  if (!normalized) return true;
  const tokens = normalized.split(/\s+/).filter(Boolean);
  const nameRoll =
    `${member?.name || member?.full_name || ""} ${member?.roll_no || ""}`.toLowerCase();
  return tokens.every(
    (tok) => nameRoll.includes(tok) || deptMatchesToken(member?.department, tok),
  );
};

export const findMatchingDepartments = (query, limit = 4) => {
  const normalized = (query || "").trim().toLowerCase();
  if (!normalized) return [];
  const tokens = normalized.split(/\s+/).filter(Boolean);
  return DEPARTMENT_LIST.filter((dept) =>
    tokens.every((tok) => deptMatchesToken(dept.name, tok)),
  ).slice(0, limit);
};
