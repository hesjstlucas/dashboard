import { RANKS } from "@/lib/permissions";
import { normalizeGuidelines } from "@/lib/guidelines";

export const SITE_NAME = "Paralix";

export const DEPARTMENTS = [
  {
    id: "police",
    name: "Police Department",
    shortName: "Police",
    dispatchTeam: "Police",
    accent: "#5fa8ff",
    mission:
      "Law enforcement operations, investigations, traffic control, warrants, custody logs, and criminal record review.",
    accessNote: "Officers can manage incident notes. Command can promote, demote, and review criminal records.",
    ranks: ["Cadet", "Officer", "Corporal", "Sergeant", "Lieutenant", "Captain", "Chief of Police"],
    modules: ["BOLO board", "Arrest log", "Evidence notes", "Warrant review"]
  },
  {
    id: "ems",
    name: "Paramedics, Nurses, and Doctors",
    shortName: "Medical",
    dispatchTeam: "EMS",
    accent: "#55d6a7",
    mission:
      "Patient intake, triage, ambulance response, hospital transfer notes, disability flags, and treatment records.",
    accessNote: "Medical staff can add patient care reports without creating criminal records.",
    ranks: ["Trainee", "EMT", "Paramedic", "Nurse", "Doctor", "Medical Supervisor", "Medical Director"],
    modules: ["Patient intake", "Treatment notes", "Hospital status", "Triage queue"]
  },
  {
    id: "dot",
    name: "Department of Transportation",
    shortName: "DOT",
    dispatchTeam: "DOT",
    accent: "#f0c96a",
    mission:
      "Road service, towing, traffic control, lane closures, vehicle recovery, repair notes, and scene support.",
    accessNote: "DOT records stay separate from medical and police files.",
    ranks: ["Trainee", "Technician", "Operator", "Senior Technician", "Supervisor", "Deputy Director", "DOT Director"],
    modules: ["Tow logs", "Road closure notes", "Service reports", "Fleet damage"]
  },
  {
    id: "fire",
    name: "Fire Department",
    shortName: "Fire",
    dispatchTeam: "Fire",
    accent: "#ff6d6d",
    mission:
      "Fire suppression, rescue operations, hazard reports, scene command, structure checks, and mutual aid.",
    accessNote: "Fire command can manage unit staffing and incident reports.",
    ranks: ["Probationary", "Firefighter", "Engineer", "Lieutenant", "Captain", "Battalion Chief", "Fire Chief"],
    modules: ["Fire incident reports", "Hazard notes", "Rescue logs", "Apparatus status"]
  }
];

export const GUIDELINES = [
  {
    id: "g1",
    title: "Realistic Scene Standard",
    content:
      "Treat scenes like real emergency service work. Document what happened, who was involved, what action was taken, and what still needs follow-up.",
    links: []
  },
  {
    id: "g2",
    title: "Records Integrity",
    content:
      "Criminal, medical, DOT, and fire records must be attached to a real player profile. Criminal records are never generated automatically.",
    links: []
  },
  {
    id: "g3",
    title: "ER:LC API Operations",
    content:
      "Use live PRC API data for players, emergency calls, moderator calls, command logs, and join logs when the server key is configured.",
    links: [
      {
        id: "g3-link-1",
        label: "PRC API docs",
        url: "https://apidocs.policeroleplay.community/"
      }
    ]
  },
  {
    id: "g4",
    title: "Department Command",
    content:
      "Department rank changes should be made only by authorized command staff. Promotions and demotions are recorded in the audit log.",
    links: []
  }
];

export const staffSeed = [
  {
    id: "s1",
    discordId: "100000000000000001",
    robloxId: "248000001",
    username: "ParalixDirector",
    displayName: "Paralix Director",
    codename: "PX-DIR-01",
    discordTag: "director.paralix",
    rankKey: "directive",
    department: "Executive Command",
    grade: 98,
    leaderboardPoints: 450,
    staffOfWeek: 4,
    activity: 10,
    reviews: [
      {
        author: "System",
        body: "Maintains portal configuration, policy, and final access review."
      }
    ],
    overview: {
      joinedAt: "2026-01-04",
      lastPatrol: "2026-04-27",
      patrolHours: 92,
      moderationActions: 38,
      adminActions: 24,
      shiftStatus: "Command duty"
    }
  },
  {
    id: "s2",
    discordId: "100000000000000002",
    robloxId: "248000002",
    username: "North_Command",
    displayName: "North Command",
    codename: "PX-MGT-02",
    discordTag: "north.command",
    rankKey: "management",
    department: "Police Department",
    grade: 94,
    leaderboardPoints: 370,
    staffOfWeek: 2,
    activity: 9,
    reviews: [
      {
        author: "Directive",
        body: "Strong supervision, clean escalations, and consistent scene documentation."
      }
    ],
    overview: {
      joinedAt: "2026-01-18",
      lastPatrol: "2026-04-28",
      patrolHours: 84,
      moderationActions: 28,
      adminActions: 12,
      shiftStatus: "On shift"
    }
  },
  {
    id: "s3",
    discordId: "100000000000000003",
    robloxId: "248000003",
    username: "Harbor_Medic",
    displayName: "Harbor Medic",
    codename: "PX-IA-03",
    discordTag: "harbor.medic",
    rankKey: "ia",
    department: "Medical",
    grade: 89,
    leaderboardPoints: 260,
    staffOfWeek: 1,
    activity: 8,
    reviews: [],
    overview: {
      joinedAt: "2026-02-06",
      lastPatrol: "2026-04-26",
      patrolHours: 63,
      moderationActions: 18,
      adminActions: 4,
      shiftStatus: "Available"
    }
  },
  {
    id: "s4",
    discordId: "100000000000000004",
    robloxId: "248000004",
    username: "Valley_Fire",
    displayName: "Valley Fire",
    codename: "PX-ADM-04",
    discordTag: "valley.fire",
    rankKey: "administration",
    department: "Fire Department",
    grade: 84,
    leaderboardPoints: 190,
    staffOfWeek: 1,
    activity: 7,
    reviews: [],
    overview: {
      joinedAt: "2026-02-14",
      lastPatrol: "2026-04-25",
      patrolHours: 49,
      moderationActions: 10,
      adminActions: 2,
      shiftStatus: "Training"
    }
  },
  {
    id: "s5",
    discordId: "100000000000000005",
    robloxId: "248000005",
    username: "Route_Service",
    displayName: "Route Service",
    codename: "PX-MOD-05",
    discordTag: "route.service",
    rankKey: "moderation",
    department: "DOT",
    grade: 78,
    leaderboardPoints: 120,
    staffOfWeek: 0,
    activity: 6,
    reviews: [],
    overview: {
      joinedAt: "2026-03-02",
      lastPatrol: "2026-04-24",
      patrolHours: 31,
      moderationActions: 6,
      adminActions: 0,
      shiftStatus: "Off shift"
    }
  }
];

export const playersSeed = staffSeed.map((member) => ({
  id: member.robloxId,
  robloxId: member.robloxId,
  username: member.username,
  displayName: member.displayName,
  team: member.department,
  callsign: "",
  location: "Stored staff profile",
  permission: member.rankKey,
  wantedStars: 0,
  firstSeen: member.overview.joinedAt,
  lastSeen: member.overview.lastPatrol,
  source: "portal seed",
  medicalRecords: [],
  criminalRecords: [],
  dotRecords: [],
  fireRecords: [],
  notes: []
}));

export const departmentMembersSeed = [
  {
    id: "dm-police-1",
    staffId: "s2",
    playerId: "248000002",
    departmentId: "police",
    rankIndex: 5,
    unit: "P-101",
    status: "Active",
    joinedAt: "2026-01-18"
  },
  {
    id: "dm-ems-1",
    staffId: "s3",
    playerId: "248000003",
    departmentId: "ems",
    rankIndex: 4,
    unit: "M-204",
    status: "Active",
    joinedAt: "2026-02-06"
  },
  {
    id: "dm-fire-1",
    staffId: "s4",
    playerId: "248000004",
    departmentId: "fire",
    rankIndex: 3,
    unit: "F-302",
    status: "Training",
    joinedAt: "2026-02-14"
  },
  {
    id: "dm-dot-1",
    staffId: "s5",
    playerId: "248000005",
    departmentId: "dot",
    rankIndex: 2,
    unit: "D-414",
    status: "Active",
    joinedAt: "2026-03-02"
  }
];

