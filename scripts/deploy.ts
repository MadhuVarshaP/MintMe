import hre from "hardhat";

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  const MintMeResume = await hre.ethers.getContractFactory("MintMeResume");
  const resumeNFT = await MintMeResume.deploy();

  await resumeNFT.waitForDeployment();

  const contractAddress = await resumeNFT.getAddress();
  console.log("MintMeResume deployed to:", contractAddress);

  // Verify the contract on Etherscan (if on a public network)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("Waiting for block confirmations...");
    await resumeNFT.deploymentTransaction()?.wait(6);
    
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("Contract verified on Etherscan");
    } catch (error) {
      console.log("Error verifying contract:", error);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });