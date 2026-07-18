/* ════════════════════════════════════════════════════════════
   FLO STUDIO — DATA LAYER (data.js)
   ────────────────────────────────────────────────────────────
   This file is structured the way the future Admin Portal will
   eventually GENERATE this data. Today, Claude/Afoo hand-writes
   it to match the real June 2026 studio schedule. When the Admin
   Portal is built, it should read/write these same shapes —
   nothing downstream (client portal, instructor portal) should
   need to change.

   Plain global script — no ES module import/export, consistent
   with the rest of the vanilla JS codebase. All variables below
   are global (window-scoped) by design.
   ════════════════════════════════════════════════════════════ */


/* ────────────────────────────────────────────────────────────
   INSTRUCTORS
   Full profile data for each instructor.
   Fields marked PLACEHOLDER need real data before going live.
   Photo upload requires backend — avatar initials used for now.

   status: "active" | "on-leave" | "inactive"
──────────────────────────────────────────────────────────── */
const instructors = [
    { id: "maani",  name: "Maani",  nickname: "Maani",  phone: "+960 700-0001", dob: "", nationalId: "", qualifications: "", experience: "", bio: "Studio owner & lead instructor.", status: "active"   },
    { id: "amu",    name: "Amu",    nickname: "Amu",    phone: "+960 700-0002", dob: "", nationalId: "", qualifications: "", experience: "", bio: "",                              status: "active"   },
    { id: "hafy",   name: "Hafy",   nickname: "Hafy",   phone: "+960 700-0003", dob: "", nationalId: "", qualifications: "", experience: "", bio: "",                              status: "active"   },
    { id: "shaba",  name: "Shaba",  nickname: "Shaba",  phone: "+960 700-0004", dob: "", nationalId: "", qualifications: "", experience: "", bio: "",                              status: "active"   },
    { id: "niya",   name: "Niya",   nickname: "Niya",   phone: "+960 700-0005", dob: "", nationalId: "", qualifications: "", experience: "", bio: "",                              status: "active"   },
    { id: "miru",   name: "Miru",   nickname: "Miru",   phone: "+960 700-0006", dob: "", nationalId: "", qualifications: "", experience: "", bio: "",                              status: "active"   },
    { id: "shamma", name: "Shamma", nickname: "Shamma", phone: "+960 700-0007", dob: "", nationalId: "", qualifications: "", experience: "", bio: "",                              status: "active"   },
    { id: "salie",  name: "Salie",  nickname: "Salie",  phone: "+960 700-0008", dob: "", nationalId: "", qualifications: "", experience: "", bio: "",                              status: "active"   },
    { id: "shiu",   name: "Shiu",   nickname: "Shiu",   phone: "+960 700-0009", dob: "", nationalId: "", qualifications: "", experience: "", bio: "",                              status: "active"   },
    { id: "dheena", name: "Dheena", nickname: "Dheena", phone: "+960 700-0010", dob: "", nationalId: "", qualifications: "", experience: "", bio: "",                              status: "active"   },
    { id: "meera",  name: "Meera",  nickname: "Meera",  phone: "+960 700-0011", dob: "", nationalId: "", qualifications: "", experience: "", bio: "",                              status: "active"   },
    { id: "zira",   name: "Zira",   nickname: "Zira",   phone: "+960 700-0012", dob: "", nationalId: "", qualifications: "", experience: "", bio: "",                              status: "inactive" }
];

function getInstructor(id) {
    return instructors.find(i => i.id === id) || null;
}

// Returns all program slots and standalone class slots assigned to an instructor,
// grouped as { programId, programName, classId, className, day, time, trackLabel }
function getInstructorAssignments(instructorId) {
    const assignments = [];

    // From programSlots
    programSlots.filter(s => s.instructorId === instructorId && s.active !== false).forEach(function(slot) {
        const cls  = getClass(slot.classId);
        const prog = getProgram(slot.programId);
        assignments.push({
            source:      'program',
            programId:   slot.programId,
            programName: prog ? prog.name : slot.programId,
            classId:     slot.classId,
            className:   cls ? cls.name : slot.classId,
            day:         slot.day,
            time:        slot.time,
            trackLabel:  slot.trackLabel || null
        });
    });

    // From standalone classSlots
    classSlots.filter(s => s.instructorId === instructorId && s.active !== false).forEach(function(slot) {
        const cls = getClass(slot.classId);
        assignments.push({
            source:    'standalone',
            classId:   slot.classId,
            className: cls ? cls.name : slot.classId,
            day:       slot.day,
            time:      slot.time
        });
    });

    return assignments;
}