export const applicationsSeed = [
  {
    id: "app-1",
    applicantName: "ExampleApplicant",
    discordTag: "example.applicant",
    robloxId: "",
    age: "16",
    departmentId: "police",
    experience: "Patrolled in several ER:LC servers and understands traffic stop procedure.",
    availability: "Weekdays after 6 PM ET",
    motivation: "Wants to run serious scenes and write clean reports.",
    status: "Pending",
    reviewerNote: "",
    createdAt: "2026-04-28"
  }
];

export const punishmentsSeed = [];

export const activitySeed = [
  {
    id: "a1",
    title: "Paralix portal initialized",
    note: "Departments, records, applications, live ER:LC calls, and rank controls are ready.",
    when: "Today"
  }
];

export const shiftsSeed = [
  {
    id: "shift-1",
    name: "Evening patrol block",
    lead: "North Command",
    window: "7:00 PM - 9:30 PM ET",
    status: "Scheduled",
    seats: "12 slots"
  },
  {
    id: "shift-2",
    name: "Medical and fire readiness",
    lead: "Harbor Medic",
    window: "8:00 PM - 10:00 PM ET",
    status: "Open",
    seats: "8 slots"
  }
];

export const loaSeed = [];

export const auditSeed = [];

export const emergencyCallsSeed = [
  {
    id: "call-demo-1",
    team: "Police",
    caller: "Demo caller",
    callNumber: "PX-911-1",
    description: "Demo emergency call. Connect the ER:LC server key to replace this with live call data.",
    positionDescriptor: "Liberty County",
    startedAt: "Demo",
    source: "demo"
  }
];

export const modCallsSeed = [
  {
    id: "mod-demo-1",
    caller: "Demo caller",
    moderator: "Unassigned",
    timestamp: "Demo",
    source: "demo"
  }
];

export const departmentReportsSeed = [];

export const integrationsSeed = [
  {
    id: "int1",
    title: "PRC ER:LC API v2",
    status: "Ready",
    description:
      "Uses the server key header, pulls Players, JoinLogs, ModCalls, EmergencyCalls, CommandLogs, Queue, Staff, and Vehicles."
  },
  {
    id: "int2",
    title: "Discord OAuth and role sync",
    status: "Ready",
    description: "Maps Discord role groups to website ranks for department dashboards and management tools."
  },
  {
    id: "int3",
    title: "Local record vault",
    status: "Browser storage",
    description: "Keeps demo records in local storage until you connect a production database."
  }
];

export const settingsSeed = [
  {
    id: "set1",
    name: "Criminal record creation",
    value: "Manual only",
    note: "No player is listed as a criminal unless staff manually adds a police record."
  },
  {
    id: "set2",
    name: "ER:LC player intake",
    value: "Players + JoinLogs",
    note: "The portal merges live players and join logs into the searchable player vault."
  },
  {
    id: "set3",
    name: "Rank management",
    value: "Management+",
    note: "Management and Directive can promote or demote department members."
  }
];

export const erlcCommandTemplates = {
  moderation: [
    { label: "Warn user", command: ":warn {user} Please follow Paralix roleplay standards." },
    { label: "Kick user", command: ":kick {user} Rejoin when ready to comply with staff direction." },
    { label: "Bring user", command: ":bring {user}" },
    { label: "Message user", command: ":pm {user} Staff needs to speak with you." }
  ],
  administration: [
    { label: "Announce restart", command: ":h Server restart in 5 minutes. Finish active scenes safely." },
    { label: "Priority status", command: ":priority set cooldown" },
    { label: "Server message", command: ":m {message}" },
    { label: "Weather notice", command: ":weather clear" }
  ]
};

