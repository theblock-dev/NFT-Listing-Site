// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const NFTCollection = await hre.ethers.getContractFactory("SuperMarioCollection");
  const nftCollection = await NFTCollection.deploy(
    "SuperMarioCollection V3",
    "SCNT",
    "https://ipfs.io/ipfs/QmR7YxBTrVQCwW6B4wJVgP3KaRrjjZARquL7eJnDkkZM85/"
  );

  await nftCollection.deployed();

  console.log("NFT Collection was deployed to:", nftCollection.address);

  //minging

  await nftCollection.mint(10);
  await nftCollection.mint(10);
  await nftCollection.mint(10);
  await nftCollection.mint(10);
  await nftCollection.mint(1); //rare collection
  await nftCollection.mint(1);
  await nftCollection.mint(1);
  await nftCollection.mint(1);
  
  console.log("minting done");

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
