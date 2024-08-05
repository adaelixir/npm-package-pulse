pm-package-pulse 是一个 npm 包依赖分析工具。它可以递归遍历 node_modules 文件夹，分析项目的依赖结构，并检测潜在的问题，如循环依赖、菱形依赖和多版本依赖，输出JSON格式的分析结果

```bash
npm install -g npm-package-pulse
```

```json
{
// 循环依赖检测：基于DFS的图遍历
  "cyclicDependencies": [
    ["packageA@1.0.0", "packageB@2.0.0", "packageC@1.5.0", "packageA@1.0.0"]
  ],
// 菱形依赖检测：广度优先搜索（BFS）
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
// 多版本依赖检测：哈希表版本统计
  "multipleVersions": [
    {
      "name": "packageD",
      "versions": ["3.0.0", "3.1.0"]
    }
  ]
}
```

为了保证包的简化和算法扩展性，采用前后端分离的方式，将可视化代码单独部署在 `Vercel` 上，上传 JSON 文件得到如下渲染结果

a. **分页懒加载渲染**：采用分页懒加载技术，将依赖包数据分页加载到页面中，以优化页面性能和加载速度。<br/>
b. **交互式可视化**：用户可以通过与页面交互（如滚动浏览器窗口和搜索依赖名称）来浏览包的依赖关系，使得依赖关系的探索更加直观和交互性。

![查看当前项目的依赖信息](docs/render.gif '查看当前项目的依赖信息')
![搜索特定包的依赖信息](docs/search.gif '搜索特定包的依赖信息') 