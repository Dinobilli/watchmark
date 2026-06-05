export function renderDashboardPage(): string {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Watchmark - Website Change Monitor</title>
  <style>
    :root { color-scheme: light; --ink:#17201a; --muted:#5d6a61; --line:#d9e2d9; --paper:#fbfaf4; --accent:#0b7a53; --warn:#b24b2f; --add:#0b7a53; --remove:#9d3324; }
    * { box-sizing: border-box; }
    body { margin:0; font-family: ui-serif, Georgia, "Times New Roman", serif; background: var(--paper); color: var(--ink); }
    main { max-width: 1120px; margin: 0 auto; padding: 42px 20px 56px; }
    .hero { display:grid; grid-template-columns: 1.1fr .9fr; gap: 28px; align-items:end; border-bottom: 1px solid var(--line); padding-bottom: 28px; }
    h1 { font-size: clamp(42px, 8vw, 92px); line-height:.88; margin:0; letter-spacing:0; }
    .tagline { font-size: 20px; color: var(--muted); max-width: 650px; }
    .panel { border:1px solid var(--line); background:#fffdf8; border-radius:8px; padding:18px; }
    label { display:block; font-size:13px; color:var(--muted); margin: 12px 0 6px; }
    input, select, button { width:100%; min-height:42px; border:1px solid var(--line); border-radius:6px; padding:10px 12px; font: inherit; background:white; }
    button { margin-top:14px; background:var(--accent); color:white; border-color:var(--accent); cursor:pointer; font-weight:700; }
    .examples { display:grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin:24px 0; }
    .example { border:1px solid var(--line); border-radius:8px; padding:14px; background:white; }
    .example b { display:block; margin-bottom:6px; }
    .fixture-preview { margin:24px 0; }
    .fixture-preview h2 { margin:0 0 10px; font-size:20px; }
    .fixture-buttons { display:grid; grid-template-columns: repeat(5, 1fr); gap:10px; }
    .fixture-buttons button { margin-top:0; background:white; color:var(--accent); }
    .result { margin-top:18px; border-left:4px solid var(--accent); padding:14px; background:#f2f8f1; min-height:92px; }
    .changed { color: var(--warn); font-weight:700; }
    .quiet { color:var(--muted); }
    .diff-grid { display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-top:12px; }
    .diff-section { border:1px solid var(--line); border-radius:8px; background:white; padding:12px; min-width:0; }
    .diff-section h3 { margin:0 0 8px; font-size:15px; }
    .diff-section ul { margin:0; padding-left:18px; }
    .diff-section li { margin:6px 0; overflow-wrap:anywhere; }
    .diff-added h3 { color:var(--add); }
    .diff-removed h3 { color:var(--remove); }
    @media (max-width: 760px) { .hero, .examples, .fixture-buttons, .diff-grid { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <main>
    <section class="hero">
      <div>
        <p class="quiet">Open-source core for a future monitoring SaaS</p>
        <h1>Watchmark</h1>
        <p class="tagline">한국 공공기관 공고, 쇼핑몰 상품 페이지, 경쟁사 가격표처럼 놓치면 손해인 웹 변경을 추적하고 AI-style 요약으로 보여줍니다.</p>
      </div>
      <form id="watch-form" class="panel">
        <label for="url">URL</label>
        <input id="url" name="url" placeholder="https://example.go.kr/notice" required />
        <label for="name">Watch name</label>
        <input id="name" name="name" placeholder="서울시 공고" />
        <label for="category">Category</label>
        <select id="category" name="category">
          <option value="public">Korea Public Sector</option>
          <option value="shopping">Shopping & Product</option>
          <option value="competitor">Competitor Intel</option>
        </select>
        <button type="submit">변경 확인</button>
      </form>
    </section>
    <section class="examples" aria-label="Use cases">
      <div class="example"><b>Korea Public Sector</b><span>입찰, 지원금, 채용 공고의 마감일 변경 감지</span></div>
      <div class="example"><b>Shopping & Product</b><span>가격, 옵션, 품절, 상세페이지 문구 변경 추적</span></div>
      <div class="example"><b>Founder OSINT</b><span>경쟁사 랜딩, 약관, 채용 페이지 업데이트 요약</span></div>
    </section>
    <section class="fixture-preview panel" aria-label="Korean public notice fixture preview">
      <h2>공공 공고 예시</h2>
      <div class="fixture-buttons">
        <button type="button" data-fixture-id="notice-title-change">제목 변경</button>
        <button type="button" data-fixture-id="deadline-change">마감일 변경</button>
        <button type="button" data-fixture-id="attachment-change">첨부파일 변경</button>
        <button type="button" data-fixture-id="department-change">담당부서 변경</button>
        <button type="button" data-fixture-id="application-period-change">접수기간 변경</button>
      </div>
    </section>
    <section class="panel">
      <h2>변경 감지 결과</h2>
      <div id="result" class="result quiet">URL을 입력하면 첫 스냅샷을 저장하고, 다음 체크부터 의미 있는 변경을 요약합니다.</div>
      <h3>요약</h3>
      <p class="quiet">No API key required for the MVP. The open-source engine uses deterministic local summarization and can later connect to hosted AI summaries.</p>
    </section>
  </main>
  <script>
    const form = document.querySelector("#watch-form");
    const result = document.querySelector("#result");
    const fixtureButtons = document.querySelectorAll("[data-fixture-id]");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      result.textContent = "확인 중...";
      const response = await fetch("/api/check", { method:"POST", headers:{ "content-type":"application/json" }, body: JSON.stringify(data) });
      const payload = await response.json();
      renderResult(payload);
    });
    for (const button of fixtureButtons) {
      button.addEventListener("click", async () => {
        const fixtureId = button.getAttribute("data-fixture-id");
        if (fixtureId === null) { return; }
        result.textContent = "예시 불러오는 중...";
        const response = await fetch("/api/fixtures/korean-public-notices/" + encodeURIComponent(fixtureId));
        const payload = await response.json();
        renderResult(payload);
      });
    }
    function renderResult(payload) {
      if (!payload.ok) { result.textContent = payload.error.message; return; }
      result.replaceChildren();
      const status = document.createElement("strong");
      status.className = payload.changed ? "changed" : "quiet";
      status.textContent = payload.changed ? "변경 감지" : "변경 없음";
      const summary = document.createElement("p");
      summary.textContent = payload.summary;
      const addedLines = normalizeDiffLines(payload.diff?.meaningfulAdded);
      const removedLines = normalizeDiffLines(payload.diff?.meaningfulRemoved);
      const hasDiffLines = addedLines.length > 0 || removedLines.length > 0;
      const diffGrid = document.createElement("div");
      diffGrid.className = "diff-grid";
      diffGrid.append(
        renderDiffSection("추가된 내용", addedLines, "추가된 의미 있는 문구 없음", "diff-section diff-added"),
        renderDiffSection("삭제된 내용", removedLines, "삭제된 의미 있는 문구 없음", "diff-section diff-removed"),
      );
      if (!hasDiffLines) {
        const emptyDiff = document.createElement("p");
        emptyDiff.className = "quiet";
        emptyDiff.textContent = "변경 상세 없음";
        result.append(status, summary, emptyDiff, diffGrid);
        return;
      }
      result.append(status, summary, diffGrid);
    }
    function normalizeDiffLines(value) {
      if (!Array.isArray(value)) {
        return [];
      }
      return value.filter((line) => typeof line === "string");
    }
    function renderDiffSection(title, lines, emptyText, className) {
      const maxDiffItems = 5;
      const section = document.createElement("section");
      section.className = className;
      const heading = document.createElement("h3");
      heading.textContent = title;
      const list = document.createElement("ul");
      if (lines.length === 0) {
        const emptyItem = document.createElement("li");
        emptyItem.className = "quiet";
        emptyItem.textContent = emptyText;
        list.append(emptyItem);
      }
      for (const line of lines.slice(0, maxDiffItems)) {
        const item = document.createElement("li");
        item.textContent = line;
        list.append(item);
      }
      if (lines.length > maxDiffItems) {
        const hiddenCount = lines.length - maxDiffItems;
        const moreItem = document.createElement("li");
        moreItem.className = "quiet";
        moreItem.textContent = "외 " + hiddenCount + "개 더 있음";
        list.append(moreItem);
      }
      section.append(heading, list);
      return section;
    }
  </script>
</body>
</html>`
}