export const initialState = {
  staff: staffSeed,
  players: playersSeed,
  departmentMembers: departmentMembersSeed,
  applications: applicationsSeed,
  punishments: punishmentsSeed,
  guidelines: normalizeGuidelines(GUIDELINES),
  activityFeed: activitySeed,
  shifts: shiftsSeed,
  loaRequests: loaSeed,
  auditLogs: auditSeed,
  emergencyCalls: emergencyCallsSeed,
  modCalls: modCallsSeed,
  departmentReports: departmentReportsSeed,
  integrations: integrationsSeed,
  settings: settingsSeed,
  erlcServer: {
    name: "Not connected",
    currentPlayers: null,
    maxPlayers: null,
    queue: null,
    source: "demo"
  }
};

export function getDepartment(departmentId) {
  return DEPARTMENTS.find((department) => department.id === departmentId) || DEPARTMENTS[0];
}

export function getDepartmentRank(member) {
  const department = getDepartment(member.departmentId);
  return department.ranks[member.rankIndex] || department.ranks[0];
}

export function getPublicStaffView(member, revealIdentity = false) {
  return {
    ...member,
    displayName: revealIdentity ? member.displayName : member.codename,
    discordTag: revealIdentity ? member.discordTag : "Hidden until Discord login"
  };
}

export function resolveStaffByDiscordId(discordId) {
  return staffSeed.find((member) => member.discordId === discordId) || null;
}

export function buildLeaderboard(staff) {
  return [...staff]
    .map((member) => ({
      ...member,
      combinedScore:
        member.grade === null &&
        member.leaderboardPoints === null &&
        member.staffOfWeek === null &&
        member.activity === null &&
        member.reviews.length === 0
          ? null
          : (member.grade || 0) * 4 +
            (member.leaderboardPoints || 0) +
            (member.staffOfWeek || 0) * 12 +
            (member.activity || 0) * 10 +
            member.reviews.length * 8
    }))
    .sort((left, right) => (right.combinedScore || -1) - (left.combinedScore || -1));
}

export function createPunishmentRecord({ targetId, category, reason, status, duration, issuedById }) {
  return {
    id: `p${Date.now()}`,
    targetId,
    category,
    reason: reason || "No reason provided.",
    status,
    duration,
    issuedById,
    date: new Date().toISOString().slice(0, 10)
  };
}

export function createActivityEntry(title, note) {
  return {
    id: `a${Date.now()}`,
    title,
    note,
    when: "Just now"
  };
}

export function createAuditEntry(event, actor, target, detail) {
  return {
    id: `log${Date.now()}`,
    event,
    actor,
    target,
    when: "Just now",
    detail
  };
}

export function createApplicationRecord(payload) {
  return {
    id: `app-${Date.now()}`,
    applicantName: payload.applicantName || "Unnamed applicant",
    discordTag: payload.discordTag || "",
    robloxId: payload.robloxId || "",
    age: payload.age || "",
    departmentId: payload.departmentId || "police",
    experience: payload.experience || "",
    availability: payload.availability || "",
    motivation: payload.motivation || "",
    status: "Pending",
    reviewerNote: "",
    createdAt: new Date().toISOString().slice(0, 10)
  };
}

export function createDepartmentReport(departmentId, payload, author) {
  return {
    id: `report-${Date.now()}`,
    departmentId,
    title: payload.title || "Untitled report",
    category: payload.category || "General",
    summary: payload.summary || "",
    linkedPlayerId: payload.linkedPlayerId || "",
    author: author || "System",
    status: payload.status || "Open",
    createdAt: new Date().toISOString().slice(0, 10)
  };
}

