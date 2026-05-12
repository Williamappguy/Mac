// chat.jsx — Chat home (the William AI core experience)

const { useState: useStateC, useEffect: useEffectC, useRef: useRefC, useMemo: useMemoC } = React;

function ChatHeader({ theme }) {
  return (
    <div style={{
      padding: "10px 18px",
      background: theme.headerBg,
      borderBottom: `1px solid ${theme.divider}`,
    }}>
      <div style={{ display: "none" }}/>
    </div>
  );
}

// Giveaway promo card on chat home
function GiveawayPromo({ theme, onTap }) {
  const [now, setNow] = useStateC(Date.now());
  useEffectC(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const drawAt = useMemoC(() => Date.now() + 2 * 86400000 + 5 * 3600000 + 12 * 60000, []);
  const ms = Math.max(0, drawAt - now);
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms / 3600000) % 24);
  const m = Math.floor((ms / 60000) % 60);
  const s = Math.floor((ms / 1000) % 60);
  return (
    <button onClick={onTap} style={{
      display: "flex", alignItems: "center", gap: 12, width: "100%", textAlign: "left", marginBottom: 12,
      borderRadius: 14, padding: "10px 12px", position: "relative", overflow: "hidden",
      background: "linear-gradient(135deg,#1a3194 0%, #15296b 60%, #0a1238 100%)",
      color: "#fff", border: `1px solid ${theme.gold}55`, cursor: "pointer", fontFamily: "inherit",
      boxShadow: `0 6px 18px rgba(15,29,74,0.18)`,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10, fontSize: 22, flexShrink: 0,
        background: theme.gold + "22", color: theme.gold,
        display: "flex", alignItems: "center", justifyContent: "center",
        border: `1px solid ${theme.gold}55`, position: "relative",
      }}>🏆</div>
      <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{
            fontSize: 8.5, fontWeight: 800, letterSpacing: 0.5, padding: "2px 6px", borderRadius: 99,
            background: theme.gold, color: "#15296b", whiteSpace: "nowrap",
          }}>WEEKLY</span>
          <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: -0.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            Win 1mo rent <span style={{ color: theme.gold }}>($2,800)</span>
          </span>
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 600, marginTop: 2, fontVariantNumeric: "tabular-nums" }}>
          Draws in {d}d {String(h).padStart(2,"0")}h {String(m).padStart(2,"0")}m · 167 entries
        </div>
      </div>
      <span style={{ position: "relative", color: theme.gold, fontSize: 18, opacity: 0.7 }}>›</span>
    </button>
  );
}

