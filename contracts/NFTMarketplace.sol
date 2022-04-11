//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SuperMarioCollection is ERC1155, Ownable{

    string public name;
    string public symbol;
    uint256 public tokenId;
    string public tokenBaseURI;

    constructor(
        string memory _name, 
        string memory _symbol, 
        string memory _tokenBaseURI
    ) ERC1155(_tokenBaseURI) {
        name = _name;
        symbol = _symbol;
        tokenBaseURI = _tokenBaseURI;        
    }

    function mint(uint256 amount) public onlyOwner() {
        tokenId++;
        _mint(msg.sender, tokenId, amount, "");
    }

    function uri(uint256 _tokenId) public view override returns(string memory) {
        return string(
            abi.encodePacked(
                tokenBaseURI,
                Strings.toString(_tokenId),
                ".json"
            )
        );
    }
}