/**
 * Gene 大星的糖蔥：Google Apps Script 後端
 * 貼到試算表「擴充功能 → Apps Script」，部署成「網頁應用程式」。
 * 欄位：A id | B 署名 | C 留言 | D 口味 | E 怪味 | F 建立時間 | G 更新時間 | H 隱藏 | I secret
 * 要隱藏某根糖蔥：在 H 欄填 TRUE。要刪除：直接刪掉那一列。
 */
const MAX_ROWS = 800;
const FLAVORS = ['plain', 'peanut', 'berry', 'matcha', 'brown', 'weird'];
const WEIRD = ['cilantro', 'wasabi', 'chaotian', 'jalapeno', 'habanero', 'ghost', 'reaper', 'mala'];

function sheet_() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// 防止有人輸入 =、+、-、@ 開頭的內容被當成試算表公式
function safe_(s) {
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function doGet() {
  const rows = sheet_().getDataRange().getValues().slice(1);
  const items = rows
    .filter(function (r) { return r[0] && r[2] && String(r[7]).toUpperCase() !== 'TRUE'; })
    .map(function (r) {
      return {
        id: String(r[0]),
        name: String(r[1]),
        text: String(r[2]),
        flavor: String(r[3]),
        weird: String(r[4]) || null,
        createdAt: Number(r[5]) || 0,
        updatedAt: Number(r[6]) || 0
      };
    });
  return json_({ ok: true, items: items });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const b = JSON.parse(e.postData.contents);
    const id = String(b.id || '');
    const secret = String(b.secret || '');
    if (!/^[A-Za-z0-9_-]{8,40}$/.test(id) || secret.length < 16 || secret.length > 80) {
      return json_({ ok: false, error: 'bad_id' });
    }
    const sh = sheet_();
    const data = sh.getDataRange().getValues();
    let rowIdx = -1;
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]) === id) { rowIdx = i; break; }
    }
    if (rowIdx > 0 && String(data[rowIdx][8]) !== secret) {
      return json_({ ok: false, error: 'not_yours' });
    }

    if (b.action === 'delete') {
      if (rowIdx > 0) sh.deleteRow(rowIdx + 1);
      return json_({ ok: true });
    }

    const name = String(b.name || '').trim().slice(0, 24);
    const text = String(b.text || '').trim().slice(0, 400);
    if (!name || !text) return json_({ ok: false, error: 'empty' });
    const flavor = FLAVORS.indexOf(b.flavor) >= 0 ? b.flavor : 'plain';
    let weird = '';
    if (flavor === 'weird') {
      const prev = rowIdx > 0 ? String(data[rowIdx][4]) : '';
      weird = WEIRD.indexOf(prev) >= 0 ? prev : WEIRD[Math.floor(Math.random() * WEIRD.length)];
    }
    const now = Date.now();

    if (rowIdx > 0) {
      sh.getRange(rowIdx + 1, 2, 1, 6).setValues([[safe_(name), safe_(text), flavor, weird, data[rowIdx][5], now]]);
      return json_({ ok: true, weird: weird });
    }
    if (data.length > MAX_ROWS) return json_({ ok: false, error: 'full' });
    sh.appendRow([id, safe_(name), safe_(text), flavor, weird, now, now, '', secret]);
    return json_({ ok: true, weird: weird });
  } catch (err) {
    return json_({ ok: false, error: 'server' });
  } finally {
    lock.releaseLock();
  }
}
