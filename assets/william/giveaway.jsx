// giveaway.jsx — William Giveaway Entry System
// Hub + Detail + Store + Earn More + Past Winners
// Self-contained, reads `theme` from props.

const { useState: useStateG, useEffect: useEffectG, useMemo: useMemoG } = React;

// ── shared chrome ─────────────────────────────────────────
function GHeader({ title, theme, onBack, right }) {
  return (
    <div style={{
      padding: "16px 14px 14px", background: theme.headerBg,
      borderBottom: `1px solid ${theme.divider}`,
      display: "flex", alignItems: "center", gap: 8, flexShrink: 0,
    }}>
      <button onClick={onBack} style={{
        width: 38, height: 38, borderRadius: 99, border: "none",
        background: "rgba(255,255,255,0.08)", color: theme.headerFg, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div style={{ flex: 1, fontSize: 18, fontWeight: 800, color: theme.headerFg, textAlign: "center", letterSpacing: -0.3 }}>
        {title}
      </div>
      <div style={{ width: 38, display: "flex", justifyContent: "flex-end" }}>{right}</div>
    </div>
  );
}

// Big animated count-up balance (lives, breathes, pulses)
function EntryCounter({ count, theme, large }) {
  const [shown, setShown] = useStateG(count);
  useEffectG(() => {
    if (shown === count) return;
    const start = shown, diff = count - start, dur = 800;
    const t0 = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(start + diff * e));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [count]);
  return (
    <div style={{
      display: "inline-flex", alignItems: "baseline", gap: 6,
      fontSize: large ? 56 : 36, fontWeight: 800, letterSpacing: -1.5,
      color: theme.gold, fontVariantNumeric: "tabular-nums",
      textShadow: `0 0 28px ${theme.gold}66`,
    }}>
      {shown.toLocaleString()}
      <span style={{ fontSize: large ? 14 : 11, fontWeight: 700, color: "#fff", opacity: 0.65, letterSpacing: 1, textShadow: "none" }}>
        ENTRIES
      </span>
    </div>
  );
}

// Countdown chip
function Countdown({ to, theme, big, dark }) {
  const [now, setNow] = useStateG(Date.now());
  useEffectG(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const ms = Math.max(0, to - now);
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms / 3600000) % 24);
  const m = Math.floor((ms / 60000) % 60);
  const s = Math.floor((ms / 1000) % 60);
  const fg = dark ? "#0b1a2b" : "#fff";
  const sub = dark ? "rgba(11,26,43,0.55)" : "rgba(255,255,255,0.55)";
  if (big) {
    return (
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        {[
          { v: d, l: "DAYS" }, { v: h, l: "HRS" }, { v: m, l: "MIN" }, { v: s, l: "SEC" },
        ].map((u, i) => (
          <div key={i} style={{
            background: dark ? "#0b1a2b" : "rgba(255,255,255,0.12)",
            color: dark ? theme.gold : "#fff",
            borderRadius: 12, padding: "8px 12px", minWidth: 56, textAlign: "center",
          }}>
            <div style={{ fontSize: 24, fontWeight: 800, fontVariantNumeric: "tabular-nums", lineHeight: 1, letterSpacing: -0.5 }}>
              {String(u.v).padStart(2, "0")}
            </div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 0.6, opacity: 0.7, marginTop: 4 }}>{u.l}</div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div style={{ display: "inline-flex", alignItems: "baseline", gap: 4, color: fg, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
      <span style={{ fontSize: 13, fontWeight: 800 }}>{d}d {String(h).padStart(2, "0")}h {String(m).padStart(2, "0")}m {String(s).padStart(2, "0")}s</span>
    </div>
  );
}

// data
const PRIZES = [
  { id: "rent",    title: "1 month of rent paid",       value: "$2,800",   icon: "🏠", color: "linear-gradient(135deg,#c084fc,#7c3aed)", entrants: 8412,  status: "live", drawLabel: "Sun 8pm",
    blurb: "Win 1 month of rent or mortgage payments made — or $4,000 cash if you'd rather. Boost your chances and grab extra entries below.",
    perks: ["Paid directly to your landlord or lender", "Or take $4,000 cash instead", "Drawn live Sunday 8pm AEST"] },
  { id: "power",   title: "1 year of electricity paid", value: "$2,400",   icon: "⚡", color: "linear-gradient(135deg,#fde047,#f59e0b)", entrants: 6203,  status: "live", drawLabel: "Sun 8pm",
    blurb: "Win a full year of electricity bills paid — or $2,400 cash. Stack entries below to up your odds.",
    perks: ["12 months of power bills covered", "Or take $2,400 cash instead", "Drawn live Sunday 8pm AEST"] },
  { id: "cash",    title: "$5,000 cold hard cash",      value: "$5,000",   icon: "💸", color: "linear-gradient(135deg,#34d399,#059669)", entrants: 12089, status: "live", drawLabel: "Sun 8pm",
    blurb: "Win $5,000 cash deposited straight to your account. No strings, no spend-rules. Boost your chances below.",
    perks: ["$5,000 paid to your William account", "Use it however you want", "Drawn live Sunday 8pm AEST"] },
];
const UPCOMING = [
  { id: "fuel",     title: "1 year of fuel paid",       value: "$3,100", icon: "⛽", color: "linear-gradient(135deg,#fda4af,#e11d48)", entrants: 0, opensInDays: 7,  drawLabel: "Next Sun" },
  { id: "groc",     title: "6 months of groceries",     value: "$3,600", icon: "🛒", color: "linear-gradient(135deg,#86efac,#16a34a)", entrants: 0, opensInDays: 14, drawLabel: "In 2 wks" },
  { id: "phone",    title: "iPhone 16 Pro",             value: "$1,899", icon: "📱", color: "linear-gradient(135deg,#7dd3fc,#0284c7)", entrants: 0, opensInDays: 14, drawLabel: "In 2 wks" },
  { id: "rentbig",  title: "3 months of rent paid",     value: "$8,400", icon: "🏡", color: "linear-gradient(135deg,#fcc846,#f0a020)", entrants: 0, opensInDays: 21, drawLabel: "End of mo" },
];
const PAST_WINS = [
  { name: "Sarah from Brisbane",  prize: "1 year of fuel",       value: "$3,100", week: "Last week",  avatar: "🚗", color: "#a78bfa" },
  { name: "Marcus from Adelaide", prize: "$2,000 cash",          value: "$2,000", week: "2 weeks ago", avatar: "💰", color: "#fcd34d" },
  { name: "Priya from Sydney",    prize: "6 months groceries",   value: "$3,600", week: "2 weeks ago", avatar: "🛒", color: "#86efac" },
  { name: "Jake from Perth",      prize: "1 month rent",         value: "$2,500", week: "3 weeks ago", avatar: "🏠", color: "#fbb6ce" },
  { name: "Alex from Melbourne",  prize: "1 year electricity",   value: "$2,400", week: "4 weeks ago", avatar: "⚡", color: "#fde047" },
];
const EARN_ACTIONS = [
  { id: "switch",  icon: "🔁", title: "Compare & switch",       sub: "Energy, internet, phone, insurance",  reward: 25, hot: true,  oneOff: true,  cta: "Switch now" },
  { id: "bill",    icon: "💳", title: "Pay a bill in-app",      sub: "Any bill, any provider",              reward: 5,  cta: "Pay a bill" },
  { id: "split",   icon: "✂️", title: "Split a bill",            sub: "Per friend you split with",           reward: 1,  cta: "Split now" },
  { id: "goal",    icon: "🎯", title: "Reach a savings goal",   sub: "On goal completion",                  reward: 15, cta: "Set a goal" },
  { id: "ref",     icon: "🤝", title: "Invite a friend",        sub: "When they connect a bank",            reward: 10, cta: "Invite" },
  { id: "import",  icon: "📥", title: "Import a bill",          sub: "First time per provider",             reward: 3,  cta: "Import" },
];
const SOURCES = [
  { name: "Subscription",    entries: 5,   color: "#fcc846" },
  { name: "Compare & switch", entries: 50, color: "#22c79c" },
  { name: "Bill splits",     entries: 12,  color: "#7dd3fc" },
  { name: "Savings goals",   entries: 30,  color: "#a78bfa" },
  { name: "Bills paid",      entries: 20,  color: "#fda4af" },
  { name: "Booster pack",    entries: 50,  color: "#f59e0b" },
];
const totalEntries = SOURCES.reduce((a, b) => a + b.entries, 0); // 167

// ── HUB ───────────────────────────────────────────────────
function GiveawayHub({ theme, go, mode }) {
  const drawAt = useMemoG(() => Date.now() + 2 * 86400000 + 5 * 3600000 + 12 * 60000, []);
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: theme.appBg }}>
      {/* Hero */}
      <div style={{
        background: `linear-gradient(160deg, ${theme.headerBg} 0%, #0a1238 100%)`,
        color: theme.headerFg, padding: "16px 18px 28px",
        position: "relative", overflow: "hidden", flexShrink: 0,
      }}>
        {/* sparkle bg */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.4 }}>
          {[[20,15,3],[80,30,2],[40,55,2],[88,70,3],[15,80,2],[60,85,3],[30,25,2]].map(([x,y,r], i) => (
            <div key={i} style={{
              position: "absolute", left: `${x}%`, top: `${y}%`,
              width: r * 2, height: r * 2, borderRadius: "50%",
              background: theme.gold, boxShadow: `0 0 10px ${theme.gold}`,
            }}/>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase", color: theme.gold }}>
            🏆 William Wins
          </div>
          <button onClick={() => go("history")} style={{
            background: "rgba(255,255,255,0.08)", border: "none", color: "#fff",
            padding: "6px 12px", borderRadius: 99, fontSize: 11, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit",
          }}>Past winners →</button>
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.15, letterSpacing: -0.4, marginBottom: 14 }}>
          {mode === "sassy"
            ? "Pay your bills. Win your bills back."
            : "Earn entries. Win weekly. It's that simple."}
        </div>
        {/* Big entry counter */}
        <div style={{
          background: "rgba(0,0,0,0.25)", borderRadius: 22, padding: 18,
          border: `1px solid ${theme.gold}33`,
        }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase" }}>
            Your balance
          </div>
          <div style={{ marginTop: 4 }}>
            <EntryCounter count={167} theme={theme} large/>
          </div>
          <div style={{
            display: "flex", gap: 6, marginTop: 14, alignItems: "center",
            fontSize: 12, color: "rgba(255,255,255,0.75)", fontWeight: 600,
          }}>
            <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#22c79c", boxShadow: "0 0 8px #22c79c" }}/>
            +52 this week from your activity
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button onClick={() => go("earn")} style={{
              flex: 1, padding: "11px", borderRadius: 12, border: "none", cursor: "pointer",
              background: theme.gold, color: "#15296b",
              fontFamily: "inherit", fontSize: 13, fontWeight: 800,
            }}>Earn free entries</button>
            <button onClick={() => go("breakdown")} style={{
              flex: 1, padding: "11px", borderRadius: 12, border: `1px solid rgba(255,255,255,0.2)`,
              background: "transparent", color: "#fff", cursor: "pointer",
              fontFamily: "inherit", fontSize: 13, fontWeight: 800,
            }}>See breakdown</button>
          </div>
          <div style={{ marginTop: 10, fontSize: 11, color: "rgba(255,255,255,0.55)", fontWeight: 600, textAlign: "center" }}>
            Buy entry packs inside any draw below ↓
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none" }}>
        {/* This week's draws */}
        <div style={{ padding: "20px 16px 8px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: theme.aiBubbleFg }}>This week's draws</div>
            <div style={{
              fontSize: 11, fontWeight: 700, color: theme.muted,
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c79c" }}/>
              Live · draws Sun 8pm
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, padding: "0 16px 4px", overflowX: "auto", scrollbarWidth: "none" }}>
          {PRIZES.map((p) => (
            <div key={p.id} onClick={() => go("detail", p)} style={{
              flexShrink: 0, width: 240, borderRadius: 22, padding: 16,
              background: p.color, color: "#0b1a2b", cursor: "pointer",
              boxShadow: theme.cardShadow, position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: -20, right: -20, fontSize: 100, opacity: 0.18 }}>{p.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase",
                background: "rgba(11,26,43,0.85)", color: "#fcc846", display: "inline-block",
                padding: "4px 9px", borderRadius: 99, whiteSpace: "nowrap",
              }}>worth {p.value}</div>
              <div style={{ fontSize: 19, fontWeight: 800, marginTop: 12, letterSpacing: -0.3, lineHeight: 1.2, position: "relative" }}>
                {p.title}
              </div>
              <div style={{ marginTop: 14, fontSize: 11, fontWeight: 700, opacity: 0.7 }}>
                Draws in
              </div>
              <div style={{ marginTop: 4 }}>
                <Countdown to={drawAt + p.entrants * 7} theme={theme} dark/>
              </div>
              <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid rgba(11,26,43,0.15)",
                display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, fontWeight: 700,
              }}>
                <span>{p.entrants.toLocaleString()} entrants</span>
                <span style={{ background: "#0b1a2b", color: "#fcc846", padding: "3px 9px", borderRadius: 99 }}>
                  Your: 167
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming draws */}
        <div style={{ padding: "24px 16px 8px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: theme.aiBubbleFg }}>Coming up</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: theme.muted }}>
              {UPCOMING.length} draws scheduled
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, padding: "0 16px 4px", overflowX: "auto", scrollbarWidth: "none" }}>
          {UPCOMING.map((p) => (
            <div key={p.id} onClick={() => go("detail", p)} style={{
              flexShrink: 0, width: 200, borderRadius: 18, padding: 14,
              background: theme.aiBubble, color: theme.aiBubbleFg, cursor: "pointer",
              border: `1px solid ${theme.cardBorder}`, position: "relative", overflow: "hidden",
            }}>
              {/* dim overlay strip on top to suggest "locked / scheduled" */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 3,
                background: p.color, opacity: 0.9,
              }}/>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, fontSize: 22, flexShrink: 0,
                  background: p.color, color: "#0b1a2b",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{p.icon}</div>
                <div style={{
                  fontSize: 9, fontWeight: 800, letterSpacing: 0.5, padding: "3px 7px", borderRadius: 99,
                  background: theme.cardChip, color: theme.muted, whiteSpace: "nowrap",
                }}>OPENS {p.drawLabel.toUpperCase()}</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: -0.2, lineHeight: 1.25 }}>
                {p.title}
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: theme.muted, marginTop: 4 }}>
                Worth <span style={{ color: theme.gold }}>{p.value}</span>
              </div>
              <div style={{
                marginTop: 12, paddingTop: 10, borderTop: `1px solid ${theme.cardBorder}`,
                fontSize: 11, fontWeight: 700, color: theme.gold, display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span>Reserve entries</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>

        {/* Sources */}
        <div style={{ padding: "20px 16px 8px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: theme.aiBubbleFg }}>Where your entries came from</div>
            <button onClick={() => go("breakdown")} style={{
              background: "transparent", border: "none", color: theme.gold,
              fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "inherit",
            }}>See all →</button>
          </div>
          {/* stacked bar */}
          <div style={{
            display: "flex", height: 14, borderRadius: 99, overflow: "hidden",
            background: theme.cardChip, marginBottom: 12,
          }}>
            {SOURCES.map((s, i) => (
              <div key={i} style={{
                flex: s.entries, background: s.color,
              }}/>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {SOURCES.slice(0, 4).map((s) => (
              <div key={s.name} style={{
                background: theme.aiBubble, padding: "10px 12px", borderRadius: 12,
                border: `1px solid ${theme.cardBorder}`,
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: 99, background: s.color, flexShrink: 0 }}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: theme.aiBubbleFg, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {s.name}
                  </div>
                  <div style={{ fontSize: 11, color: theme.muted, fontWeight: 600 }}>
                    {s.entries} entries
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Earn-more shortlist */}
        <div style={{ padding: "20px 16px 8px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: theme.aiBubbleFg }}>Earn free entries</div>
            <button onClick={() => go("earn")} style={{
              background: "transparent", border: "none", color: theme.gold,
              fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "inherit",
            }}>All ways →</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {EARN_ACTIONS.slice(0, 3).map((a) => <EarnRow key={a.id} a={a} theme={theme}/>)}
          </div>
        </div>

        {/* Recent winners ticker */}
        <div style={{ padding: "0 16px 24px" }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase",
            color: theme.muted, marginBottom: 8, paddingLeft: 4 }}>Recent winners</div>
          {PAST_WINS.slice(0, 2).map((w, i) => <WinRow key={i} w={w} theme={theme}/>)}
          <button onClick={() => go("history")} style={{
            marginTop: 8, width: "100%", padding: 12, borderRadius: 14,
            background: theme.aiBubble, color: theme.aiBubbleFg,
            border: `1px solid ${theme.cardBorder}`, cursor: "pointer",
            fontFamily: "inherit", fontSize: 13, fontWeight: 700,
          }}>See all winners →</button>
        </div>
      </div>
    </div>
  );
}

function EarnRow({ a, theme, full }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
      background: theme.aiBubble, borderRadius: 16,
      border: `1px solid ${theme.cardBorder}`,
    }}>
      <div style={{
        width: 42, height: 42, borderRadius: 12, fontSize: 20,
        background: theme.cardChip,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>{a.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: theme.aiBubbleFg }}>{a.title}</div>
          {a.hot && <span style={{
            fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 99,
            background: "#ff5e5e", color: "#fff", letterSpacing: 0.4, whiteSpace: "nowrap",
          }}>HOT</span>}
        </div>
        <div style={{ fontSize: 12, color: theme.muted, marginTop: 1 }}>{a.sub}</div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: 800, color: theme.gold,
          background: theme.gold + "1a", padding: "4px 10px", borderRadius: 99, whiteSpace: "nowrap",
        }}>+{a.reward} {full ? "entries" : ""}</div>
        {full && <div style={{ fontSize: 11, color: theme.muted, marginTop: 4, fontWeight: 600 }}>
          {a.oneOff ? "per switch" : "each"}
        </div>}
      </div>
    </div>
  );
}

function WinRow({ w, theme }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
      background: theme.aiBubble, borderRadius: 14, marginBottom: 6,
      border: `1px solid ${theme.cardBorder}`,
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: "50%", background: w.color,
        fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>{w.avatar}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: theme.aiBubbleFg }}>{w.name}</div>
        <div style={{ fontSize: 11.5, color: theme.muted, fontWeight: 600, marginTop: 1 }}>
          won <span style={{ color: theme.aiBubbleFg, fontWeight: 700 }}>{w.prize}</span> · {w.week}
        </div>
      </div>
      <div style={{ fontSize: 12, fontWeight: 800, color: theme.success, whiteSpace: "nowrap" }}>
        {w.value}
      </div>
    </div>
  );
}

// ── DETAIL ────────────────────────────────────────────────
function GiveawayDetail({ prize, theme, onBack }) {
  const isUpcoming = prize.status === "upcoming" || prize.opensInDays;
  const drawAt = useMemoG(() => Date.now() + (isUpcoming ? (prize.opensInDays || 7) : 2) * 86400000 + 5 * 3600000, [isUpcoming]);
  const yourEntries = isUpcoming ? 0 : 167;
  const blurb = prize.blurb || `Win ${prize.title.toLowerCase()} — or take it as cash. Boost your chances below.`;
  const perks = prize.perks || ["Paid directly", "Or take cash instead", "Drawn live Sunday 8pm AEST"];

  // Per-prize packs (no Quick Buy) — entries are free, you're paying for AI prompts (trade promo)
  const packs = [
    { id: "starter", name: "Lucky Dip",       price: "$4.95",  entries: 5,   prompts: 25,  emoji: "🍀", color: "#86efac" },
    { id: "mid",     name: "Hot Streak",      price: "$14.95", entries: 25,  prompts: 100, emoji: "🔥", color: "#fcc846", best: true },
    { id: "elite",   name: "Jackpot Bundle",  price: "$29.95", entries: 75,  prompts: 300, emoji: "🎰", color: "#a78bfa" },
  ];
  const subs = [
    { id: "pre", name: "Premium",  price: "$9.95",  entries: 5,  features: "5 entries every week, every draw", color: "#fcc846", popular: true },
    { id: "eli", name: "Elite",    price: "$19.95", entries: 10, features: "10 entries every week, every draw", color: "#a78bfa" },
  ];
  const earn = [
    { id: "refi",   icon: "🏦", title: "Refinance a loan",       sub: "Home, car, personal",          reward: 50, hot: true },
    { id: "switch", icon: "🔁", title: "Compare & switch",       sub: "Energy, internet, phone",      reward: 25, hot: true },
    { id: "bnpl",   icon: "📆", title: "Split a bill into 4",    sub: "Pay in 4 with William BNPL",   reward: 5 },
    { id: "refer",  icon: "🤝", title: "Invite friends",         sub: "When they sign up",            reward: 4 },
    { id: "goal",   icon: "🎯", title: "Hit a savings goal",     sub: "Per goal completed",           reward: 2 },
    { id: "bill",   icon: "💳", title: "Pay a bill in-app",      sub: "Any provider",                 reward: 2 },
    { id: "bank",   icon: "🔗", title: "Connect a bank account", sub: "One-off when you link",        reward: 2 },
    { id: "split",  icon: "✂️", title: "Split a bill with a friend", sub: "Per split",               reward: 1 },
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: theme.appBg }}>
      <GHeader title="Giveaway" theme={theme} onBack={onBack}
        right={<button style={{ background: "transparent", border: "none", color: theme.gold, fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>Share</button>}/>
      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none" }}>
        {/* prize hero */}
        <div style={{
          background: prize.color, color: "#0b1a2b",
          padding: "20px 18px 28px", textAlign: "center", position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -40, right: -40, fontSize: 200, opacity: 0.15 }}>{prize.icon}</div>
          <div style={{ position: "absolute", bottom: -50, left: -30, fontSize: 160, opacity: 0.12 }}>{prize.icon}</div>
          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 64, marginBottom: 4 }}>{prize.icon}</div>
            <div style={{
              display: "inline-block", fontSize: 11, fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase",
              background: "#0b1a2b", color: "#fcc846", padding: "5px 12px", borderRadius: 99,
              marginBottom: 10, whiteSpace: "nowrap",
            }}>{isUpcoming ? `Opens in ${prize.opensInDays || 7}d` : `This week's draw`} · worth {prize.value}</div>
            <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1.15 }}>
              {prize.title}
            </div>
          </div>
        </div>

        {/* countdown */}
        <div style={{ padding: "18px 16px 0", marginTop: -22 }}>
          <div style={{
            background: theme.aiBubble, borderRadius: 22, padding: 18,
            border: `1px solid ${theme.cardBorder}`, boxShadow: theme.cardShadow,
          }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase",
              color: theme.muted, textAlign: "center", marginBottom: 10 }}>
              {isUpcoming ? "Opens in" : "Drawn live Sunday 8pm AEST"}
            </div>
            <Countdown to={drawAt} theme={theme} big dark/>
          </div>
        </div>

        {/* About this prize */}
        <div style={{ padding: "16px 16px 0" }}>
          <div style={{
            background: theme.aiBubble, borderRadius: 22, padding: 18,
            border: `1px solid ${theme.cardBorder}`,
          }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase",
              color: theme.muted, marginBottom: 8 }}>What you'll win</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: theme.aiBubbleFg, lineHeight: 1.45, marginBottom: 14 }}>
              {blurb}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {perks.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: 99, background: theme.gold + "22",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12l4 4L19 7" stroke={theme.gold} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: theme.aiBubbleFg }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Your entries — gamified */}
        <div style={{ padding: "16px 16px 0" }}>
          <div style={{
            background: `linear-gradient(135deg, ${theme.headerBg} 0%, #1a3194 100%)`, color: "#fff",
            borderRadius: 22, padding: 18, position: "relative", overflow: "hidden",
            boxShadow: theme.cardShadow,
          }}>
            <div style={{ position: "absolute", right: -20, top: -20, fontSize: 120, opacity: 0.12 }}>🎟️</div>
            <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16, background: theme.gold + "22",
                border: `1.5px solid ${theme.gold}`, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 28, flexShrink: 0,
              }}>🎟️</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>
                  {isUpcoming ? "Reserved entries" : "Your entries in this draw"}
                </div>
                <div style={{ fontSize: 38, fontWeight: 800, color: theme.gold, fontVariantNumeric: "tabular-nums", letterSpacing: -1, lineHeight: 1 }}>
                  {yourEntries}
                </div>
              </div>
            </div>
            <div style={{ position: "relative", marginTop: 14, padding: "10px 12px", background: "rgba(252,200,70,0.1)",
              borderRadius: 12, border: `1px dashed ${theme.gold}55`,
              fontSize: 12, fontWeight: 700, color: theme.gold, lineHeight: 1.4 }}>
              💡 More entries = more chances to win. Stack 'em up below.
            </div>
          </div>
        </div>

        {/* Boost — packs inline */}
        <div style={{ padding: "20px 16px 0" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 4 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: theme.aiBubbleFg, letterSpacing: -0.3 }}>
              Boost your entries
            </div>
            <span style={{ fontSize: 11, fontWeight: 800, color: theme.gold, letterSpacing: 0.4, textTransform: "uppercase" }}>
              {isUpcoming ? "Reserve now" : "For this draw"}
            </span>
          </div>
          <div style={{ fontSize: 13, color: theme.muted, fontWeight: 500, marginBottom: 14, lineHeight: 1.4 }}>
            Each pack unlocks <strong style={{ color: theme.aiBubbleFg }}>extra AI prompts</strong> — free giveaway entries come with every purchase.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {packs.map((p) => (
              <button key={p.id} style={{
                position: "relative", display: "flex", alignItems: "center", gap: 14,
                padding: 14, borderRadius: 18, border: p.best ? `2px solid ${theme.gold}` : `1px solid ${theme.cardBorder}`,
                background: theme.aiBubble, color: theme.aiBubbleFg, cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                boxShadow: p.best ? `0 8px 24px ${theme.gold}33` : theme.cardShadow,
              }}>
                {p.best && <span style={{
                  position: "absolute", top: -8, left: 14, fontSize: 9, fontWeight: 800, letterSpacing: 0.6,
                  padding: "3px 8px", borderRadius: 99, background: theme.gold, color: "#15296b", whiteSpace: "nowrap",
                }}>BEST VALUE</span>}
                <div style={{
                  width: 50, height: 50, borderRadius: 14, background: p.color + "33",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0,
                }}>{p.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 800 }}>{p.name}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: theme.aiBubbleFg, marginTop: 3, lineHeight: 1.3 }}>
                    {p.prompts} AI prompts
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: theme.gold, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                    + {p.entries} free entries 🎟️
                  </div>
                </div>
                <div style={{
                  padding: "10px 14px", borderRadius: 12, background: p.best ? theme.gold : theme.headerBg,
                  color: p.best ? "#15296b" : "#fff", fontWeight: 800, fontSize: 13, whiteSpace: "nowrap",
                }}>{p.price}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Subscription */}
        <div style={{ padding: "20px 16px 0" }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: theme.aiBubbleFg, letterSpacing: -0.3, marginBottom: 4 }}>
            Or subscribe for recurring entries
          </div>
          <div style={{ fontSize: 12.5, color: theme.muted, fontWeight: 500, marginBottom: 12, lineHeight: 1.4 }}>
            Auto-entered every week, plus more AI prompts.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {subs.map((s) => (
              <button key={s.id} style={{
                display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 14,
                border: `1px solid ${theme.cardBorder}`, background: theme.aiBubble, color: theme.aiBubbleFg,
                cursor: "pointer", fontFamily: "inherit", textAlign: "left",
              }}>
                <div style={{
                  padding: "5px 9px", borderRadius: 8, background: s.color + "33", color: theme.aiBubbleFg,
                  fontSize: 11, fontWeight: 800, whiteSpace: "nowrap",
                }}>+{s.entries}/wk</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", gap: 6 }}>
                    {s.name}
                    {s.popular && <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 99, background: theme.gold, color: "#15296b" }}>POPULAR</span>}
                  </div>
                  <div style={{ fontSize: 11, color: theme.muted, fontWeight: 500, marginTop: 1 }}>{s.features}</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 800, color: theme.aiBubbleFg, whiteSpace: "nowrap" }}>
                  {s.price}<span style={{ fontSize: 10, fontWeight: 700, color: theme.muted }}>/mo</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Earn FREE entries — inline */}
        <div style={{ padding: "20px 16px 0" }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: theme.aiBubbleFg, letterSpacing: -0.3, marginBottom: 4 }}>
            Or earn entries for free
          </div>
          <div style={{ fontSize: 12.5, color: theme.muted, fontWeight: 500, marginBottom: 12, lineHeight: 1.4 }}>
            Use William like normal — every action stacks more entries.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {earn.map((a) => (
              <div key={a.id} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 14,
                background: theme.aiBubble, border: `1px solid ${theme.cardBorder}`, color: theme.aiBubbleFg,
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10, background: theme.cardChip,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0,
                }}>{a.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", gap: 6 }}>
                    {a.title}
                    {a.hot && <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 99, background: "#ff5e5e", color: "#fff" }}>HOT</span>}
                  </div>
                  <div style={{ fontSize: 11, color: theme.muted, fontWeight: 500, marginTop: 1 }}>{a.sub}</div>
                </div>
                <div style={{
                  padding: "5px 9px", borderRadius: 99, background: theme.gold + "22",
                  color: "#a06a00", fontSize: 11, fontWeight: 800, whiteSpace: "nowrap",
                }}>+{a.reward} 🎟️</div>
              </div>
            ))}
          </div>
        </div>

        {/* terms */}
        <div style={{ padding: "20px 16px 28px" }}>
          <div style={{
            padding: "12px 14px", borderRadius: 14,
            background: theme.cardChip, fontSize: 11, color: theme.muted, lineHeight: 1.5,
          }}>
            Each entry is a chance to win — more entries = better odds. Drawn live on William
            socials Sunday 8pm AEST. AU residents 18+. No purchase necessary; free entries available.
          </div>
        </div>
      </div>
    </div>
  );
}

