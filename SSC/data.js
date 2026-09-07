// OWNER CONTENT — ask AI to edit this file for routine updates.
// Keep quoted text, commas, and field names intact. See ../OWNER-GUIDE.md.
const SITE = {
  pageTitle: "College Office Hub",
  headlineStart: "Your college",
  headlineMiddle: "plan, ",
  headlineHighlight: "sorted.",
  contactHeading: "Stuck? Come find us. 👋",
  contactButton: "Email a counselor",
  staffLocation: "Room 214",
  searchHelp: 'Try "FAFSA", "SUNY", or stop by the College Office in Room 214.',
  schoolName: "Randolph High School",
  logo: "logo.png",
  updateLabel: "Your next chapter starts here",
  intro: "Every application portal, aid form, scholarship and handout your counselors actually use — plus your youth leaders and our monthly newsletters. All in one place.",
  officeDetails: "College Office · Room 214 · Open 8:30 AM – 3:30 PM",
  walkInHours: "Walk-in hours every Wednesday after 6th period.",
  email: "collegeoffice@school.edu"
};

/* ═══════════════════════════════════════════════════════════════════
   DATA — edit this section to customise links, slides & people
   ═══════════════════════════════════════════════════════════════════ */

const HUB_LINKS = {
  applying: [
    { emoji:"🗽", label:"Apply to CUNY",            sub:"One application, 20+ NYC campuses. Fee waivers available.",         url:"https://www.cuny.edu/admissions/undergraduate/apply/",                                                                                                                                   tag:"🔥 Start here" },
    { emoji:"🌲", label:"Apply to SUNY",            sub:"Up to five SUNY campuses per application.",                          url:"https://www.suny.edu/attend/apply-to-suny/",                                                                                                                                              tag:"" },
    { emoji:"📝", label:"Common App",               sub:"Private and out-of-state colleges.",                                  url:"https://www.commonapp.org/",                                                                                                                                                             tag:"" },
    { emoji:"✊🏾",label:"Common Black College App", sub:"One $20 application to 60+ HBCUs.",                                  url:"https://commonblackcollegeapp.com/",                                                                                                                                                      tag:"💰 One fee" },
    { emoji:"📅", label:"Deadline Tracker",         sub:"Every due date for this year's seniors in one place.",               url:"https://bigfuture.collegeboard.org/plan-for-college/college-application-process",                                                                                                         tag:"⏰ Check weekly" }
  ],
  pathways: [
    { emoji:"🔧", label:"Co-op Tech",               sub:"NYC DOE career and technical training programs.",                    url:"https://www.coopnyc.org/",                                                                                                                                                               tag:"" },
    { emoji:"⚡", label:"APEX Technical School",    sub:"Welding, HVAC, auto and electrical trades.",                         url:"https://www.apexschool.edu/",                                                                                                                                                            tag:"" },
    { emoji:"🚙", label:"Universal Technical Institute", sub:"Automotive, diesel and collision repair training.",             url:"https://www.uti.edu/",                                                                                                                                                                   tag:"" },
    { emoji:"🎖️",label:"Armed Forces",             sub:"Army, Navy, Marines, Air Force, National Guard. See Ms. Goris to meet with a recruiter.", url:"https://www.todaysmilitary.com/",                                                                                                                                tag:"📍 See Ms. Goris" }
  ],
  financialAid: [
    { emoji:"🔑", label:"Create an FSA ID",         sub:"Do this before the FAFSA. You and a parent each need your own.",    url:"https://studentaid.gov/fsa-id/create-account/launch",                                                                                                                                    tag:"1️⃣ Step one" },
    { emoji:"💰", label:"Complete your FAFSA",      sub:"Federal aid — free to file, opens every October.",                  url:"https://studentaid.gov/h/apply-for-aid/fafsa",                                                                                                                                           tag:"🔥 Do first" },
    { emoji:"🗞️",label:"New York State TAP Grant", sub:"State tuition assistance for NY residents.",                         url:"https://www.hesc.ny.gov/pay-for-college/apply-for-financial-aid/nys-tap.html",                                                                                                           tag:"" },
    { emoji:"🌅", label:"Jose Peralta NYS DREAM Act",sub:"State aid for undocumented students.",                              url:"https://www.hesc.ny.gov/dream/",                                                                                                                                                         tag:"📍 NY only" },
    { emoji:"🎯", label:"NYS Excelsior Scholarship",sub:"Free SUNY/CUNY tuition for eligible families.",                      url:"https://www.hesc.ny.gov/pay-for-college/financial-aid/types-of-financial-aid/nys-grants-scholarships-awards/the-excelsior-scholarship.html",                                            tag:"" },
    { emoji:"🧮", label:"Net Price Calculator",     sub:"See what a college actually costs your family.",                     url:"https://collegecost.ed.gov/net-price",                                                                                                                                                   tag:"" }
  ],
  scholarships: [
    { emoji:"🌉", label:"QuestBridge",              sub:"Full scholarships for high-achieving students.",                     url:"https://www.questbridge.org/",                                                                                                                                                           tag:"💰 Full ride" },
    { emoji:"🤝", label:"POSSE Foundation",         sub:"Full-tuition leadership scholarships, nominated in fall.",           url:"https://www.possefoundation.org/",                                                                                                                                                       tag:"💰 Full ride" },
    { emoji:"🔎", label:"Fastweb",                  sub:"Searchable national scholarship database.",                           url:"https://www.fastweb.com/",                                                                                                                                                               tag:"" },
    { emoji:"🎓", label:"Scholarships.com",         sub:"Match awards to your major and interests.",                          url:"https://www.scholarships.com/",                                                                                                                                                          tag:"" },
    { emoji:"🏙️",label:"NYC Scholarships",         sub:"Local awards open only to city students.",                           url:"https://www.schools.nyc.gov/school-life/college-and-career/college-planning/paying-for-college",                                                                                        tag:"📍 Local" },
    { emoji:"📬", label:"Monthly Scholarship Newsletter", sub:"Fresh awards and deadlines, posted by us every month.",        url:"#",                                                                                                                                                                                      tag:"🆕 Monthly" }
  ],
  guides: [
    { emoji:"🖥️",label:"Set Up Your OverGrad",    sub:"Step-by-step account setup walkthrough.",                             url:"#",  tag:"PDF" },
    { emoji:"🗂️",label:"Senior Year Checklist",   sub:"Month by month, September to June.",                                  url:"#",  tag:"PDF" },
    { emoji:"✍️", label:"Personal Essay Guide",    sub:"Prompts, structure, three samples.",                                  url:"#",  tag:"PDF" },
    { emoji:"📨", label:"How to Request a Rec Letter", sub:"Requesting recommendations on OverGrad.",                        url:"#",  tag:"PDF" },
    { emoji:"🔗", label:"OverGrad Request Page",   sub:"Go straight to your recommendation requests.",                        url:"https://www.overgrad.com/", tag:"Link" }
  ],
  social: [
    { emoji:"📸", label:"Instagram",               sub:"@randolphcollegeoffice — daily posts and reminders.",                 url:"#",  tag:"Follow" },
    { emoji:"🎵", label:"TikTok",                  sub:"Quick explainers and senior takeovers.",                              url:"#",  tag:"Follow" },
    { emoji:"🏫", label:"Google Classroom",        sub:"Official announcements and posted deadlines.",                        url:"#",  tag:"Join" }
  ]
};

