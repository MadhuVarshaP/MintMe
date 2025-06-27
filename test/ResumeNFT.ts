import { expect } from "chai";
import hre from "hardhat";
import { MintMeResume } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

const { ethers } = hre;

describe("MintMeResume", function () {
  let resumeNFT: MintMeResume;
  let owner: HardhatEthersSigner;
  let addr1: HardhatEthersSigner;
  let addr2: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const MintMeResumeFactory = await ethers.getContractFactory("MintMeResume");
    resumeNFT = await MintMeResumeFactory.deploy();
    await resumeNFT.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right name and symbol", async function () {
      expect(await resumeNFT.name()).to.equal("MintMe Resume");
      expect(await resumeNFT.symbol()).to.equal("MINTME");
    });

    it("Should set the right owner", async function () {
      expect(await resumeNFT.owner()).to.equal(owner.address);
    });

    it("Should start with zero total supply", async function () {
      expect(await resumeNFT.totalSupply()).to.equal(0);
    });
  });

  describe("Minting", function () {
    it("Should mint a resume NFT", async function () {
      const tokenURI = "https://example.com/resume1.json";
      const devScore = 85;

      await expect(resumeNFT.connect(addr1).mintResume(tokenURI, devScore))
        .to.emit(resumeNFT, "ResumeMinted")
        .withArgs(addr1.address, 1, tokenURI, devScore);

      expect(await resumeNFT.totalSupply()).to.equal(1);
      expect(await resumeNFT.ownerOf(1)).to.equal(addr1.address);
      expect(await resumeNFT.tokenURI(1)).to.equal(tokenURI);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(await resumeNFT.hasMinted(addr1.address)).to.be.true;
    });

    it("Should prevent double minting", async function () {
      const tokenURI = "https://example.com/resume1.json";
      const devScore = 85;

      await resumeNFT.connect(addr1).mintResume(tokenURI, devScore);

      await expect(
        resumeNFT.connect(addr1).mintResume(tokenURI, devScore)
      ).to.be.revertedWith("Already minted");
    });

    it("Should store version history on mint", async function () {
      const tokenURI = "https://example.com/resume1.json";
      const devScore = 85;

      await resumeNFT.connect(addr1).mintResume(tokenURI, devScore);

      const versionHistory = await resumeNFT.getVersionHistory(1);
      expect(versionHistory.length).to.equal(1);
      expect(versionHistory[0].metadataUri).to.equal(tokenURI);
      expect(versionHistory[0].devScore).to.equal(devScore);
    });
  });

  describe("Updating Resume", function () {
    beforeEach(async function () {
      const tokenURI = "https://example.com/resume1.json";
      const devScore = 85;
      await resumeNFT.connect(addr1).mintResume(tokenURI, devScore);
    });

    it("Should update resume URI and score", async function () {
      const newTokenURI = "https://example.com/resume1-updated.json";
      const newScore = 90;

      await expect(resumeNFT.connect(addr1).updateResumeURI(1, newTokenURI, newScore))
        .to.emit(resumeNFT, "ResumeUpdated")
        .withArgs(1, newTokenURI, newScore);

      expect(await resumeNFT.tokenURI(1)).to.equal(newTokenURI);

      const versionHistory = await resumeNFT.getVersionHistory(1);
      expect(versionHistory.length).to.equal(2);
      expect(versionHistory[1].metadataUri).to.equal(newTokenURI);
      expect(versionHistory[1].devScore).to.equal(newScore);
    });

    it("Should prevent non-owner from updating", async function () {
      const newTokenURI = "https://example.com/resume1-updated.json";
      const newScore = 90;

      await expect(
        resumeNFT.connect(addr2).updateResumeURI(1, newTokenURI, newScore)
      ).to.be.revertedWith("Not token owner");
    });
  });

  describe("Soulbound Behavior", function () {
    beforeEach(async function () {
      const tokenURI = "https://example.com/resume1.json";
      const devScore = 85;
      await resumeNFT.connect(addr1).mintResume(tokenURI, devScore);
    });

    it("Should prevent transfers", async function () {
      await expect(
        resumeNFT.connect(addr1).transferFrom(addr1.address, addr2.address, 1)
      ).to.be.revertedWith("Soulbound: non-transferable");
    });

    it("Should prevent safe transfers", async function () {
      await expect(
        resumeNFT.connect(addr1)["safeTransferFrom(address,address,uint256)"](
          addr1.address,
          addr2.address,
          1
        )
      ).to.be.revertedWith("Soulbound: non-transferable");
    });
  });

  describe("Version History", function () {
    it("Should track multiple versions", async function () {
      const tokenURI1 = "https://example.com/resume1-v1.json";
      const tokenURI2 = "https://example.com/resume1-v2.json";
      const tokenURI3 = "https://example.com/resume1-v3.json";

      await resumeNFT.connect(addr1).mintResume(tokenURI1, 80);
      await resumeNFT.connect(addr1).updateResumeURI(1, tokenURI2, 85);
      await resumeNFT.connect(addr1).updateResumeURI(1, tokenURI3, 90);

      const versionHistory = await resumeNFT.getVersionHistory(1);
      expect(versionHistory.length).to.equal(3);
      
      expect(versionHistory[0].metadataUri).to.equal(tokenURI1);
      expect(versionHistory[0].devScore).to.equal(80);
      
      expect(versionHistory[1].metadataUri).to.equal(tokenURI2);
      expect(versionHistory[1].devScore).to.equal(85);
      
      expect(versionHistory[2].metadataUri).to.equal(tokenURI3);
      expect(versionHistory[2].devScore).to.equal(90);

      expect(await resumeNFT.getVersionCount(1)).to.equal(3);
    });
  });
});