/* ────────────────────────────────────────────────────────────
   ROOMS
   Studio spaces available for scheduling. Admin can add, edit,
   or delete rooms via a dedicated Rooms tab (to be built).
   Used to populate the Room dropdown in the New Class form and
   to check room conflicts when scheduling slots.
──────────────────────────────────────────────────────────── */
const rooms = [
    { id: "studio-1",   name: "Studio 1" },
    { id: "studio-2",   name: "Studio 2" },
    { id: "aerial-room", name: "Aerial Room" }
];

function getRoom(id) {
    return rooms.find(r => r.id === id) || null;
}


/* ────────────────────────────────────────────────────────────
   TRACKS
   Named day-option groups defined globally and reused across
   programs. A track labels a specific day-configuration that
   a student commits to at enrolment (e.g. "Sat & Mon" means
   they attend every Saturday and Monday session in a program).

   Tracks are optional per program — a program with no track
   assignments just has one undivided group of students.

   Admin manages tracks in the Config tab (add/edit/delete).
   Slots are tagged with a track's label via dayOptionGroup.
──────────────────────────────────────────────────────────── */
const tracks = [
    { id: "satmon",  name: "Sat & Mon",  label: "satmon", days: ["Sat", "Mon"] },
    { id: "suntue",  name: "Sun & Tue",  label: "suntue", days: ["Sun", "Tue"] },
    { id: "sat",     name: "Saturday",   label: "sat",    days: ["Sat"]        },
    { id: "mon",     name: "Monday",     label: "mon",    days: ["Mon"]        },
    { id: "wed",     name: "Wednesday",  label: "wed",    days: ["Wed"]        }
];

function getTrack(id) {
    return tracks.find(t => t.id === id) || null;
}

function getTrackByLabel(label) {
    return tracks.find(t => t.label === label) || null;
}


