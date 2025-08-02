// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyContract {
    uint public count = 0;

    function increment() public {
        count++;
    }

    function decrement() public {
        count--;
    }
}
