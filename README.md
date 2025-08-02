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