export function createPlayerRecord(type, payload, author) {
  const common = {
    id: `${type}-${Date.now()}`,
    type,
    author: author || "Unknown staff",
    createdAt: new Date().toISOString().slice(0, 10),
    status: payload.status || "Open",
    description: payload.description || ""
  };

  if (type === "medicalRecords") {
    return {
      ...common,
      patientName: payload.patientName || "",
      age: payload.age || "",
      disabilities: payload.disabilities || "",
      allergies: payload.allergies || "",
      treatment: payload.treatment || "",
      unit: payload.unit || ""
    };
  }

  if (type === "criminalRecords") {
    return {
      ...common,
      offense: payload.offense || "",
      evidence: payload.evidence || "",
      caseNumber: payload.caseNumber || `PX-${Date.now().toString().slice(-6)}`
    };
  }

  if (type === "dotRecords") {
    return {
      ...common,
      vehicle: payload.vehicle || "",
      plate: payload.plate || "",
      serviceType: payload.serviceType || ""
    };
  }

  return {
    ...common,
    incidentType: payload.incidentType || "",
    hazards: payload.hazards || "",
    damage: payload.damage || ""
  };
}

export function createManualPlayer(payload) {
  const normalizedId = payload.robloxId?.trim() || `manual-${Date.now()}`;
  return {
    id: normalizedId,
    robloxId: payload.robloxId || "",
    username: payload.username || "UnknownPlayer",
    displayName: payload.displayName || payload.username || "Unknown Player",
    team: payload.team || "Unknown",
    callsign: payload.callsign || "",
    location: payload.location || "Manual entry",
    permission: payload.permission || "Normal",
    wantedStars: 0,
    firstSeen: new Date().toISOString().slice(0, 10),
    lastSeen: new Date().toISOString().slice(0, 10),
    source: "manual",
    medicalRecords: [],
    criminalRecords: [],
    dotRecords: [],
    fireRecords: [],
    notes: []
  };
}

function parsePlayerToken(value) {
  if (!value) {
    return { username: "Unknown", robloxId: "" };
  }

  if (typeof value === "number") {
    return { username: String(value), robloxId: String(value) };
  }

  const raw = String(value);
  const [username, id] = raw.split(":");
  return {
    username: username || raw,
    robloxId: id || ""
  };
}

function normalizeTimestamp(value) {
  if (!value || value === "Demo") {
    return value || "";
  }

  if (typeof value === "number") {
    return new Date(value * 1000).toLocaleString();
  }

  return String(value);
}

export function normalizeErlcPlayer(item) {
  const parsed = parsePlayerToken(item.Player || item.player || item.Caller || item);
  const id = parsed.robloxId || parsed.username;
  const location = item.Location
    ? [item.Location.BuildingNumber, item.Location.StreetName, item.Location.PostalCode]
        .filter(Boolean)
        .join(" ")
    : item.PositionDescriptor || "In server";

  return {
    id,
    robloxId: parsed.robloxId,
    username: parsed.username,
    displayName: parsed.username,
    team: item.Team || "Unknown",
    callsign: item.Callsign || "",
    location,
    permission: item.Permission || "Normal",
    wantedStars: Number(item.WantedStars || 0),
    firstSeen: new Date().toISOString().slice(0, 10),
    lastSeen: new Date().toISOString().slice(0, 10),
    source: "erlc api",
    medicalRecords: [],
    criminalRecords: [],
    dotRecords: [],
    fireRecords: [],
    notes: []
  };
}

export function normalizeJoinLog(log) {
  const parsed = parsePlayerToken(log.Player);
  const id = parsed.robloxId || parsed.username;

  return {
    id,
    robloxId: parsed.robloxId,
    username: parsed.username,
    displayName: parsed.username,
    team: "Seen in join logs",
    callsign: "",
    location: log.Join ? "Joined server" : "Left server",
    permission: "Normal",
    wantedStars: 0,
    firstSeen: normalizeTimestamp(log.Timestamp),
    lastSeen: normalizeTimestamp(log.Timestamp),
    source: "erlc join log",
    medicalRecords: [],
    criminalRecords: [],
    dotRecords: [],
    fireRecords: [],
    notes: []
  };
}

