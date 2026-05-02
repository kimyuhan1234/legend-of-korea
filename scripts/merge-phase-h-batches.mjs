// Phase H Stage 2: 7 batch JSON → lib/data/food-dupes.ts 의 각 음식 dupes 필드 머지
// 사용: node scripts/merge-phase-h-batches.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const DATA_DIR = path.join(ROOT, 'data');
const TARGET = path.join(ROOT, 'lib', 'data', 'food-dupes.ts');

const BATCH_FILES = [
  'national',
  'seoul-gyeonggi',
  'chungcheong-gangwon',
  'jeolla',
  'gyeongsang-1',
  'gyeongsang-2',
  'jeju',
];

// 1. 모든 batch 로드 → id → dupes 매핑
const dupesById = {};
let totalKeys = 0;
for (const f of BATCH_FILES) {
  const p = path.join(DATA_DIR, `dupes-batch-${f}.json`);
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  for (const [id, dupes] of Object.entries(data)) {
    if (dupesById[id]) {
      console.error(`ERROR: duplicate id ${id} (also in ${f})`);
      process.exit(1);
    }
    dupesById[id] = dupes;
    totalKeys++;
  }
  console.log(`  loaded ${f}: ${Object.keys(data).length} foods`);
}
console.log(`Total batch foods: ${totalKeys}`);

// 2. food-dupes.ts 로드
const original = fs.readFileSync(TARGET, 'utf8');

// 3. 자동 백업 (다음 .bakN 결정)
let bakIdx = 1;
while (fs.existsSync(`${TARGET}.bak${bakIdx}`)) bakIdx++;
fs.writeFileSync(`${TARGET}.bak${bakIdx}`, original);
console.log(`Backup: ${TARGET}.bak${bakIdx}`);

// 4. 문자열-aware brace matcher: src 에서 startIdx 의 '{' 부터 매칭되는 '}' 인덱스 반환
function findClosingBrace(src, startIdx) {
  if (src[startIdx] !== '{') throw new Error(`Expected { at ${startIdx}`);
  let depth = 0;
  let i = startIdx;
  let inStr = false;
  let strQ = '';
  let esc = false;
  while (i < src.length) {
    const ch = src[i];
    if (inStr) {
      if (esc) { esc = false; }
      else if (ch === '\\') { esc = true; }
      else if (ch === strQ) { inStr = false; }
    } else {
      if (ch === '"' || ch === "'" || ch === '`') { inStr = true; strQ = ch; }
      else if (ch === '{') depth++;
      else if (ch === '}') {
        depth--;
        if (depth === 0) return i;
      }
    }
    i++;
  }
  throw new Error(`Unmatched { at ${startIdx}`);
}

// 5. dupes 직렬화 (TS object literal 호환)
function serializeDupes(dupesObj, baseIndent) {
  // baseIndent = 'dupes:' 라인 시작 칸 수 (보통 8칸)
  const pad = ' '.repeat(baseIndent);
  const padCC = ' '.repeat(baseIndent + 2);
  const padDupe = ' '.repeat(baseIndent + 4);

  let out = '{\n';
  for (const cc of ['JP', 'CN']) {
    out += `${padCC}${cc}: `;
    const arr = Array.isArray(dupesObj[cc]) ? dupesObj[cc] : [];
    if (arr.length === 0) {
      out += '[],\n';
    } else {
      out += '[\n';
      for (const dupe of arr) {
        // JSON.stringify 결과를 padDupe 들여쓰기로 다시 정렬
        const json = JSON.stringify(dupe, null, 2);
        const indented = json
          .split('\n')
          .map((ln, idx) => (idx === 0 ? padDupe + ln : padDupe + ln))
          .join('\n');
        out += indented + ',\n';
      }
      out += `${padCC}],\n`;
    }
  }
  out += `${pad}}`;
  return out;
}

// 6. 음식 별로 id → dupes 블록 위치 찾고 교체
// 단일 패스: 뒤에서부터 교체 (인덱스 무효화 방지)
const idRegex = /(^[ \t]+)id:\s*"([^"]+)",/gm;
const matches = [];
let m;
while ((m = idRegex.exec(original)) !== null) {
  matches.push({ idx: m.index, indent: m[1].length, id: m[2], headerEnd: m.index + m[0].length });
}
console.log(`Found ${matches.length} id: lines in food-dupes.ts`);

// 각 음식의 다음 음식까지의 범위 = 음식 블록 전체 영역
// (지역 entry 도 id 가 없어 안전)
let merged = original;
let replaced = 0;
let skipped = 0;
const missingInBatch = [];

for (let i = matches.length - 1; i >= 0; i--) {
  const cur = matches[i];
  const next = matches[i + 1];
  const blockEnd = next ? next.idx : merged.length;
  // dupes: { 위치 찾기 (이 음식 블록 내에서)
  const blockSlice = merged.slice(cur.idx, blockEnd);
  const dupesMatch = blockSlice.match(/\n([ \t]+)dupes:\s*\{/);
  if (!dupesMatch) {
    console.error(`ERROR: dupes: block not found for id=${cur.id}`);
    process.exit(1);
  }
  const dupesIndent = dupesMatch[1].length;
  const dupesRelIdx = blockSlice.indexOf(dupesMatch[0]) + dupesMatch[0].length - 1; // '{' 위치
  const dupesAbsIdx = cur.idx + dupesRelIdx;
  const closeIdx = findClosingBrace(merged, dupesAbsIdx);

  if (!(cur.id in dupesById)) {
    missingInBatch.push(cur.id);
    skipped++;
    continue;
  }

  const newDupesText = serializeDupes(dupesById[cur.id], dupesIndent);
  merged = merged.slice(0, dupesAbsIdx) + newDupesText + merged.slice(closeIdx + 1);
  replaced++;
}

if (missingInBatch.length > 0) {
  console.error(`ERROR: ${missingInBatch.length} ids in food-dupes.ts but not in batches:`);
  console.error(missingInBatch.slice(0, 20));
  process.exit(1);
}

console.log(`Replaced: ${replaced}`);
console.log(`Skipped (no batch entry): ${skipped}`);

// 7. 결과 쓰기
fs.writeFileSync(TARGET, merged);
console.log(`Wrote: ${TARGET}`);

// 8. 통계
let jpWith = 0, cnWith = 0, jpEmpty = 0, cnEmpty = 0, jpTotal = 0, cnTotal = 0;
for (const id of Object.keys(dupesById)) {
  const d = dupesById[id];
  if ((d.JP || []).length > 0) { jpWith++; jpTotal += d.JP.length; } else jpEmpty++;
  if ((d.CN || []).length > 0) { cnWith++; cnTotal += d.CN.length; } else cnEmpty++;
}

console.log('\n=== 통계 ===');
console.log(`총 음식 수: ${matches.length}`);
console.log(`머지된 음식 수: ${replaced}`);
console.log(`JP 후보 보유 음식: ${jpWith} / 빈: ${jpEmpty} (총 후보 ${jpTotal})`);
console.log(`CN 후보 보유 음식: ${cnWith} / 빈: ${cnEmpty} (총 후보 ${cnTotal})`);
console.log(`평균 JP 후보 (보유 음식 기준): ${(jpTotal / Math.max(jpWith, 1)).toFixed(2)}`);
console.log(`평균 CN 후보 (보유 음식 기준): ${(cnTotal / Math.max(cnWith, 1)).toFixed(2)}`);
console.log(`평균 후보 (전체 음식, JP+CN): ${((jpTotal + cnTotal) / matches.length).toFixed(2)}`);
