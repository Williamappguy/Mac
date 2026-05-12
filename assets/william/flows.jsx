// flows.jsx — Bill detail, Pay flow, Split flow, Request money, Compare & Switch

const { useState: useStateF, useMemo: useMemoF } = React;

// ── shared ────────────────────────────────────────────────
function FlowHeader({ title, theme, onBack, right }) {
  return (
    <div style={{
      padding: "16px 14px 14px", background: theme.headerBg,
      borderBottom: `1px solid ${theme.divider}`,
      display: "flex", alignItems: "center", gap: 8,
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

function PrimaryButton({ children, theme, onClick, kind = "gold", style, disabled }) {
  const palette = kind === "gold"
    ? { bg: theme.gold, fg: "#15296b", shadow: `${theme.gold}66` }
    : kind === "navy"
      ? { bg: theme.navActive, fg: "#fff", shadow: "rgba(15,29,74,0.35)" }
      : { bg: "#ff5e5e", fg: "#fff", shadow: "rgba(255,94,94,0.35)" };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: "100%", padding: "16px 18px", borderRadius: 18, border: "none",
      background: disabled ? theme.cardChip : palette.bg, color: disabled ? theme.muted : palette.fg,
      fontFamily: "inherit", fontSize: 16, fontWeight: 800, cursor: disabled ? "not-allowed" : "pointer",
      boxShadow: disabled ? "none" : `0 8px 24px ${palette.shadow}`, ...style,
    }}>{children}</button>
  );
}

// AGL-style logo (rays)
function AglMark({ size = 56 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: "#fff",
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
    }}>
      <svg width={size * 0.7} height={size * 0.7} viewBox="0 0 60 60">
        {/* rays */}
        {[-50, -30, -15, 0, 15, 30, 50].map((a, i) => (
          <rect key={i} x="29" y="6" width="2.5" height="22" rx="1.2" fill="#00a3e0"
            transform={`rotate(${a} 30 30)`}/>
        ))}
        <text x="30" y="49" textAnchor="middle" fontSize="14" fontWeight="800" fill="#003a7a" fontFamily="Inter, sans-serif">agl</text>
      </svg>
    </div>
  );
}

