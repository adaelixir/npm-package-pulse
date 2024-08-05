**npm-package-pulse** 是一个 npm 包依赖分析工具，专注于分析脚本代码 <br/>
通过命令行启动后，递归遍历项目 node_modules 文件夹，分析依赖结构，并检测循环依赖、菱形依赖和多版本依赖，输出JSON格式的结果

为了保证包的最简和算法扩展性，采用前后端分离的方式，将可视化代码单独**部署在 `Vercel` 上**，上传结果文件后便可以得到渲染结果
a. 分页懒加载渲染：采用分页懒加载技术，将依赖包数据分页加载到页面中，以优化页面性能和加载速度<br/>
b. 交互式可视化：用户可以通过与页面交互（如滚动浏览器窗口和搜索依赖名称）来浏览包的依赖关系，使得依赖关系的探索更加直观和交互性

```bash
npm install -g npm-package-pulse
```
![查看当前项目的依赖信息](docs/render.gif '查看当前项目的依赖信息')

```json
{
  "cyclicDependencies": [
    ["packageA@1.0.0", "packageB@2.0.0", "packageC@1.5.0", "packageA@1.0.0"]
  ],
  "diamondDependencies": [
    {
      "start": "packageA@1.0.0",
      "end": "packageD@3.0.0",
      "paths": [
        ["packageA@1.0.0", "packageB@2.0.0", "packageD@3.0.0"],
        ["packageA@1.0.0", "packageC@1.5.0", "packageD@3.0.0"]
      ]
    }
  ],
  "multipleVersions": [
    {
      "name": "packageD",
      "versions": ["3.0.0", "3.1.0"]
    }
  ]
}
```