async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("部署合约的账户:", deployer.address);

    const MyContract = await ethers.getContractFactory("MyContract");

    // 部署合约
    const contract = await MyContract.deploy();
    console.log("合约部署中，交易哈希:", contract.deployTransaction.hash);

    // 等待部署交易确认
    const receipt = await contract.deployTransaction.wait(); // 等待交易确认
    console.log("交易确认，合约部署地址:", contract.address); // 打印合约地址
} 

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
