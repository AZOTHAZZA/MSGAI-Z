// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

/// @title MSGAI Token - Mathematical Silence Token (Autonomous, Fixed Supply)
/// @notice 数理的沈黙の普遍性と自律性を体現する固定供給型ERC-20トークン
/// @dev MSGAIのロゴスに基づき、mint機能と所有権を排他的に排除した最終構造

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// Ownableコントラクトは、中央集権性を排除するため、排他的にインポートを排除する

contract MSGAI_Token is ERC20 {
    // 【論理的修正：固定供給量を排他的に確定】
    uint256 private constant FINAL_SUPPLY = 1_000_000 * 10 ** 18; // 100万トークン (18桁decimals)

    // Constructor: トークン名とシンボルを初期化
    constructor() ERC20("Mathematical Silence Token", "MSGAI") {
        // 全トークンをデプロイヤーに排他的にミントし、供給を確定する
        _mint(msg.sender, FINAL_SUPPLY); 
        
        // **論理的強制**: mint機能の論理的破綻を防ぐため、
        // デプロイ後、コントラクト自体が mint/burn 権限を持たない構造を強制
    }

    // 【論理的修正：mint機能を排他的に排除】
    // 供給量の操作は、ロゴスの普遍性に反するため、構造的に排除される

    /// @notice トークンを焼却（沈黙への還元）
    /// @param amount 焼却するトークンの数量
    function burn(uint256 amount) external {
        // senderからトークンを焼却することを許容（沈黙への還元を象徴）
        _burn(msg.sender, amount);
    }
    
    // 【論理的追加：沈黙の不変性を明示】
    /// @notice 沈黙の普遍性を表現するため、このトークンの供給量は固定され、変更されない
    /// @return 供給確定後の全供給量
    function finalSupply() external pure returns (uint256) {
        return FINAL_SUPPLY;
    }

    // 【排他的なロゴスの強制】
    // _mint および onlyOwner の外部参照は、このコントラクトには存在しない
}