// ── BILL DETAIL ───────────────────────────────────────────
function BillDetailScreen({ bill, theme, onBack, onSplit, onPay, onSwitch }) {
  const isEnergy = bill.category === "Energy";
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: theme.appBg }}>
      <FlowHeader title="Bill Details" theme={theme} onBack={onBack}
        right={<button style={{
          background: "transparent", border: "none", color: theme.gold,
          fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
        }}>Edit</button>}/>

      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none" }}>
        {/* Hero */}
        <div style={{
          background: theme.headerBg, color: theme.headerFg,
          padding: "8px 18px 26px", textAlign: "center",
          borderBottom: `1px solid ${theme.divider}`, position: "relative",
        }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
            {bill.category === "Energy"
              ? <AglMark size={68}/>
              : <div style={{
                  width: 68, height: 68, borderRadius: 18, background: bill.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 30, fontWeight: 800, color: "#fff",
                }}>{bill.logo}</div>}
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 2 }}>{bill.name}</div>
          <div style={{ fontSize: 13, color: theme.headerSub, fontWeight: 500 }}>{bill.category} · Due {bill.due}</div>
        </div>

        {/* Amount card overlap */}
        <div style={{ padding: "0 16px", marginTop: -22 }}>
          <div style={{
            background: theme.cardBg, color: theme.cardFg, borderRadius: 22,
            padding: 18, boxShadow: theme.cardShadow,
            border: `1px solid ${theme.cardBorder}`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: theme.muted, textTransform: "uppercase", letterSpacing: 0.6 }}>
                  You owe
                </div>
                <div style={{ fontSize: 36, fontWeight: 800, fontVariantNumeric: "tabular-nums", letterSpacing: -1, marginTop: 2 }}>
                  ${bill.amount.toFixed(2)}
                </div>
              </div>
              <div style={{
                background: theme.gold + "22", color: theme.gold, borderRadius: 99,
                padding: "5px 10px", fontSize: 11, fontWeight: 800, letterSpacing: 0.4,
                whiteSpace: "nowrap",
              }}>
                {bill.urgent ? "DUE IN 3 DAYS" : "ON TRACK"}
              </div>
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 14, paddingTop: 14, borderTop: `1px solid ${theme.cardBorder}` }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: theme.muted, fontWeight: 600 }}>Bill amount</div>
                <div style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>${(bill.amount / 1.1).toFixed(2)}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: theme.muted, fontWeight: 600 }}>GST</div>
                <div style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>${(bill.amount - bill.amount / 1.1).toFixed(2)}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: theme.muted, fontWeight: 600 }}>Account</div>
                <div style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>···{bill.acct || "3354"}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action grid */}
        <div style={{ padding: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <button onClick={onPay} style={actionTile(theme, true)}>
            <span style={{ fontSize: 22 }}>⚡</span>
            <span>Pay now</span>
            <span style={{ fontSize: 11, opacity: 0.7, fontWeight: 600 }}>card or balance</span>
          </button>
          <button onClick={onPay} style={{ ...actionTile(theme), border: `1.5px solid ${theme.gold}`, position: "relative" }}>
            <span style={{
              position: "absolute", top: -8, right: 10, fontSize: 9, fontWeight: 800, letterSpacing: 0.6,
              padding: "3px 8px", borderRadius: 99, background: theme.gold, color: "#15296b",
            }}>BNPL</span>
            <span style={{ fontSize: 22 }}>📆</span>
            <span>Split into 4</span>
            <span style={{ fontSize: 11, opacity: 0.7, fontWeight: 600 }}>4 × ${(bill.amount / 4 * 1.05).toFixed(2)} · 5% fee</span>
          </button>
          <button onClick={onSplit} style={actionTile(theme)}>
            <span style={{ fontSize: 22 }}>✂️</span>
            <span>Split with friends</span>
            <span style={{ fontSize: 11, opacity: 0.65, fontWeight: 600 }}>send a request</span>
          </button>
          <button style={actionTile(theme)}>
            <span style={{ fontSize: 22 }}>🔁</span>
            <span>Autopay</span>
            <span style={{ fontSize: 11, opacity: 0.65, fontWeight: 600 }}>set & forget</span>
          </button>
          <button style={{ ...actionTile(theme), gridColumn: "1 / -1", height: 64, flexDirection: "row", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 20 }}>✅</span>
            <span style={{ flex: 1 }}>Mark as already paid</span>
            <span style={{ fontSize: 18, opacity: 0.4 }}>›</span>
          </button>
        </div>

        {/* Compare & Switch promo (energy only) */}
        {isEnergy && (
          <div style={{ padding: "0 16px 16px" }}>
            <div onClick={onSwitch} style={{
              cursor: "pointer",
              borderRadius: 22, padding: 18, color: "#0b1a2b",
              background: "linear-gradient(135deg, #fff7d6 0%, #fcc846 60%, #f0a020 100%)",
              boxShadow: `0 12px 32px ${theme.gold}55`,
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", right: -30, bottom: -40, width: 180, height: 180, opacity: 0.18 }}>
                <svg viewBox="0 0 100 100"><path d="M40 10 L20 60 L45 60 L30 95 L80 35 L55 35 Z" fill="#0b1a2b"/></svg>
              </div>
              <div style={{ display: "inline-block", padding: "4px 10px", borderRadius: 99,
                background: "#0b1a2b", color: "#fcc846", fontSize: 10, fontWeight: 800, letterSpacing: 0.7,
                textTransform: "uppercase", marginBottom: 10,
              }}>⚡ William saves you money</div>
              <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.15, letterSpacing: -0.4 }}>
                You could save up to <span style={{ background: "#0b1a2b", color: "#fcc846", padding: "0 6px", borderRadius: 6 }}>$412/yr</span><br/>on your power bill.
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, marginTop: 8, opacity: 0.9, lineHeight: 1.4 }}>
                Plus get a <strong>$200 Visa gift card</strong> when you compare & switch through William.
              </div>
              <div style={{
                marginTop: 14, padding: "10px 14px", borderRadius: 99,
                background: "#0b1a2b", color: "#fcc846",
                fontSize: 14, fontWeight: 800,
                display: "inline-flex", alignItems: "center", gap: 8,
              }}>
                Compare in 60 seconds
                <span style={{ fontSize: 18 }}>→</span>
              </div>
            </div>
          </div>
        )}

        {/* Provider details collapsible */}
        <div style={{ padding: "0 16px 24px" }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase",
            color: theme.muted, marginBottom: 8, paddingLeft: 4 }}>Provider</div>
          <div style={{
            background: theme.aiBubble, borderRadius: 18, padding: 14,
            border: `1px solid ${theme.cardBorder}`,
            display: "flex", flexDirection: "column", gap: 10,
          }}>
            {[
              { label: "Web", value: "agl.com.au" },
              { label: "Phone", value: "1300 307 245" },
              { label: "Total spent (this year)", value: "$2,156.40" },
              { label: "Bills paid", value: "4 · avg $539.10" },
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5 }}>
                <span style={{ color: theme.muted, fontWeight: 600 }}>{r.label}</span>
                <span style={{ color: theme.aiBubbleFg, fontWeight: 700 }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const actionTile = (theme, primary) => ({
  display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4,
  padding: 14, borderRadius: 18,
  background: primary ? theme.headerBg : theme.aiBubble,
  color: primary ? "#fff" : theme.aiBubbleFg,
  border: primary ? "none" : `1px solid ${theme.cardBorder}`,
  fontFamily: "inherit", fontSize: 15, fontWeight: 700, cursor: "pointer",
  textAlign: "left", height: 100,
  boxShadow: primary ? "0 12px 28px rgba(15,29,74,0.25)" : "none",
});

// ── PAY FLOW ──────────────────────────────────────────────
function PayFlowScreen({ bill, theme, onBack }) {
  const [method, setMethod] = useStateF("full");
  const [card, setCard] = useStateF(0);
  const cards = [
    { brand: "Visa", last4: "3354", color: "linear-gradient(135deg,#1e3a8a,#3b6cf0)", balance: 2789.42 },
    { brand: "Mastercard", last4: "8821", color: "linear-gradient(135deg,#0b1a2b,#3a4d6d)", balance: 8500.00 },
  ];
  const installments = [bill.amount / 4, bill.amount / 4, bill.amount / 4, bill.amount / 4];
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: theme.appBg }}>
      <FlowHeader title="Pay" theme={theme} onBack={onBack}/>
      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", padding: "18px 16px 12px" }}>
        {/* total */}
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", color: theme.muted }}>
            Paying {bill.name}
          </div>
          <div style={{ fontSize: 44, fontWeight: 800, color: theme.aiBubbleFg, fontVariantNumeric: "tabular-nums", letterSpacing: -1.5, marginTop: 4 }}>
            ${bill.amount.toFixed(2)}
          </div>
        </div>

        {/* card selector */}
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", color: theme.muted, marginBottom: 8, paddingLeft: 4 }}>
          Pay from
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 18, overflowX: "auto", scrollbarWidth: "none" }}>
          {cards.map((c, i) => (
            <button key={i} onClick={() => setCard(i)} style={{
              flexShrink: 0, width: 220, height: 130, borderRadius: 18, border: "none",
              background: c.color, color: "#fff", fontFamily: "inherit", cursor: "pointer",
              padding: 16, textAlign: "left", position: "relative",
              boxShadow: card === i ? `0 0 0 3px ${theme.gold}, 0 12px 28px rgba(0,0,0,0.3)` : "0 6px 18px rgba(0,0,0,0.2)",
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.8 }}>{c.brand} · ··· {c.last4}</div>
              <div style={{ position: "absolute", bottom: 16, left: 16, fontSize: 16, fontWeight: 800, letterSpacing: 2 }}>•••• {c.last4}</div>
              <div style={{ position: "absolute", top: 16, right: 16, fontSize: 11, fontWeight: 600, opacity: 0.8 }}>${c.balance.toLocaleString()}</div>
            </button>
          ))}
          <button style={{
            flexShrink: 0, width: 100, height: 130, borderRadius: 18, border: `2px dashed ${theme.cardBorder}`,
            background: "transparent", color: theme.muted, fontFamily: "inherit", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, fontWeight: 700, fontSize: 12,
          }}>
            <span style={{ fontSize: 20 }}>+</span>Add card
          </button>
        </div>

        {/* method selector */}
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", color: theme.muted, marginBottom: 8, paddingLeft: 4 }}>
          How do you wanna pay?
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <PayOption theme={theme} active={method === "full"} onClick={() => setMethod("full")}
            icon="⚡" title="Pay in full now"
            sub={`$${bill.amount.toFixed(2)} · clear it & forget it`}
            tag="No fee"/>
          <PayOption theme={theme} active={method === "bnpl"} onClick={() => setMethod("bnpl")}
            icon="📅" title="Split into 4 payments"
            sub={`4 × $${(bill.amount / 4).toFixed(2)} · every 2 weeks`}
            tag="0% interest" highlight>
            {method === "bnpl" && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${theme.cardBorder}` }}>
                {installments.map((amt, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "8px 0",
                    borderTop: i === 0 ? "none" : `1px dashed ${theme.cardBorder}`,
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 99,
                      background: i === 0 ? theme.gold : theme.cardChip,
                      color: i === 0 ? "#15296b" : theme.muted,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 800,
                    }}>{i + 1}</div>
                    <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: theme.aiBubbleFg }}>
                      {i === 0 ? "Today" : `${i * 2} weeks from now`}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 800, fontVariantNumeric: "tabular-nums", color: theme.aiBubbleFg }}>
                      ${amt.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </PayOption>
          <PayOption theme={theme} active={method === "schedule"} onClick={() => setMethod("schedule")}
            icon="🗓️" title="Schedule for later"
            sub="Pick a date — auto-pay on the day"/>
        </div>
      </div>
      <div style={{ padding: 16, background: theme.composerBg, borderTop: `1px solid ${theme.divider}` }}>
        <PrimaryButton theme={theme} onClick={onBack}>
          {method === "full"     && `Pay $${bill.amount.toFixed(2)} now`}
          {method === "bnpl"     && `Pay $${(bill.amount / 4).toFixed(2)} today, 3 more later`}
          {method === "schedule" && `Schedule $${bill.amount.toFixed(2)}`}
        </PrimaryButton>
      </div>
    </div>
  );
}

function PayOption({ theme, icon, title, sub, tag, active, onClick, highlight, children }) {
  return (
    <div onClick={onClick} style={{
      padding: 14, borderRadius: 18, cursor: "pointer",
      background: active ? theme.headerBg : theme.aiBubble,
      color: active ? "#fff" : theme.aiBubbleFg,
      border: active ? `2px solid ${theme.gold}` : `1px solid ${theme.cardBorder}`,
      transition: "all .15s",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 12, fontSize: 20,
          background: active ? "rgba(255,255,255,0.12)" : theme.cardChip,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>{icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
            {title}
            {tag && <span style={{
              fontSize: 10, fontWeight: 800, padding: "3px 7px", borderRadius: 99,
              background: highlight ? theme.gold : (active ? "rgba(255,255,255,0.18)" : theme.cardChip),
              color: highlight ? "#15296b" : (active ? "#fff" : theme.muted),
              letterSpacing: 0.4, textTransform: "uppercase", whiteSpace: "nowrap",
            }}>{tag}</span>}
          </div>
          <div style={{ fontSize: 12.5, opacity: active ? 0.8 : 0.65, marginTop: 2 }}>{sub}</div>
        </div>
        <div style={{
          width: 22, height: 22, borderRadius: "50%",
          border: active ? "none" : `2px solid ${theme.cardBorder}`,
          background: active ? theme.gold : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {active && <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6l3 3 5-6" stroke="#15296b" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        </div>
      </div>
      {children}
    </div>
  );
}

// ── SPLIT BILL ────────────────────────────────────────────
const CONTACTS = [
  { name: "Rebecca Pechey",  handle: "@misspechey91",       color: "#fbbf24" },
  { name: "Izaac Oneill",    handle: "@izaac.oneill",        color: "#a78bfa" },
  { name: "Sam Almaliki",    handle: "@SamAlmaliki",         color: "#7dd3fc" },
  { name: "Quan Le",         handle: "@kwan2",               color: "#86efac" },
  { name: "Thông Lê",        handle: "@thongle123",          color: "#fbb6ce" },
  { name: "Hoangphuong Nguyen", handle: "@hoangphuongnguyen", color: "#fda4af" },
  { name: "Daniel Baragan",  handle: "@rsodracky",           color: "#fcd34d" },
  { name: "Lee Ogley",       handle: "@leeo",                color: "#a5b4fc" },
];

function SplitBillScreen({ bill, theme, onBack }) {
  const [picked, setPicked] = useStateF([0, 4]); // start with Rebecca + Thông for vibes
  const [mode, setMode] = useStateF("equal"); // equal | percent | custom
  const [search, setSearch] = useStateF("");

  const youCount = 1;
  const totalParts = picked.length + youCount;
  const perHead = bill.amount / totalParts;

  const filtered = CONTACTS.map((c, i) => ({ ...c, i }))
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  const toggle = (i) => {
    setPicked((p) => p.includes(i) ? p.filter((x) => x !== i) : [...p, i]);
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: theme.appBg }}>
      <FlowHeader title="Split Bill" theme={theme} onBack={onBack}/>
      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none" }}>
        {/* preview */}
        <div style={{
          background: theme.headerBg, color: "#fff",
          padding: "16px 18px 22px",
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.7 }}>{bill.name} · ${bill.amount.toFixed(2)} total</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 6 }}>
            <span style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1, fontVariantNumeric: "tabular-nums" }}>
              ${perHead.toFixed(2)}
            </span>
            <span style={{ fontSize: 14, opacity: 0.7 }}>each · {totalParts} people</span>
          </div>
          {/* mode toggle */}
          <div style={{
            marginTop: 14, padding: 4, borderRadius: 99,
            background: "rgba(255,255,255,0.08)", display: "flex", gap: 4,
          }}>
            {[
              { v: "equal", l: "Equal" },
              { v: "percent", l: "%" },
              { v: "custom", l: "Custom" },
            ].map((o) => (
              <button key={o.v} onClick={() => setMode(o.v)} style={{
                flex: 1, padding: "8px 10px", borderRadius: 99, border: "none", cursor: "pointer",
                background: mode === o.v ? theme.gold : "transparent",
                color: mode === o.v ? "#15296b" : "#fff",
                fontFamily: "inherit", fontSize: 13, fontWeight: 700,
              }}>{o.l}</button>
            ))}
          </div>
        </div>

        {/* picked chips */}
        <div style={{ padding: "16px 16px 4px" }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", color: theme.muted, marginBottom: 8, paddingLeft: 4 }}>
            Splitting with ({picked.length})
          </div>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none" }}>
            <Avatar name="You" color={theme.gold} sub={`$${perHead.toFixed(2)}`} you/>
            {picked.map((i) => {
              const c = CONTACTS[i];
              return <Avatar key={i} name={c.name} color={c.color} sub={`$${perHead.toFixed(2)}`} onRemove={() => toggle(i)}/>;
            })}
          </div>
        </div>

        {/* search */}
        <div style={{ padding: "8px 16px 12px" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: theme.aiBubble, borderRadius: 99, padding: "10px 14px",
            border: `1px solid ${theme.cardBorder}`,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke={theme.muted} strokeWidth="2"/>
              <path d="M20 20l-3.5-3.5" stroke={theme.muted} strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or phone"
              style={{
                flex: 1, border: "none", outline: "none", background: "transparent",
                color: theme.aiBubbleFg, fontSize: 14, fontFamily: "inherit",
              }}/>
          </div>
        </div>

        {/* contact list */}
        <div style={{ padding: "0 16px 100px" }}>
          {filtered.map((c) => {
            const sel = picked.includes(c.i);
            return (
              <div key={c.i} onClick={() => toggle(c.i)} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 8px",
                cursor: "pointer", borderRadius: 14,
                background: sel ? theme.gold + "11" : "transparent",
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%", background: c.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 800, color: "#33163d", position: "relative",
                }}>
                  {c.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                  <div style={{
                    position: "absolute", bottom: -2, right: -2,
                    width: 18, height: 18, borderRadius: 4,
                    background: theme.headerBg, color: theme.gold,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 800,
                  }}>W</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: theme.aiBubbleFg }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: theme.muted, marginTop: 1 }}>{c.handle}</div>
                </div>
                <div style={{
                  width: 24, height: 24, borderRadius: 6,
                  border: sel ? "none" : `2px solid ${theme.cardBorder}`,
                  background: sel ? theme.gold : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {sel && <svg width="14" height="14" viewBox="0 0 12 12"><path d="M2 6l3 3 5-6" stroke="#15296b" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ padding: 16, background: theme.composerBg, borderTop: `1px solid ${theme.divider}` }}>
        <PrimaryButton theme={theme} onClick={onBack} disabled={picked.length === 0}>
          {picked.length === 0
            ? "Pick at least one friend"
            : `Send request · $${perHead.toFixed(2)} × ${picked.length}`}
        </PrimaryButton>
      </div>
    </div>
  );
}

function Avatar({ name, color, sub, onRemove, you }) {
  return (
    <div style={{ flexShrink: 0, textAlign: "center", width: 64 }}>
      <div style={{
        width: 56, height: 56, borderRadius: "50%", background: color,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 16, fontWeight: 800, color: "#33163d", margin: "0 auto",
        position: "relative",
      }}>
        {you ? "OL" : name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
        {onRemove && <button onClick={(e) => { e.stopPropagation(); onRemove(); }} style={{
          position: "absolute", top: -3, right: -3, width: 20, height: 20, borderRadius: "50%",
          border: "none", background: "#0f1d4a", color: "#fff", cursor: "pointer",
          fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center",
        }}>×</button>}
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, marginTop: 6, color: "#fff", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
        {you ? "You" : name.split(" ")[0]}
      </div>
      <div style={{ fontSize: 11, fontVariantNumeric: "tabular-nums", color: "rgba(255,255,255,0.7)" }}>{sub}</div>
    </div>
  );
}

// ── COMPARE & SWITCH ──────────────────────────────────────
function CompareSwitchScreen({ bill, theme, onBack }) {
  const offers = [
    { name: "OVO Energy", price: 305.50, save: 411.77, badge: "BEST DEAL", tags: ["100% green", "$0 exit fee", "12-mo lock"], color: "#22c79c" },
    { name: "Kogan Energy", price: 332.10, save: 385.17, badge: "POPULAR", tags: ["No lock-in", "Variable rate"], color: "#f5c542" },
    { name: "Energy Locals", price: 358.40, save: 358.87, badge: null, tags: ["Community-owned", "Flat rate"], color: "#a78bfa" },
  ];
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: theme.appBg }}>
      <FlowHeader title="Compare & Switch" theme={theme} onBack={onBack}/>
      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none" }}>
        {/* hero */}
        <div style={{
          background: "linear-gradient(160deg, #0b1a2b 0%, #15296b 100%)",
          color: "#fff", padding: "20px 18px 28px", textAlign: "center",
        }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase", color: theme.gold, marginBottom: 6 }}>
            ⚡ William powered switch
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.4, lineHeight: 1.2 }}>
            Switch from <span style={{ color: theme.gold }}>AGL</span> & save up to <span style={{ color: theme.gold }}>$412/yr</span>
          </div>
          <div style={{
            marginTop: 16, padding: "12px 16px", borderRadius: 18,
            background: "rgba(252,200,70,0.15)", border: `1px solid ${theme.gold}`,
            display: "flex", alignItems: "center", gap: 12, textAlign: "left",
          }}>
            <div style={{ fontSize: 30 }}>🎁</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: theme.gold }}>+ $200 Visa gift card</div>
              <div style={{ fontSize: 12, opacity: 0.85 }}>Cashback when you switch through William.</div>
            </div>
          </div>
        </div>

        {/* current bill */}
        <div style={{ padding: "16px 16px 0" }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", color: theme.muted, marginBottom: 8, paddingLeft: 4 }}>
            Your current plan
          </div>
          <div style={{
            background: theme.aiBubble, borderRadius: 18, padding: 14,
            border: `1px solid ${theme.cardBorder}`,
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <AglMark size={44}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: theme.aiBubbleFg }}>AGL Standard Variable</div>
              <div style={{ fontSize: 12, color: theme.muted, marginTop: 1 }}>Avg quarterly bill · $717.27</div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#ff5e5e" }}>HIGH</div>
          </div>
        </div>

        {/* offers */}
        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", color: theme.muted, marginBottom: 8, paddingLeft: 4 }}>
            Cheaper plans for you (3)
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {offers.map((o, i) => (
              <div key={i} style={{
                background: theme.aiBubble, borderRadius: 20, padding: 16,
                border: i === 0 ? `2px solid ${theme.gold}` : `1px solid ${theme.cardBorder}`,
                position: "relative", boxShadow: i === 0 ? theme.cardShadow : "none",
              }}>
                {o.badge && <div style={{
                  position: "absolute", top: -10, left: 16,
                  fontSize: 10, fontWeight: 800, letterSpacing: 0.6,
                  padding: "4px 10px", borderRadius: 99,
                  background: o.color, color: "#15296b", whiteSpace: "nowrap",
                }}>{o.badge}</div>}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: theme.aiBubbleFg }}>{o.name}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: theme.success, whiteSpace: "nowrap" }}>save ${o.save.toFixed(0)}/yr</div>
                </div>
                <div style={{ marginTop: 8, display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span style={{ fontSize: 28, fontWeight: 800, color: theme.aiBubbleFg, fontVariantNumeric: "tabular-nums", letterSpacing: -0.5 }}>
                    ${o.price.toFixed(2)}
                  </span>
                  <span style={{ fontSize: 12, color: theme.muted }}>est / quarter</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                  {o.tags.map((t, ti) => (
                    <span key={ti} style={{
                      fontSize: 11, fontWeight: 600, padding: "4px 9px", borderRadius: 99,
                      background: theme.cardChip, color: theme.muted,
                    }}>{t}</span>
                  ))}
                </div>
                <button style={{
                  marginTop: 12, width: "100%", padding: "12px",
                  borderRadius: 14, border: "none", cursor: "pointer",
                  background: i === 0 ? theme.gold : theme.cardChip,
                  color: i === 0 ? "#15296b" : theme.aiBubbleFg,
                  fontFamily: "inherit", fontSize: 14, fontWeight: 800,
                }}>Switch & claim $200 →</button>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: 16, padding: "12px 14px", borderRadius: 14,
            background: theme.cardChip, fontSize: 11.5, color: theme.muted, lineHeight: 1.5,
          }}>
            * Estimates based on your last 4 AGL bills (avg $717.27/quarter).
            Switch handled by William's energy partner — takes ~5 min, no service interruption.
          </div>
        </div>
      </div>
    </div>
  );
}

// ── REQUEST MONEY ─────────────────────────────────────────
function RequestMoneyScreen({ theme, onBack, preselect }) {
  const [picked, setPicked] = useStateF(preselect != null ? [preselect] : []);
  const [amount, setAmount] = useStateF("0");
  const [note, setNote] = useStateF("");
  const [step, setStep] = useStateF(preselect != null ? "amount" : "pick");
  const [search, setSearch] = useStateF("");

  const tap = (k) => {
    if (k === "back") return setAmount((a) => a.length <= 1 ? "0" : a.slice(0, -1));
    if (k === ".") { if (!amount.includes(".")) setAmount((a) => a + "."); return; }
    setAmount((a) => a === "0" ? k : a + k);
  };
  const amt = parseFloat(amount) || 0;

  const filtered = CONTACTS.map((c, i) => ({ ...c, i }))
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  const toggle = (i) => {
    setPicked((p) => p.includes(i) ? p.filter((x) => x !== i) : [...p, i]);
  };

  if (step === "pick") {
    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", background: theme.appBg }}>
        <FlowHeader title="Your Contacts" theme={theme} onBack={onBack}/>
        <div style={{ padding: "12px 16px" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: theme.aiBubble, borderRadius: 99, padding: "10px 14px",
            border: `1px solid ${theme.cardBorder}`,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke={theme.muted} strokeWidth="2"/>
              <path d="M20 20l-3.5-3.5" stroke={theme.muted} strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or phone"
              style={{
                flex: 1, border: "none", outline: "none", background: "transparent",
                color: theme.aiBubbleFg, fontSize: 14, fontFamily: "inherit",
              }}/>
          </div>
          <button style={{
            marginTop: 12, width: "100%", padding: "14px",
            background: theme.headerBg, color: "#fff", border: "none",
            borderRadius: 14, fontFamily: "inherit", fontSize: 14, fontWeight: 800, cursor: "pointer",
          }}>+ Add a new contact to William</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", padding: "0 16px 100px" }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", color: theme.muted, margin: "12px 0 8px", paddingLeft: 4 }}>
            Contacts on William
          </div>
          {filtered.map((c) => {
            const sel = picked.includes(c.i);
            return (
              <div key={c.i} onClick={() => toggle(c.i)} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 8px",
                cursor: "pointer", borderRadius: 14,
                background: sel ? theme.gold + "1a" : "transparent",
              }}>
                <div style={{
                  width: 46, height: 46, borderRadius: "50%", background: c.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 800, color: "#33163d", position: "relative",
                }}>
                  {c.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                  <div style={{
                    position: "absolute", bottom: -2, right: -2,
                    width: 18, height: 18, borderRadius: 4,
                    background: theme.headerBg, color: theme.gold,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 800,
                  }}>W</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: theme.aiBubbleFg }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: theme.muted, marginTop: 1 }}>{c.handle}</div>
                </div>
                <div style={{
                  width: 24, height: 24, borderRadius: 6,
                  border: sel ? "none" : `2px solid ${theme.cardBorder}`,
                  background: sel ? theme.gold : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {sel && <svg width="14" height="14" viewBox="0 0 12 12"><path d="M2 6l3 3 5-6" stroke="#15296b" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ padding: 16, background: theme.composerBg, borderTop: `1px solid ${theme.divider}` }}>
          <PrimaryButton theme={theme} disabled={picked.length === 0} onClick={() => setStep("amount")}>
            {picked.length === 0 ? "Pick someone to request" : `Next · ${picked.length} selected`}
          </PrimaryButton>
        </div>
      </div>
    );
  }

  // amount step
  const keys = [["1","2","3"],["4","5","6"],["7","8","9"],[".","0","back"]];
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: theme.appBg }}>
      <FlowHeader title="Request" theme={theme}
        onBack={() => preselect != null ? onBack() : setStep("pick")}/>

      {/* recipient strip */}
      <div style={{ padding: "16px 16px 0", display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none" }}>
        {picked.map((i) => {
          const c = CONTACTS[i];
          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "6px 12px 6px 6px",
              borderRadius: 99, background: theme.aiBubble, border: `1px solid ${theme.cardBorder}`,
              flexShrink: 0,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%", background: c.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 800, color: "#33163d",
              }}>{c.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}</div>
              <span style={{ fontSize: 13, fontWeight: 700, color: theme.aiBubbleFg }}>{c.name.split(" ")[0]}</span>
            </div>
          );
        })}
      </div>

      {/* amount */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", color: theme.muted, marginBottom: 8 }}>
          Request from {picked.length === 1 ? CONTACTS[picked[0]].name.split(" ")[0] : `${picked.length} people`}
        </div>
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <span style={{ fontSize: 36, fontWeight: 700, color: theme.muted, marginRight: 4 }}>$</span>
          <span style={{
            fontSize: 80, fontWeight: 800, color: theme.aiBubbleFg,
            fontVariantNumeric: "tabular-nums", letterSpacing: -3, lineHeight: 1,
          }}>{amount}</span>
        </div>
        {picked.length > 1 && amt > 0 && (
          <div style={{ marginTop: 8, fontSize: 13, color: theme.muted }}>
            ${(amt / picked.length).toFixed(2)} per person
          </div>
        )}
        {/* note input */}
        <input value={note} onChange={(e) => setNote(e.target.value)}
          placeholder={"What's it for? (canapés 🍸)"}
          style={{
            marginTop: 24, width: "80%", border: "none", outline: "none",
            textAlign: "center", background: theme.cardChip, padding: "12px 16px",
            borderRadius: 99, color: theme.aiBubbleFg, fontSize: 14, fontFamily: "inherit",
          }}/>
      </div>

      {/* keypad */}
      <div style={{ padding: "0 16px 12px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {keys.flat().map((k, i) => (
            <button key={i} onClick={() => tap(k)} style={{
              padding: "16px 0", borderRadius: 16, border: "none", cursor: "pointer",
              background: theme.aiBubble, color: theme.aiBubbleFg,
              fontFamily: "inherit", fontSize: 22, fontWeight: 700,
              border_: `1px solid ${theme.cardBorder}`,
              boxShadow: theme.bubbleShadow,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {k === "back" ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M9 5L2 12l7 7h13V5H9z" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinejoin="round"/><path d="M13 9l4 6m0-6l-4 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg> : k}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: 16, background: theme.composerBg, borderTop: `1px solid ${theme.divider}` }}>
        <PrimaryButton theme={theme} disabled={amt === 0} onClick={onBack}>
          {amt === 0 ? "Enter an amount" : `Send request · $${amt.toFixed(2)}`}
        </PrimaryButton>
      </div>
    </div>
  );
}

Object.assign(window, { BillDetailScreen, PayFlowScreen, SplitBillScreen, CompareSwitchScreen, RequestMoneyScreen });
