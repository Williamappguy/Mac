// Sample data for the William AI prototype.
// Lots of personality strings — dialed by `mode` ("sassy" | "pro").

window.WILLIAM_DATA = (() => {
  const sassyOpener = [
    { t: "text", from: "ai", body: "Oh look who's back. 👀 Missed me, Ollie?" },
    { t: "text", from: "ai", body: "I peeked at your week. We need to talk about Friday night." },
  ];
  const proOpener = [
    { t: "text", from: "ai", body: "Welcome back, Ollie. I've reviewed your week's activity." },
    { t: "text", from: "ai", body: "You spent **$417.83** across 12 transactions. Want a breakdown or a forecast?" },
  ];

  // The roast — rich response after user taps "Roast my spending"
  const roast = (mode) => mode === "sassy" ? [
    { t: "typing", from: "ai" },
    { t: "text", from: "ai", body: "Okay buckle up babe. 🪑✨" },
    { t: "recap", from: "ai", title: "Ollie's week of crimes",
      lines: [
        { label: "Cocktails & Canapés", amount: 142.40, emoji: "🍸", verdict: "you, a person who has rent" },
        { label: "Grumpy Monkey (×4)", amount: 26.24, emoji: "☕️", verdict: "the espresso budget of a small nation" },
        { label: "Statement Barber", amount: 50.80, emoji: "💈", verdict: "the cut WAS clean tho, fair" },
        { label: "Uber after midnight", amount: 38.10, emoji: "🚕", verdict: "could've walked. it was 600m." },
      ],
      total: 257.54 },
    { t: "meme", from: "ai", caption: "you, looking at your bank balance Sunday morning:",
      art: "side-eye" },
    { t: "text", from: "ai", body: "Verdict: **Diet Sassy.** You're not in shambles, but Friday-Ollie owes Monday-Ollie an apology. 💅" },
    { t: "actions", from: "ai", title: "Wanna fix it?", actions: [
      { id: "set-budget", label: "Set a weekend cap", icon: "🛡️" },
      { id: "save-50",    label: "Move $50 to savings", icon: "🏦" },
      { id: "split",      label: "Split the canapés bill", icon: "✂️" },
    ]},
  ] : [
    { t: "typing", from: "ai" },
    { t: "text", from: "ai", body: "Here's your weekly summary." },
    { t: "recap", from: "ai", title: "Week of 4–10 May",
      lines: [
        { label: "Dining & nightlife", amount: 142.40, emoji: "🍽", verdict: "+38% vs last week" },
        { label: "Cafés", amount: 26.24, emoji: "☕️", verdict: "in line with average" },
        { label: "Personal care", amount: 50.80, emoji: "💈", verdict: "monthly recurring" },
        { label: "Transport", amount: 38.10, emoji: "🚕", verdict: "above target by $8" },
      ],
      total: 257.54 },
    { t: "text", from: "ai", body: "Recommendation: cap weekend discretionary at **$120** and you'll stay on track for your San Francisco goal." },
    { t: "actions", from: "ai", title: "Suggested actions", actions: [
      { id: "set-budget", label: "Set weekend budget", icon: "🛡️" },
      { id: "save-50",    label: "Auto-move $50 to savings", icon: "🏦" },
      { id: "split",      label: "Request split from group", icon: "✂️" },
    ]},
  ];

  const billNudge = (mode) => mode === "sassy" ? [
    { t: "text", from: "ai", body: "Heads up bestie 📢 — **Suncorp credit card** wants $612.40 in 3 days." },
    { t: "billCard", from: "ai", bill: { name: "Suncorp Credit Card", amount: 612.40, due: "Mon, May 11", logo: "S", color: "#FFB81C" } },
    { t: "text", from: "ai", body: "Your account's got it. We just need you to *not* spend $613 on espresso martinis between now and Monday. 🤝" },
    { t: "actions", from: "ai", actions: [
      { id: "pay-now",  label: "Pay now",       icon: "⚡" },
      { id: "split-4",  label: "Split into 4",  icon: "📆" },
      { id: "split-friends", label: "Split with friends", icon: "✂️" },
      { id: "snooze",   label: "Remind tomorrow", icon: "🔔" },
      { id: "autopay",  label: "Turn on autopay", icon: "🔁" },
    ]},
  ] : [
    { t: "text", from: "ai", body: "Reminder: Suncorp Credit Card payment of $612.40 is due Monday May 11." },
    { t: "billCard", from: "ai", bill: { name: "Suncorp Credit Card", amount: 612.40, due: "Mon, May 11", logo: "S", color: "#FFB81C" } },
    { t: "text", from: "ai", body: "Available balance covers it. Pay now, schedule, or enable autopay." },
    { t: "actions", from: "ai", actions: [
      { id: "pay-now",  label: "Pay now",       icon: "⚡" },
      { id: "split-4",  label: "Split into 4",  icon: "📆" },
      { id: "split-friends", label: "Split with friends", icon: "✂️" },
      { id: "snooze",   label: "Schedule",      icon: "📅" },
      { id: "autopay",  label: "Enable autopay", icon: "🔁" },
    ]},
  ];

  const goalChat = (mode) => mode === "sassy" ? [
    { t: "text", from: "ai", body: "San Francisco trip 🌉. We're at **$5,624 / $5,400** — wait." },
    { t: "text", from: "ai", body: "OLLIE. You smashed it?? When did you do that. I literally was gonna roast you about this. 🥲" },
    { t: "goalCard", from: "ai", goal: { name: "San Francisco", target: 5400, current: 5624, emoji: "🌉" } },
    { t: "text", from: "ai", body: "Wanna roll the extra $224 into your next goal (Wedding 💍 sitting at $0/$10k... brave) or move it back to checking?" },
    { t: "actions", from: "ai", actions: [
      { id: "next-goal", label: "Roll into Wedding goal", icon: "💍" },
      { id: "checking",  label: "Send to checking",       icon: "💳" },
    ]},
  ] : [
    { t: "text", from: "ai", body: "Goal status: San Francisco — $5,624.27 / $5,400.00. Target met." },
    { t: "goalCard", from: "ai", goal: { name: "San Francisco", target: 5400, current: 5624, emoji: "🌉" } },
    { t: "text", from: "ai", body: "Surplus of $224.27 available. Allocate to next goal or return to checking?" },
    { t: "actions", from: "ai", actions: [
      { id: "next-goal", label: "Allocate to Wedding",  icon: "💍" },
      { id: "checking",  label: "Return to checking",   icon: "💳" },
    ]},
  ];

  const sendMoney = (mode) => mode === "sassy" ? [
    { t: "text", from: "ai", body: "Thông owes you $146.46 from the canapés massacre. Want me to nudge?" },
    { t: "personCard", from: "ai", person: { name: "Thông Lê", handle: "@thongle123", amount: 146.46, avatarColor: "#fbb6ce" }, kind: "request" },
    { t: "actions", from: "ai", actions: [
      { id: "nudge",  label: "Send a (polite) nudge", icon: "👉" },
      { id: "snark",  label: "Send a (rude) nudge",   icon: "🔥" },
      { id: "split",  label: "Re-split the bill",      icon: "✂️" },
    ]},
  ] : [
    { t: "text", from: "ai", body: "Thông Lê owes you $146.46 across 3 activities." },
    { t: "personCard", from: "ai", person: { name: "Thông Lê", handle: "@thongle123", amount: 146.46, avatarColor: "#fbb6ce" }, kind: "request" },
    { t: "actions", from: "ai", actions: [
      { id: "nudge", label: "Send reminder",   icon: "📨" },
      { id: "split", label: "Adjust the split", icon: "✂️" },
    ]},
  ];

  // Quick suggestion chips that float above the composer
  const suggestionChips = [
    "🔥 Roast my week",
    "📊 Where did my money go?",
    "🪙 Can I afford brunch?",
    "🏦 Move $50 to savings",
    "📨 Nudge Thông",
    "📅 Bills due this week",
    "🌉 SF goal status",
    "💸 Cancel a subscription",
  ];

  // Conversation kickoff bubble shown above the chat
  const intentRows = [
    { id: "roast",  title: "Roast my week",       sub: "Spending recap with attitude", icon: "🔥",  hue: "#ff6b6b" },
    { id: "bills",  title: "What's due?",          sub: "3 bills, $789 total this week", icon: "📅", hue: "#5b9cff" },
    { id: "save",   title: "Help me save",         sub: "$224 surplus from SF goal",     icon: "🏦", hue: "#22c79c" },
    { id: "nudge",  title: "Get my money back",    sub: "Thông owes you $146.46",        icon: "📨", hue: "#f5c542" },
  ];

  return {
    sassyOpener, proOpener,
    roast, billNudge, goalChat, sendMoney,
    suggestionChips, intentRows,
  };
})();
