// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Context.sol";

contract MintMeResume is ERC721, ERC721URIStorage, Ownable {
    uint256 public totalSupply;
    mapping(address => bool) public hasMinted;

    //  Struct now includes reputation score
    struct VersionRecord {
        string metadataUri;
        uint256 timestamp;
        uint256 devScore; 
    }

    // tokenId => array of resume versions
    mapping(uint256 => VersionRecord[]) private _tokenVersionHistory;

    event ResumeMinted(address indexed owner, uint256 tokenId, string tokenURI, uint256 devScore);
    event ResumeUpdated(uint256 indexed tokenId, string newTokenURI, uint256 devScore);

    constructor() 
        ERC721("MintMe Resume", "MINTME") 
        Ownable(_msgSender())
    {}

    ///  Add reputation score while minting
    function mintResume(string memory _tokenURI, uint256 _devScore) external {
        require(!hasMinted[_msgSender()], "Already minted");

        totalSupply++;
        uint256 tokenId = totalSupply;

        _safeMint(_msgSender(), tokenId);
        _setTokenURI(tokenId, _tokenURI);
        hasMinted[_msgSender()] = true;

        _tokenVersionHistory[tokenId].push(
            VersionRecord(_tokenURI, block.timestamp, _devScore)
        );

        emit ResumeMinted(_msgSender(), tokenId, _tokenURI, _devScore);
    }

    ///  Update resume URI + score
    function updateResumeURI(uint256 tokenId, string memory newTokenURI, uint256 newScore) external {
        require(ownerOf(tokenId) == _msgSender(), "Not token owner");

        _setTokenURI(tokenId, newTokenURI);

        _tokenVersionHistory[tokenId].push(
            VersionRecord(newTokenURI, block.timestamp, newScore)
        );

        emit ResumeUpdated(tokenId, newTokenURI, newScore);
    }

    ///  Public getter: return full version history
    function getVersionHistory(uint256 tokenId) external view returns (VersionRecord[] memory) {
        return _tokenVersionHistory[tokenId];
    }

    function getVersionCount(uint256 tokenId) external view returns (uint256) {
        return _tokenVersionHistory[tokenId].length;
    }

    ///  Soulbound behavior: block transfers
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override(ERC721) returns (address) {
        address from = _ownerOf(tokenId);

        if (from != address(0) && to != address(0)) {
            revert("Soulbound: non-transferable");
        }

        return super._update(to, tokenId, auth);
    }

    /// Required overrides
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
