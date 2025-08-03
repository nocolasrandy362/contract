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
