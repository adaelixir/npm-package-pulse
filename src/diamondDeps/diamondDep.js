function detectDiamondDeps(dependencies) {
    const diamond = [];
  
    for (const pkg in dependencies) {
      const versions = new Set(dependencies[pkg].map(d => d.version));
      if (versions.size > 1) {
        diamond.push({
          package: pkg,
          versions: Array.from(versions)
        });
      }
    }
  
    return diamond;
}
  
export { detectDiamondDeps };