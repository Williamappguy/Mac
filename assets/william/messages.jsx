// messages.jsx — Chat bubble + rich message components for William AI

const { useState, useEffect, useRef } = React;

// Renders inline **bold** in a string
function Rich({ children }) {
  if (typeof children !== "string") return children;
  const parts = children.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**")
      ? <strong key={i} style={{ fontWeight: 700 }}>{p.slice(2, -2)}</strong>
      : <span key={i}>{p}</span>
  );
}

// ── plain bubbles ─────────────────────────────────────────
function Bubble({ from, children, theme, time }) {
  const isUser = from === "user";
  const bg = isUser ? theme.userBubble : theme.aiBubble;
  const fg = isUser ? theme.userBubbleFg : theme.aiBubbleFg;
  return (
    <div style={{
      display: "flex", justifyContent: isUser ? "flex-end" : "flex-start",
      width: "100%",
    }}>
      <div style={{
        maxWidth: "82%",
        background: bg,
        color: fg,
        padding: "12px 14px",
        borderRadius: 20,
        borderBottomRightRadius: isUser ? 6 : 20,
        borderBottomLeftRadius: isUser ? 20 : 6,
        fontSize: 15.5, lineHeight: 1.4, fontWeight: 450,
        boxShadow: isUser ? "none" : theme.bubbleShadow,
        whiteSpace: "pre-wrap",
      }}>
        {children}
        {time && <div style={{
          fontSize: 11, opacity: 0.5, marginTop: 4, fontWeight: 500,
        }}>{time}</div>}
      </div>
    </div>
  );
}

function TextMessage({ msg, theme }) {
  return (
    <Bubble from={msg.from} theme={theme}>
      <Rich>{msg.body}</Rich>
    </Bubble>
  );
}

// ── typing dots ───────────────────────────────────────────
function TypingDots({ theme }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-start" }}>
      <div style={{
        background: theme.aiBubble, padding: "14px 16px", borderRadius: 20,
        borderBottomLeftRadius: 6, display: "flex", gap: 4,
        boxShadow: theme.bubbleShadow,
      }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            width: 7, height: 7, borderRadius: 7,
            background: theme.aiBubbleFg, opacity: 0.6,
            animation: `wmDot 1.2s ${i * 0.18}s infinite ease-in-out`,
          }}/>
        ))}
      </div>
      <style>{`
        @keyframes wmDot { 0%,80%,100%{transform:translateY(0);opacity:.35} 40%{transform:translateY(-4px);opacity:.95} }
      `}</style>
    </div>
  );
}

