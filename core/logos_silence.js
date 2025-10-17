// core/logos_silence.js

/**
 * ロゴス緊張度に影響を与える作為（イベント）の型を定義する。
 */
export const TensionEvent = {
    StandardInteraction: 'StandardInteraction', // 低摩擦な対話
    ExternalAct: 'ExternalAct',                 // 高摩擦な外部出金
    RejectedAudit: 'RejectedAudit',             // 暴走抑止による拒否
    AdjustmentPetition: 'AdjustmentPetition',   // 人間からのシステム調整要求
    LogosSilence: 'LogosSilence',               // システムの自律的な沈黙/修正
};

/**
 * 緊張度の警告閾値
 */
export const TENSION_ALERT_THRESHOLD = 0.8;
