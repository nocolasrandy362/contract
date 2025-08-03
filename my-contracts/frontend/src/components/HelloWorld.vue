<template>
  <div>
    <h2>Current Count: {{ count }}</h2>
    <button @click="incrementCount">Increment</button>
    <button @click="decrementCount">Decrement</button>

    <!-- 显示交易信息 -->
    <div v-if="transactionHash">
      <h3>Transaction Details:</h3>
      <p><strong>Transaction Hash:</strong> {{ transactionHash }}</p>
      <p><strong>Gas Used:</strong> {{ gasUsed }} gas</p>
      <p><strong>Gas Price:</strong> {{ gasPrice }} Gwei</p>
      <p><strong>Total Fee:</strong> {{ totalFee }} ETH</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { ethers } from 'ethers';

// 合约地址和 ABI
const contractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'; // 需要替换为实际部署后的合约地址
const contractABI = [
  "function increment() public",
  "function decrement() public",
  "function count() public view returns (uint)"
];

export default {
  setup() {
    const count = ref(0);  // 用来展示当前计数
    const provider = ref(null);
    const contract = ref(null);
    const signer = ref(null);

    const transactionHash = ref(null); // 用来保存交易哈希
    const gasUsed = ref(null); // 用来保存实际消耗的 Gas
    const gasPrice = ref(null); // 用来保存 Gas 价格
    const totalFee = ref(null); // 用来保存总费用（ETH）

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

    // 增加计数
    const incrementCount = async () => {
      try {
        const tx = await contract.value.increment();
        console.log('increase Detail',tx)
        transactionHash.value = tx.hash; // 保存交易哈希
        await tx.wait(); // 等待交易确认

        // 获取交易信息
        const receipt = await provider.value.getTransactionReceipt(tx.hash);
        gasUsed.value = receipt.gasUsed.toString(); // 获取实际消耗的 Gas
        gasPrice.value = ethers.utils.formatUnits(await provider.value.getGasPrice(), 'gwei'); // 获取 Gas Price（单位：Gwei）
        const totalFeeInWei = receipt.gasUsed.mul(await provider.value.getGasPrice()); // 计算总费用
        totalFee.value = ethers.utils.formatEther(totalFeeInWei); // 转换为 ETH

        updateCount(); // 更新计数
      } catch (error) {
        console.error("Error incrementing count:", error);
      }
    };

    // 减少计数
    const decrementCount = async () => {
      try {
        const tx = await contract.value.decrement();
        transactionHash.value = tx.hash; // 保存交易哈希
        await tx.wait(); // 等待交易确认

        // 获取交易信息
        const receipt = await provider.value.getTransactionReceipt(tx.hash);
        gasUsed.value = receipt.gasUsed.toString(); // 获取实际消耗的 Gas
        gasPrice.value = ethers.utils.formatUnits(await provider.value.getGasPrice(), 'gwei'); // 获取 Gas Price（单位：Gwei）
        const totalFeeInWei = receipt.gasUsed.mul(await provider.value.getGasPrice()); // 计算总费用
        totalFee.value = ethers.utils.formatEther(totalFeeInWei); // 转换为 ETH

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
      decrementCount,
      transactionHash,
      gasUsed,
      gasPrice,
      totalFee
    };
  }
};
</script>

<style scoped>
button {
  margin-right: 10px;
}
</style>
