import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(root, "beta.html"), "utf8");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const scoreFileStart = html.indexOf('const scoreFile = event.target.closest("[data-score-file]")');
const inputHandlerStart = html.indexOf('document.addEventListener("input"', scoreFileStart);
const scoreFileBlock = html.slice(scoreFileStart, inputHandlerStart);

assert(scoreFileStart > -1, "score upload handler is missing");
assert(!html.includes("upload-simulated"), "score uploads must not be saved as simulated recognition");
assert(!html.includes("模拟识别"), "UI must not claim simulated recognition");
assert(!scoreFileBlock.includes("Math.random"), "upload handler must not generate random score data");
assert(!scoreFileBlock.includes("secondsToTime(base"), "upload handler must not fabricate finish time");
assert(!scoreFileBlock.includes("已识别为"), "upload handler must not claim success before OCR");
assert(html.includes("extractResultFromImage"), "real OCR extraction function is missing");
assert(html.includes("Tesseract.createWorker"), "browser OCR worker path is missing");
assert(html.includes('name="ocrStatus"'), "OCR status must be stored with the form");
assert(html.includes('source: values.ocrStatus === "verified" ? "ocr" : "manual"'), "result source must distinguish OCR from manual entry");
assert(html.includes('["xianning-2026", "咸宁马拉松"'), "2026 Xianning event must be available for OCR date matching");
assert(html.includes('["xiangjiang-half-2026", "湘江半程马拉松"'), "2026 Xiangjiang Half Marathon must be available for OCR matching");
assert(html.includes("function parseEventDateFromText"), "OCR must parse event dates from score text");
assert(html.includes("function selectBestEventMatch"), "OCR must choose event by city plus parsed year/date");
assert(html.includes('words: ["湘江", "湘马", "湘江半马", "湘江半程", "xiangjiang"]'), "Xiangjiang aliases must match certificate file names like 湘马成绩证书");
assert(html.includes("genderRank:"), "OCR result must include gender ranking");
assert(html.includes('name="genderRank"'), "report form must expose gender ranking");
assert(html.includes("性别排名"), "UI must distinguish gender ranking from age-group ranking");
assert(html.includes("function runnerAgeOnDate"), "runner age must be computed from birthday and event date");
assert(html.includes("ROAD_LEVEL_STANDARDS"), "road race level standards must be data-driven");
assert(html.includes("function roadLevelFor"), "public road level must be calculated from gender, age group, distance, and time");
assert(html.includes('name="birthDate"'), "runner profile must collect birthday for level calculation");
assert(html.includes('name="gender"'), "runner profile must collect gender for level calculation");
assert(html.includes('name="routeImage"'), "optional route image upload slot is missing");
assert(html.includes('name="shirtImage"'), "optional race shirt upload slot is missing");
assert(html.includes('name="medalImage"'), "optional medal upload slot is missing");
assert(html.includes('name="bibImage"'), "optional bib upload slot is missing");

const reportStart = html.indexOf("function renderReport()");
const reportEnd = html.indexOf("function renderSettings()", reportStart);
const reportBlock = html.slice(reportStart, reportEnd);
const scoreUploadIndex = reportBlock.indexOf('name="file"');
const eventQueryIndex = reportBlock.indexOf('name="eventQuery"');
assert(scoreUploadIndex > -1 && eventQueryIndex > -1, "report form must include score upload and event fields");
assert(scoreUploadIndex < eventQueryIndex, "score upload must be the first report action before manual event fields");
assert(html.includes("height: 100dvh"), "mobile app shell must use fixed dynamic viewport height so inner screen can scroll");
assert(html.includes("-webkit-overflow-scrolling: touch"), "mobile screen must opt into momentum scrolling");
assert(html.includes("editingResultId"), "archive records must support edit mode");
assert(html.includes("deletedResultIds"), "deleted archive records must be tracked so remote merge cannot revive them");
assert(html.includes("mergeById(remote.results, local.results, deletedIds)"), "result merge must respect deleted record ids");
assert(html.includes('data-action="edit-result"'), "poster/detail view must expose edit action");
assert(html.includes('data-action="delete-result"'), "poster/detail view must expose delete action");
assert(html.includes("runnerStyles"), "runner style options must be available");
assert(html.includes('name="runnerStyle"'), "runner style must be collected in profile forms");
assert(html.includes("佛系跑者") && html.includes("严肃竞速") && html.includes("赛道香风"), "runner styles must include share-friendly presets");
assert(!html.includes('url("assets/memorial-ui-06-poster-maker.jpg")'), "poster output must not use sample screenshot as background");
assert(html.includes("18 + Math.min(city.count, 6) * 2"), "map city markers must be smaller on mobile");

function runParser(sampleText, fileName) {
  const script = html
    .match(/<script>\n([\s\S]*)\n  <\/script>\n<\/body>/)[1]
    .replace(/\n\s*bootstrap\(\);\s*$/, "");
  const stubElement = {
    addEventListener() {},
    classList: { toggle() {}, add() {}, remove() {} },
    style: {},
    hidden: false,
    textContent: "",
    innerHTML: "",
    scrollTop: 0
  };
  const sandbox = {
    document: {
      querySelector() { return stubElement; },
      addEventListener() {}
    },
    window: {
      addEventListener() {},
      dispatchEvent() {},
      clearTimeout() {},
      setTimeout() {},
      matchMedia() { return { matches: false }; }
    },
    localStorage: {
      getItem() { return null; },
      setItem() {},
      removeItem() {}
    },
    navigator: { clipboard: { writeText() {} } },
    fetch() { throw new Error("fetch disabled in parser test"); },
    console,
    Date,
    Math,
    JSON,
    Set,
    Map,
    RegExp,
    String,
    Number,
    Boolean,
    Array,
    Object,
    Error,
    encodeURIComponent
  };
  return Function("sandbox", "sampleText", "fileName", `with (sandbox) { ${script}; db = normalizeBetaState(generateSeed()); return parseOcrResult(sampleText, fileName); }`)(sandbox, sampleText, fileName);
}

const xiangmaCertificateText = `
2026 湘江半程马拉松 成绩证书
姓名 郭威 参赛号码 B13160 性别 男
枪声成绩 02:22:12
净计时成绩 02:16:56
平均配速 00:06:29
性别排名 / GENDER PLACE
枪声成绩 7093 名
净计时成绩 6945 名
全部选手排名 / OVERALL PLACE
枪声成绩 8818 名
净计时成绩 8537 名
`;
const xiangmaParsed = runParser(xiangmaCertificateText, "湘马成绩证书.jpg");
assert(xiangmaParsed.event?.id === "xiangjiang-half-2026", "Xiangjiang certificate must match the 2026 Xiangjiang half event");
assert(xiangmaParsed.time === "2:16:56", "certificate parser must prefer net time over gun time");
assert(xiangmaParsed.genderRank === "6945", "gender ranking must prefer net-time gender place");
assert(xiangmaParsed.rank === "8537", "overall ranking must prefer net-time overall place");

console.log("OCR regression checks passed");
