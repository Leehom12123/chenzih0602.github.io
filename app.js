(() => {
  "use strict";
  const papers = window.PUBLICATIONS || [];
  const list = document.querySelector("#publication-list");
  const count = document.querySelector("#result-count");
  const yearFilter = document.querySelector("#year-filter");
  const filterButtons = [...document.querySelectorAll("[data-filter]")];
  const dialog = document.querySelector("#citation-dialog");
  const citationContent = document.querySelector("#citation-content");
  const copyStatus = document.querySelector("#copy-status");
  let selectedTopic = "all";
  let citationOpener;

  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({"&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"}[character]));
  function makeBibtex(paper) {
    const fields = [
      ["author", paper.authors.join(" and ")], ["title", paper.bibTitle || paper.title],
      ["journal", paper.journal], ["year", paper.year], ["volume", paper.volume],
      ["number", paper.number], ["pages", paper.pages], ["doi", paper.doi], ["url", paper.doi ? `https://doi.org/${paper.doi}` : paper.url]
    ].filter(([, value]) => value !== "" && value != null);
    return `@article{${paper.id},\n${fields.map(([key, value]) => `  ${key} = {${value}}`).join(",\n")}\n}`;
  }

  function renderPapers() {
    const visible = papers.filter((paper) => (selectedTopic === "all" || paper.tags.includes(selectedTopic)) && (yearFilter.value === "all" || String(paper.year) === yearFilter.value));
    let previousYear;
    list.innerHTML = visible.map((paper) => {
      const yearHeading = previousYear !== paper.year ? `<div class="publication-year"><h3>${paper.year}</h3><span aria-hidden="true"></span></div>` : "";
      previousYear = paper.year;
      const authors = paper.authors.map((name) => `${name === "Zihan Chen" ? `<strong>${escapeHtml(name)}</strong>` : escapeHtml(name)}${name === paper.correspondingAuthor ? '<span class="corresponding-author" lang="zh-CN">（通讯作者）</span>' : ""}`).join(", ");
      const details = [paper.volume ? `vol. ${paper.volume}${paper.number ? `, no. ${paper.number}` : ""}` : "", paper.pages ? (paper.pages.includes("--") ? `pp. ${paper.pages.replace(/--/g, "–")}` : `Art. ${paper.pages}`) : "", paper.year].filter(Boolean).join(", ");
      const url = paper.doi ? `https://doi.org/${paper.doi}` : paper.url;
      const sourceLabel = paper.url.includes("researchgate.net") ? "ResearchGate" : "期刊页面";
      return `${yearHeading}<article class="paper" id="${escapeHtml(paper.id)}"><span class="paper-index" aria-hidden="true">${String(papers.indexOf(paper) + 1).padStart(2, "0")}</span><div><h4 class="paper-title" lang="en"><a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(paper.title)}</a></h4><p class="paper-authors" lang="en">${authors}</p><p class="paper-venue"><span class="venue-name" lang="en">${escapeHtml(paper.journal)}</span><span class="venue-detail"> · ${escapeHtml(details)}</span></p><div class="paper-tags">${paper.keywords.map((tag) => `<span class="paper-tag">${escapeHtml(tag)}</span>`).join("")}</div><div class="paper-actions">${paper.doi ? `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" aria-label="论文 ${papers.indexOf(paper) + 1} 的 DOI 链接">DOI <span aria-hidden="true">↗</span></a>` : ""}<a href="${escapeHtml(paper.url)}" target="_blank" rel="noopener noreferrer" aria-label="在${sourceLabel}查看论文 ${papers.indexOf(paper) + 1}">${sourceLabel} <span aria-hidden="true">↗</span></a><button type="button" data-citation="${escapeHtml(paper.id)}" aria-label="查看论文 ${papers.indexOf(paper) + 1} 的 BibTeX 引用">引用 BibTeX <span aria-hidden="true">↗</span></button></div><details class="paper-summary"><summary>中文简介</summary><p>${escapeHtml(paper.summary)}</p></details></div></article>`;
    }).join("");
    count.textContent = `显示 ${visible.length} 篇 / 共 ${papers.length} 篇选录论文`;
    document.querySelector("#empty-state").hidden = visible.length !== 0;
  }

  const years = [...new Set(papers.map((paper) => paper.year))].sort((a, b) => b - a);
  yearFilter.innerHTML = `<option value="all">全部年份</option>${years.map((year) => `<option value="${year}">${year}</option>`).join("")}`;
  filterButtons.forEach((button) => button.addEventListener("click", () => {
    selectedTopic = button.dataset.filter;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    renderPapers();
  }));
  yearFilter.addEventListener("change", renderPapers);
  renderPapers();
  document.querySelector(".publication-tools").hidden = false;
  document.querySelector(".bibliography-download").addEventListener("click", (event) => {
    event.preventDefault();
    const url = URL.createObjectURL(new Blob([papers.map(makeBibtex).join("\n\n") + "\n"], {type: "text/plain;charset=utf-8"}));
    const link = document.createElement("a");
    link.href = url;
    link.download = "zihan-chen-publications.bib";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  list.addEventListener("click", (event) => {
    const opener = event.target.closest("[data-citation]");
    if (!opener) return;
    const paper = papers.find((item) => item.id === opener.dataset.citation);
    if (!paper) return;
    citationOpener = opener;
    citationContent.textContent = makeBibtex(paper);
    copyStatus.textContent = "";
    dialog.showModal();
  });
  function closeCitation() { dialog.close(); }
  dialog.querySelector(".dialog-close").addEventListener("click", closeCitation);
  dialog.addEventListener("click", (event) => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) closeCitation();
  });
  dialog.addEventListener("close", () => citationOpener?.focus());
  document.querySelector("#copy-citation").addEventListener("click", async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(citationContent.textContent);
      copyStatus.textContent = "引用已复制";
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(citationContent);
      selection.removeAllRanges();
      selection.addRange(range);
      citationContent.focus();
      copyStatus.textContent = "请按 Ctrl+C（Mac：⌘C）复制所选引用";
    }
  });

  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#main-nav");
  function closeMenu() {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "展开导航");
    nav.classList.remove("is-open");
  }
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "收起导航" : "展开导航");
    nav.classList.toggle("is-open", open);
  });
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });
  document.addEventListener("click", (event) => { if (!event.target.closest(".site-header")) closeMenu(); });
  window.matchMedia("(min-width: 601px)").addEventListener("change", closeMenu);
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) nav.querySelectorAll("a").forEach((link) => {
          const current = link.hash === `#${entry.target.id}`;
          link.classList.toggle("is-active", current);
          if (current) link.setAttribute("aria-current", "location"); else link.removeAttribute("aria-current");
        });
      });
    }, {rootMargin: "-12% 0px -62% 0px"});
    document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));
  }
  document.querySelector("#copyright-year").textContent = new Date().getFullYear();
})();