/* ────────────────────────────────────────────────────────────
   CLASSES
   "fixed: true"  → roster is locked together as a group
                    (e.g. ballet — formation/performance matters,
                    kids should see the same lineup every session)
   "fixed: false" → roster can vary instance to instance
                    (e.g. aerial — individual performance, one
                    hammock per child, no formation dependency)

   colorKey maps to the existing CSS class-color system
   (teal-family for adult low/med intensity, tangerine for
   high-intensity, plus the kids-specific purple/pink/blue used
   in the original spreadsheet legend).
──────────────────────────────────────────────────────────── */
const classes = [
    // ── ADULT CLASSES ──
    { id: "flow",     name: "Flow",     fixed: false, audience: "adult", type: "Vinyasa Yoga",      colorKey: "teal",      durationMin: 50, room: "Studio 1" },
    { id: "soar",      name: "Soar",     fixed: false, audience: "adult", type: "Aerial Hammock",     colorKey: "teal",      durationMin: 50, room: "Aerial Room" },
    { id: "pulse",     name: "Pulse",    fixed: false, audience: "adult", type: "High-Intensity",     colorKey: "tangerine", durationMin: 50, room: "Studio 1" },
    { id: "reform",    name: "Reform",   fixed: false, audience: "adult", type: "Reformer Pilates",   colorKey: "teal",      durationMin: 50, room: "Studio 2" },
    { id: "connect",   name: "Connect",  fixed: false, audience: "adult", type: "Mindful Movement",   colorKey: "teal",      durationMin: 50, room: "Studio 1" },
    { id: "sculpt",    name: "Sculpt",   fixed: false, audience: "adult", type: "Mat Pilates",        colorKey: "teal",      durationMin: 50, room: "Studio 2" },
    { id: "reboot",    name: "ReBoot",   fixed: false, audience: "adult", type: "HIIT",               colorKey: "tangerine", durationMin: 50, room: "Studio 1" },
    { id: "reset",     name: "Reset",    fixed: false, audience: "adult", type: "Restorative",        colorKey: "teal",      durationMin: 50, room: "Studio 1" },
    { id: "transform", name: "Transform",fixed: false, audience: "adult", type: "Strength",           colorKey: "tangerine", durationMin: 50, room: "Studio 1" },
    { id: "bounce",    name: "Bounce",   fixed: false, audience: "adult", type: "Trampoline Cardio",  colorKey: "tangerine", durationMin: 50, room: "Studio 1" },

    // ── KIDS CLASSES ──
    // Fusion ballet: FIXED. Two day-option groups exist (see classSlots
    // dayOptionGroup field) — kids enrolled in Fusion choose ONE option
    // group and stay in that group's ballet sessions for formation
    // consistency, per Maani's instructions.
    { id: "ballet",      name: "Ballet",             fixed: true,  audience: "kids",  type: "Ballet",           colorKey: "pink",      durationMin: 60, room: "Studio 2",    maxSize: 12 },
    { id: "aerial-kids", name: "Aerial (Kids)",       fixed: false, audience: "kids",  type: "Aerial",           colorKey: "lavender",  durationMin: 60, room: "Aerial Room", maxSize: 8  },
    { id: "aerial-only", name: "Aerial (Standalone)", fixed: true,  audience: "kids",  type: "Aerial",           colorKey: "skyblue",   durationMin: 60, room: "Aerial Room", maxSize: 8  }

    // NOTE: "Fly Boys" class intentionally removed — halted due to low
    // enrollment per studio decision (June 2026). No trace kept in data.
];

function getClass(id) {
    return classes.find(c => c.id === id) || null;
}

// Returns only active classes (active !== false)
// Used by client-facing and instructor views so soft-deleted classes
// are invisible to non-admin users.
function getActiveClasses(audience) {
    const filtered = classes.filter(c => c.active !== false);
    return audience ? filtered.filter(c => c.audience === audience) : filtered;
}


/* ────────────────────────────────────────────────────────────
   CLASS SLOTS (standalone — no program ownership)
   These are adult classes that run independently of any program.
   Clients enrol directly into these slots. Each slot belongs to
   a class but NOT to a specific program.

   Kids class sessions are NOT here — they belong to programSlots
   since they only make sense as part of a program (Fusion, Aerial).
──────────────────────────────────────────────────────────── */
const classSlots = [

    // Flow
    { id: "flow-mon-0800", classId: "flow", day: "Mon", time: "08:00", instructorId: "meera" },
    { id: "flow-wed-0800", classId: "flow", day: "Wed", time: "08:00", instructorId: "meera" },

    // Soar
    { id: "soar-sat-0900", classId: "soar", day: "Sat", time: "09:00", instructorId: "shaba" },
    { id: "soar-mon-0900", classId: "soar", day: "Mon", time: "09:00", instructorId: "shaba" },
    { id: "soar-thu-0900", classId: "soar", day: "Thu", time: "09:00", instructorId: "shaba" },
    { id: "soar-thu-1800", classId: "soar", day: "Thu", time: "18:00", instructorId: "amu" },

    // Pulse
    { id: "pulse-sun-1000", classId: "pulse", day: "Sun", time: "10:00", instructorId: "shamma" },
    { id: "pulse-tue-1000", classId: "pulse", day: "Tue", time: "10:00", instructorId: "shamma" },

    // Reform
    { id: "reform-sun-1100", classId: "reform", day: "Sun", time: "11:00", instructorId: "shamma" },
    { id: "reform-tue-1100", classId: "reform", day: "Tue", time: "11:00", instructorId: "shamma" },

    // Connect
    { id: "connect-sat-0600", classId: "connect", day: "Sat", time: "06:00", instructorId: "hafy" },
    { id: "connect-mon-0600", classId: "connect", day: "Mon", time: "06:00", instructorId: "hafy" },
    { id: "connect-wed-0600", classId: "connect", day: "Wed", time: "06:00", instructorId: "hafy" },

    // Sculpt
    { id: "sculpt-sat-0800", classId: "sculpt", day: "Sat", time: "08:00", instructorId: "meera" },
    { id: "sculpt-wed-0900", classId: "sculpt", day: "Wed", time: "09:00", instructorId: "meera" },
    { id: "sculpt-fri-1800", classId: "sculpt", day: "Fri", time: "18:00", instructorId: "meera" },

    // ReBoot
    { id: "reboot-sat-0800", classId: "reboot", day: "Sat", time: "08:00", instructorId: "amu" },
    { id: "reboot-sat-1900", classId: "reboot", day: "Sat", time: "19:00", instructorId: "miru" },
    { id: "reboot-mon-1900", classId: "reboot", day: "Mon", time: "19:00", instructorId: "salie" },
    { id: "reboot-wed-1900", classId: "reboot", day: "Wed", time: "19:00", instructorId: "dheena" },
    { id: "reboot-thu-1900", classId: "reboot", day: "Thu", time: "19:00", instructorId: "miru" },

    // Reset
    { id: "reset-sun-1900", classId: "reset", day: "Sun", time: "19:00", instructorId: "miru" },

    // Transform
    { id: "transform-tue-1600", classId: "transform", day: "Tue", time: "16:00", instructorId: "meera" },
    { id: "transform-thu-1600", classId: "transform", day: "Thu", time: "16:00", instructorId: "meera" },

    // Bounce — not yet confirmed live
    { id: "bounce-sat-2000", classId: "bounce", day: "Sat", time: "20:00", instructorId: "meera", active: false }
];

