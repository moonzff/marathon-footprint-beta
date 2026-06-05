import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(root, "beta.html"), "utf8");
const browserScript = html
  .match(/<script>\n([\s\S]*)\n  <\/script>\n<\/body>/)[1]
  .replace(/\n\s*bootstrap\(\);\s*$/, "");

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
assert(html.includes('name="runnerPhoto"'), "optional runner photo upload slot is missing");
assert(html.includes('name="shirtImage"'), "optional race shirt upload slot is missing");
assert(html.includes('name="medalImage"'), "optional medal upload slot is missing");
assert(html.includes('name="bibImage"'), "optional bib upload slot is missing");
assert(html.includes('name="bibNumber"'), "bib number field is missing");
assert(html.includes('name="elevationGain"'), "elevation gain field is missing");
assert(html.includes('name="photoAlbumUrl"'), "official photo album URL field is missing");

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
assert(html.includes("function posterEventTitle"), "poster title must use the recorded race name instead of city-only naming");
assert(!html.includes("${safe(result.city)}马拉松"), "poster must not rewrite special races like 湘江半程马拉松 into city + 马拉松");
assert(html.includes("poster-route-art"), "uploaded route maps should be treated as poster art rather than pasted raw screenshots");
assert(html.includes("poster-runner-photo"), "uploaded personal photos should become poster hero material");
assert(html.includes("@imgly/background-removal"), "runner photos must use browser AI background removal");
assert(html.includes("function ensureBackgroundRemoval"), "background removal module loader is missing");
assert(html.includes("function removeRunnerPhotoBackground"), "runner photo background removal helper is missing");
assert(html.includes("function ensureCanvasConvertToBlob"), "background removal must polyfill canvas convertToBlob for mobile webviews");
assert(html.includes("aiCutout"), "runner photo assets must record AI cutout state");
assert(html.includes("has-cutout-photo"), "poster must render a distinct layout for cutout runner photos");
assert(html.includes("上传后会先智能抠图"), "runner photo upload copy must explain AI cutout behavior");
assert(html.includes("poster-distance-badge"), "poster must label full marathon versus half marathon results");
assert(html.includes("function posterLineHtml"), "poster copy must protect against orphan characters");
assert(html.includes("poster-nowrap"), "poster copy must include no-wrap spans for short ending phrases");
assert(html.includes("function compressImageForAsset"), "uploaded poster assets should be compressed and retained for poster rendering");
assert(html.includes("function parseBibNumberFromText"), "OCR must parse bib numbers when visible");
assert(html.includes("function parseElevationFromText"), "OCR must parse elevation gain when route text exposes it");
assert(html.includes("function safeExternalUrl"), "external photo album links must be protocol-checked");
assert(html.includes("查赛事照片"), "poster view must expose recorded race photo album links");
assert(!html.includes("poster-asset-row"), "poster should not show collected-asset badges that collide with copy");
assert(html.includes("18 + Math.min(city.count, 6) * 2"), "map city markers must be smaller on mobile");

function runParser(sampleText, fileName) {
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
  return Function("sandbox", "sampleText", "fileName", `with (sandbox) { ${browserScript}; db = normalizeBetaState(generateSeed()); return parseOcrResult(sampleText, fileName); }`)(sandbox, sampleText, fileName);
}

function renderXiangmaPosterSample() {
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
    fetch() { throw new Error("fetch disabled in poster test"); },
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
  return Function("sandbox", `with (sandbox) {
    ${browserScript};
    db = normalizeBetaState({
      version: 2,
      users: [{
        id: "user_xiangma",
        nickname: "疯神菜腿",
        runnerGoal: "pb",
        runnerStyle: "zen",
        publicProfile: true
      }],
      results: [{
        id: "result_xiangma",
        userId: "user_xiangma",
        eventId: "xiangjiang-half-2026",
        eventName: "湘江半程马拉松",
        city: "长沙",
        date: "2026-04-26",
        distance: "半马",
        seconds: 8216,
        time: "2:16:56",
        pace: "6:29/km",
        rank: "8537 / 15000",
        genderRank: "6945",
        ageRank: "",
        bibNumber: "B13160",
        elevationGain: "330",
        photoAlbumUrl: "https://example.com/photos",
        level: "待补充档案",
        official: true,
        pb: false,
        medal: "gold",
        assets: {
          runnerPhoto: { name: "runner.jpg", dataUrl: "data:image/png;base64,RUNNER", cutout: true, aiCutout: true },
          routeImage: { name: "route.jpg", dataUrl: "data:image/jpeg;base64,ROUTE" },
          medalImage: { name: "medal.jpg", dataUrl: "data:image/jpeg;base64,MEDAL" }
        }
      }],
      posts: [],
      feedback: [],
      deletedResultIds: []
    });
    state.currentUserId = "user_xiangma";
    state.selectedResultId = "result_xiangma";
    return renderPoster();
  }`)(sandbox);
}

const xiangmaCertificateText = `
2026 湘江半程马拉松 成绩证书
姓名 郭威 参赛号码 B13160 性别 男
枪声成绩 02:22:12
净计时成绩 02:16:56
平均配速 00:06:29
累计爬升 330m
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
assert(xiangmaParsed.bibNumber === "B13160", "certificate parser must capture bib number");
assert(xiangmaParsed.elevationGain === "330", "route text parser must capture elevation gain when present");

const xiangmaPoster = renderXiangmaPosterSample();
assert(xiangmaPoster.includes("湘江半程马拉松"), "Xiangjiang poster must show the actual race name");
assert(!xiangmaPoster.includes("长沙马拉松"), "Xiangjiang poster must not be renamed to Changsha Marathon");
assert(xiangmaPoster.includes("半马成绩"), "Xiangjiang half poster must explicitly label the result as half marathon");
assert(xiangmaPoster.includes("爬升 330m"), "poster must surface elevation gain when recorded");
assert(xiangmaPoster.includes("poster-runner-photo"), "runner photo must become the poster hero layer");
assert(xiangmaPoster.includes("has-cutout-photo"), "AI cutout runner photo must use the cutout poster layout");
assert(xiangmaPoster.includes("data:image/png;base64,RUNNER"), "runner photo upload must be used in the poster");
assert(xiangmaPoster.includes("查赛事照片"), "poster must offer the saved race photo album entry");
assert(xiangmaPoster.includes("poster-route-art"), "route upload must render through the stylized poster art layer");
assert(xiangmaPoster.includes("data:image/jpeg;base64,MEDAL"), "medal upload must be used in the poster instead of the default medal");
assert(!xiangmaPoster.includes("路线图已收录") && !xiangmaPoster.includes("奖牌已收录"), "poster must not print collected asset badges over the design");

console.log("OCR regression checks passed");