// ── STORE ─────────────────────────────────────────────────
const TIERS = [
  { id: "std", name: "Standard", price: "$0", priceSub: "/mo", entries: 2,  prompts: 50,  features: ["Basic AI prompts", "All giveaways"], color: "#9aa6cb" },
  { id: "pre", name: "Premium",  price: "$9.95",  priceSub: "/mo", entries: 5, prompts: 250, features: ["More AI prompts", "Priority support", "Exclusive draws"], color: "#fcc846", popular: true },
  { id: "eli", name: "Elite",    price: "$19.95", priceSub: "/mo", entries: 10, prompts: 1000, features: ["Unlimited-feel prompts", "Concierge", "Mega prizes"], color: "#7c3aed" },
];
const PACKS = [
  { id: "starter", name: "Starter Pack", price: "$14.95", entries: 15,  prompts: 100, color: "#86efac", emoji: "🎁" },
  { id: "mid",     name: "Mid Pack",     price: "$29.95", entries: 50,  prompts: 250, color: "#fcc846", emoji: "📦", best: true },
  { id: "elite",   name: "Elite Pack",   price: "$59.95", entries: 120, prompts: 700, color: "#a78bfa", emoji: "💎" },
];
const QUICK = [
  { id: "budget",  name: "Budget Booster", price: "$4.95",  entries: 3,   color: "#7dd3fc" },
  { id: "mid",     name: "Mid Booster",    price: "$24.95", entries: 50,  color: "#fbb6ce" },
  { id: "whale",   name: "Whale Pack",     price: "$99.95", entries: 350, color: "#fcc846" },
];

