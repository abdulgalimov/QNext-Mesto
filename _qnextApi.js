
async function system() {
  return {
    collection: () => {},
  }
}

global.exports = {}
global.qnext = {
  data: {
    localVar: {}
  },
  onFinish(message) {},
  getValue(path, def) {},
  database: {
    system,
  },
  tasks: {
    parallel: () => {},
    timeout: () => {},
  },
  html: {
    link: (text, url) => {},
  },
  customStats: {
    read: async (options) => {},
  },
  git: {
    readFile: async (repoIsd, filename, sourceType) => {},
  },
  telegram: {
    api: async function (method, body) {}
  },
  isoLanguages: {
    getByCode: code => {},
    getById: id => {},
    encode: code => {},
    decode: id => {},
  }
}
global.out = {};
