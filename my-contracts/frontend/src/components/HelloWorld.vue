<template>
  <div>
    <h2>Current Count: {{ count }}</h2>
    <button @click="incrementCount">Increment</button>
    <button @click="decrementCount">Decrement</button>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { ethers } from 'ethers';

// 合约地址和 ABI
const contractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'; // 需要替换为实际部署后的合约地址
const contractABI = [
    {
      "inputs": [],
      "name": "count",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decrement",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "increment",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

export default {
  setup() {
    const count = ref(0);  // 用来展示当前计数
    const provider = ref(null);
    const contract = ref(null);
    const signer = ref(null);

    // 初始化合约
    const initializeContract = async () => {
      // 连接到以太坊主网，或者是本地网络
      const providerInstance = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545"); // 使用本地 Hardhat 网络
      provider.value = providerInstance;

      // 获取用户的签名账户
      const signerInstance = providerInstance.getSigner();
      signer.value = signerInstance;

      // 初始化合约实例
      const contractInstance = new ethers.Contract(contractAddress, contractABI, signerInstance);
      contract.value = contractInstance;

      // 获取当前的计数
      const currentCount = await contractInstance.count();
      count.value = currentCount.toNumber(); // 更新组件中的 count
    };

    async function getBalanceDetail (tx) {
      const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545"); // 或者使用主网RPC URL
      // 假设我们有一个交易对象 tx，获取交易发起者的地址
      console.log(`Transaction sent by: ${tx.from}`);  // 获取发起交易的账户地址
      // 获取交易发起者的余额（单位：wei）
      const balanceWei = await provider.getBalance(tx.from);
      // 将余额从 wei 转换为 ETH（1 ETH = 10^18 wei）
      const balanceEth = ethers.utils.formatEther(balanceWei);
      console.log(`Balance of ${tx.from}: ${balanceEth} ETH`);
    }


    async function getTransactionDetails(txHash) {
      // 获取交易收据
      const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545"); // 或者使用主网RPC URL
      const receipt = await provider.getTransactionReceipt(txHash);
      if (!receipt) {
        console.log("Transaction not found!");
        return;
      }

      // 获取实际消耗的 Gas
      const gasUsed = receipt.gasUsed.toString();

      // 获取当前的 Gas Price
      const gasPrice = await provider.getGasPrice();  // 获取 Gas Price（单位：wei）
      const gasPriceInGwei = ethers.utils.formatUnits(gasPrice, 'gwei');  // 转换为 Gwei

      // 计算总费用（单位：ETH）
      const totalFeeInWei = gasUsed * gasPrice;
      const totalFeeInEth = ethers.utils.formatEther(totalFeeInWei.toString());

      // 输出交易费用信息
      console.log(`Gas Used: ${gasUsed} Gas`);
      console.log(`Gas Price: ${gasPriceInGwei} Gwei`);
      console.log(`Total Fee: ${totalFeeInEth} ETH`);
    }

    // 增加计数
    const incrementCount = async () => {
      try {
        const tx = await contract.value.increment();
        getBalanceDetail(tx); // 获取余额详情
        console.log("Transaction Hash:", tx.hash)
        getTransactionDetails(tx.hash); // 获取交易详情
        await tx.wait(); // 等待交易确认
        updateCount(); // 更新计数
      } catch (error) {
        console.error("Error incrementing count:", error);
      }
    };

    // 减少计数
    const decrementCount = async () => {
      try {
        const tx = await contract.value.decrement();
        getBalanceDetail(tx); // 获取余额详情
        getTransactionDetails(tx.hash); // 获取交易详情
        await tx.wait(); // 等待交易确认
        updateCount(); // 更新计数
      } catch (error) {
        console.error("Error decrementing count:", error);
      }
    };

    // 更新计数
    const updateCount = async () => {
      const currentCount = await contract.value.count();
      count.value = currentCount.toNumber(); // 更新计数
    };

    // 在组件挂载时初始化合约
    onMounted(() => {
      initializeContract();
    });

    // 返回绑定到模板中的响应式变量和方法
    return {
      count,
      incrementCount,
      decrementCount
    };
  }
};
</script>

<style scoped>
button {
  margin-right: 10px;
}
</style>