function StoreScreen({ theme, onBack }) {
  const [tab, setTab] = useStateG("packs");
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: theme.appBg }}>
      <GHeader title="Boosters" theme={theme} onBack={onBack}/>
      {/* tab pills */}
      <div style={{ padding: "12px 16px 0", flexShrink: 0 }}>
        <div style={{
          background: theme.cardChip, borderRadius: 99, padding: 4,
          display: "flex", gap: 4,
        }}>
          {[
            { id: "packs", label: "Packs" },
            { id: "tiers", label: "Subscription" },
            { id: "quick", label: "Quick buy" },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: "8px", borderRadius: 99, border: "none", cursor: "pointer",
              background: tab === t.id ? theme.headerBg : "transparent",
              color: tab === t.id ? "#fff" : theme.muted,
              fontFamily: "inherit", fontSize: 12, fontWeight: 800,
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", padding: "16px" }}>
        {tab === "packs" && (
          <>
            <div style={{ fontSize: 13, color: theme.muted, marginBottom: 14, lineHeight: 1.4 }}>
              Each pack stacks <span style={{ color: theme.gold, fontWeight: 800 }}>entries</span> and tops up your <span style={{ color: theme.aiBubbleFg, fontWeight: 800 }}>AI prompts</span>. One-time, never expire.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {PACKS.map((p) => <PackCard key={p.id} p={p} theme={theme}/>)}
            </div>
          </>
        )}
        {tab === "tiers" && (
          <>
            <div style={{ fontSize: 13, color: theme.muted, marginBottom: 14, lineHeight: 1.4 }}>
              Recurring monthly entries + AI prompt cap. Refreshes each cycle.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {TIERS.map((t) => <TierCard key={t.id} t={t} theme={theme}/>)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PackCard({ p, theme }) {
  return (
    <div style={{
      borderRadius: 22, padding: 18, position: "relative",
      background: theme.aiBubble,
      border: p.best ? `2px solid ${theme.gold}` : `1px solid ${theme.cardBorder}`,
      boxShadow: p.best ? theme.cardShadow : "none",
    }}>
      {p.best && <div style={{
        position: "absolute", top: -10, left: 18,
        fontSize: 10, fontWeight: 800, letterSpacing: 0.6,
        padding: "4px 10px", borderRadius: 99,
        background: theme.gold, color: "#15296b", whiteSpace: "nowrap",
      }}>MOST POPULAR</div>}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16, background: p.color,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28,
        }}>{p.emoji}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: theme.aiBubbleFg }}>{p.name}</div>
          <div style={{ fontSize: 13, color: theme.muted, fontWeight: 600, marginTop: 1 }}>One-time purchase</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: theme.aiBubbleFg, letterSpacing: -0.5, fontVariantNumeric: "tabular-nums" }}>
            {p.price}
          </div>
        </div>
      </div>
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 14,
      }}>
        <div style={{
          padding: "10px 12px", borderRadius: 12,
          background: theme.gold + "22", border: `1px solid ${theme.gold}55`,
        }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: theme.gold, letterSpacing: 0.6, textTransform: "uppercase" }}>
            Entries
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: theme.gold, fontVariantNumeric: "tabular-nums", marginTop: 2 }}>
            +{p.entries}
          </div>
        </div>
        <div style={{
          padding: "10px 12px", borderRadius: 12,
          background: theme.cardChip,
        }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: theme.muted, letterSpacing: 0.6, textTransform: "uppercase" }}>
            AI prompts
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: theme.aiBubbleFg, fontVariantNumeric: "tabular-nums", marginTop: 2 }}>
            +{p.prompts}
          </div>
        </div>
      </div>
      <button style={{
        marginTop: 14, width: "100%", padding: 12, borderRadius: 14,
        border: "none", cursor: "pointer",
        background: p.best ? theme.gold : theme.headerBg,
        color: p.best ? "#15296b" : "#fff",
        fontFamily: "inherit", fontSize: 14, fontWeight: 800,
      }}>Buy {p.name}</button>
    </div>
  );
}

