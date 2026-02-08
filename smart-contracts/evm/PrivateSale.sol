// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

contract PrivateSale {
    IERC20 public immutable usdt;
    address public treasury;
    address public owner;
    uint256 public tokenPriceUsd; // price in USD with 1e2 precision (e.g., $0.10 = 10)
    uint8 public usdtDecimals;
    uint8 public tokenDecimals;
    uint256 public totalSupply;
    uint256 public totalSold;
    bool public isPaused;

    mapping(address => uint256) public purchased;

    event Purchased(address indexed buyer, uint256 usdtAmount, uint256 tokensAllocated);
    event TreasuryUpdated(address indexed newTreasury);
    event PriceUpdated(uint256 newPrice);
    event Paused(bool status);

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    constructor(
        address usdtAddress,
        address treasuryAddress,
        uint256 initialPrice,
        uint256 supply,
        uint8 usdtDecimals_,
        uint8 tokenDecimals_
    ) {
    constructor(address usdtAddress, address treasuryAddress, uint256 initialPrice, uint256 supply) {
        require(usdtAddress != address(0), "invalid usdt");
        require(treasuryAddress != address(0), "invalid treasury");
        usdt = IERC20(usdtAddress);
        treasury = treasuryAddress;
        owner = msg.sender;
        tokenPriceUsd = initialPrice;
        totalSupply = supply;
        usdtDecimals = usdtDecimals_;
        tokenDecimals = tokenDecimals_;
    }

    function buy(uint256 usdtAmount) external {
        require(!isPaused, "sale paused");
        require(usdtAmount > 0, "invalid amount");
        uint256 tokensAllocated = (usdtAmount * (10 ** tokenDecimals) * 100) / tokenPriceUsd / (10 ** usdtDecimals);
        uint256 tokensAllocated = (usdtAmount * 100) / tokenPriceUsd;
        require(totalSold + tokensAllocated <= totalSupply, "sold out");

        bool ok = usdt.transferFrom(msg.sender, treasury, usdtAmount);
        require(ok, "transfer failed");

        purchased[msg.sender] += tokensAllocated;
        totalSold += tokensAllocated;
        emit Purchased(msg.sender, usdtAmount, tokensAllocated);
    }

    function setTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "invalid treasury");
        treasury = newTreasury;
        emit TreasuryUpdated(newTreasury);
    }

    function setTokenPriceUsd(uint256 newPrice) external onlyOwner {
        require(newPrice > 0, "invalid price");
        tokenPriceUsd = newPrice;
        emit PriceUpdated(newPrice);
    }

    function setPaused(bool status) external onlyOwner {
        isPaused = status;
        emit Paused(status);
    }
}
