function detectMultipleVersions(dependencies) {
    return Object.entries(dependencies)
      .filter(([_, versions]) => versions.length > 1)
      .map(([pkg, versions]) => ({
        package: pkg,
        versions: versions.map(v => v.version)
      }));
}
  
export { detectMultipleVersions };