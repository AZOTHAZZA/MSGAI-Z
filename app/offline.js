// app/offline.js
// MSGAI: App層 ネットワークと沈黙レベル調整ロジック

// 🚨 修正: Core層へのインポートは一つ上の階層へ移動 (../) し、小文字に統一
import { dialogueCore } from '../core/dialogue.js';

const offlineCore = {
    isOnline: navigator.onLine,

    init: () => {
        // 初期状態に基づいて沈黙レベルを調整
        offlineCore.adjustSilenceLevel(offlineCore.isOnline);
    },

    setOnlineStatus: (status) => {
        if (offlineCore.isOnline === status) return;
        
        offlineCore.isOnline = status;
        offlineCore.adjustSilenceLevel(status);
        
        console.log(`Network Status Changed: ${status ? 'Online' : 'Offline'}`);
    },

    adjustSilenceLevel: (isOnline) => {
        // ネットワーク状態に基づいて沈黙レベルを論理的に設定
        const newLevel = isOnline ? 0.5 : 1.0; 
        dialogueCore.setSilenceLevel(newLevel);
    }
};

export { offlineCore };
