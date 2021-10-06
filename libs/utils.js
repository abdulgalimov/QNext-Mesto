
function encodeLanguageCode(languageCode) {
  let value = 0;
  for (let i=0; i<2; i++) {
    let code = languageCode.charCodeAt(i);
    if (i === 0) {
      code = code << 8;
    }
    value |= code;
  }
  return value;
}

function decodeLanguageCode(value) {
  const code2 = value & 0xff;
  value = value >> 8;
  const code1 = value & 0xff;
  return String.fromCharCode(code1, code2);
}

module.exports = {
  encodeLanguageCode,
  decodeLanguageCode,
}
