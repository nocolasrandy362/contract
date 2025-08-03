my-project/
├── contracts/                   # 智能合约源代码
│   └── MyContract.sol
├── frontend/                    # 前端项目（Vue 3 应用）
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/          # 合约交互组件
│   │   ├── App.vue              # 根组件
│   │   ├── main.js              # 入口文件
│   ├── package.json             # 前端依赖和脚本配置
│   ├── vite.config.js           # Vite 配置文件
│   └── index.html               # 项目的主 HTML 文件
├── scripts/                     # Hardhat 部署脚本
│   └── deploy.js                # 部署脚本
├── hardhat.config.js            # Hardhat 配置文件
├── package.json                 # 根项目的 npm 配置文件
└── README.md                    # 项目说明文档
# contract


<!-- 启动 Hardhat 网络     jingbozhang@jingbodeMacBook-Air my-contracts % npx hardhat node  -->
npx hardhat node

<!-- 运行部署脚本          -->
npx hardhat run scripts/deploy.js --network localhost








启动本地合约并进行部署，主要涉及以下几个步骤。我们可以分为 **环境准备** 和 **合约部署** 两部分来复盘。

### 1. **环境准备**

#### 1.1 安装 Node.js 和 NPM

#### 1.2 初始化项目

在你的项目目录下初始化一个 Node.js 项目，并安装所需的依赖
mkdir my-contracts
cd my-contracts
#### 1.3 安装 Hardhat 和依赖
安装 **Hardhat** 及其相关工具（如 `ethers.js` 和 `hardhat-ethers` 插件），它们是用来编译、部署和测试智能合约的核心工具。
npm install --save-dev hardhat
npm install --save-dev @nomicfoundation/hardhat-ethers ethers

#### 1.4 创建 Hardhat 项目

初始化一个 Hardhat 项目（这会自动生成项目所需的基本结构）：
npx hardhat
选择 "Create a basic sample project" 选项，然后按提示安装依赖。成功后，你会看到一个包含合约、脚本、配置文件等的项目结构。

### 2. **编写和编译合约**

#### 2.1 编写智能合约
在 `contracts` 目录下创建或修改你的智能合约。比如，创建一个简单的 `MyContract.sol` 合约：

#### 2.2 编译合约
编译合约生成 ABI 和字节码。确保你在项目根目录下运行以下命令：
npx hardhat compile
这会在 `artifacts` 目录下生成编译后的合约文件（`abi` 和 `bytecode`）。

### 3. **部署合约到本地 Hardhat 网络**

#### 3.1 启动本地 Hardhat 网络
启动本地 Hardhat 测试网络（它会模拟一个真实的以太坊网络）。运行：

npx hardhat node
这将启动一个本地 Ethereum 节点，并生成一组 **预设的账户**，它们每个都包含大量的测试 ETH。默认的 RPC 地址是 `http://127.0.0.1:8545/`。

你会看到一组账户和它们的私钥，类似于：

Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

#### 3.2 编写部署脚本
在 `scripts` 目录下创建一个部署脚本，类似于 `deploy.js`

#### 3.3 部署合约到本地网络
在新的终端窗口中，保持本地 Hardhat 网络运行，使用以下命令部署你的合约：
npx hardhat run scripts/deploy.js --network localhost
你会看到合约部署的输出，包括合约的部署地址：

```text
Deploying contracts with the account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Contract deployed to: 0x1234567890abcdef1234567890abcdef12345678
```
### 4. **与合约交互**