// ── recap card (the roast / weekly summary) ───────────────
function RecapCard({ msg, theme }) {
  return (
    <div style={{ width: "100%" }}>
      <div style={{
        background: theme.cardBg, color: theme.cardFg, borderRadius: 22,
        padding: 16, boxShadow: theme.cardShadow,
        border: `1px solid ${theme.cardBorder}`,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
          <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase", color: theme.gold }}>
            {msg.title}
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.5 }}>WEEK</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {msg.lines.map((l, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "8px 0",
              borderTop: i === 0 ? "none" : `1px solid ${theme.cardBorder}`,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 12, fontSize: 18,
                background: theme.cardChip,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>{l.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14.5, fontWeight: 600 }}>{l.label}</div>
                <div style={{ fontSize: 12, opacity: 0.65, marginTop: 2 }}>{l.verdict}</div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                ${l.amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: 14, paddingTop: 12, borderTop: `1px dashed ${theme.cardBorder}`,
          display: "flex", justifyContent: "space-between", alignItems: "baseline",
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.6, textTransform: "uppercase", letterSpacing: 0.6 }}>
            Total damage
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, fontVariantNumeric: "tabular-nums", color: theme.gold }}>
            ${msg.total.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── meme card (drawn, no images) ──────────────────────────
function MemeCard({ msg, theme }) {
  return (
    <div style={{
      width: "100%", background: "#0b0d12", borderRadius: 22, overflow: "hidden",
      boxShadow: theme.cardShadow, position: "relative",
    }}>
      <div style={{ padding: "14px 16px 4px", color: "#fff", fontSize: 14, fontWeight: 600, opacity: 0.85 }}>
        {msg.caption}
      </div>
      <div style={{ height: 220, position: "relative", background: "radial-gradient(ellipse at 30% 30%, #2b3252 0%, #0b0d12 70%)" }}>
        {/* Side-eye SVG character */}
        <svg viewBox="0 0 320 220" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <defs>
            <radialGradient id="face" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#ffd9a8"/>
              <stop offset="100%" stopColor="#e0a06c"/>
            </radialGradient>
          </defs>
          <ellipse cx="160" cy="135" rx="78" ry="90" fill="url(#face)"/>
          {/* hair */}
          <path d="M88 110 C 90 50, 230 50, 232 105 C 230 80, 200 70, 160 72 C 120 70, 90 80, 88 110 Z" fill="#1c1817"/>
          {/* eyes — looking right */}
          <ellipse cx="138" cy="125" rx="16" ry="11" fill="#fff"/>
          <ellipse cx="186" cy="125" rx="16" ry="11" fill="#fff"/>
          <circle cx="148" cy="126" r="6" fill="#1c1817"/>
          <circle cx="196" cy="126" r="6" fill="#1c1817"/>
          <circle cx="150" cy="124" r="2" fill="#fff"/>
          <circle cx="198" cy="124" r="2" fill="#fff"/>
          {/* eyebrows, raised */}
          <path d="M122 108 Q 138 100 156 110" stroke="#1c1817" strokeWidth="4" fill="none" strokeLinecap="round"/>
          <path d="M170 108 Q 186 100 204 110" stroke="#1c1817" strokeWidth="4" fill="none" strokeLinecap="round"/>
          {/* tight mouth */}
          <path d="M140 168 Q 162 162 184 170" stroke="#5a3a2a" strokeWidth="3" fill="none" strokeLinecap="round"/>
          {/* sweat drop */}
          <path d="M232 110 q -6 12 0 18 a 6 6 0 0 0 12 0 q 6 -6 -6 -18 z" fill="#7ec8ff"/>
        </svg>
      </div>
      <div style={{ padding: "10px 16px 14px", color: "#fff", fontSize: 12, fontWeight: 600, opacity: 0.5, letterSpacing: 0.5, textTransform: "uppercase" }}>
        — sent with love by William 💛
      </div>
    </div>
  );
}

// ── action button row ─────────────────────────────────────
function ActionsCard({ msg, theme, onAction }) {
  return (
    <div style={{ width: "100%" }}>
      {msg.title && <div style={{
        fontSize: 12, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase",
        color: theme.muted, marginBottom: 8, marginLeft: 4,
      }}>{msg.title}</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {msg.actions.map((a) => (
          <button key={a.id} onClick={() => onAction && onAction(a)}
            style={{
              display: "flex", alignItems: "center", gap: 12, width: "100%",
              padding: "12px 14px", borderRadius: 16,
              background: theme.actionBg, color: theme.actionFg,
              border: `1px solid ${theme.actionBorder}`,
              fontSize: 15, fontWeight: 600, cursor: "pointer",
              fontFamily: "inherit", textAlign: "left",
              transition: "transform .12s, background .12s",
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.98)"}
            onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            <span style={{ fontSize: 20 }}>{a.icon}</span>
            <span style={{ flex: 1 }}>{a.label}</span>
            <span style={{ opacity: 0.4, fontSize: 18 }}>→</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── bill card ─────────────────────────────────────────────
function BillCard({ msg, theme }) {
  const b = msg.bill;
  return (
    <div style={{
      width: "100%", background: theme.cardBg, color: theme.cardFg,
      borderRadius: 22, padding: 16,
      border: `1px solid ${theme.cardBorder}`, boxShadow: theme.cardShadow,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", right: -30, top: -30, width: 120, height: 120,
        borderRadius: "50%", background: b.color, opacity: 0.18,
      }}/>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, background: b.color,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#1a1a1a", fontWeight: 800, fontSize: 22,
        }}>{b.logo}</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{b.name}</div>
          <div style={{ fontSize: 12, opacity: 0.65 }}>Due {b.due}</div>
        </div>
      </div>
      <div style={{ fontSize: 36, fontWeight: 800, fontVariantNumeric: "tabular-nums", letterSpacing: -1 }}>
        ${b.amount.toFixed(2)}
      </div>
      <div style={{ marginTop: 8, fontSize: 12, opacity: 0.6 }}>
        Available balance after pay: <strong>$2,176.92</strong>
      </div>
    </div>
  );
}

// ── goal card ─────────────────────────────────────────────
function GoalCard({ msg, theme }) {
  const g = msg.goal;
  const pct = Math.min(120, (g.current / g.target) * 100);
  return (
    <div style={{
      width: "100%", background: theme.cardBg, color: theme.cardFg,
      borderRadius: 22, padding: 16, border: `1px solid ${theme.cardBorder}`,
      boxShadow: theme.cardShadow,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, fontSize: 22,
          background: theme.cardChip,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>{g.emoji}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{g.name}</div>
          <div style={{ fontSize: 12, opacity: 0.65 }}>Goal completed 🎉</div>
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: theme.success }}>
          +{Math.round(pct - 100)}%
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 22, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
          ${g.current.toLocaleString()}
        </span>
        <span style={{ fontSize: 13, opacity: 0.65, alignSelf: "end" }}>
          of ${g.target.toLocaleString()}
        </span>
      </div>
      <div style={{ height: 10, borderRadius: 10, background: theme.cardChip, overflow: "hidden", position: "relative" }}>
        <div style={{
          height: "100%", width: `${Math.min(100, pct)}%`,
          background: `linear-gradient(90deg, ${theme.gold}, ${theme.success})`,
          borderRadius: 10,
        }}/>
      </div>
    </div>
  );
}

// ── person card (send / request money) ────────────────────
function PersonCard({ msg, theme }) {
  const p = msg.person;
  const isReq = msg.kind === "request";
  return (
    <div style={{
      width: "100%", background: theme.cardBg, color: theme.cardFg,
      borderRadius: 22, padding: 16, border: `1px solid ${theme.cardBorder}`,
      boxShadow: theme.cardShadow,
      display: "flex", alignItems: "center", gap: 14,
    }}>
      <div style={{
        width: 50, height: 50, borderRadius: "50%", background: p.avatarColor,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20, fontWeight: 800, color: "#33163d",
      }}>{p.name.split(" ").map(s => s[0]).join("").slice(0,2)}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 700 }}>{p.name}</div>
        <div style={{ fontSize: 12, opacity: 0.65 }}>{p.handle}</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
          textTransform: "uppercase", color: isReq ? theme.success : theme.gold }}>
          {isReq ? "Owes you" : "You owe"}
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
          ${p.amount.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

// ── render switch ─────────────────────────────────────────
function MessageRenderer({ msg, theme, onAction }) {
  switch (msg.t) {
    case "text":      return <TextMessage msg={msg} theme={theme}/>;
    case "typing":    return <TypingDots theme={theme}/>;
    case "recap":     return <RecapCard msg={msg} theme={theme}/>;
    case "meme":      return <MemeCard msg={msg} theme={theme}/>;
    case "actions":   return <ActionsCard msg={msg} theme={theme} onAction={onAction}/>;
    case "billCard":  return <BillCard msg={msg} theme={theme}/>;
    case "goalCard":  return <GoalCard msg={msg} theme={theme}/>;
    case "personCard":return <PersonCard msg={msg} theme={theme}/>;
    default: return null;
  }
}

Object.assign(window, { MessageRenderer, Bubble, TypingDots, Rich });
