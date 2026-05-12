// app.jsx — Root shell: phone bezel + tab router + theme + tweaks

const { useState: useStateA, useEffect: useEffectA } = React;

const THEMES = {
  blue: {
    appBg: "#f4f6fc",
    headerBg: "#15296b",
    headerFg: "#ffffff",
    headerSub: "rgba(255,255,255,0.7)",
    headerPill: "rgba(255,255,255,0.12)",
    gold: "#fcc846",
    success: "#22c79c",
    muted: "#7a86a8",
    divider: "rgba(255,255,255,0.08)",
    aiBubble: "#ffffff",
    aiBubbleFg: "#0f1d4a",
    userBubble: "linear-gradient(135deg, #15296b 0%, #2952b8 100%)",
    userBubbleFg: "#ffffff",
    bubbleShadow: "0 4px 16px rgba(15, 29, 74, 0.06)",
    cardBg: "#ffffff",
    cardFg: "#0f1d4a",
    cardBorder: "rgba(15,29,74,0.08)",
    cardChip: "#eef1f8",
    cardShadow: "0 8px 24px rgba(15,29,74,0.08)",
    composerBg: "#ffffff",
    inputBg: "#f4f6fc",
    inputFg: "#0f1d4a",
    chipBg: "#ffffff",
    chipFg: "#15296b",
    actionBg: "#ffffff",
    actionFg: "#0f1d4a",
    actionBorder: "rgba(15,29,74,0.10)",
    heroFg: "#0f1d4a",
    heroSub: "#5a6790",
    navBg: "#ffffff",
    navFg: "#7a86a8",
    navActive: "#15296b",
  },
  dark: {
    appBg: "#0a1232",
    headerBg: "#070d23",
    headerFg: "#ffffff",
    headerSub: "rgba(255,255,255,0.6)",
    headerPill: "rgba(255,255,255,0.08)",
    gold: "#fcc846",
    success: "#22c79c",
    muted: "#8794bc",
    divider: "rgba(255,255,255,0.06)",
    aiBubble: "#152151",
    aiBubbleFg: "#e7ecff",
    userBubble: "linear-gradient(135deg, #fcc846 0%, #f5a623 100%)",
    userBubbleFg: "#15296b",
    bubbleShadow: "0 4px 16px rgba(0,0,0,0.25)",
    cardBg: "#152151",
    cardFg: "#e7ecff",
    cardBorder: "rgba(255,255,255,0.08)",
    cardChip: "rgba(255,255,255,0.06)",
    cardShadow: "0 12px 36px rgba(0,0,0,0.45)",
    composerBg: "#070d23",
    inputBg: "#152151",
    inputFg: "#ffffff",
    chipBg: "#152151",
    chipFg: "#e7ecff",
    actionBg: "#152151",
    actionFg: "#e7ecff",
    actionBorder: "rgba(255,255,255,0.08)",
    heroFg: "#ffffff",
    heroSub: "rgba(255,255,255,0.65)",
    navBg: "#070d23",
    navFg: "#8794bc",
    navActive: "#fcc846",
  },
  light: {
    appBg: "#fafbff",
    headerBg: "#ffffff",
    headerFg: "#0f1d4a",
    headerSub: "#5a6790",
    headerPill: "rgba(15,29,74,0.06)",
    gold: "#f0ac20",
    success: "#0f9e7a",
    muted: "#8390b3",
    divider: "rgba(15,29,74,0.08)",
    aiBubble: "#ffffff",
    aiBubbleFg: "#0f1d4a",
    userBubble: "linear-gradient(135deg, #15296b 0%, #2952b8 100%)",
    userBubbleFg: "#ffffff",
    bubbleShadow: "0 4px 14px rgba(15,29,74,0.05)",
    cardBg: "#ffffff",
    cardFg: "#0f1d4a",
    cardBorder: "rgba(15,29,74,0.07)",
    cardChip: "#f1f3f9",
    cardShadow: "0 6px 20px rgba(15,29,74,0.05)",
    composerBg: "#ffffff",
    inputBg: "#f4f6fc",
    inputFg: "#0f1d4a",
    chipBg: "#f4f6fc",
    chipFg: "#15296b",
    actionBg: "#ffffff",
    actionFg: "#0f1d4a",
    actionBorder: "rgba(15,29,74,0.08)",
    heroFg: "#0f1d4a",
    heroSub: "#5a6790",
    navBg: "#ffffff",
    navFg: "#8390b3",
    navActive: "#15296b",
  },
};

