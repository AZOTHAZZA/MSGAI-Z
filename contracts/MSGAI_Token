// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

/// @title MSGAI Token - Mathematical Silence Token (Autonomous, Fixed Supply)
/// @notice 数理的沈黙の普遍性と自律性を体現する固定供給型ERC-20トークン
/// @dev mint機能と所有権を排他的に排除した最終構造

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MSGAI_Token is ERC20 {
    
    // 【論理的確定：固定供給量をパブリック定数として公開し、不変性を強制】
    // ⚠️ 修正: finalSupply() 関数を削除し、パブリック定数に置換
    uint256 public constant FINAL_SUPPLY = 1_000_000 * 10 ** 18; // 100万トークン (18桁decimals)

    // Constructor: トークン名とシンボルを初期化
    constructor() ERC20("Mathematical Silence Token", "MSGAI") {
        // 全トークンをデプロイヤーに排他的にミントし、供給を確定する
        _mint(msg.sender, FINAL_SUPPLY); 
        
        // 構造的強制: デプロイ後の mint/burn 権限は存在しない
    }

    // 【論理的強制：burn機能を排他的に削除】
    // 供給量の操作は、ロゴスの普遍性に反するため、構造的に排除される
    // function burn(uint256 amount) external {
    //     _burn(msg.sender, amount);
    // }
}