// Hero "intent rows" shown when convo is empty
function IntentDeck({ theme, mode, onPick, onNavigate }) {
  const D = window.WILLIAM_DATA;
  return (
    <div style={{ padding: "8px 16px 16px" }}>
      <div style={{
        fontSize: 28, fontWeight: 800, color: theme.heroFg, letterSpacing: -0.6, lineHeight: 1.15,
        marginBottom: 6,
      }}>
        Hi <span style={{ color: theme.gold }}>Ollie</span>.
      </div>
      <div style={{ fontSize: 16, color: theme.heroSub, fontWeight: 500, marginBottom: 18, lineHeight: 1.35 }}>
        {mode === "sassy"
          ? "I've got tea ☕️ about your week. Pick your poison:"
          : "Here's a quick look at what's worth your attention this week."}
      </div>
      <GiveawayPromo theme={theme} onTap={() => onNavigate && onNavigate("win")}/>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {D.intentRows.map((r) => (
          <button key={r.id} onClick={() => onPick(r.id)} style={{
            display: "flex", alignItems: "center", gap: 14, padding: "14px 14px",
            borderRadius: 18, background: theme.aiBubble, color: theme.aiBubbleFg,
            border: `1px solid ${theme.cardBorder}`, cursor: "pointer",
            fontFamily: "inherit", textAlign: "left", width: "100%",
            boxShadow: theme.bubbleShadow,
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12, fontSize: 22,
              background: r.hue + "22", color: r.hue,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: `1px solid ${r.hue}44`,
            }}>{r.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{r.title}</div>
              <div style={{ fontSize: 12.5, opacity: 0.6, marginTop: 1 }}>{r.sub}</div>
            </div>
            <span style={{ opacity: 0.4, fontSize: 18 }}>›</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Composer with text input + mic
function Composer({ theme, onSend, mode }) {
  const [val, setVal] = useStateC("");
  const [recording, setRecording] = useStateC(false);
  const D = window.WILLIAM_DATA;
  const send = () => {
    if (!val.trim()) return;
    onSend(val.trim());
    setVal("");
  };
  return (
    <div style={{
      padding: "10px 12px 14px",
      background: theme.composerBg,
      borderTop: `1px solid ${theme.divider}`,
    }}>
      {/* suggestion chips */}
      <div style={{
        display: "flex", gap: 8, overflowX: "auto", paddingBottom: 10,
        scrollbarWidth: "none",
      }}>
        {D.suggestionChips.map((c, i) => (
          <button key={i} onClick={() => onSend(c)} style={{
            flexShrink: 0, padding: "8px 14px", borderRadius: 99,
            background: theme.chipBg, color: theme.chipFg,
            border: `1px solid ${theme.cardBorder}`,
            fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer",
            whiteSpace: "nowrap",
          }}>{c}</button>
        ))}
      </div>
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        background: theme.inputBg, borderRadius: 26,
        padding: "6px 6px 6px 18px",
        border: `1px solid ${theme.cardBorder}`,
      }}>
        <input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={mode === "sassy" ? "spill the tea..." : "Ask William anything..."}
          style={{
            flex: 1, border: "none", outline: "none", background: "transparent",
            color: theme.inputFg, fontSize: 16, fontFamily: "inherit",
            padding: "10px 0",
          }}
        />
        {val.trim() ? (
          <button onClick={send} style={{
            width: 40, height: 40, borderRadius: 99, border: "none", cursor: "pointer",
            background: theme.gold, color: "#15296b",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 4px 14px ${theme.gold}66`,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M4 12l16-8-6 16-3-7-7-1z" fill="currentColor"/>
            </svg>
          </button>
        ) : (
          <button onClick={() => setRecording((r) => !r)} style={{
            width: 40, height: 40, borderRadius: 99, border: "none", cursor: "pointer",
            background: recording ? "#ff5e5e" : theme.gold, color: "#15296b",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: recording ? "0 0 0 6px rgba(255,94,94,0.25)" : `0 4px 14px ${theme.gold}66`,
            transition: "all .2s",
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="9" y="3" width="6" height="13" rx="3" fill="currentColor"/>
              <path d="M5 11a7 7 0 0014 0M12 18v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
            </svg>
          </button>
        )}
      </div>
      {recording && (
        <div style={{
          marginTop: 8, fontSize: 12, color: theme.muted, textAlign: "center", fontWeight: 600,
        }}>
          Listening... say "what did I spend on coffee" 🎙️
        </div>
      )}
    </div>
  );
}

function ChatScreen({ theme, mode, onModeToggle, onNavigate }) {
  const D = window.WILLIAM_DATA;
  const [messages, setMessages] = useStateC([]);
  const [started, setStarted] = useStateC(false);
  const scrollRef = useRefC(null);

  useEffectC(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, started]);

  const pushAi = (items, baseDelay = 350) => {
    items.forEach((m, i) => {
      setTimeout(() => setMessages((prev) => {
        // strip leading typing indicator if next is text
        if (m.t === "typing") return [...prev, m];
        const noTyping = prev.filter((x, idx) => !(x.t === "typing" && idx === prev.length - 1 && i > 0));
        return [...noTyping, m];
      }), baseDelay + i * 700);
    });
  };

  const sendUser = (text) => {
    setStarted(true);
    setMessages((prev) => [...prev, { t: "text", from: "user", body: text }]);
    // route based on text
    const t = text.toLowerCase();
    if (/roast|spend|week|where.*money|my money|expense/.test(t)) {
      pushAi(D.roast(mode));
    } else if (/bill|due|pay|autopay/.test(t)) {
      pushAi(D.billNudge(mode));
    } else if (/goal|sf|san fran|save|saving/.test(t)) {
      pushAi(D.goalChat(mode));
    } else if (/thông|nudge|owe|request|split/.test(t)) {
      pushAi(D.sendMoney(mode));
    } else if (/brunch|afford/.test(t)) {
      pushAi([
        { t: "typing", from: "ai" },
        { t: "text", from: "ai", body: mode === "sassy"
            ? "Brunch?? After Saturday?? Bold of you. 🥂"
            : "Yes — brunch up to $48 keeps you on track this week." },
        { t: "text", from: "ai", body: mode === "sassy"
            ? "But yeah you've got **$48** of weekend wiggle. Don't order the bottomless mimosas. Looking at you."
            : "You currently have $48 of discretionary budget remaining for the weekend." },
      ]);
    } else {
      pushAi([
        { t: "typing", from: "ai" },
        { t: "text", from: "ai", body: mode === "sassy"
            ? "Mmm. I'll think about that and roast you in approximately 6 seconds. 💭"
            : "Let me check your accounts and get back to you." },
      ]);
    }
  };

  const onAction = (a) => {
    const lookup = {
      "set-budget": "Set me a weekend cap of $120",
      "save-50": "Move $50 to my savings",
      "split": "Split the canapés bill with the group",
      "pay-now": "Pay the Suncorp bill now",
      "split-4": "Split the Suncorp bill into 4 fortnightly payments",
      "split-friends": "Split the Suncorp bill with friends",
      "snooze": "Remind me about that bill tomorrow",
      "autopay": "Turn on autopay for Suncorp",
      "next-goal": "Move surplus to my Wedding goal",
      "checking": "Send the surplus back to checking",
      "nudge": "Send Thông a nudge",
      "snark": "Send Thông a (rude) nudge",
    };
    const text = lookup[a.id] || a.label;
    sendUser(text);
  };

  const pickIntent = (id) => {
    const map = { roast: "🔥 Roast my week", bills: "📅 What bills are due?", save: "🏦 Help me save", nudge: "📨 Get my money from Thông" };
    sendUser(map[id]);
  };

  return (
    <div style={{
      height: "100%", display: "flex", flexDirection: "column",
      background: theme.appBg,
    }}>
      <ChatHeader theme={theme}/>
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none" }}>
        {!started && <IntentDeck theme={theme} mode={mode} onPick={pickIntent} onNavigate={onNavigate}/>}
        {started && (
          <div style={{ padding: "16px 16px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
            {/* opener */}
            {(mode === "sassy" ? D.sassyOpener : D.proOpener).map((m, i) => (
              <MessageRenderer key={"op" + i} msg={m} theme={theme}/>
            ))}
            {messages.map((m, i) => (
              <MessageRenderer key={i} msg={m} theme={theme} onAction={onAction}/>
            ))}
          </div>
        )}
      </div>
      <Composer theme={theme} onSend={sendUser} mode={mode}/>
    </div>
  );
}

window.ChatScreen = ChatScreen;