export function mergePlayers(existingPlayers, incomingPlayers) {
  const byId = new Map(existingPlayers.map((player) => [player.id, player]));

  incomingPlayers.forEach((incoming) => {
    const current = byId.get(incoming.id);
    byId.set(incoming.id, {
      ...incoming,
      ...current,
      team: incoming.team || current?.team || "Unknown",
      callsign: incoming.callsign || current?.callsign || "",
      location: incoming.location || current?.location || "",
      permission: incoming.permission || current?.permission || "Normal",
      wantedStars: incoming.wantedStars ?? current?.wantedStars ?? 0,
      lastSeen: incoming.lastSeen || current?.lastSeen || "",
      source: incoming.source || current?.source || "portal",
      medicalRecords: current?.medicalRecords || incoming.medicalRecords || [],
      criminalRecords: current?.criminalRecords || incoming.criminalRecords || [],
      dotRecords: current?.dotRecords || incoming.dotRecords || [],
      fireRecords: current?.fireRecords || incoming.fireRecords || [],
      notes: current?.notes || incoming.notes || []
    });
  });

  return [...byId.values()].sort((left, right) => left.username.localeCompare(right.username));
}

export function normalizeEmergencyCalls(calls = []) {
  return calls.map((call, index) => ({
    id: `emergency-${call.CallNumber || call.StartedAt || index}`,
    team: call.Team || "Unknown",
    caller: String(call.Caller || "Unknown"),
    callNumber: call.CallNumber || index + 1,
    description: call.Description || "No description provided.",
    positionDescriptor: call.PositionDescriptor || (Array.isArray(call.Position) ? call.Position.join(", ") : "Unknown"),
    startedAt: normalizeTimestamp(call.StartedAt),
    players: call.Players || [],
    source: "erlc api"
  }));
}

export function normalizeModCalls(calls = []) {
  return calls.map((call, index) => {
    const caller = parsePlayerToken(call.Caller);
    const moderator = parsePlayerToken(call.Moderator);
    return {
      id: `mod-${call.Timestamp || index}`,
      caller: caller.username,
      moderator: call.Moderator ? moderator.username : "Unassigned",
      timestamp: normalizeTimestamp(call.Timestamp),
      source: "erlc api"
    };
  });
}

export function normalizeErlcServerData(data = {}) {
  const players = [
    ...(Array.isArray(data.Players) ? data.Players.map(normalizeErlcPlayer) : []),
    ...(Array.isArray(data.JoinLogs) ? data.JoinLogs.map(normalizeJoinLog) : [])
  ];

  return {
    players,
    emergencyCalls: normalizeEmergencyCalls(data.EmergencyCalls || []),
    modCalls: normalizeModCalls(data.ModCalls || []),
    server: {
      name: data.Name || "Connected ER:LC server",
      currentPlayers: data.CurrentPlayers ?? null,
      maxPlayers: data.MaxPlayers ?? null,
      queue: Array.isArray(data.Queue) ? data.Queue.length : null,
      joinKey: data.JoinKey || "",
      staff:
        data.Staff && typeof data.Staff === "object"
          ? Object.values(data.Staff).reduce((count, group) => count + Object.keys(group || {}).length, 0)
          : null,
      source: "erlc api"
    }
  };
}

export function getErlcSummary() {
  return {
    Name: "Not connected",
    CurrentPlayers: null,
    MaxPlayers: null,
    Queue: [],
    Players: [],
    JoinLogs: [],
    ModCalls: [],
    EmergencyCalls: [],
    CommandLogs: [],
    Vehicles: []
  };
}

export function getDiscordSummary() {
  return {
    guildName: "Not connected",
    onlineMembers: null,
    pendingTickets: null,
    dmService: "Unavailable"
  };
}

export function getRankCards() {
  return RANKS.map((rank) => ({
    ...rank,
    powers: {
      moderation: rank.level >= 1,
      admin: rank.level >= 2,
      records: rank.level >= 1,
      applications: rank.level >= 3,
      grades: rank.level >= 3,
      punishment: rank.level >= 3,
      leaderboard: rank.level >= 4,
      departmentRanks: rank.level >= 4,
      guidelines: rank.level >= 5,
      integrations: rank.level >= 5
    }
  }));
}
