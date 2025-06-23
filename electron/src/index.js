const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { generateKeyPairSync } = require('crypto');
const { fork,spawn  } = require('child_process');
const http = require('http');
const config = require("./config.json")
// const isDev = require('electron-is-dev');

// 🔐 Sabit AES açarı (test məqsədli, realda istifadəçi parolu ilə törədilməlidir)
// const source = 'http://192.168.100.150:3000'
const source = `http://${config.server_ip}:3000`
function createWindow() {
  const win = new BrowserWindow({
    fullscreen: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.removeMenu();
  win.webContents.openDevTools();
  win.loadURL(source); 
}

function waitForReactApp(url, callback) {
  const interval = setInterval(() => {
    http.get(url, (res) => {
      if (res.statusCode === 200) {
        clearInterval(interval);
        callback();
      }
    }).on('error', () => {
      // Ignore errors, just keep trying
    });
  }, 10000); // Check every second
}

app.whenReady().then(() => {
  const serverProcess = fork(path.join(__dirname, 'server', 'server.js'));

  const frontendProcess = spawn('npm', ['start'], {
    cwd: path.join(__dirname, 'frontend'),
    shell: true,
    stdio: 'inherit',
  });

  frontendProcess.on('exit', (code) => {
    console.log(`Frontend exited with code ${code}`);
  });

  serverProcess.on('exit', (code) => {
    console.log(`Backend server exited with code ${code}`);
  });

  waitForReactApp(source, createWindow);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

const AES_KEY = Buffer.from('12345678901234567890123456789012');

// ==================== ŞİFRƏLƏMƏ ====================
const { randomUUID } = require('crypto');

ipcMain.handle('encrypt-file-aes', async (event, fileData, fileName) => {
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', AES_KEY, iv);

    const ext = path.extname(fileName); 
    const extBuffer = Buffer.from(ext.padEnd(10)); 

    const encrypted = Buffer.concat([
      cipher.update(Buffer.from(fileData)),
      cipher.final()
    ]);

    const fullEncrypted = Buffer.concat([iv, extBuffer, encrypted]);
    const randomName = randomUUID() + '.enc';
    const savePath = path.join(__dirname, 'encrypted', randomName);
    fs.writeFileSync(savePath, fullEncrypted);

    console.log('✅ Fayl şifrələndi və random adla saxlandı:', savePath);
    return { success: true,file_name:randomName };
  } catch (err) {
    console.error('❌ Şifrələmə xətası:', err);
    return { success: false };
  }
});



// ==================== DEŞİFRƏLƏMƏ ====================
ipcMain.handle('decrypt-file-aes', async (event, filePath) => {
  try {
    // Read the file from the given path
    const buffer = fs.readFileSync(filePath);

    const iv = buffer.slice(0, 16);
    const extBuffer = buffer.slice(16, 26); // 10 bytes for extension
    const encryptedData = buffer.slice(26);

    const fileExt = extBuffer.toString().trim();

    const decipher = crypto.createDecipheriv('aes-256-cbc', AES_KEY, iv);
    const decrypted = Buffer.concat([
      decipher.update(encryptedData),
      decipher.final()
    ]);

    // 📁 Random name + original extension
    const randomName = randomUUID() + fileExt;
    const saveDir = path.join(__dirname, 'decrypted');

    // Ensure 'decrypted' folder exists
    if (!fs.existsSync(saveDir)) {
      fs.mkdirSync(saveDir);
    }

    const savePath = path.join(saveDir, randomName);
    fs.writeFileSync(savePath, decrypted);

    console.log('✅ File decrypted and saved with random name:', savePath);
    return { success: true, path: `${randomName}` };
  } catch (err) {
    console.error('❌ Decryption error:', err);
    return { success: false, error: err.message };
  }
});

const DES_KEY = Buffer.from('12345678'); // 8 baytlıq sabit DES açarı (realda təhlükəsiz yaradılmalıdır)

ipcMain.handle('encrypt-file-des', async (event, fileData, fileName) => {
  try {
    const iv = crypto.randomBytes(8); // DES üçün IV 8 baytdır
    const cipher = crypto.createCipheriv('des-cbc', DES_KEY, iv);

    const ext = path.extname(fileName);
    const extBuffer = Buffer.from(ext.padEnd(10)); // 10 bayt extensiya saxlanılır

    const encrypted = Buffer.concat([
      cipher.update(Buffer.from(fileData)),
      cipher.final()
    ]);

    const fullEncrypted = Buffer.concat([iv, extBuffer, encrypted]);
    const randomName = randomUUID() + '.desenc';
    const savePath = path.join(__dirname, 'encrypted', randomName);

    fs.writeFileSync(savePath, fullEncrypted);

    console.log('✅ [DES] Fayl şifrələndi və random adla saxlandı:', savePath);
    return { success: true, file_name: randomName };
  } catch (err) {
    console.error('❌ [DES] Şifrələmə xətası:', err);
    return { success: false };
  }
});
ipcMain.handle('decrypt-file-des', async (event, filePath) => {
  try {
    const buffer = fs.readFileSync(filePath);

    const iv = buffer.slice(0, 8); // DES üçün IV 8 baytdır
    const extBuffer = buffer.slice(8, 18); // extensiya üçün 10 bayt
    const encryptedData = buffer.slice(18);

    const fileExt = extBuffer.toString().trim();

    const decipher = crypto.createDecipheriv('des-cbc', DES_KEY, iv);
    const decrypted = Buffer.concat([
      decipher.update(encryptedData),
      decipher.final()
    ]);

    const randomName = randomUUID() + fileExt;
    const saveDir = path.join(__dirname, 'decrypted');

    if (!fs.existsSync(saveDir)) {
      fs.mkdirSync(saveDir);
    }

    const savePath = path.join(saveDir, randomName);
    fs.writeFileSync(savePath, decrypted);

    console.log('✅ [DES] Fayl deşifrələndi və random adla saxlandı:', savePath);
    return { success: true, path: `${randomName}` };
  } catch (err) {
    console.error('❌ [DES] Deşifrələmə xətası:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('encrypt-file-rsa', async (event, fileData, fileName) => {
  try {
    const keysDir = path.join(__dirname, 'keys');
    if (!fs.existsSync(keysDir)) {
      fs.mkdirSync(keysDir);
    }

    // RSA açar cütlüyü yarat
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    const privateKeyName = randomUUID() + '_private.pem';
    const publicKeyName = randomUUID() + '_public.pem';

    const privateKeyPath = path.join(keysDir, privateKeyName);
    const publicKeyPath = path.join(keysDir, publicKeyName);

    fs.writeFileSync(privateKeyPath, privateKey);
    fs.writeFileSync(publicKeyPath, publicKey);

    const ext = path.extname(fileName);
    const extBuffer = Buffer.from(ext.padEnd(10));

    const bufferData = Buffer.from(fileData);

    // Faylı public açarla şifrələ
    const encryptedData = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      },
      bufferData
    );

    const fullEncrypted = Buffer.concat([extBuffer, encryptedData]);
    const randomName = randomUUID() + '.rsaenc';
    const savePath = path.join(__dirname, 'encrypted', randomName);

    fs.writeFileSync(savePath, fullEncrypted);

    console.log('✅ [RSA] Fayl şifrələndi və random adla saxlandı:', savePath);
    return { 
      success: true,
      file_name: randomName,
      privatekey: privateKeyName,
      publickey: publicKeyName,
    };
  } catch (err) {
    console.error('❌ [RSA] Şifrələmə xətası:', err);
    return { success: false, error: err.message };
  }
});
ipcMain.handle('decrypt-file-rsa', async (event, filePath, privateKeyFileName) => {
  try {
    const keysDir = path.join(__dirname, 'keys');
    const privateKeyPath = path.join(keysDir, privateKeyFileName);

    if (!fs.existsSync(privateKeyPath)) {
      throw new Error('Private açar tapılmadı!');
    }

    const privateKey = fs.readFileSync(privateKeyPath, 'utf-8');

    const buffer = fs.readFileSync(filePath);

    const extBuffer = buffer.slice(0, 10); // 10 bayt extensiya
    const encryptedData = buffer.slice(10);

    const fileExt = extBuffer.toString().trim();

    const decryptedData = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      },
      encryptedData
    );

    const randomName = randomUUID() + fileExt;
    const saveDir = path.join(__dirname, 'decrypted');

    if (!fs.existsSync(saveDir)) {
      fs.mkdirSync(saveDir);
    }

    const savePath = path.join(saveDir, randomName);
    fs.writeFileSync(savePath, decryptedData);

    console.log('✅ [RSA] Fayl deşifrələndi və random adla saxlandı:', savePath);
    return { success: true, path: `${randomName}` };
  } catch (err) {
    console.error('❌ [RSA] Deşifrələmə xətası:', err);
    return { success: false, error: err.message };
  }
});

const EC = require('elliptic').ec;
const ec = new EC('secp256k1'); // Bitcoin-da istifadə olunan standart elliptic curve
const keysPath = path.join(__dirname, 'keys');

// Ensure keys folder exists
if (!fs.existsSync(keysPath)) {
  fs.mkdirSync(keysPath);
}

// ==================== ECC ŞİFRƏLƏMƏ ====================
ipcMain.handle('encrypt-file-ecc', async (event, fileData, fileName) => {
  try {
    // 🔑 Yeni ECC açar cütü yarat
    const keyPair = ec.genKeyPair();
    const publicKey = keyPair.getPublic('hex');
    const privateKey = keyPair.getPrivate('hex');

    const ext = path.extname(fileName);
    const extBuffer = Buffer.from(ext.padEnd(10));

    // 🔒 Faylı public açarla "encrypt" etmək (simulyasiya edirik)
    const encrypted = Buffer.from(fileData.map(b => b ^ 0xAA)); // Sadə XOR ilə simulyasiya

    const fullEncrypted = Buffer.concat([extBuffer, encrypted]);
    const randomName = randomUUID() + '.eccenc';
    const savePath = path.join(__dirname, 'encrypted', randomName);

    fs.writeFileSync(savePath, fullEncrypted);

    // 🔑 Açarları saxla
    const privateKeyFile = randomUUID() + '.pem';
    const publicKeyFile = randomUUID() + '.pem';

    fs.writeFileSync(path.join(keysPath, privateKeyFile), privateKey);
    fs.writeFileSync(path.join(keysPath, publicKeyFile), publicKey);

    console.log('✅ [ECC] Fayl şifrələndi və açarlar saxlandı:', savePath);
    return { success: true, file_name: randomName, privatekey: privateKeyFile, publickey: publicKeyFile };
  } catch (err) {
    console.error('❌ [ECC] Şifrələmə xətası:', err);
    return { success: false, error: err.message };
  }
});

// ==================== ECC DEŞİFRƏLƏMƏ ====================
ipcMain.handle('decrypt-file-ecc', async (event, filePath, privateKeyFileName) => {
  try {
    const buffer = fs.readFileSync(filePath);

    const extBuffer = buffer.slice(0, 10);
    const encryptedData = buffer.slice(10);

    const fileExt = extBuffer.toString().trim();

    // 🔑 Private açarı oxu
    const privateKeyHex = fs.readFileSync(path.join(keysPath, privateKeyFileName), 'utf8');
    const privateKey = ec.keyFromPrivate(privateKeyHex, 'hex');

    // 🔓 Faylı deşifrələyirik (XOR-u geri qaytarırıq)
    const decrypted = Buffer.from(encryptedData.map(b => b ^ 0xAA));

    const randomName = randomUUID() + fileExt;
    const saveDir = path.join(__dirname, 'decrypted');

    if (!fs.existsSync(saveDir)) {
      fs.mkdirSync(saveDir);
    }

    const savePath = path.join(saveDir, randomName);
    fs.writeFileSync(savePath, decrypted);

    console.log('✅ [ECC] Fayl deşifrələndi və random adla saxlandı:', savePath);
    return { success: true, path: `${randomName}` };
  } catch (err) {
    console.error('❌ [ECC] Deşifrələmə xətası:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('calculate-file-hash', async (event, filePath) => {
  try {
    const buffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(buffer);
    const hex = hashSum.digest('hex');

    console.log('✅ [SHA-256] Hash hesablandı:', hex);

    return { success: true, hash: hex };
  } catch (error) {
    console.error('❌ [SHA-256] Hash hesablama xətası:', error);
    return { success: false, error: error.message };
  }
});