async function loadConfig() {
  const el = document.querySelector("#config");
  const res = await fetch("/api/config.json", { cache: "no-store" });
  const cfg = await res.json();
  el.textContent = JSON.stringify(cfg, null, 2);

  document.querySelector("#env").textContent = cfg.environment || "unknown";
  document.querySelector("#apiBase").textContent = cfg.apiBase || "/api";
  return cfg;
}

async function pingStatus() {
  const el = document.querySelector("#status");
  try {
    const t0 = performance.now();
    const res = await fetch("/api/ping", { cache: "no-store" });
    const t1 = performance.now();
    if (!res.ok) throw new Error("bad status");
    const data = await res.json();
    el.textContent = `OK (${Math.round(t1 - t0)}ms) @ ${data.time}`;
  } catch (e) {
    el.textContent = "ERROR";
  }
}

function confettiOnce() {
  const el = document.querySelector("#confetti");
  const chars = ["✨","🎉","⭐","💫","🔥","🚀"];
  const line = Array.from({length: 32}, () => chars[Math.floor(Math.random()*chars.length)]).join("");
  el.textContent = line;
  setTimeout(() => el.textContent = "", 1200);
}

(async () => {
  const cfg = await loadConfig();
  if (cfg.featureFlags?.enableStatusPing) {
    await pingStatus();
    setInterval(pingStatus, 5000);
  }
  document.querySelector("#btn").addEventListener("click", () => {
    if (cfg.featureFlags?.showConfetti) confettiOnce();
  });
})();