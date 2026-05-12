// screens.jsx — Connected screens (Bills / Transactions / Requests / Profile)
// Modernized to match the new chat-first William vibe.

const { useState: useStateS } = React;

// shared list-row helper
function StatRow({ icon, label, value, sub, theme, accent }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
      background: theme.aiBubble, borderRadius: 18, border: `1px solid ${theme.cardBorder}`,
    }}>
      <div style={{
        width: 42, height: 42, borderRadius: 12, fontSize: 20,
        background: (accent || theme.gold) + "22", color: accent || theme.gold,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14.5, fontWeight: 700, color: theme.aiBubbleFg }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: theme.muted, marginTop: 1 }}>{sub}</div>}
      </div>
      <div style={{ fontSize: 16, fontWeight: 800, color: theme.aiBubbleFg, fontVariantNumeric: "tabular-nums" }}>
        {value}
      </div>
    </div>
  );
}

function ScreenHeader({ title, theme, subtitle, action }) {
  return (
    <div style={{
      padding: "20px 18px 14px", background: theme.headerBg,
      borderBottom: `1px solid ${theme.divider}`,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 800, color: theme.headerFg, letterSpacing: -0.5 }}>{title}</div>
          {subtitle && <div style={{ fontSize: 13, color: theme.headerSub, marginTop: 2 }}>{subtitle}</div>}
        </div>
        {action}
      </div>
    </div>
  );
}

