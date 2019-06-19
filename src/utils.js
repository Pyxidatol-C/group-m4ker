async function hash(s) {
  const encoder = new TextEncoder();
  const data = encoder.encode(s);
  const buffer = await window.crypto.subtle.digest('SHA-256', data);
  return hexString(buffer);
}

// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#Converting_a_digest_to_a_hex_string
function hexString(buffer) {
  const byteArray = new Uint8Array(buffer);

  const hexCodes = [...byteArray].map(value => {
    const hexCode = value.toString(16);
    const paddedHexCode = hexCode.padStart(2, '0');
    return paddedHexCode;
  });

  return hexCodes.join('');
}

export default hash;