function getSlot(id) {
    return classSlots.find(s => s.id === id) || null;
}

function getSlotsForClass(classId) {
    return classSlots.filter(s => s.classId === classId);
}

function getSlotsForInstructor(instructorId) {
    const fromClass   = classSlots.filter(s => s.instructorId === instructorId || s.assistingInstructorId === instructorId);
    const fromProgram = programSlots.filter(s => s.instructorId === instructorId || s.assistingInstructorId === instructorId);
    return fromClass.concat(fromProgram);
}

function getSlotsForDay(day) {
    const fromClass   = classSlots.filter(s => s.day === day);
    const fromProgram = programSlots.filter(s => s.day === day);
    return fromClass.concat(fromProgram);
}

// All active slots across both standalone classes and programs —
// used by the conflict checker when scheduling new slots.
function getAllActiveSlots() {
    return classSlots.filter(s => s.active !== false)
        .concat(programSlots.filter(s => s.active !== false));
}


/* ────────────────────────────────────────────────────────────
   PROGRAM SLOTS
   These slots are OWNED by a specific program — they define
   when and where a program's students meet each week.

   A "Fusion" program owns its own Ballet + Aerial sessions.
   An "Aerial" program owns its own Aerial sessions.
   Two programs can both include Aerial (the class type) but
   they have completely separate programSlots — different days,
   times, instructors, and student groups.

   Each slot:
     programId   — which program owns this session
     classId     — which class type is being taught
     day/time    — when it runs
     instructorId — who teaches it
     dayOptionGroup — (optional) for fixed classes with multiple
                      track options (e.g. Fusion Ballet's
                      satmon vs suntue), links slots that are
                      alternatives of each other within a program
──────────────────────────────────────────────────────────── */
const programSlots = [

    // ══ FUSION PROGRAM ══
    { id: "fusion-ballet-sat", programId: "kids-fusion", classId: "ballet",     day: "Sat", time: "17:00", instructorId: "meera", trackLabel: "satmon" },
    { id: "fusion-ballet-mon", programId: "kids-fusion", classId: "ballet",     day: "Mon", time: "17:00", instructorId: "meera", trackLabel: "satmon" },
    { id: "fusion-ballet-sun", programId: "kids-fusion", classId: "ballet",     day: "Sun", time: "17:00", instructorId: "meera", trackLabel: "suntue" },
    { id: "fusion-ballet-tue", programId: "kids-fusion", classId: "ballet",     day: "Tue", time: "17:00", instructorId: "meera", trackLabel: "suntue" },

    { id: "fusion-aerial-wed", programId: "kids-fusion", classId: "aerial-kids", day: "Wed", time: "10:00", instructorId: "niya",  trackLabel: "satmon" },
    { id: "fusion-aerial-thu", programId: "kids-fusion", classId: "aerial-kids", day: "Thu", time: "10:00", instructorId: "niya",  trackLabel: "suntue" },

    // ══ AERIAL (STANDALONE) PROGRAM ══
    { id: "aerial-only-sat", programId: "kids-aerial-only", classId: "aerial-only", day: "Sat", time: "10:00", instructorId: "niya", trackLabel: "sat" },
    { id: "aerial-only-mon", programId: "kids-aerial-only", classId: "aerial-only", day: "Mon", time: "16:00", instructorId: "niya", trackLabel: "mon" },
    { id: "aerial-only-wed", programId: "kids-aerial-only", classId: "aerial-only", day: "Wed", time: "16:00", instructorId: "niya", trackLabel: "wed" }
];

