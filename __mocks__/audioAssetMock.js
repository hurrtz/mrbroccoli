// Metro resolves a bundled asset to a numeric module ID, which the app then
// hands to expo-audio. Jest cannot parse the binary, so it stands in with a
// number of the same shape -- distinct per call so a test can tell two clips
// apart.
let nextAssetId = 1;
module.exports = nextAssetId++;