function BillsScreen({ theme }) {
  const bills = [
    { name: "AGL Energy", due: "May 14", amount: 789.00, color: "#00a3e0", logo: "⚡", urgent: true, category: "Energy", acct: "8842" },
    { name: "Suncorp Credit Card", due: "Mon, May 11", amount: 612.40, color: "#FFB81C", logo: "S", urgent: true, category: "Credit", acct: "3354" },
    { name: "Spotify Family", due: "May 14", amount: 17.99, color: "#1DB954", logo: "♫", category: "Subscription" },
    { name: "iCloud+", due: "May 28", amount: 4.99, color: "#888", logo: "", category: "Subscription" },
  ];
  const [route, setRoute] = useStateS({ name: "list" });
  if (route.name === "detail")  return <BillDetailScreen   bill={route.bill} theme={theme} onBack={() => setRoute({ name: "list" })} onPay={() => setRoute({ name: "pay", bill: route.bill })} onSplit={() => setRoute({ name: "split", bill: route.bill })} onSwitch={() => setRoute({ name: "switch", bill: route.bill })}/>;
  if (route.name === "pay")     return <PayFlowScreen      bill={route.bill} theme={theme} onBack={() => setRoute({ name: "detail", bill: route.bill })}/>;
  if (route.name === "split")   return <SplitBillScreen    bill={route.bill} theme={theme} onBack={() => setRoute({ name: "detail", bill: route.bill })}/>;
  if (route.name === "switch")  return <CompareSwitchScreen bill={route.bill} theme={theme} onBack={() => setRoute({ name: "detail", bill: route.bill })}/>;
  const total = bills.reduce((s, b) => s + b.amount, 0);
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: theme.appBg }}>
      <ScreenHeader title="Bills" subtitle={`${bills.length} due in 30 days`} theme={theme}
        action={<button style={{
          padding: "8px 14px", borderRadius: 99, border: "none",
          background: theme.gold, color: "#15296b", fontFamily: "inherit",
          fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
          flexShrink: 0,
        }}>+ Add</button>}/>
      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", padding: "16px" }}>
        <div style={{
          background: `linear-gradient(135deg, ${theme.headerBg} 0%, ${theme.aiBubble} 100%)`,
          borderRadius: 22, padding: 18, marginBottom: 18,
          border: `1px solid ${theme.cardBorder}`, position: "relative", overflow: "hidden",
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: theme.muted }}>
            Due in 30 days
          </div>
          <div style={{ fontSize: 38, fontWeight: 800, color: theme.headerFg, letterSpacing: -1, fontVariantNumeric: "tabular-nums" }}>
            ${total.toFixed(2)}
          </div>
          <div style={{ marginTop: 6, fontSize: 13, color: theme.muted, fontWeight: 500 }}>
            William says: <span style={{ color: theme.headerFg, fontWeight: 700 }}>you're covered</span> — checking has $2,789
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {bills.map((b, i) => (
            <div key={i} onClick={() => setRoute({ name: "detail", bill: b })} style={{
              cursor: "pointer",
              display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
              background: theme.aiBubble, borderRadius: 18, border: `1px solid ${b.urgent ? theme.gold : theme.cardBorder}`,
              position: "relative",
            }}>
              {b.urgent && <div style={{
                position: "absolute", top: -7, left: 14, fontSize: 10, fontWeight: 800,
                background: theme.gold, color: "#15296b", padding: "2px 8px", borderRadius: 99,
                letterSpacing: 0.5, whiteSpace: "nowrap",
              }}>DUE SOON</div>}
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: b.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 800, fontSize: 20,
              }}>{b.logo}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: theme.aiBubbleFg }}>{b.name}</div>
                <div style={{ fontSize: 12, color: theme.muted, marginTop: 1 }}>Due {b.due}</div>
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, color: theme.aiBubbleFg, fontVariantNumeric: "tabular-nums" }}>
                ${b.amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TransactionsScreen({ theme }) {
  const txs = [
    { name: "Cocktails & Canapés", merchant: "South Stradb", category: "Dining", amount: -142.40, emoji: "🍸", date: "Today" },
    { name: "Statement Barber", merchant: "Burleigh Heads", category: "Personal Care", amount: -50.80, emoji: "💈", date: "Today" },
    { name: "Grumpy Monkey Coff", merchant: "Norman Park", category: "Cafés", amount: -6.56, emoji: "☕️", date: "Yesterday" },
    { name: "Salary — Acme Co", merchant: "Direct deposit", category: "Income", amount: 4250.00, emoji: "💼", date: "May 5" },
    { name: "Uber", merchant: "Trip · 0.6km", category: "Transport", amount: -38.10, emoji: "🚕", date: "May 4" },
    { name: "Coles", merchant: "Burleigh", category: "Groceries", amount: -68.42, emoji: "🛒", date: "May 3" },
  ];
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: theme.appBg }}>
      <ScreenHeader title="Transactions" theme={theme} subtitle="Tap any row to ask William about it"/>
      <div style={{ padding: "12px 16px 0" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: theme.aiBubble, borderRadius: 99, padding: "10px 14px",
          border: `1px solid ${theme.cardBorder}`,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke={theme.muted} strokeWidth="2"/>
            <path d="M20 20l-3.5-3.5" stroke={theme.muted} strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span style={{ flex: 1, color: theme.muted, fontSize: 14 }}>Search or ask William...</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: theme.gold }}>✨ AI</span>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", padding: "14px 16px" }}>
        {["Today", "Yesterday", "Earlier"].map((group, gi) => {
          const list = txs.filter((t) => group === "Earlier" ? !["Today", "Yesterday"].includes(t.date) : t.date === group);
          if (!list.length) return null;
          return (
            <div key={group} style={{ marginBottom: 18 }}>
              <div style={{
                fontSize: 11, fontWeight: 800, letterSpacing: 0.7, textTransform: "uppercase",
                color: theme.muted, marginBottom: 8, paddingLeft: 4,
              }}>{group}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {list.map((t, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                    background: theme.aiBubble, borderRadius: 16, border: `1px solid ${theme.cardBorder}`,
                  }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 12, fontSize: 18,
                      background: theme.cardChip,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>{t.emoji}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: theme.aiBubbleFg, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: theme.muted, marginTop: 1 }}>{t.category} · {t.merchant}</div>
                    </div>
                    <div style={{
                      fontSize: 15, fontWeight: 800, fontVariantNumeric: "tabular-nums",
                      color: t.amount > 0 ? "#22c79c" : theme.aiBubbleFg,
                    }}>
                      {t.amount > 0 ? "+" : ""}${Math.abs(t.amount).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RequestsScreen({ theme }) {
  const [route, setRoute] = useStateS({ name: "list" });
  if (route.name === "request") return <RequestMoneyScreen theme={theme} preselect={route.preselect} onBack={() => setRoute({ name: "list" })}/>;
  const people = [
    { name: "Izaac Oneill", handle: "@izaac.oneill", amount: 50.00, color: "#a78bfa", note: "1 activity" },
    { name: "Thông Lê", handle: "@thongle123", amount: 146.46, color: "#fbb6ce", note: "3 activities" },
    { name: "Sam Almaliki", handle: "@SamAlmaliki", amount: 50.00, color: "#7dd3fc", note: "1 activity" },
    { name: "Rebecca Pechey", handle: "@rjpechey91", amount: 615.00, color: "#fbbf24", note: "2 activities" },
  ];
  const total = people.reduce((s, p) => s + p.amount, 0);
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: theme.appBg }}>
      <ScreenHeader title="Requests" theme={theme} subtitle="Get your money back"/>
      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", padding: 16 }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18,
        }}>
          <div style={{
            background: theme.aiBubble, borderRadius: 18, padding: 14,
            border: `1px solid ${theme.cardBorder}`,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: theme.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>You owe</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: theme.aiBubbleFg, marginTop: 4 }}>$0.00</div>
          </div>
          <div style={{
            background: `linear-gradient(135deg, ${theme.gold}33, ${theme.gold}11)`,
            borderRadius: 18, padding: 14, border: `1px solid ${theme.gold}66`,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: theme.gold, textTransform: "uppercase", letterSpacing: 0.5 }}>Owed to you</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: theme.aiBubbleFg, marginTop: 4 }}>${total.toFixed(2)}</div>
          </div>
        </div>
        <button onClick={() => setRoute({ name: "request" })} style={{
          padding: 14, marginBottom: 16, borderRadius: 18, border: "none", cursor: "pointer",
          background: theme.headerBg, color: theme.headerFg, width: "100%", fontFamily: "inherit",
          display: "flex", alignItems: "center", gap: 12, textAlign: "left",
        }}>
          <div style={{ fontSize: 24 }}>✨</div>
          <div style={{ flex: 1, fontSize: 13, fontWeight: 600, lineHeight: 1.35 }}>
            New request — pick contacts, set amount. <span style={{ color: theme.gold, fontWeight: 800 }}>Start →</span>
          </div>
        </button>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {people.map((p, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
              background: theme.aiBubble, borderRadius: 18, border: `1px solid ${theme.cardBorder}`,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%", background: p.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, fontWeight: 800, color: "#33163d",
              }}>{p.name.split(" ").map((s) => s[0]).join("")}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: theme.aiBubbleFg }}>{p.name}</div>
                <div style={{ fontSize: 12, color: theme.muted, marginTop: 1 }}>{p.handle} · {p.note}</div>
              </div>
              <button style={{
                padding: "8px 14px", borderRadius: 99, border: "none",
                background: theme.gold, color: "#15296b",
                fontFamily: "inherit", fontSize: 14, fontWeight: 800, cursor: "pointer",
                fontVariantNumeric: "tabular-nums",
              }}>${p.amount.toFixed(2)}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileScreen({ theme }) {
  const goals = [
    { name: "San Francisco", emoji: "🌉", current: 5624.27, target: 5400, status: "complete" },
    { name: "Wedding", emoji: "💍", current: 0, target: 10000, status: "starting" },
    { name: "iPhone 17 Pro Max", emoji: "📱", current: 0, target: 3000, status: "starting" },
  ];
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: theme.appBg }}>
      <ScreenHeader title="Profile" theme={theme}/>
      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", padding: 16 }}>
        <div style={{
          background: theme.headerBg, borderRadius: 22, padding: 18, marginBottom: 18,
          display: "flex", alignItems: "center", gap: 14,
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: `linear-gradient(135deg, ${theme.gold}, #f08a2c)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, fontWeight: 800, color: "#15296b",
          }}>OL</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: theme.headerFg }}>Ollie Brennan</div>
            <div style={{ fontSize: 13, color: theme.headerSub, marginTop: 2 }}>@ollie · William since 2024</div>
            <div style={{ marginTop: 6, fontSize: 11, fontWeight: 800, color: theme.gold, letterSpacing: 0.4, textTransform: "uppercase" }}>
              ⚡ Pro · sass level: maxed
            </div>
          </div>
        </div>

        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", color: theme.muted, marginBottom: 8, paddingLeft: 4 }}>
          Your goals
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
          {goals.map((g, i) => {
            const pct = Math.min(100, (g.current / g.target) * 100);
            return (
              <div key={i} style={{
                background: theme.aiBubble, borderRadius: 18, padding: 14,
                border: `1px solid ${theme.cardBorder}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <div style={{ fontSize: 24 }}>{g.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 700, color: theme.aiBubbleFg }}>{g.name}</div>
                    <div style={{ fontSize: 12, color: theme.muted, marginTop: 1 }}>
                      ${g.current.toLocaleString()} of ${g.target.toLocaleString()}
                    </div>
                  </div>
                  {g.status === "complete" && <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 99, background: "#22c79c33", color: "#22c79c" }}>DONE</span>}
                </div>
                <div style={{ height: 8, background: theme.cardChip, borderRadius: 8, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: `${pct}%`,
                    background: g.status === "complete" ? "#22c79c" : theme.gold,
                    borderRadius: 8,
                  }}/>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", color: theme.muted, marginBottom: 8, paddingLeft: 4 }}>
          Settings
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { icon: "🔥", label: "AI personality", sub: "Sassy" },
            { icon: "🌗", label: "Theme", sub: "William Blue" },
            { icon: "🔔", label: "Notifications", sub: "Bills, goals, roasts" },
            { icon: "🏦", label: "Linked accounts", sub: "Suncorp · 2 cards" },
            { icon: "🛡", label: "Privacy & security", sub: "" },
          ].map((r, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
              background: theme.aiBubble, borderRadius: 14, border: `1px solid ${theme.cardBorder}`,
            }}>
              <div style={{ fontSize: 18 }}>{r.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: theme.aiBubbleFg }}>{r.label}</div>
                {r.sub && <div style={{ fontSize: 12, color: theme.muted, marginTop: 1 }}>{r.sub}</div>}
              </div>
              <span style={{ color: theme.muted, fontSize: 18 }}>›</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { BillsScreen, TransactionsScreen, RequestsScreen, ProfileScreen });