function getProgramSlots(programId) {
    return programSlots.filter(s => s.programId === programId && s.active !== false);
}

function getProgramSlotsForClass(programId, classId) {
    return programSlots.filter(s => s.programId === programId && s.classId === classId && s.active !== false);
}



/* ────────────────────────────────────────────────────────────
   ADULT CLASS ROSTERS
   Who's enrolled in a given adult class slot, keyed by slotId.
   Illustrative client roster data for the instructor portal's
   click-to-expand roster panel. Real enrollment data will come
   from the Admin Portal / client self-enrollment once built.
──────────────────────────────────────────────────────────── */
const adultRosters = {
    "flow-mon-0800": [
        { name: "Sara Rasheed",      status: "member"  },
        { name: "Aminath Laila",     status: "member"  },
        { name: "Fathimath Yoosuf",  status: "dropin"  },
        { name: "Nisha Mohamed",     status: "member"  },
        { name: "Raina Hassan",      status: "member"  },
        { name: "Khadeeja Ibrahim",  status: "member"  },
        { name: "Maryam Ali",        status: "member"  },
        { name: "Zainab Rashid",     status: "member"  }
    ],
    "flow-wed-0800": [
        { name: "Sara Rasheed",      status: "member"  },
        { name: "Badhoor Ali",       status: "member"  },
        { name: "Juwairiya Hassan",  status: "member"  },
        { name: "Priya Nair",        status: "dropin"  },
        { name: "Nisha Mohamed",     status: "member"  },
        { name: "Raina Hassan",      status: "member"  },
        { name: "Aisha Latheef",     status: "member"  }
    ],
    "sculpt-wed-0900": [
        { name: "Leena Abdulla",     status: "member"  },
        { name: "Hana Waheed",       status: "member"  },
        { name: "Dheena Rasheed",    status: "member"  },
        { name: "Isha Naseem",       status: "member"  },
        { name: "Thoola Shareef",    status: "member"  },
        { name: "Yoosra Waheed",     status: "dropin"  }
    ],
    "sculpt-fri-1800": [
        { name: "Leena Abdulla",     status: "member"  },
        { name: "Maryam Shujau",     status: "member"  },
        { name: "Fathimath Yoosuf",  status: "member"  },
        { name: "Zainab Rashid",     status: "member"  },
        { name: "Aisha Latheef",     status: "dropin"  },
        { name: "Khadeeja Ibrahim",  status: "member"  },
        { name: "Hana Waheed",       status: "member"  },
        { name: "Isha Naseem",       status: "member"  },
        { name: "Priya Nair",        status: "member"  }
    ],
    "soar-thu-1800": [
        { name: "Nisha Mohamed",     status: "member"  },
        { name: "Sara Rasheed",      status: "member"  },
        { name: "Maryam Ali",        status: "member"  },
        { name: "Aminath Laila",     status: "dropin"  },
        { name: "Raina Hassan",      status: "member"  }
    ],
    "reboot-sat-0800": [
        { name: "Khadeeja Ibrahim",  status: "member"  },
        { name: "Maryam Shujau",     status: "member"  },
        { name: "Fathimath Yoosuf",  status: "member"  },
        { name: "Leena Abdulla",     status: "member"  },
        { name: "Zainab Rashid",     status: "member"  },
        { name: "Badhoor Ali",       status: "member"  },
        { name: "Aisha Latheef",     status: "dropin"  },
        { name: "Hana Waheed",       status: "member"  },
        { name: "Isha Naseem",       status: "member"  },
        { name: "Dheena Rasheed",    status: "member"  }
    ]
};

