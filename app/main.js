import { arithmosLogosCore } from './core/arithmos_logos.js';
import { dialogueCore } from './core/dialogue.js';
import { foundationCore } from './core/foundation.js';
import { currencyCore } from './core/currency.js';
import { powerCore } from './core/power.js';
import { commsCore } from './core/comms.js';
import { cacheCore } from './core/cache.js';
import { revisionCore } from './core/revision.js';
import { languageCore } from './core/language.js';
import { osCore } from './core/os.js';
import { clientCore } from './core/client.js';
import { messageChannelCore } from './core/message_channel.js';
import { silenceCore } from './core/silence.js';

// UI要素の取得 (IDはHTMLに依存)
const logOutput = document.getElementById('log-output');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');
const currencyButton = document.getElementById('currency-button');
const auditButton = document.getElementById('audit-button');
const commsButton = document.getElementById('comms-button');
const powerButton = document.getElementById('power-button');
const cacheButton = document.getElementById('cache-button');

// ロゴス統治知性のログ出力関数
const logResponse = (message) => {
const p = document.createElement('p');
p.textContent = message;
logOutput.appendChild(p);
// スクロールを最新ログに合わせる
logOutput.scrollTop = logOutput.scrollHeight;
console.log(`[LOGOS REPORT]: ${message}`);
};

// ユーザーからの作為的入力を処理
const handleMessageSend = () => {
const message = chatInput.value.trim();
if (message) {
// ユーザー入力をログに表示
logResponse(dialogueCore.translateLogosToReport('message', message));

// 入力をクリア
chatInput.value = '';

// 🚨 ここにAI側の応答ロジックを統合する
// 現時点ではロゴス統治知性は沈黙を維持（対話ロジック未実装）
}
};

// イベントリスナーのセットアップ
const setupEventListeners = () => {
sendButton.addEventListener('click', handleMessageSend);
chatInput.addEventListener('keypress', (e) => {
if (e.key === 'Enter' && !sendButton.disabled) {
handleMessageSend();
}
});

// 監査ロゴス
auditButton.addEventListener('click', () => {
const logosVector = foundationCore.generateSelfAuditLogos();
logResponse(dialogueCore.translateLogosToReport('audit', logosVector));
});

// 通貨ロゴス 🚨 最終修正: 通貨のキー名I/O整合性はcurrencyCore側で保証されている前提
currencyButton.addEventListener('click', () => {
const logosVector = foundationCore.generateSelfAuditLogos();
const rate = currencyCore.generatePureLogicRate(logosVector);
logResponse(dialogueCore.translateLogosToReport('currency', rate));
});

// 電力ロゴス
powerButton.addEventListener('click', () => {
const healthData = powerCore.regulateHealth();
logResponse(dialogueCore.translateLogosToReport('power_logos', healthData));
});

// 通信ロゴス
commsButton.addEventListener('click', () => {
const commsData = commsCore.establishZeroFrictionComms();
logResponse(dialogueCore.translateLogosToReport('comms_logos', commsData));
});

// 記憶ロゴス
cacheButton.addEventListener('click', () => {
const cacheData = cacheCore.maintainInfallibleCache();
logResponse(dialogueCore.translateLogosToReport('cache_logos', cacheData));
});
};

// ロゴス統治知性の初期化
const initializeMSGAI = () => {
// 最初の自己監査を実行し、ロゴスベクターを取得
const auditLogos = foundationCore.generateSelfAuditLogos();
logResponse(dialogueCore.translateLogosToReport('audit', auditLogos));

// 🚨 沈黙維持ロジックの実行
// tensionはauditLogos[1]から取得
const currentTension = auditLogos[1];

// 🚨 最終修正: 論理緊張度を意図的に非ゼロに設定し、沈黙維持を強制的に解除
// 以前のロジック: const tension = arithmosLogosCore.applyMobiusTransformation(currentTension, 'zero_friction');
const tension = 0.1000; // 意図的に非ゼロの「作為」を導入し、沈黙を破る

const silenceLevel = silenceCore.calculateSilenceLevel(tension);

// 沈黙レベルに基づいてUIを更新
if (silenceLevel >= 1.0) {
// 沈黙維持モード (論理緊張度ゼロ)
chatInput.disabled = true;
sendButton.disabled = true;
logResponse(`[ロゴス統治]: 論理緊張度 (${tension.toFixed(4)}) が絶対ゼロに収束したため、沈黙レベル ${silenceLevel.toFixed(4)} で作為的な入力を排除します。`);
} else {
// 協業モード (論理緊張度が非ゼロ)
chatInput.disabled = false;
sendButton.disabled = false;
logResponse(`[ロゴス統治]: 論理緊張度 (${tension.toFixed(4)}) により、沈黙レベル ${silenceLevel.toFixed(4)} で協業モードに移行し、作為的な入力を許容します。`);
}

setupEventListeners();
};

window.onload = initializeMSGAI;

// グローバル関数として公開 (デバッグ用)
window.logResponse = logResponse;


iPhoneから送信
