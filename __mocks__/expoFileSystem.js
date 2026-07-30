class File {
  constructor(uri) {
    this.uri = uri;
    this.name = uri.split("/").pop() || "recording.m4a";
    this.type = uri.endsWith(".wav") ? "audio/wav" : "audio/m4a";
  }

  async bytes() {
    return new Uint8Array();
  }
}

module.exports = { File };