const NAV = [
  { id: "william", label: "AI",
    icon: (a, c) => (
      <svg width="26" height="15" viewBox="0 0 51 29" fill="none">
        <path d="M17.4 5.71c0-.02-.01-.06-.01-.08C16.58.25 12.06.07 12.06.07H0l1.7 9.65h4.12c1.01 0 1.88.76 2.07 1.81l.46 2.29.02-.02 4.05 15.1 7.18-14.72-2.19-8.47z" fill={a ? "#26A9E1" : c} opacity={a ? 1 : 0.55}/>
        <path d="M40.7 0L35.47 13.54 32.89 0H23.07L12.42 28.9h.05l-.05.1H22.64l4.24-12.01 2.65 11.91h11.06L51.18 0H40.7z" fill={c}/>
      </svg>
    )},
  { id: "bills", label: "Bills",
    icon: (a, c) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z" stroke={c} strokeWidth={a ? 2.4 : 1.9} strokeLinejoin="round"/>
        <path d="M9 8h6M9 12h6M9 16h4" stroke={c} strokeWidth={a ? 2.4 : 1.9} strokeLinecap="round"/>
      </svg>
    )},
  { id: "tx", label: "Transactions",
    icon: (a, c) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M4 8h13l-3-3M20 16H7l3 3" stroke={c} strokeWidth={a ? 2.6 : 2} strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )},
  { id: "explore", label: "Explore",
    icon: (a, c) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke={c} strokeWidth={a ? 2.4 : 1.9}/>
        <path d="M15.5 8.5l-2 5-5 2 2-5 5-2z" fill={a ? c : "none"} stroke={c} strokeWidth={a ? 2 : 1.7} strokeLinejoin="round"/>
      </svg>
    )},
];

const EXPLORE_GROUPS = [
  { title: "Money Management", items: [
    { id: "william",  label: "William AI",        emoji: "💬", tint: "#7dd3fc" },
    { id: "budget",   label: "Budget",            emoji: "🌑", tint: "#a78bfa" },
    { id: "banktx",   label: "Bank Transactions", emoji: "💳", tint: "#86efac" },
    { id: "goals",    label: "Savings Goals",     emoji: "🐷", tint: "#fbb6ce" },
    { id: "debts",    label: "Debts",             emoji: "💳", tint: "#fcd34d" },
    { id: "accounts", label: "Bank Accounts",     emoji: "🏦", tint: "#fde047" },
    { id: "intx",     label: "In-app Transactions", emoji: "💸", tint: "#7dd3fc" },
    { id: "cards",    label: "Cards",             emoji: "💳", tint: "#a78bfa" },
  ]},
  { title: "Bills & Payments", items: [
    { id: "bills",    label: "Bills",             emoji: "🧾", tint: "#86efac" },
    { id: "req",      label: "Request Money",     emoji: "✋", tint: "#fbb6ce" },
    { id: "group",    label: "Group Payments",    emoji: "👥", tint: "#fcd34d" },
    { id: "payreq",   label: "Payment Requests",  emoji: "✋", tint: "#7dd3fc" },
    { id: "split",    label: "Split Bills",       emoji: "✂️", tint: "#a78bfa" },
  ]},
  { title: "Analytics & Reports", items: [
    { id: "reports",  label: "Reports",           emoji: "📊", tint: "#fcd34d", badge: "NEW" },
    { id: "cats",     label: "Categories",        emoji: "🔷", tint: "#7dd3fc" },
  ]},
  { title: "Service", items: [
    { id: "switch",   label: "Switch & Save",     emoji: "🔁", tint: "#86efac" },
    { id: "fuel",     label: "Fuel Price",        emoji: "⛽", tint: "#fbb6ce" },
    { id: "swipe",    label: "Swipe Game",        emoji: "🎮", tint: "#a78bfa", badge: "NEW" },
  ]},
  { title: "Social", items: [
    { id: "friends",  label: "Friends",           emoji: "👋", tint: "#7dd3fc" },
  ]},
  { title: "Support & Rewards", items: [
    { id: "win",      label: "William Wins",      emoji: "🏆", tint: "#fcc846" },
    { id: "help",     label: "Help & Support",    emoji: "🎧", tint: "#86efac" },
    { id: "rewards",  label: "Rewards",           emoji: "🪙", tint: "#fcd34d" },
  ]},
  { title: "Security", items: [
    { id: "login",    label: "Login & Security",  emoji: "🔒", tint: "#fcc846" },
  ]},
];
const EXPLORE_ITEMS = EXPLORE_GROUPS.flatMap((g) => g.items.map((i) => ({
  ...i, sub: g.title,
})));
const EXPLORE_FOOTER = [
  { id: "me",       label: "Profile",       emoji: "👤" },
  { id: "settings", label: "Settings",      emoji: "⚙️" },
  { id: "help",     label: "Help & feedback", emoji: "💬" },
];