// ADD NEW NEWSLETTERS HERE. date is YYYY-MM-DD; newest displays first.
const NEWSLETTERS = [
  { emoji:"🍂", date:"2026-09-01", label:"September 2026", sub:"Senior kickoff, FAFSA prep, fall deadlines.",  url:"#", tag:"Newest" },
  { emoji:"☀️", date:"2026-06-01", label:"June 2026",      sub:"Decision day recap and summer to-do list.",     url:"#", tag:"PDF" },
  { emoji:"🌷", date:"2026-05-01", label:"May 2026",       sub:"Committing to a college and award letters.",     url:"#", tag:"PDF" },
  { emoji:"🌱", date:"2026-04-01", label:"April 2026",     sub:"Comparing financial aid offers.",                url:"#", tag:"PDF" }
];

// ANNOUNCEMENTS: displayed in this order. Move, add, or remove whole entries.
// Optional image: a file path or URL. Themes: sky, pink, amber, mint, violet.
const SLIDESHOW = [
  { tag:"🔥 This week", headline:"FAFSA Night is Thursday",        sub:"Bring a parent and your 2024 tax info to Room 214 at 6 PM. We'll file it with you, start to finish.", cta:"See what to bring",           url:"#", image:"", emoji:"💰", theme:"mint"   },
  { tag:"📣 Now open",  headline:"CUNY applications are live",     sub:"Fee waivers are available for every senior. Start the application and we'll review it with you before you submit.", cta:"Start your CUNY app", url:"https://www.cuny.edu/admissions/undergraduate/apply/", image:"", emoji:"🗽", theme:"sky" },
  { tag:"🎉 Congrats",  headline:"12 seniors accepted early",      sub:"Our first early-action results are in. Come see the acceptance wall outside Room 214.",                cta:"Read the September newsletter", url:"#", image:"", emoji:"🎓", theme:"amber"  },
  { tag:"🫂 Meet us",   headline:"Your youth leader is waiting",   sub:"Eighteen youth leaders, free periods posted below. Find yours and book a check-in this week.",        cta:"Find your youth leader",       url:"#", image:"", emoji:"🤝", theme:"violet" }
];

const YOUTH_LEADERS = [
  { name:"Henry Ramos",  role:"Youth Leader", assigned:"Last names A–D, grade 12", free:"Periods 2 & 8", work:"Periods 3, 4 · Room 214", email:"hramos@school.edu" },
  { name:"Jasmine Peña", role:"Youth Leader", assigned:"Last names E–J, grade 12", free:"Periods 1 & 5", work:"Periods 5, 6 · Room 214", email:"jpena@school.edu" },
  { name:"Marcus Boyd",  role:"Youth Leader", assigned:"Last names K–P, grade 12", free:"Periods 4 & 7", work:"Periods 7, 8 · Room 214", email:"mboyd@school.edu" },
  { name:"Amara Osei",   role:"Youth Leader", assigned:"Last names Q–Z, grade 12", free:"Periods 3 & 6", work:"Periods 1, 2 · Room 214", email:"aosei@school.edu" }
];

const SSC_STAFF = [
  { name:"Carolina Goris", role:"College & Career Counselor",  room:"Room 214 · SSC Office", hours:"Mon–Fri, 8:00 AM – 4:00 PM", about:"Applications, trade school, military recruiters", email:"cgoris@school.edu" },
  { name:"Staff Name",     role:"Financial Aid Coordinator",   room:"Room 214 · SSC Office", hours:"Mon–Fri, 8:00 AM – 4:00 PM", about:"FAFSA, TAP, Dream Act, award letters",            email:"name@school.edu" },
  { name:"Staff Name",     role:"Social Worker",               room:"Room 216",               hours:"Mon–Fri, 8:00 AM – 4:00 PM", about:"Wellness check-ins and outside referrals",         email:"name@school.edu" }
];