function TierCard({ t, theme }) {
  return (
    <div style={{
      borderRadius: 22, padding: 18, position: "relative",
      background: theme.aiBubble,
      border: t.popular ? `2px solid ${theme.gold}` : `1px solid ${theme.cardBorder}`,
      boxShadow: t.popular ? theme.cardShadow : "none",
    }}>
      {t.popular && <div style={{
        position: "absolute", top: -10, left: 18,
        fontSize: 10, fontWeight: 800, letterSpacing: 0.6,
        padding: "4px 10px", borderRadius: 99,
        background: theme.gold, color: "#15296b", whiteSpace: "nowrap",
      }}>RECOMMENDED</div>}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: theme.aiBubbleFg }}>{t.name}</div>
          <div style={{
            display: "inline-flex", alignItems: "baseline", gap: 4, marginTop: 4,
            color: theme.aiBubbleFg,
          }}>
            <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: -1, fontVariantNumeric: "tabular-nums" }}>{t.price}</span>
            <span style={{ fontSize: 13, color: theme.muted, fontWeight: 600 }}>{t.priceSub}</span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{
            background: t.color, color: "#0b1a2b",
            padding: "6px 12px", borderRadius: 99, fontSize: 12, fontWeight: 800,
            whiteSpace: "nowrap",
          }}>{t.entries} entries/mo</div>
          <div style={{ fontSize: 11, color: theme.muted, marginTop: 4, fontWeight: 600 }}>
            {t.prompts.toLocaleString()} AI prompts/mo
          </div>
        </div>
      </div>
      <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
        {t.features.map((f, i) => (
          <div key={i} style={{ fontSize: 13, color: theme.aiBubbleFg, fontWeight: 600, display: "flex", gap: 8 }}>
            <span style={{ color: theme.success }}>✓</span> {f}
          </div>
        ))}
      </div>
      <button style={{
        marginTop: 14, width: "100%", padding: 12, borderRadius: 14,
        border: "none", cursor: "pointer",
        background: t.popular ? theme.gold : theme.cardChip,
        color: t.popular ? "#15296b" : theme.aiBubbleFg,
        fontFamily: "inherit", fontSize: 14, fontWeight: 800,
      }}>{t.id === "std" ? "Current plan" : `Upgrade to ${t.name}`}</button>
    </div>
  );
}

