import { decrypt, encrypt } from 'crypto-js/aes'
import UTF8, { parse } from 'crypto-js/enc-utf8'
import pkcs7 from 'crypto-js/pad-pkcs7'
import ECB from 'crypto-js/mode-ecb'
import md5 from 'crypto-js/md5'
import Base64 from 'crypto-js/enc-base64'

export interface EncryptionParams {
  key: string
  iv: string
}

export const cacheCipher = {
  key: '_11111000001111@',
  iv: '@11111000001111_',
}

export function aesEncryption(
  payload: string,
  method: 'encrypt' | 'decrypt' = 'encrypt',
) {
  const iv = parse(cacheCipher.iv)

  const options = {
    mode: ECB,
    padding: pkcs7,
    iv,
  }

  const encryptByAES = (cipherText: string) => {
    return encrypt(cipherText, cacheCipher.key, options).toString()
  }

  const decryptByAES = (cipherText: string) => {
    return decrypt(cipherText, cacheCipher.key, options).toString(UTF8)
  }

  return method === 'encrypt' ? encryptByAES(payload) : decryptByAES(payload)
}

export function encryptByBase64(cipherText: string) {
  return UTF8.parse(cipherText).toString(Base64)
}

export function decodeByBase64(cipherText: string) {
  return Base64.parse(cipherText).toString(UTF8)
}

export function encryptByMd5(password: string) {
  return md5(password).toString()
}
