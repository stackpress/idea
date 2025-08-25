# Binary Distribution Strategy

This document explains how the Rust binaries are built and distributed for the `@stackpress/idea-parser` npm package.

## Overview

The package uses a hybrid approach for binary distribution:

1. **GitHub Actions** builds pre-compiled binaries for multiple platforms
2. **Postinstall script** downloads the appropriate binary for the user's platform
3. **Fallback to source compilation** if no pre-built binary is available

## Supported Platforms

The following platforms are supported with pre-built binaries:

- **macOS**: 
  - x86_64 (Intel)
  - aarch64 (Apple Silicon)
- **Windows**:
  - x86_64 (64-bit)
  - i686 (32-bit)
- **Linux**:
  - x86_64 (GNU)
  - x86_64 (musl)
  - aarch64 (ARM64)
  - i686 (32-bit)
  - armv7 (ARM)
- **FreeBSD**:
  - x86_64

## How It Works

### 1. GitHub Actions Workflow

The `.github/workflows/build-binaries.yml` workflow:

- Triggers on version tags (`v*`) or manual dispatch
- Builds binaries for all supported platforms using a matrix strategy
- Uploads binaries as artifacts
- Creates a GitHub Release with all binaries attached

### 2. Postinstall Script

The `scripts/install.cjs` script:

- Detects the user's platform and architecture
- Maps it to the corresponding Rust target triple
- Attempts to download the pre-built binary from GitHub Releases
- Falls back to building from source if download fails
- Places the binary in the correct locations for both CJS and ESM builds

### 3. Platform Detection

The script maps Node.js platform/architecture to Rust target triples:

```javascript
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
```

## Release Process

To create a new release with binaries:

1. Update the version in `package.json`
2. Create and push a git tag:
   ```bash
   git tag v0.6.3
   git push origin v0.6.3
   ```
3. The GitHub Actions workflow will automatically:
   - Build binaries for all platforms
   - Create a GitHub Release
   - Upload all binaries to the release

## Binary Naming Convention

Binaries are named using the pattern:
```
idea-parser-{target-triple}.node
```

Examples:
- `idea-parser-aarch64-apple-darwin.node`
- `idea-parser-x86_64-pc-windows-msvc.node`
- `idea-parser-x86_64-unknown-linux-gnu.node`

## Fallback Behavior

If a pre-built binary is not available for the user's platform:

1. The script will attempt to build from source using `yarn build:rs`
2. This requires the user to have:
   - Rust toolchain installed
   - Appropriate build tools for their platform
3. The build process uses the existing `napi` configuration

## Testing

To test the installation process:

```bash
# Test the postinstall script directly
node scripts/install.cjs

# Test with npm install (in a clean environment)
npm install
```

## Troubleshooting

### Binary Download Fails

If the binary download fails, check:
1. Internet connectivity
2. GitHub Releases page for the version
3. Binary exists for your platform

### Build from Source Fails

If building from source fails, ensure:
1. Rust is installed (`rustup` recommended)
2. Build tools are available:
   - **Windows**: Visual Studio Build Tools
   - **macOS**: Xcode Command Line Tools
   - **Linux**: `build-essential` package

### Platform Not Supported

If your platform is not supported:
1. Check if it's in the platform map in `scripts/install.cjs`
2. Add support by updating the GitHub Actions workflow
3. Update the platform map in the install script

## Benefits

This approach provides:

- **Fast installation** for supported platforms (no compilation needed)
- **Broad compatibility** with fallback to source compilation
- **Automatic updates** when new versions are released
- **Reduced package size** (binaries hosted separately)
- **CI/CD integration** for consistent builds across platforms
