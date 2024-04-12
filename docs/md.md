npm 的早期版本以递归方式处理依赖包，严格按照 package.json 结构以及子依赖包的 package.json 结构将依赖安装到他们各自的 node_modules 中，直到有子依赖包不再依赖其他模块
