const entries = new Map();

function uriOf(value) {
  return typeof value === "string" ? value : value.uri;
}

function joinUri(parent, child) {
  return `${parent.replace(/\/$/, "")}/${child}`;
}

class File {
  constructor(...uris) {
    this.uri = uris.map(uriOf).reduce(joinUri);
    this.name = this.uri.split("/").pop() || "recording.m4a";
    this.type = this.uri.endsWith(".wav") ? "audio/wav" : "audio/m4a";
  }

  async bytes() {
    return new Uint8Array();
  }

  get exists() {
    return entries.get(this.uri)?.type === "file";
  }

  create() {
    entries.set(this.uri, { content: "", type: "file" });
  }

  delete() {
    entries.delete(this.uri);
  }

  write(content) {
    entries.set(this.uri, { content, type: "file" });
  }
}

class Directory {
  constructor(...uris) {
    this.uri = uris.map(uriOf).reduce(joinUri);
    this.name = this.uri.split("/").pop() || "folder";
  }

  static pickDirectoryAsync = jest.fn(
    async () => new Directory("file:///archive"),
  );

  get exists() {
    return entries.get(this.uri)?.type === "directory";
  }

  create() {
    entries.set(this.uri, { type: "directory" });
  }

  createDirectory(name) {
    const directory = new Directory(this, name);
    directory.create();
    return directory;
  }

  createFile(name) {
    const file = new File(this, name);
    file.create();
    return file;
  }

  list() {
    const prefix = `${this.uri.replace(/\/$/, "")}/`;
    return [...entries]
      .filter(
        ([uri]) =>
          uri.startsWith(prefix) && !uri.slice(prefix.length).includes("/"),
      )
      .map(([uri, entry]) =>
        entry.type === "directory" ? new Directory(uri) : new File(uri),
      );
  }
}

function __reset() {
  entries.clear();
  Directory.pickDirectoryAsync.mockClear();
}

function __getFileContent(uri) {
  return entries.get(uri)?.content;
}

module.exports = { Directory, File, __getFileContent, __reset };
