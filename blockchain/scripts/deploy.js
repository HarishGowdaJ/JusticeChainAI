async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const CaseStorage = await ethers.getContractFactory("CaseStorage");
  const caseStorage = await CaseStorage.deploy();
  await caseStorage.deployed();

  console.log("CaseStorage deployed to:", caseStorage.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