function getRosterForSlot(slotId) {
    return adultRosters[slotId] || [];
}


/* ────────────────────────────────────────────────────────────
   PROGRAMS
   A purchasable bundle of classes. Mirrors what an Admin will
   eventually build via "create new program → pick N classes →
   set price" in the Admin Portal.
──────────────────────────────────────────────────────────── */
const programs = [
    {
        id: "kids-aerial-only",
        name: "Aerial",
        priceRf: 1000,
        billingPeriod: "month",
        classIds: ["aerial-only"],
        description: "1x weekly aerial class. Missed sessions may be made up in a Fusion aerial slot (admin approval)."
    },
    {
        id: "kids-fusion",
        name: "Fusion",
        priceRf: 1800,
        billingPeriod: "month",
        classIds: ["ballet", "aerial-kids"],
        description: "3x weekly: 2 ballet sessions (fixed group) + 1 aerial session (swappable)."
    }
];

function getProgram(id) {
    return programs.find(p => p.id === id) || null;
}

function getActivePrograms() {
    return programs.filter(p => p.active !== false);
}


/* ────────────────────────────────────────────────────────────
   ENROLLMENTS
   Links a child/client to a program and records their chosen
   day-option group(s) for any fixed classes within it.

   chosenGroups: { [classId]: dayOptionGroup }
   e.g. { "ballet": "satmon", "aerial-kids": "satmon" }
   means: this child's default aerial day is Wed (since "satmon"
   pairs with Wed per classSlots above), but per Maani, the
   aerial portion can still be swapped week-to-week.
──────────────────────────────────────────────────────────── */
const enrollments = [
    // Example seed data — illustrative, not exhaustive. Real rosters
    // live in classSlots' implied attendance until the Admin Portal
    // and a real enrollment database exist.
    { id: "enr-001", childName: "Sara", programId: "kids-fusion", chosenGroups: { "ballet": "satmon", "aerial-kids": "satmon" }, status: "approved" },
    { id: "enr-002", childName: "Hana", programId: "kids-fusion", chosenGroups: { "ballet": "suntue", "aerial-kids": "suntue" }, status: "approved" }
];


/* ────────────────────────────────────────────────────────────
   AERIAL SWAP REQUESTS
   A one-off, single-week override for a Fusion child's aerial
   session — logged for admin confirmation, NOT auto-applied.
   Mirrors the adult sub-request pattern: request → admin
   confirms → reflected in that week's rosters for both the
   original and destination sessions.
──────────────────────────────────────────────────────────── */
const aerialSwapRequests = [
    // { id, childName, weekOf, fromSlotId, toSlotId, requestedBy: "parent"|"admin", status: "pending"|"confirmed"|"declined", note }
];


/* ────────────────────────────────────────────────────────────
   PENDING ENROLMENT REQUESTS
   Submitted by clients via the client portal enrolment flow.
   Admin reviews and approves or declines each request.

   type: "adult" | "kids"
   status: "pending" | "approved" | "declined"
   For kids: programId + trackLabel
   For adult: classId (standalone class slot)
──────────────────────────────────────────────────────────── */
const pendingEnrolments = [
    {
        id: "enr-req-001",
        clientName: "Aminath Laila",
        type: "adult",
        classId: "flow",
        details: "Flow — Mon & Wed 8:00 AM",
        submittedDate: "2026-06-10",
        status: "pending",
        declineReason: ""
    },
    {
        id: "enr-req-002",
        clientName: "Khadeeja Ibrahim",
        type: "adult",
        classId: "reboot",
        details: "ReBoot — Sat 8:00 AM",
        submittedDate: "2026-06-11",
        status: "pending",
        declineReason: ""
    },
    {
        id: "enr-req-003",
        clientName: "Fathimath Yoosuf",
        type: "kids",
        childName: "Layla",
        programId: "kids-fusion",
        trackLabel: "satmon",
        details: "Fusion — Sat & Mon Ballet + Wed Aerial",
        submittedDate: "2026-06-12",
        status: "pending",
        declineReason: ""
    },
    {
        id: "enr-req-004",
        clientName: "Raina Hassan",
        type: "kids",
        childName: "Sana",
        programId: "kids-aerial-only",
        trackLabel: "sat",
        details: "Aerial (Standalone) — Saturday 10:00 AM",
        submittedDate: "2026-06-13",
        status: "pending",
        declineReason: ""
    },
    {
        id: "enr-req-005",
        clientName: "Maryam Ali",
        type: "adult",
        classId: "sculpt",
        details: "Sculpt — Wed 9:00 AM",
        submittedDate: "2026-06-09",
        status: "approved",
        declineReason: ""
    }
];


/* ────────────────────────────────────────────────────────────
   PENDING SUB REQUESTS
   Submitted by instructors via the instructor portal.
   Admin reviews, confirms the substitute, which updates
   the relevant slot for that specific date.

   status: "pending" | "confirmed" | "declined"
──────────────────────────────────────────────────────────── */
const pendingSubRequests = [
    {
        id: "sub-req-001",
        instructorId: "amu",
        className: "Soar",
        classDay: "Thu",
        classTime: "18:00",
        coverDate: "2026-06-19",
        agreedSubId: "hafy",
        note: "Travelling that week, apologies for the short notice.",
        submittedDate: "2026-06-10",
        status: "pending"
    }
];


/* ────────────────────────────────────────────────────────────
   COLOR KEY → CSS CLASS MAP
   Single source of truth so the timetable rendering and the
   legend never drift out of sync.
──────────────────────────────────────────────────────────── */
const colorKeyMap = {
    teal:      { bg: "var(--teal-light)",       border: "var(--teal)" },
    tangerine: { bg: "var(--tangerine-light)",  border: "var(--tangerine)" },
    pink:      { bg: "#fce4ec",                 border: "#d81b60" },
    lavender:  { bg: "#ede7f6",                 border: "#7e57c2" },
    skyblue:   { bg: "#e3f2fd",                 border: "#1e88e5" }
};


/* ────────────────────────────────────────────────────────────
   HELPER: build a display-ready weekly timetable for a given
   audience ("adult" | "kids"), grouped by day.
   Used by both client and instructor portals so the rendering
   logic only needs to live in one place.
──────────────────────────────────────────────────────────── */
function buildWeeklyTimetable(audience) {
    const days = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
    const table = {};
    days.forEach(d => table[d] = []);

    // Standalone class slots (adult classes)
    classSlots
        .filter(slot => slot.active !== false)
        .forEach(slot => {
            const cls = getClass(slot.classId);
            if (!cls || cls.active === false) return;
            if (audience && cls.audience !== audience) return;
            table[slot.day].push({ slot, cls, program: null });
        });

    // Program-owned slots (kids programs, and future adult programs)
    programSlots
        .filter(slot => slot.active !== false)
        .forEach(slot => {
            const cls = getClass(slot.classId);
            const prog = getProgram(slot.programId);
            if (!cls || cls.active === false) return;
            if (!prog || prog.active === false) return;
            if (audience && cls.audience !== audience) return;
            table[slot.day].push({ slot, cls, program: prog });
        });

    days.forEach(d => table[d].sort((a, b) => a.slot.time.localeCompare(b.slot.time)));
    return table;
}
