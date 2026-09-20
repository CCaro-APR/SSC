const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
test("public page has no dashboard or backend dependency", () => {
  const html = fs.readFileSync("index.html", "utf8");
  assert.doesNotMatch(html, /admin-trigger|admin-overlay|APPS_SCRIPT_URL/);
  assert.equal(fs.existsSync("apps-script.js"), false);
});
test("site content and resource cards remain editable independently", () => {
  const ctx = vm.createContext({});
  vm.runInContext(fs.readFileSync("data.js", "utf8"), ctx);
  assert.equal(vm.runInContext("typeof SITE", ctx), "object");
  assert.ok(
    vm.runInContext(
      "HUB_LINKS.applying.length > 0 && SSC_STAFF.length > 0",
      ctx,
    ),
  );
});

function renderContext(query = "") {
  const elements = new Map();
  const element = (id) => {
    if (!elements.has(id))
      elements.set(id, {
        value: id === "search" ? query : "",
        innerHTML: "",
        hidden: false,
        querySelector: () => null,
        querySelectorAll: () => [],
        appendChild() {},
      });
    return elements.get(id);
  };
  const context = vm.createContext({
    document: {
      addEventListener() {},
      getElementById: element,
      createElement: () => ({ setAttribute() {}, style: {} }),
    },
  });
  for (const file of ["data.js", "app.js"])
    vm.runInContext(fs.readFileSync(file, "utf8"), context);
  return { context, element };
}

test("all resource sections render and search filters content", () => {
  const { context, element } = renderContext();
  vm.runInContext("render()", context);
  assert.equal(
    (element("bento").innerHTML.match(/<section\b/g) || []).length,
    9,
  );
  element("search").value = "FAFSA";
  vm.runInContext("render()", context);
  assert.match(element("bento").innerHTML, /FAFSA/);
  assert.doesNotMatch(element("bento").innerHTML, /Henry Ramos/);
  element("search").value = "<no-such-result>";
  vm.runInContext("render()", context);
  assert.match(element("bento").innerHTML, /Nothing matched/);
  assert.match(element("bento").innerHTML, /&lt;no-such-result&gt;/);
});

test("an empty announcement list hides the carousel and navigation is safe", () => {
  const { context, element } = renderContext();
  vm.runInContext("SLIDESHOW.splice(0); renderSlides(); goTo(1)", context);
  assert.equal(element("carousel-wrap").hidden, true);
});

test("validator rejects malformed content and missing attachments", () => {
  const os = require("node:os");
  const path = require("node:path");
  const { spawnSync } = require("node:child_process");
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-validation-"));
  try {
    fs.mkdirSync(path.join(temp, "scripts"));
    for (const file of [
      "data.js",
      "app.js",
      "styles.css",
      "index.html",
      "logo.png",
      "scripts/check-content.cjs",
    ]) {
      fs.copyFileSync(file, path.join(temp, file));
    }
    const run = () =>
      spawnSync(
        process.execPath,
        [path.join(temp, "scripts/check-content.cjs")],
        { encoding: "utf8" },
      );
    assert.equal(run().status, 0);
    fs.appendFileSync(
      path.join(temp, "data.js"),
      '\nHUB_LINKS.applying[0].url = "uploads/missing.pdf";\nSSC_STAFF[0].name = 42; SITE.email = "invalid";',
    );
    const result = run();
    assert.equal(result.status, 1);
    assert.match(result.stderr, /local file missing/);
    assert.match(result.stderr, /SITE.email: invalid address/);
    assert.match(result.stderr, /SSC_STAFF\[0\].name: expected text/);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});
