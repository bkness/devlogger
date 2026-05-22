<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>DevLogger — Navbar Designs</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:     #050d14;
    --cyan:   #00e5ff;
    --green:  #00ff88;
    --orange: #ff6b35;
    --border: rgba(0,229,255,0.15);
    --muted:  rgba(0,229,255,0.3);
    --dim:    rgba(0,229,255,0.06);
  }

  body {
    background: var(--bg);
    font-family: 'JetBrains Mono', monospace;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    gap: 0;
    background-image:
      linear-gradient(rgba(0,229,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,229,255,0.025) 1px, transparent 1px);
    background-size: 28px 28px;
  }

  .label {
    font-size: 9px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--muted);
    padding: 28px 32px 14px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  /* ═══════════════════════════════════
     NAVBAR A — Full Command Bar
     HUD-style, full width, dense info
  ═══════════════════════════════════ */
  .nav-a {
    width: 100%;
    height: 52px;
    background: rgba(5,13,20,0.97);
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    padding: 0 24px;
    gap: 0;
    position: relative;
    animation: fadeIn 0.4s ease both;
  }

  /* left accent stripe */
  .nav-a::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
    background: linear-gradient(to bottom, var(--cyan), transparent);
  }

  .na-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    padding-right: 24px;
    border-right: 1px solid var(--border);
    margin-right: 24px;
    flex-shrink: 0;
  }

  .na-hex {
    width: 26px;
    height: 26px;
    position: relative;
    flex-shrink: 0;
  }
  .na-hex svg { width: 26px; height: 26px; }

  .na-title {
    font-size: 13px;
    font-weight: 700;
    color: var(--cyan);
    letter-spacing: 0.08em;
    line-height: 1;
  }
  .na-sub {
    font-size: 8px;
    color: var(--muted);
    letter-spacing: 0.2em;
    margin-top: 2px;
  }

  .na-nav {
    display: flex;
    align-items: center;
    gap: 2px;
    flex: 1;
  }

  .na-link {
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    padding: 6px 14px;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.15s;
    position: relative;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .na-link:hover {
    color: var(--cyan);
    border-color: var(--border);
    background: var(--dim);
  }
  .na-link.active {
    color: var(--cyan);
    border-color: rgba(0,229,255,0.25);
    background: rgba(0,229,255,0.06);
  }
  .na-link.active::after {
    content: '';
    position: absolute;
    bottom: -1px; left: 0; right: 0;
    height: 2px;
    background: var(--cyan);
    box-shadow: 0 0 8px var(--cyan);
  }
  .na-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--green);
    box-shadow: 0 0 6px var(--green);
    animation: pulse 2s ease infinite;
  }

  .na-right {
    display: flex;
    align-items: center;
    gap: 16px;
    padding-left: 24px;
    border-left: 1px solid var(--border);
    flex-shrink: 0;
  }

  .na-stat {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  .na-stat-val {
    font-size: 13px;
    font-weight: 700;
    color: var(--green);
    line-height: 1;
  }
  .na-stat-label {
    font-size: 8px;
    color: rgba(0,229,255,0.25);
    letter-spacing: 0.15em;
    margin-top: 1px;
  }

  .na-divider {
    width: 1px;
    height: 24px;
    background: var(--border);
  }

  .na-btn {
    font-size: 9px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding: 6px 12px;
    border: 1px solid rgba(0,255,136,0.4);
    color: var(--green);
    background: rgba(0,255,136,0.06);
    cursor: pointer;
    font-family: inherit;
    transition: all 0.15s;
  }
  .na-btn:hover {
    background: rgba(0,255,136,0.14);
    box-shadow: 0 0 12px rgba(0,255,136,0.2);
  }

  .na-time {
    font-size: 10px;
    color: rgba(0,229,255,0.2);
    letter-spacing: 0.08em;
    flex-shrink: 0;
  }


  /* ═══════════════════════════════════
     NAVBAR B — Slim Signal Bar
     Minimal, elegant, one-liner
  ═══════════════════════════════════ */
  .nav-b {
    width: 100%;
    height: 44px;
    background: transparent;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    padding: 0 32px;
    gap: 32px;
    animation: fadeIn 0.4s ease both;
    position: relative;
  }

  /* bottom glow line */
  .nav-b::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, var(--cyan) 20%, var(--cyan) 80%, transparent);
    opacity: 0.3;
  }

  .nb-brand {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .nb-logo-mark {
    font-size: 14px;
    font-weight: 700;
    color: var(--cyan);
    letter-spacing: -0.02em;
    line-height: 1;
    border: 1px solid rgba(0,229,255,0.4);
    padding: 3px 6px;
    position: relative;
  }
  .nb-logo-mark::before,
  .nb-logo-mark::after {
    content: '';
    position: absolute;
    width: 4px; height: 4px;
  }
  .nb-logo-mark::before { top: -2px; left: -2px; border-top: 1px solid var(--cyan); border-left: 1px solid var(--cyan); }
  .nb-logo-mark::after  { bottom: -2px; right: -2px; border-bottom: 1px solid var(--cyan); border-right: 1px solid var(--cyan); }

  .nb-name {
    font-size: 11px;
    font-weight: 600;
    color: rgba(200,240,255,0.7);
    letter-spacing: 0.12em;
  }

  .nb-sep {
    width: 1px;
    height: 16px;
    background: var(--border);
    flex-shrink: 0;
  }

  .nb-links {
    display: flex;
    align-items: center;
    gap: 24px;
    flex: 1;
  }

  .nb-link {
    font-size: 10px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(0,229,255,0.35);
    cursor: pointer;
    transition: color 0.15s;
    text-decoration: none;
    padding-bottom: 2px;
    border-bottom: 1px solid transparent;
    transition: all 0.15s;
  }
  .nb-link:hover { color: var(--cyan); }
  .nb-link.active {
    color: var(--cyan);
    border-bottom-color: var(--cyan);
  }

  .nb-right {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-shrink: 0;
  }

  .nb-count {
    font-size: 10px;
    color: rgba(0,229,255,0.25);
    letter-spacing: 0.1em;
  }
  .nb-count span {
    color: var(--cyan);
    font-weight: 600;
  }

  .nb-new {
    font-size: 9px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--green);
    border: 1px solid rgba(0,255,136,0.35);
    padding: 4px 10px;
    cursor: pointer;
    font-family: inherit;
    background: none;
    transition: all 0.15s;
  }
  .nb-new:hover { background: rgba(0,255,136,0.08); }


  /* ═══════════════════════════════════
     NAVBAR C — Terminal Breadcrumb
     Wide, asymmetric, path-style
  ═══════════════════════════════════ */
  .nav-c {
    width: 100%;
    height: 48px;
    background: rgba(0,229,255,0.03);
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: stretch;
    animation: fadeIn 0.4s ease both;
  }

  .nc-brand-block {
    display: flex;
    align-items: center;
    padding: 0 20px;
    gap: 10px;
    border-right: 1px solid var(--border);
    background: rgba(0,229,255,0.04);
    flex-shrink: 0;
  }

  .nc-logo {
    width: 22px;
    height: 22px;
  }

  .nc-brand-text {
    font-size: 11px;
    font-weight: 700;
    color: var(--cyan);
    letter-spacing: 0.1em;
  }

  .nc-path {
    display: flex;
    align-items: center;
    padding: 0 20px;
    gap: 0;
    flex: 1;
    font-size: 10px;
    letter-spacing: 0.08em;
    color: rgba(0,229,255,0.25);
    overflow: hidden;
  }

  .nc-crumb {
    padding: 0 12px;
    height: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
    position: relative;
    border-right: 1px solid transparent;
  }
  .nc-crumb:hover {
    color: var(--cyan);
    background: var(--dim);
  }
  .nc-crumb.active {
    color: var(--cyan);
    background: rgba(0,229,255,0.06);
    border-right-color: var(--border);
  }
  .nc-crumb.active::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 2px;
    background: var(--cyan);
    box-shadow: 0 0 8px var(--cyan);
  }

  .nc-arrow {
    color: rgba(0,229,255,0.15);
    font-size: 10px;
    padding: 0 2px;
    user-select: none;
  }

  .nc-right {
    display: flex;
    align-items: center;
    gap: 0;
    border-left: 1px solid var(--border);
    flex-shrink: 0;
  }

  .nc-action {
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 18px;
    font-size: 9px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    cursor: pointer;
    border-right: 1px solid var(--border);
    transition: all 0.15s;
    color: var(--muted);
    font-family: inherit;
    background: none;
    border-top: none;
    border-bottom: none;
  }
  .nc-action:last-child { border-right: none; }
  .nc-action:hover { background: var(--dim); color: var(--cyan); }
  .nc-action.primary {
    color: var(--green);
    background: rgba(0,255,136,0.05);
  }
  .nc-action.primary:hover { background: rgba(0,255,136,0.12); }

  .nc-pulse {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--green);
    box-shadow: 0 0 6px var(--green);
    margin-right: 7px;
    animation: pulse 2s ease infinite;
    flex-shrink: 0;
  }


  /* ═══════════════ App previews ═══════════════ */
  .app-preview {
    width: 100%;
    height: 140px;
    background: rgba(5,13,20,0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid rgba(0,229,255,0.05);
  }
  .preview-hint {
    font-size: 9px;
    letter-spacing: 0.2em;
    color: rgba(0,229,255,0.12);
    text-transform: uppercase;
  }

  /* ═══════════════ Animations ═══════════════ */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  .spacer { height: 40px; }
</style>
</head>
<body>

  <!-- ── DESIGN A ── -->
  <div class="label">A — Command Bar &nbsp;·&nbsp; HUD-style, dense, stats + live indicator</div>

  <nav class="nav-a">
    <div class="na-brand">
      <div class="na-hex">
        <svg viewBox="0 0 26 26" fill="none">
          <polygon points="13,2 23,7.5 23,18.5 13,24 3,18.5 3,7.5" stroke="#00e5ff" stroke-width="1.5" fill="rgba(0,229,255,0.05)"/>
          <polygon points="13,6 19,9.5 19,16.5 13,20 7,16.5 7,9.5" stroke="rgba(0,229,255,0.25)" stroke-width="1" fill="none"/>
          <text x="13" y="16" text-anchor="middle" fill="#00ff88" font-size="7" font-weight="700" font-family="monospace">DL</text>
        </svg>
      </div>
      <div>
        <div class="na-title">DEVLOGGER</div>
        <div class="na-sub">devforge · bkness</div>
      </div>
    </div>

    <div class="na-nav">
      <a class="na-link active">
        <span class="na-dot"></span>
        Logs
      </a>
      <a class="na-link">Stats</a>
      <a class="na-link">Tags</a>
      <a class="na-link">Settings</a>
    </div>

    <div class="na-right">
      <div class="na-stat">
        <div class="na-stat-val">14</div>
        <div class="na-stat-label">total logs</div>
      </div>
      <div class="na-divider"></div>
      <div class="na-stat">
        <div class="na-stat-val">5</div>
        <div class="na-stat-label">this week</div>
      </div>
      <div class="na-divider"></div>
      <button class="na-btn">+ New Log</button>
      <div class="na-time" id="naTime">--:--:--</div>
    </div>
  </nav>

  <div class="app-preview"><span class="preview-hint">app content area</span></div>

  <!-- ── DESIGN B ── -->
  <div class="label">B — Slim Signal &nbsp;·&nbsp; Minimal, elegant, breathing room</div>

  <nav class="nav-b">
    <div class="nb-brand">
      <div class="nb-logo-mark">DL</div>
      <span class="nb-name">DEVLOGGER</span>
    </div>

    <div class="nb-sep"></div>

    <div class="nb-links">
      <a class="nb-link active">Logs</a>
      <a class="nb-link">Stats</a>
      <a class="nb-link">Tags</a>
      <a class="nb-link">Settings</a>
    </div>

    <div class="nb-right">
      <span class="nb-count"><span>14</span> logs</span>
      <button class="nb-new">+ New</button>
    </div>
  </nav>

  <div class="app-preview"><span class="preview-hint">app content area</span></div>

  <!-- ── DESIGN C ── -->
  <div class="label">C — Terminal Path &nbsp;·&nbsp; Breadcrumb-style, tab-bar as file path</div>

  <nav class="nav-c">
    <div class="nc-brand-block">
      <svg class="nc-logo" viewBox="0 0 22 22" fill="none">
        <polygon points="11,1.5 20,6.5 20,15.5 11,20.5 2,15.5 2,6.5" stroke="#00e5ff" stroke-width="1.5" fill="rgba(0,229,255,0.05)"/>
        <text x="11" y="14" text-anchor="middle" fill="#00ff88" font-size="6" font-weight="700" font-family="monospace">DL</text>
      </svg>
      <span class="nc-brand-text">DL</span>
    </div>

    <div class="nc-path">
      <div class="nc-crumb active">~/logs</div>
      <span class="nc-arrow">›</span>
      <div class="nc-crumb">~/stats</div>
      <span class="nc-arrow">›</span>
      <div class="nc-crumb">~/tags</div>
      <span class="nc-arrow">›</span>
      <div class="nc-crumb">~/settings</div>
    </div>

    <div class="nc-right">
      <button class="nc-action primary">
        <div class="nc-pulse"></div>
        + New Log
      </button>
      <button class="nc-action">Export</button>
      <button class="nc-action">⚙</button>
    </div>
  </nav>

  <div class="app-preview"><span class="preview-hint">app content area</span></div>

  <div class="spacer"></div>

<script>
  // live clock for nav A
  function tick() {
    const now = new Date();
    const t = now.toTimeString().slice(0,8);
    const el = document.getElementById('naTime');
    if (el) el.textContent = t;
  }
  tick();
  setInterval(tick, 1000);

  // click active state switching
  document.querySelectorAll('.na-link').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('.na-link').forEach(x => x.classList.remove('active'));
      el.classList.add('active');
    });
  });
  document.querySelectorAll('.nb-link').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('.nb-link').forEach(x => x.classList.remove('active'));
      el.classList.add('active');
    });
  });
  document.querySelectorAll('.nc-crumb').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('.nc-crumb').forEach(x => x.classList.remove('active'));
      el.classList.add('active');
    });
  });
</script>
</body>
</html>
