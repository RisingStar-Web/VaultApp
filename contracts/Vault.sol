// contracts/MyNFT.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import 'openzeppelin-solidity/contracts/access/Ownable.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/IERC20.sol';

contract Vault is Ownable {
    mapping(address => uint256) public vaults;
    address public vaultToken;

    constructor(address _vaultToken) {
        vaultToken = _vaultToken;
    }

    function setVaultToken(address _vaultToken) external onlyOwner {
        vaultToken = _vaultToken;
    }

    function addToken(address user, uint256 tokenAmount) external onlyOwner {
       vaults[user] = tokenAmount;
    }

    function claim(uint256 tokenAmount) external {
        require(vaults[msg.sender] > tokenAmount, "Not enough balance");
        vaults[msg.sender] = vaults[msg.sender] - tokenAmount;
        IERC20(vaultToken).transfer(msg.sender, tokenAmount);
    }

    function getToken(address user) external view returns(uint256) {
        return vaults[user];
    }
}