function QuickCard({ q, theme }) {
  return (
    <div style={{
      borderRadius: 18, padding: 14, display: "flex", alignItems: "center", gap: 14,
      background: theme.aiBubble, border: `1px solid ${theme.cardBorder}`,
    }}>
      <div style={{
        width: 50, height: 50, borderRadius: 14, background: q.color,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: "#0b1a2b", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
          {q.entries}
        </div>
        <div style={{ fontSize: 8, fontWeight: 800, color: "#0b1a2b", letterSpacing: 0.6, marginTop: 2 }}>
          ENTRIES
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: theme.aiBubbleFg }}>{q.name}</div>
        <div style={{ fontSize: 12, color: theme.muted, fontWeight: 600, marginTop: 2 }}>
          ${(parseFloat(q.price.slice(1)) / q.entries).toFixed(2)} per entry
        </div>
      </div>
      <button style={{
        padding: "10px 14px", borderRadius: 99, border: "none", cursor: "pointer",
        background: theme.gold, color: "#15296b",
        fontFamily: "inherit", fontSize: 13, fontWeight: 800, whiteSpace: "nowrap",
      }}>{q.price}</button>
    </div>
  );
}

// ── EARN MORE ─────────────────────────────────────────────
function EarnMoreScreen({ theme, onBack }) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: theme.appBg }}>
      <GHeader title="Earn free entries" theme={theme} onBack={onBack}/>
      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", padding: "16px" }}>
        <div style={{
          background: "linear-gradient(135deg, #fff7d6 0%, #fcc846 60%, #f0a020 100%)",
          color: "#0b1a2b", borderRadius: 22, padding: 16, marginBottom: 16,
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", right: -10, top: -10, fontSize: 90, opacity: 0.18 }}>🎯</div>
          <div style={{ fontSize: 19, fontWeight: 800, lineHeight: 1.2, letterSpacing: -0.3, position: "relative" }}>
            No purchase necessary.
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, marginTop: 6, opacity: 0.85, position: "relative" }}>
            Use William like normal — every action earns entries that never expire.
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {EARN_ACTIONS.map((a) => (
            <div key={a.id} style={{
              padding: 14, borderRadius: 18,
              background: theme.aiBubble, border: `1px solid ${theme.cardBorder}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 14, fontSize: 22,
                  background: theme.cardChip,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>{a.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: theme.aiBubbleFg }}>{a.title}</div>
                    {a.hot && <span style={{
                      fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 99,
                      background: "#ff5e5e", color: "#fff", letterSpacing: 0.4, whiteSpace: "nowrap",
                    }}>HOT</span>}
                  </div>
                  <div style={{ fontSize: 12, color: theme.muted, marginTop: 2 }}>{a.sub}</div>
                </div>
                <div style={{
                  fontSize: 13, fontWeight: 800, color: theme.gold,
                  background: theme.gold + "1a", padding: "5px 11px", borderRadius: 99,
                  whiteSpace: "nowrap", flexShrink: 0,
                }}>+{a.reward}</div>
              </div>
              <button style={{
                marginTop: 10, width: "100%", padding: 10, borderRadius: 12,
                border: "none", cursor: "pointer",
                background: a.hot ? theme.gold : theme.cardChip,
                color: a.hot ? "#15296b" : theme.aiBubbleFg,
                fontFamily: "inherit", fontSize: 13, fontWeight: 800,
              }}>{a.cta} →</button>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: 16, padding: "12px 14px", borderRadius: 14,
          background: theme.cardChip, fontSize: 11, color: theme.muted, lineHeight: 1.5,
        }}>
          Bonus entries from in-app actions never expire and stack indefinitely on top of your subscription and pack entries.
        </div>
      </div>
    </div>
  );
}

// ── BREAKDOWN ─────────────────────────────────────────────
function BreakdownScreen({ theme, onBack }) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: theme.appBg }}>
      <GHeader title="Your entries" theme={theme} onBack={onBack}/>
      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", padding: 16 }}>
        <div style={{
          textAlign: "center", padding: "12px 0 20px",
        }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: theme.muted, letterSpacing: 0.6, textTransform: "uppercase" }}>
            Total balance
          </div>
          <EntryCounter count={167} theme={theme} large/>
        </div>

        {/* donut-style stacked bar */}
        <div style={{
          background: theme.aiBubble, borderRadius: 20, padding: 16,
          border: `1px solid ${theme.cardBorder}`,
        }}>
          <div style={{
            display: "flex", height: 18, borderRadius: 99, overflow: "hidden",
            background: theme.cardChip, marginBottom: 14,
          }}>
            {SOURCES.map((s, i) => (
              <div key={i} style={{ flex: s.entries, background: s.color }}/>
            ))}
          </div>
          {SOURCES.map((s, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 0",
              borderTop: i === 0 ? "none" : `1px solid ${theme.cardBorder}`,
            }}>
              <span style={{ width: 10, height: 10, borderRadius: 99, background: s.color, flexShrink: 0 }}/>
              <span style={{ flex: 1, fontSize: 13.5, fontWeight: 700, color: theme.aiBubbleFg }}>{s.name}</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: theme.aiBubbleFg, fontVariantNumeric: "tabular-nums" }}>
                {s.entries}
              </span>
              <span style={{ fontSize: 11, color: theme.muted, fontWeight: 600, width: 40, textAlign: "right" }}>
                {Math.round(s.entries / totalEntries * 100)}%
              </span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16, fontSize: 11, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase",
          color: theme.muted, marginBottom: 8, paddingLeft: 4 }}>This cycle</div>
        <div style={{
          background: theme.aiBubble, borderRadius: 20, padding: 16,
          border: `1px solid ${theme.cardBorder}`,
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12,
        }}>
          {[
            { l: "Earned this week", v: "+52", c: theme.success },
            { l: "Used this cycle", v: "0", c: theme.muted },
            { l: "Refreshes in", v: "12 days", c: theme.aiBubbleFg },
            { l: "Plan", v: "Premium", c: theme.gold },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: 11, color: theme.muted, fontWeight: 600 }}>{s.l}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: s.c, marginTop: 2 }}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── PAST WINNERS ──────────────────────────────────────────
function HistoryScreen({ theme, onBack }) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: theme.appBg }}>
      <GHeader title="Past winners" theme={theme} onBack={onBack}/>
      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", padding: 16 }}>
        <div style={{
          background: theme.aiBubble, borderRadius: 18, padding: 14, marginBottom: 16,
          border: `1px solid ${theme.cardBorder}`,
          display: "flex", alignItems: "center", gap: 14,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, fontSize: 26,
            background: theme.gold + "22",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>🎟</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: theme.aiBubbleFg }}>You haven't won yet</div>
            <div style={{ fontSize: 12, color: theme.muted, marginTop: 2 }}>
              Stay in for this week — odds 1 in 50.
            </div>
          </div>
        </div>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase",
          color: theme.muted, marginBottom: 8, paddingLeft: 4 }}>All winners</div>
        {PAST_WINS.map((w, i) => <WinRow key={i} w={w} theme={theme}/>)}
        <div style={{
          marginTop: 12, padding: "12px 14px", borderRadius: 14,
          background: theme.cardChip, fontSize: 11, color: theme.muted, lineHeight: 1.5,
        }}>
          Winners drawn live on William socials every Sunday 8pm AEST. Verified independently — names shown with consent.
        </div>
      </div>
    </div>
  );
}

// ── ENTRY POINT ───────────────────────────────────────────
function GiveawayScreen({ theme, mode }) {
  const [route, setRoute] = useStateG({ name: "hub" });
  const go = (name, prize) => setRoute({ name, prize });
  const back = () => setRoute({ name: "hub" });
  if (route.name === "detail")    return <GiveawayDetail prize={route.prize} theme={theme} onBack={back}/>;
  if (route.name === "store")     return <StoreScreen theme={theme} onBack={back}/>;
  if (route.name === "earn")      return <EarnMoreScreen theme={theme} onBack={back}/>;
  if (route.name === "breakdown") return <BreakdownScreen theme={theme} onBack={back}/>;
  if (route.name === "history")   return <HistoryScreen theme={theme} onBack={back}/>;
  return <GiveawayHub theme={theme} mode={mode} go={go}/>;
}

Object.assign(window, { GiveawayScreen });
