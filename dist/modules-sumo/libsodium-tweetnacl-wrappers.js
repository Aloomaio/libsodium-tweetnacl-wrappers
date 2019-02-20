const _sodium = require('./libsodium-wrappers');
let sodium;
(async() => {
  await _sodium.ready;
  sodium = _sodium;
})();

// const = require('typedarray-to-buffer');

const crypto_sign_PUBLICKEYBYTES = 32,
      crypto_sign_SECRETKEYBYTES = 64,
      crypto_sign_SEEDBYTES = 32;
      crypto_box_PUBLICKEYBYTES = 32,
      crypto_box_SECRETKEYBYTES = 32;

function toArrayBuffer(buf) {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return view;
}

function objectToArrayBuffer(obj) {
  Object.keys(obj).map(key => {
    obj[key] = toArrayBuffer(obj[key]);
  });
  return obj;
}

function copyByReference(x, y) {
  for (const [index, value] of y.entries()) {
    x[index] = value;
  }
}

function cleanKeys(keys) {
  const {publicKey, privateKey} = keys;
  return {
    publicKey,
    secretKey: privateKey
  };
}

let mapping = {
  lowlevel: {
    crypto_hash: (message, key) => {
      copyByReference(message,sodium.crypto_hash_sha512(message));
      return 0;
    }
  },
  box: {
    before: (pk, sk) => {
      return sodium.crypto_box_beforenm(pk, sk);
    },
    keyPair: () => {
      return cleanKeys(sodium.crypto_box_keypair());
    }
  },
  sign: {
    keyPair: () => {
      return cleanKeys(sodium.crypto_sign_keypair());
    },
    detached: (message, key) => {
      return sodium.crypto_auth(message, key.slice(0,32));
    }
  }
};

mapping.sign.detached.verify = (message, token,  secretKey) => {
  return sodium.crypto_auth_verify(token, message, secretKey.slice(0,32));
};

mapping.sign.keyPair.fromSeed = (seed) => {
  return cleanKeys(sodium.crypto_sign_seed_keypair(seed));
};

mapping.box.keyPair.fromSecretKey = (sk) => {
  if (sk.length !== crypto_box_SECRETKEYBYTES)
    throw new Error('bad secret key size');
  var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
  pk = sodium.crypto_scalarmult(pk, sk);
  return {publicKey: pk, secretKey: sk};
};

mapping.box.keyPair.fromSeed = mapping.sign.keyPair.fromSeed;

mapping.getNacl = () => sodium;

module.exports = mapping;