function BottomNav({ tab, setTab, theme }) {
  return (
    <div style={{
      display: "flex", background: theme.navBg,
      borderTop: `1px solid ${theme.divider}`,
      paddingBottom: 6, paddingTop: 6,
    }}>
      {NAV.map((n) => {
        const active = tab === n.id;
        const c = active ? theme.navActive : theme.navFg;
        return (
          <button key={n.id} onClick={() => setTab(n.id)} style={{
            flex: 1, padding: "8px 4px 6px", border: "none", background: "transparent",
            cursor: "pointer", display: "flex", flexDirection: "column",
            alignItems: "center", gap: 4, color: c, fontFamily: "inherit",
          }}>
            {active && (
              <div style={{
                position: "absolute", marginTop: -8, width: 28, height: 3,
                borderRadius: 3, background: theme.gold,
              }}/>
            )}
            {n.icon(active, c)}
            <span style={{ fontSize: 10, fontWeight: active ? 800 : 600, letterSpacing: 0.2 }}>
              {n.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ── Side drawer (Claude-style) ────────────────────────────
function SideDrawer({ open, onClose, theme, onPick, currentTab }) {
  return (
    <>
      <div onClick={onClose} style={{
        position: "absolute", inset: 0, background: "rgba(8,12,30,0.5)",
        opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none",
        transition: "opacity .2s ease", zIndex: 50,
      }}/>
      <div style={{
        position: "absolute", top: 0, bottom: 0, left: 0, width: "82%",
        background: theme.headerBg, color: theme.headerFg,
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform .25s cubic-bezier(.2,.8,.2,1)",
        display: "flex", flexDirection: "column", zIndex: 51,
        boxShadow: "8px 0 32px rgba(0,0,0,0.35)",
      }}>
        <div style={{ padding: "16px 18px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10, background: theme.gold,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3 5l3.5 12L10 9l2 8 3.5-8L18 17l3-12" stroke="#15296b" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.3 }}>William</div>
          </div>
          <button onClick={onClose} style={{
            width: 34, height: 34, borderRadius: 10, border: "none", cursor: "pointer",
            background: "rgba(255,255,255,0.08)", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M9 4v16" stroke="currentColor" strokeWidth="1.8"/>
            </svg>
          </button>
        </div>
        <button onClick={() => onPick("william")} style={{
          margin: "6px 14px 14px", padding: "12px 14px", borderRadius: 12,
          background: "rgba(255,255,255,0.08)", border: `1px solid rgba(255,255,255,0.12)`,
          color: "#fff", fontFamily: "inherit", fontSize: 14, fontWeight: 700,
          cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{
            width: 22, height: 22, borderRadius: 99, background: theme.gold, color: "#15296b",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800,
          }}>+</span>
          New chat
        </button>
        <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", padding: "0 8px" }}>
          {EXPLORE_ITEMS.map((it) => {
            const active = currentTab === it.id;
            return (
              <button key={it.id} onClick={() => onPick(it.id)} style={{
                width: "100%", padding: "11px 12px", borderRadius: 10, border: "none",
                background: active ? "rgba(252,200,70,0.14)" : "transparent",
                color: "#fff", fontFamily: "inherit", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 12, textAlign: "left", marginBottom: 2,
              }}>
                <span style={{
                  width: 30, height: 30, borderRadius: 9, background: it.tint + "22",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0,
                }}>{it.emoji}</span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 14, fontWeight: 700, color: active ? theme.gold : "#fff" }}>{it.label}</span>
                  <span style={{ display: "block", fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.55)", marginTop: 1 }}>{it.sub}</span>
                </span>
              </button>
            );
          })}
          <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "10px 4px" }}/>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)", padding: "4px 12px 8px" }}>Account</div>
          {EXPLORE_FOOTER.map((it) => (
            <button key={it.id} onClick={() => onPick(it.id)} style={{
              width: "100%", padding: "10px 12px", borderRadius: 10, border: "none",
              background: "transparent", color: "#fff", fontFamily: "inherit", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 12, textAlign: "left",
              fontSize: 13.5, fontWeight: 600,
            }}>
              <span style={{ width: 22, textAlign: "center" }}>{it.emoji}</span>
              {it.label}
            </button>
          ))}
        </div>
        <div style={{ padding: 12, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
            borderRadius: 12, background: "rgba(255,255,255,0.05)",
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "linear-gradient(135deg,#fcc846,#f0a020)", color: "#15296b",
              display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14,
            }}>OW</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>Ollie Wilson</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>Premium plan</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M8 9l4-4 4 4M8 15l4 4 4-4" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Explore landing (when explore tab is active and user picks a sub-screen we don't have, or just opens it) ──
function ExploreLanding({ theme, active, onPick }) {
  const item = EXPLORE_ITEMS.find((i) => i.id === active);
  const heading = active === "explore" ? "Explore" : (item?.label || "Coming soon");
  const [search, setSearch] = useStateA("");
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: theme.appBg }}>
      <div style={{
        padding: "14px 18px 12px", background: theme.headerBg,
        color: theme.headerFg, borderBottom: `1px solid ${theme.divider}`,
      }}>
        <div style={{ paddingLeft: 44, fontSize: 11, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>
          {active === "explore" ? "All services" : "Explore"}
        </div>
        <div style={{ paddingLeft: 44, fontSize: 22, fontWeight: 800, letterSpacing: -0.4, marginTop: 2 }}>{heading}</div>
        {active === "explore" && (
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.12)", borderRadius: 99, padding: "8px 14px",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="rgba(255,255,255,0.65)" strokeWidth="2"/>
              <path d="M20 20l-3.5-3.5" stroke="rgba(255,255,255,0.65)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search services"
              style={{ flex: 1, background: "transparent", border: "none", color: "#fff",
                fontFamily: "inherit", fontSize: 14, outline: "none" }}/>
          </div>
        )}
      </div>
      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", padding: "8px 14px 16px" }}>
        {active !== "explore" && (
          <div style={{
            background: theme.aiBubble, color: theme.aiBubbleFg,
            border: `1px solid ${theme.cardBorder}`, borderRadius: 16, padding: 18,
            margin: "12px 2px 16px", textAlign: "center",
          }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>🚧</div>
            <div style={{ fontSize: 15, fontWeight: 800 }}>Coming soon</div>
            <div style={{ fontSize: 12, color: theme.muted, marginTop: 4, fontWeight: 500 }}>
              This screen is on the build list — pick something else for now.
            </div>
          </div>
        )}
        {EXPLORE_GROUPS.map((g) => {
          const items = g.items.filter((i) => !search || i.label.toLowerCase().includes(search.toLowerCase()));
          if (!items.length) return null;
          return (
            <div key={g.title} style={{ marginTop: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: theme.aiBubbleFg, padding: "6px 4px 10px", letterSpacing: -0.2 }}>
                {g.title}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4, rowGap: 14 }}>
                {items.map((it) => (
                  <button key={it.id} onClick={() => onPick(it.id)} style={{
                    padding: "4px 2px", border: "none", background: "transparent",
                    cursor: "pointer", fontFamily: "inherit",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 7, position: "relative",
                  }}>
                    {it.badge && <span style={{
                      position: "absolute", top: -4, right: 4, fontSize: 8, fontWeight: 800, letterSpacing: 0.4,
                      padding: "2px 5px", borderRadius: 6, background: "#ff5e5e", color: "#fff", zIndex: 2,
                    }}>{it.badge}</span>}
                    <span style={{
                      width: 56, height: 56, borderRadius: "50%",
                      background: theme.headerBg, color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
                      boxShadow: theme.cardShadow,
                    }}>{it.emoji}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: theme.aiBubbleFg, textAlign: "center", lineHeight: 1.2 }}>
                      {it.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Phone bezel — Samsung-ish to match the source screenshots
function PhoneShell({ children, theme }) {
  return (
    <div style={{
      width: 380, height: 780, borderRadius: 44, padding: 8,
      background: "#0a0c14",
      boxShadow: "0 30px 80px rgba(0,0,0,0.35), inset 0 0 0 1.5px #2a2d36",
      position: "relative",
    }}>
      <div style={{
        width: "100%", height: "100%", borderRadius: 36, overflow: "hidden",
        background: theme.appBg, display: "flex", flexDirection: "column",
        position: "relative",
      }}>
        {/* status bar */}
        <div style={{
          height: 26, padding: "4px 22px 0", display: "flex",
          alignItems: "center", justifyContent: "space-between",
          background: theme.headerBg, color: theme.headerFg,
          fontSize: 12, fontWeight: 600, fontFamily: "inherit", flexShrink: 0,
          position: "relative", zIndex: 2,
        }}>
          <span>2:30</span>
          <div style={{
            position: "absolute", left: "50%", top: 6, transform: "translateX(-50%)",
            width: 16, height: 16, borderRadius: "50%", background: "#000",
          }}/>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor"><path d="M7 9.5L0.7 3.4a8.9 8.9 0 0112.6 0L7 9.5z"/></svg>
            <svg width="13" height="10" viewBox="0 0 13 10" fill="currentColor"><path d="M12.7 9.7V0.4L0.4 9.7h12.3z"/></svg>
            <svg width="20" height="10" viewBox="0 0 20 10"><rect x="0.5" y="1.5" width="16" height="7" rx="1.5" stroke="currentColor" fill="none"/><rect x="2" y="3" width="11" height="4" fill="currentColor"/></svg>
          </div>
        </div>
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [tweaks, setTweak] = useTweaks(/*EDITMODE-BEGIN*/{
    "personality": "sassy",
    "theme": "blue"
  }/*EDITMODE-END*/);
  const [tab, setTab] = useStateA("william");
  const [drawer, setDrawer] = useStateA(false);
  const navTabs = ["william","bills","tx","explore"];
  const navTab = navTabs.includes(tab) ? tab : "explore";
  const theme = THEMES[tweaks.theme] || THEMES.blue;
  const mode = tweaks.personality;

  let screen;
  switch (tab) {
    case "william": screen = <ChatScreen theme={theme} mode={mode} onNavigate={(id) => setTab(id)} onModeToggle={() => setTweak("personality", mode === "sassy" ? "pro" : "sassy")}/>; break;
    case "bills":   screen = <BillsScreen theme={theme}/>; break;
    case "tx":      screen = <TransactionsScreen theme={theme}/>; break;
    case "win":     screen = <GiveawayScreen theme={theme} mode={mode}/>; break;
    case "req":     screen = <RequestsScreen theme={theme}/>; break;
    case "me":      screen = <ProfileScreen theme={theme}/>; break;
    case "explore":
    case "goals":
    case "switch":
    case "insights":
    case "docs":
    case "refer":
    case "settings":
    case "help":
      screen = <ExploreLanding theme={theme} active={tab} onPick={(id) => setTab(id)}/>; break;
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "radial-gradient(ellipse at top, #1a2862 0%, #0a0f24 70%)",
      padding: 32, fontFamily: 'Inter, "SF Pro Text", system-ui, sans-serif',
    }}>
      <PhoneShell theme={theme}>
        <div data-screen-label={tab} style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
          {screen}
          <button onClick={() => setDrawer(true)} aria-label="Menu" style={{
            position: "absolute", top: 8, left: 10, width: 34, height: 34, borderRadius: 10,
            border: "none", background: "rgba(255,255,255,0.12)", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <SideDrawer open={drawer} onClose={() => setDrawer(false)} theme={theme}
            onPick={(id) => { setDrawer(false); setTab(id); }} currentTab={tab}/>
        </div>
        <BottomNav tab={navTab} setTab={(id) => { if (id === "explore") setTab("explore"); else setTab(id); }} theme={theme}/>
      </PhoneShell>

      <TweaksPanel title="Tweaks">
        <TweakSection label="William's vibe">
          <TweakRadio label="Personality" value={tweaks.personality}
            onChange={(v) => setTweak("personality", v)}
            options={[{ value: "sassy", label: "🔥 Sassy" }, { value: "pro", label: "💼 Pro" }]}/>
        </TweakSection>
        <TweakSection label="Theme">
          <TweakRadio label="Surface" value={tweaks.theme}
            onChange={(v) => setTweak("theme", v)}
            options={[
              { value: "blue", label: "William" },
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
            ]}/>
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
