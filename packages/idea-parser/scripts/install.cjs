#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// Get platform and architecture information
function getPlatformInfo() {
  const platform = process.platform;
  const arch = process.arch;
  
  // Map Node.js platform/arch to Rust target triples
  const platformMap = {
    'darwin': {
      'x64': 'x86_64-apple-darwin',
      'arm64': 'aarch64-apple-darwin'
    },
    'win32': {
      'x64': 'x86_64-pc-windows-msvc',
      'ia32': 'i686-pc-windows-msvc'
    },
    'linux': {
      'x64': 'x86_64-unknown-linux-gnu',
      'arm64': 'aarch64-unknown-linux-gnu',
      'ia32': 'i686-unknown-linux-gnu',
      'arm': 'armv7-unknown-linux-gnueabihf'
    },
    'freebsd': {
      'x64': 'x86_64-unknown-freebsd'
    }
  };

  if (!platformMap[platform] || !platformMap[platform][arch]) {
    throw new Error(`Unsupported platform: ${platform}-${arch}`);
  }

  return {
    platform,
    arch,
    target: platformMap[platform][arch]
  };
}

// Get the package version from package.json
function getPackageVersion() {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
  return packageJson.version;
}

// Download file from URL
function downloadFile(url, destination) {
  return new Promise((resolve, reject) => {
    console.log(`Downloading binary from: ${url}`);
    
    const file = fs.createWriteStream(destination);
    
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirect
        return downloadFile(response.headers.location, destination)
          .then(resolve)
          .catch(reject);
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: HTTP ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log('Binary downloaded successfully');
        resolve();
      });
      
      file.on('error', (err) => {
        fs.unlink(destination, () => {}); // Delete the file on error
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Check if binary already exists
function binaryExists() {
  try {
    const platformInfo = getPlatformInfo();
    const binaryPaths = [
      path.join(__dirname, '..', `idea-parser.${platformInfo.target}.node`),
      path.join(__dirname, '..', 'cjs', `idea-parser.${platformInfo.target}.node`),
      path.join(__dirname, '..', 'esm', `idea-parser.${platformInfo.target}.node`)
    ];

    return binaryPaths.some(binaryPath => fs.existsSync(binaryPath));
  } catch (error) {
    return false;
  }
}

// Build from source as fallback
function buildFromSource() {
  console.log('Building binary from source...');
  try {
    execSync('yarn build:rs', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    console.log('Binary built successfully from source');
    
    // After building from source, copy the generated files to the expected locations
    const platformInfo = getPlatformInfo();
    
    // Look for any .node files that might have been created by the build
    const possibleSourceFiles = [];
    
    // Check root directory for any .node files
    const rootFiles = fs.readdirSync(path.join(__dirname, '..'));
    for (const file of rootFiles) {
      if (file.endsWith('.node')) {
        possibleSourceFiles.push(path.join(__dirname, '..', file));
      }
    }
    
    // Check cjs directory
    const cjsDir = path.join(__dirname, '..', 'cjs');
    if (fs.existsSync(cjsDir)) {
      const cjsFiles = fs.readdirSync(cjsDir);
      for (const file of cjsFiles) {
        if (file.endsWith('.node')) {
          possibleSourceFiles.push(path.join(cjsDir, file));
        }
      }
    }
    
    // Check esm directory
    const esmDir = path.join(__dirname, '..', 'esm');
    if (fs.existsSync(esmDir)) {
      const esmFiles = fs.readdirSync(esmDir);
      for (const file of esmFiles) {
        if (file.endsWith('.node')) {
          possibleSourceFiles.push(path.join(esmDir, file));
        }
      }
    }
    
    const destinations = [
      path.join(__dirname, '..', `idea-parser.${platformInfo.target}.node`),
      path.join(__dirname, '..', 'cjs', `idea-parser.${platformInfo.target}.node`),
      path.join(__dirname, '..', 'esm', `idea-parser.${platformInfo.target}.node`)
    ];
    
    // Ensure directories exist
    fs.mkdirSync(path.join(__dirname, '..', 'cjs'), { recursive: true });
    fs.mkdirSync(path.join(__dirname, '..', 'esm'), { recursive: true });
    
    // Find the source file that exists and copy it to all destinations
    let sourceFile = null;
    for (const file of possibleSourceFiles) {
      if (fs.existsSync(file)) {
        sourceFile = file;
        break;
      }
    }
    
    if (sourceFile) {
      for (const dest of destinations) {
        fs.copyFileSync(sourceFile, dest);
        console.log(`Binary copied to: ${dest}`);
      }
    } else {
      console.warn('Could not find built binary to copy');
    }
    
  } catch (error) {
    console.error('Failed to build from source:', error.message);
    throw error;
  }
}

// Main installation function
async function install() {
  try {
    // Check if binary already exists
    if (binaryExists()) {
      console.log('Binary already exists, skipping download');
      return;
    }

    const platformInfo = getPlatformInfo();
    const version = getPackageVersion();
    
    console.log(`Platform: ${platformInfo.platform}-${platformInfo.arch}`);
    console.log(`Target: ${platformInfo.target}`);
    console.log(`Version: ${version}`);
    
    // Construct download URL for GitHub Releases
    const binaryName = `idea-parser-${platformInfo.target}.node`;
    const downloadUrl = `https://github.com/stackpress/idea/releases/download/v${version}/${binaryName}`;
    
    // Determine destination paths
    const destinations = [
      path.join(__dirname, '..', `idea-parser.${platformInfo.target}.node`),
      path.join(__dirname, '..', 'cjs', `idea-parser.${platformInfo.target}.node`),
      path.join(__dirname, '..', 'esm', `idea-parser.${platformInfo.target}.node`)
    ];
    
    // Ensure directories exist
    fs.mkdirSync(path.join(__dirname, '..', 'cjs'), { recursive: true });
    fs.mkdirSync(path.join(__dirname, '..', 'esm'), { recursive: true });
    
    // Try to download the binary
    try {
      const tempFile = path.join(__dirname, '..', 'temp-binary.node');
      await downloadFile(downloadUrl, tempFile);
      
      // Copy to all destination paths
      for (const dest of destinations) {
        fs.copyFileSync(tempFile, dest);
        console.log(`Binary copied to: ${dest}`);
      }
      
      // Clean up temp file
      fs.unlinkSync(tempFile);
      
    } catch (downloadError) {
      console.warn('Failed to download pre-built binary:', downloadError.message);
      console.log('Attempting to build from source...');
      
      // Fallback to building from source
      buildFromSource();
    }
    
  } catch (error) {
    console.error('Installation failed:', error.message);
    process.exit(1);
  }
}

// Run installation
if (require.main === module) {
  install();
}

module.exports = { install, getPlatformInfo, getPackageVersion };
