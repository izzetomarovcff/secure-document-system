const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  encryptFileAes: (data, fileName) => ipcRenderer.invoke('encrypt-file-aes', data, fileName),
  decryptFileAes: (data) => ipcRenderer.invoke('decrypt-file-aes', data),
  encryptFileDes: (data, fileName) => ipcRenderer.invoke('encrypt-file-des', data, fileName),
  decryptFileDes: (data) => ipcRenderer.invoke('decrypt-file-des', data),
  encryptFileRsa: (data, fileName) => ipcRenderer.invoke('encrypt-file-rsa', data, fileName),
  decryptFileRsa: (filePath, privateKeyFileName) => ipcRenderer.invoke('decrypt-file-rsa', filePath, privateKeyFileName),
  encryptFileEcc: (data, fileName) => ipcRenderer.invoke('encrypt-file-ecc', data, fileName),
  decryptFileEcc: (filePath, privateKeyFileName) => ipcRenderer.invoke('decrypt-file-ecc', filePath, privateKeyFileName),
  calculateFileHash: (filePath) => ipcRenderer.invoke('calculate-file-hash', filePath),
});
