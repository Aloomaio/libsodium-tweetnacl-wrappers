## crypto_hash function
  - `nacl.lowlevel.crypto_hash`
  ```
  const nacl = require("./dist/modules-sumo/libsodium-tweetnacl-wrappers")
  x = Uint8Array.from("uE8PKeSYFIorw8ojOk4Cg7et0s4WSxf5WpjOORascdLW2wQuYvGoLDR7zM9USNh5")
  nacl.lowlevel.crypto_hash(x)
  ```
  - should return 0 and change the value of x to the new encrypted value

## box.before function
  - Returns a precomputed shared key which can be used in `nacl.box.after` and `nacl.box.open.after`
  ```
  const nacl = require("./dist/modules-sumo/libsodium-tweetnacl-wrappers")
  x = Uint8Array.from("T6Mjk3c65EI2C09F6jlr1fibgaqgC1eT")
  y = Uint8Array.from("T6Mjk3c65EI2C09F6jlr1fibgaqgC1eT")
  nacl.box.before(x, y)
  ```
  - should return a new array with 32U length

## box.keyPair
  - Generates a new random key pair for box and returns it as an object with `publicKey` and `secretKey` members
  ```
  const nacl = require("./dist/modules-sumo/libsodium-tweetnacl-wrappers")
  nacl.box.keyPair()
  ```
  - should return a new array with `publicKey` and `secretKey` each with 32U length

## box.keyPair.fromSecretKey
  - Returns a key pair for box with public key corresponding to the given secret key.
  ```
  const nacl = require("./dist/modules-sumo/libsodium-tweetnacl-wrappers")
  secret = (nacl.box.keyPair()).secretKey
  nacl.box.keyPair.fromSecretKey(secret)
  ```
  - should return a new array with `publicKey` and `secretKey` each with 32U length

## sign.keyPair
  - Generates new random key pair for signing and returns it as an object with `publicKey` and `secretKey` members
  ```
  const nacl = require("./dist/modules-sumo/libsodium-tweetnacl-wrappers")
  nacl.sign.keyPair()
  ```
  - should return a new array with `publicKey` 32U length and `secretKey` 64U length

## sign.detached function
  - `nacl.sign.detached`
  ```
  const nacl = require("./dist/modules-sumo/libsodium-tweetnacl-wrappers")
  message = Uint8Array.from("T6Mjk3c65EI2C09F6jlr1fibgaqgC1eT")
  key = Uint8Array.from("T6Mjk3c65EI2C09F6jlr1fibgaqgC1eTT6Mjk3c65EI2C09F6jlr1fibgaqgC1eT")
  nacl.sign.detached(message, key)
  ```
  - should return the new encrypted value with 32U length (in tweetnacl the length is 64 but in this case it's ok as at verification is also in sodium)

## sign.detached.verify function
  - `nacl.sign.detached.verify`
  ```
  const nacl = require("./dist/modules-sumo/libsodium-tweetnacl-wrappers")
  message = Uint8Array.from("T6Mjk3c65EI2C09F6jlr1fibgaqgC1eT")
  key = Uint8Array.from("T6Mjk3c65EI2C09F6jlr1fibgaqgC1eTT6Mjk3c65EI2C09F6jlr1fibgaqgC1eT")
  token = nacl.sign.detached(message, key)
  nacl.sign.detached.verify(message, token,  key)
  ```
  - should return true, as the message is verified with the right token

## sign.keyPair.fromSeed function
  - `nacl.sign.keyPair.fromSeed`
  ```
  const nacl = require("./dist/modules-sumo/libsodium-tweetnacl-wrappers")
  seed = Uint8Array.from("T6Mjk3c65EI2C09F6jlr1fibgaqgC1eT")
  nacl.sign.keyPair.fromSeed(seed)
  ```
  - should return a new array with `publicKey` 32U length and `secretKey` 64U length

## notes
  - testing will not working unless `npm i` passes (best to test in a unix, mac os is problematic)
    see [node-sodium installation](https://github.com/paixaop/node-sodium#install) for instructions
  - all returned values should be of type `Uint8Array`
  - all sodium functions receive a buffer,
    the workaround is to convert the buffers to `Uint8Array`
    pass it to sodium and change the original arrays by reference copy
