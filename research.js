(() => {
  "use strict";
  const root = document.querySelector("#research-demo");
  if (!root) return;
  const ns = "http://www.w3.org/2000/svg";
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const panels = [...root.querySelectorAll('[role="tabpanel"]')];
  const playButton = root.querySelector("[data-scene-play]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const rotors = [...root.querySelectorAll("[data-wind-rotor]")];
  const packets = [...root.querySelectorAll("[data-energy-packet]")];
  const energyPaths = [...root.querySelectorAll("[data-energy-path]")];
  const pathLengths = energyPaths.map(path => path.getTotalLength());
  const curve = root.querySelector("[data-frequency-curve]");
  const curvePoint = root.querySelector("[data-frequency-point]");
  const powerStatus = root.querySelector("[data-power-state]");
  const linkLayer = root.querySelector("[data-formation-links]");
  const agentLayer = root.querySelector("[data-formation-agents]");
  const trace = root.querySelector("[data-leader-trace]");
  const graph = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 4], [2, 5], [3, 4], [4, 5]];
  const arrowOffsets = [[0, 0], [-55, -38], [-55, 38], [-110, -72], [-110, 0], [-110, 72]];
  const starts = [[354, 183], [90, 90], [180, 265], [80, 250], [400, 70], [420, 270]];
  const times = [0, 0];
  let points = starts.map(([x, y]) => ({x, y}));
  let history = [];
  let sampleAt = -1;
  let active = 0;
  let playing = !reducedMotion.matches;
  let visible = true;
  let speed = 1;
  let formation = "arrow";
  let disturbedAt = null;
  let frame = 0;
  let previousTime = null;

  function element(tag, attributes, parent) {
    const node = document.createElementNS(ns, tag);
    for (const [name, value] of Object.entries(attributes)) node.setAttribute(name, value);
    parent.appendChild(node);
    return node;
  }
  const links = graph.map(() => element("line", {}, linkLayer));
  const agents = starts.map((_, index) => {
    const group = element("g", {"data-agent":index}, agentLayer);
    if (index === 0) {
      group.style.cssText = "--agent-body:#c7db98;--agent-edge:#e3e8b8;--agent-mouth:#284f3c";
      element("circle", {r:28,fill:"none",stroke:"#c7db98","stroke-opacity":".3"}, group);
      const name = element("text", {y:-36,"text-anchor":"middle",fill:"#dce5b3","font-size":11,"font-family":"Microsoft YaHei, sans-serif"}, group);
      name.textContent = "领导者";
    }
    element("use", {href:"#formation-robot"}, group);
    return group;
  });
  const leaderAt = time => ({x:292 + 62 * Math.cos(time * .35), y:183 + 35 * Math.sin(time * .7)});
  const leaderVelocity = time => ({x:-21.7 * Math.sin(time * .35), y:24.5 * Math.cos(time * .7)});
  const linePath = values => values.map((p, index) => `${index ? "L" : "M"}${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ");
  root.querySelector("[data-leader-route]").setAttribute("d", linePath(Array.from({length:121}, (_, index) => leaderAt(index * 2 * Math.PI / (.35 * 120)))));
  function offsets() {
    return formation === "arrow" ? arrowOffsets : [[0, 0], ...Array.from({length:5}, (_, i) => [72 * Math.cos(i * 2 * Math.PI / 5), 72 * Math.sin(i * 2 * Math.PI / 5)])];
  }
  function renderPower() {
    const time = times[0];
    rotors.forEach((rotor, i) => rotor.setAttribute("transform", `rotate(${(time * (i ? 46 : 38) + i * 22) % 360})`));
    packets.forEach((packet, i) => {
      const point = energyPaths[i].getPointAtLength(((time * .2 + i * .4) % 1) * pathLengths[i]);
      packet.setAttribute("cx", point.x);
      packet.setAttribute("cy", point.y);
    });
    let status = "稳态运行";
    if (disturbedAt === null) {
      curve.setAttribute("d", "M54 309H454");
      curvePoint.setAttribute("cx", 454);
      curvePoint.setAttribute("cy", 309);
    } else {
      const elapsed = Math.min(12, time - disturbedAt);
      const sampleCount = Math.max(2, Math.ceil(elapsed * 20) + 1);
      // The small curve illustrates a damped frequency response; it is not a paper's simulation data.
      const samples = Array.from({length:sampleCount}, (_, i) => {
        const t = elapsed * i / (sampleCount - 1);
        return {x:54 + t / 12 * 400,y:309 + 24 * Math.exp(-.43 * t) * Math.sin(1.7 * t)};
      });
      curve.setAttribute("d", linePath(samples));
      const last = samples[samples.length - 1];
      curvePoint.setAttribute("cx", last.x);
      curvePoint.setAttribute("cy", last.y);
      status = elapsed < 1.5 ? "负荷发生变化" : elapsed < 9 ? "频率调节中" : "恢复稳态";
    }
    if (powerStatus.textContent !== status) powerStatus.textContent = status;
  }
  function stepFormation(dt) {
    const time = times[1];
    const desired = offsets();
    const velocity = leaderVelocity(time);
    const old = points.map(p => ({...p}));
    old[0] = leaderAt(time);
    points[0] = old[0];
    // Relative-position feedback acts along the displayed communication links.
    for (let i = 1; i < points.length; i++) {
      const neighbors = graph.filter(([, target]) => target === i).map(([source]) => source);
      let ex = 0, ey = 0;
      for (const j of neighbors) {
        ex += old[j].x - old[i].x + desired[i][0] - desired[j][0];
        ey += old[j].y - old[i].y + desired[i][1] - desired[j][1];
      }
      points[i].x += (velocity.x + 2.8 * ex / neighbors.length) * dt;
      points[i].y += (velocity.y + 2.8 * ey / neighbors.length) * dt;
    }
    if (time - sampleAt >= .1) {
      history.push({...points[0]});
      if (history.length > 150) history.shift();
      sampleAt = time;
    }
  }
  function renderFormation() {
    agents.forEach((agent, i) => agent.setAttribute("transform", `translate(${points[i].x.toFixed(2)} ${points[i].y.toFixed(2)})`));
    graph.forEach(([source, target], i) => {
      const a = points[source], b = points[target];
      for (const [name, value] of Object.entries({x1:a.x,y1:a.y,x2:b.x,y2:b.y})) links[i].setAttribute(name, value.toFixed(2));
    });
    trace.setAttribute("d", linePath(history));
  }
  function render() { active === 0 ? renderPower() : renderFormation(); }
  function canAnimate() { return playing && visible && !document.hidden; }
  function tick(timestamp) {
    frame = 0;
    if (!canAnimate()) return;
    const dt = previousTime === null ? 0 : Math.min((timestamp - previousTime) / 1000, .05) * speed;
    previousTime = timestamp;
    times[active] += dt;
    if (active === 1) stepFormation(dt);
    render();
    frame = requestAnimationFrame(tick);
  }
  function schedule() {
    cancelAnimationFrame(frame);
    frame = 0;
    previousTime = null;
    if (canAnimate()) frame = requestAnimationFrame(tick);
    playButton.textContent = playing ? "暂停演示" : "播放演示";
  }
  function activate(index, focus = false) {
    active = index;
    tabs.forEach((tab, i) => {
      tab.setAttribute("aria-selected", String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
    if (focus) tabs[index].focus();
    render();
    schedule();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activate(index));
    tab.addEventListener("keydown", event => {
      let next;
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") next = (index + 1) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); activate(next, true); }
    });
  });
  playButton.addEventListener("click", () => { playing = !playing; schedule(); });
  root.querySelector("[data-scene-reset]").addEventListener("click", () => {
    times[active] = 0;
    if (active === 0) disturbedAt = null;
    else { points = starts.map(([x, y]) => ({x, y})); history = []; sampleAt = -1; }
    render();
    schedule();
  });
  root.querySelector("[data-load-change]").addEventListener("click", () => { disturbedAt = times[0]; renderPower(); });
  root.querySelector("[data-scene-speed]").addEventListener("change", event => { speed = Number(event.target.value); });
  root.querySelectorAll("[data-formation]").forEach(button => button.addEventListener("click", () => {
    formation = button.dataset.formation;
    root.querySelectorAll("[data-formation]").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
  }));
  root.querySelector("[data-show-links]").addEventListener("change", event => { linkLayer.style.visibility = event.target.checked ? "visible" : "hidden"; });
  document.addEventListener("visibilitychange", schedule);
  reducedMotion.addEventListener("change", () => { if (reducedMotion.matches) playing = false; schedule(); });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; schedule(); }, {threshold:.05}).observe(root);
  }
  root.querySelectorAll(".scene-tabs,.scene-controls,.scene-options").forEach(node => { node.hidden = false; });
  renderFormation();
  activate(0);
})();
