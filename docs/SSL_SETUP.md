# SSL Certificate Generation Guide

## Method 1: Install OpenSSL on Windows

### Option A: Using Chocolatey (Recommended)
```powershell
# Install Chocolatey if not installed
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install OpenSSL
choco install openssl

# Verify
openssl version
```

### Option B: Manual Installation
1. Download from: https://slproweb.com/products/Win32OpenSSL.html
2. Install "Win64 OpenSSL v3.x.x Light"
3. Add to PATH: `C:\Program Files\OpenSSL-Win64\bin`
4. Restart PowerShell

## Method 2: Use Git Bash (if Git is installed)

```bash
# Open Git Bash
cd "D:\B - University\7-internt engineering\todo-project-v2.2"
mkdir -p cert
openssl req -x509 -newkey rsa:2048 -keyout cert/key.pem -out cert/cert.pem -days 365 -nodes -subj "/CN=localhost"
```

## Method 3: Generate Certificate with Node.js

Create and run this script:

```javascript
// generate-cert.js
const { execSync } = require('child_process');
const fs = require('fs');

if (!fs.existsSync('./cert')) {
  fs.mkdirSync('./cert');
}

try {
  execSync('openssl req -x509 -newkey rsa:2048 -keyout cert/key.pem -out cert/cert.pem -days 365 -nodes -subj "/CN=localhost"', {
    stdio: 'inherit'
  });
  console.log('✅ SSL certificates generated successfully!');
} catch (error) {
  console.error('❌ OpenSSL not found. Please install OpenSSL first.');
  console.log('Alternative: Use the manual method below.\n');
  
  // Generate self-signed certificate using Node.js crypto
  const crypto = require('crypto');
  const forge = require('node-forge');
  
  console.log('Attempting to generate with node-forge...');
  console.log('Run: npm install node-forge');
}
```

## Method 4: Manual Certificate Creation (Advanced)

```powershell
# Using PowerShell's New-SelfSignedCertificate
$cert = New-SelfSignedCertificate -DnsName "localhost" -CertStoreLocation "Cert:\CurrentUser\My" -KeySpec KeyExchange
$password = ConvertTo-SecureString -String "password" -Force -AsPlainText
Export-PfxCertificate -Cert $cert -FilePath "cert\certificate.pfx" -Password $password

# Convert PFX to PEM (requires OpenSSL)
openssl pkcs12 -in cert\certificate.pfx -nocerts -out cert\key.pem -nodes
openssl pkcs12 -in cert\certificate.pfx -nokeys -out cert\cert.pem
```

## Quick Test Without HTTPS

If you don't need HTTPS for development, just use HTTP:

1. Comment out HTTPS server code in `app.js`
2. Access app at `http://localhost:3000`

HTTPS is recommended for production but not required for local development.

## Verify Certificates

After generation:
```powershell
ls cert/
# Should show: key.pem and cert.pem
```

Restart server:
```powershell
npm run dev
```

You should see:
```
🔐 HTTPS Server running on https://localhost:3443
```

## Trust Self-Signed Certificate (Optional)

To avoid browser warnings:

1. Double-click `cert/cert.pem`
2. Click "Install Certificate"
3. Select "Local Machine"
4. Choose "Place all certificates in the following store"
5. Select "Trusted Root Certification Authorities"
6. Complete the wizard

**Warning:** Only do this for development certificates you generated yourself!
