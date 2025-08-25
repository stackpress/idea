// TypeScript wrapper for the native Rust parser
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

// Handle both ESM and CJS environments
let currentDir: string;
let requireFunc: NodeRequire;

// Check if we're in ESM or CJS environment
const isESM = typeof import.meta !== 'undefined';

if (isESM) {
  // ESM environment
  currentDir = path.dirname(fileURLToPath(import.meta.url));
  requireFunc = createRequire(import.meta.url);
} else {
  // CJS environment - use global variables
  currentDir = (globalThis as any).__dirname || __dirname;
  requireFunc = (globalThis as any).require || require;
}

const { platform, arch } = process;

let nativeBinding: any = null;
let localFileExisted = false;
let loadError: Error | null = null;

function isMusl() {
  // For Node 10
  if (!process.report || typeof process.report.getReport !== 'function') {
    try {
      const lddPath = requireFunc('child_process')
        .execSync('which ldd')
        .toString()
        .trim();
      return fs.readFileSync(lddPath, 'utf8').includes('musl');
    } catch (e) {
      return true;
    }
  } else {
    const report = process.report.getReport() as any;
    const { glibcVersionRuntime } = report.header || {};
    return !glibcVersionRuntime;
  }
}

switch (platform) {
  case 'android':
    switch (arch) {
      case 'arm64':
        localFileExisted = fs.existsSync(
          path.join(currentDir, 'idea-parser.android-arm64.node')
        );
        try {
          if (localFileExisted) {
            nativeBinding = requireFunc('../idea-parser.android-arm64.node');
          } else {
            nativeBinding = requireFunc('@stackpress/idea-parser-android-arm64');
          }
        } catch (e) {
          loadError = e as Error;
        }
        break;
      case 'arm':
        localFileExisted = fs.existsSync(
          path.join(currentDir, 'idea-parser.android-arm-eabi.node')
        );
        try {
          if (localFileExisted) {
            nativeBinding = requireFunc('../idea-parser.android-arm-eabi.node');
          } else {
            nativeBinding = requireFunc('@stackpress/idea-parser-android-arm-eabi');
          }
        } catch (e) {
          loadError = e as Error;
        }
        break;
      default:
        throw new Error(`Unsupported architecture on Android ${arch}`);
    }
    break;
  case 'win32':
    switch (arch) {
      case 'x64':
        localFileExisted = fs.existsSync(
          path.join(currentDir, 'idea-parser.win32-x64-msvc.node')
        );
        try {
          if (localFileExisted) {
            nativeBinding = requireFunc('../idea-parser.win32-x64-msvc.node');
          } else {
            nativeBinding = requireFunc('@stackpress/idea-parser-win32-x64-msvc');
          }
        } catch (e) {
          loadError = e as Error;
        }
        break;
      case 'ia32':
        localFileExisted = fs.existsSync(
          path.join(currentDir, 'idea-parser.win32-ia32-msvc.node')
        );
        try {
          if (localFileExisted) {
            nativeBinding = requireFunc('../idea-parser.win32-ia32-msvc.node');
          } else {
            nativeBinding = requireFunc('@stackpress/idea-parser-win32-ia32-msvc');
          }
        } catch (e) {
          loadError = e as Error;
        }
        break;
      case 'arm64':
        localFileExisted = fs.existsSync(
          path.join(currentDir, 'idea-parser.win32-arm64-msvc.node')
        );
        try {
          if (localFileExisted) {
            nativeBinding = requireFunc('../idea-parser.win32-arm64-msvc.node');
          } else {
            nativeBinding = requireFunc('@stackpress/idea-parser-win32-arm64-msvc');
          }
        } catch (e) {
          loadError = e as Error;
        }
        break;
      default:
        throw new Error(`Unsupported architecture on Windows: ${arch}`);
    }
    break;
  case 'darwin':
    switch (arch) {
      case 'x64':
        // Check for the file created by our postinstall script
        localFileExisted = fs.existsSync(
          path.join(currentDir, '..', 'idea-parser.x86_64-apple-darwin.node')
        );
        try {
          if (localFileExisted) {
            nativeBinding = requireFunc('../idea-parser.x86_64-apple-darwin.node');
          } else {
            throw new Error('Native binary not found. Please run npm install to download the appropriate binary.');
          }
        } catch (e) {
          loadError = e as Error;
        }
        break;
      case 'arm64':
        // Check for the file created by our postinstall script
        localFileExisted = fs.existsSync(
          path.join(currentDir, '..', 'idea-parser.aarch64-apple-darwin.node')
        );
        try {
          if (localFileExisted) {
            nativeBinding = requireFunc('../idea-parser.aarch64-apple-darwin.node');
          } else {
            throw new Error('Native binary not found. Please run npm install to download the appropriate binary.');
          }
        } catch (e) {
          loadError = e as Error;
        }
        break;
      default:
        throw new Error(`Unsupported architecture on macOS: ${arch}`);
    }
    break;
  case 'freebsd':
    if (arch !== 'x64') {
      throw new Error(`Unsupported architecture on FreeBSD: ${arch}`);
    }
    localFileExisted = fs.existsSync(
      path.join(currentDir, 'idea-parser.freebsd-x64.node')
    );
    try {
      if (localFileExisted) {
        nativeBinding = requireFunc('../idea-parser.freebsd-x64.node');
      } else {
        nativeBinding = requireFunc('@stackpress/idea-parser-freebsd-x64');
      }
    } catch (e) {
      loadError = e as Error;
    }
    break;
  case 'linux':
    switch (arch) {
      case 'x64':
        if (isMusl()) {
          localFileExisted = fs.existsSync(
            path.join(currentDir, 'idea-parser.linux-x64-musl.node')
          );
          try {
            if (localFileExisted) {
              nativeBinding = requireFunc('../idea-parser.linux-x64-musl.node');
            } else {
              nativeBinding = requireFunc('@stackpress/idea-parser-linux-x64-musl');
            }
          } catch (e) {
            loadError = e as Error;
          }
        } else {
          localFileExisted = fs.existsSync(
            path.join(currentDir, 'idea-parser.linux-x64-gnu.node')
          );
          try {
            if (localFileExisted) {
              nativeBinding = requireFunc('../idea-parser.linux-x64-gnu.node');
            } else {
              nativeBinding = requireFunc('@stackpress/idea-parser-linux-x64-gnu');
            }
          } catch (e) {
            loadError = e as Error;
          }
        }
        break;
      case 'arm64':
        if (isMusl()) {
          localFileExisted = fs.existsSync(
            path.join(currentDir, 'idea-parser.linux-arm64-musl.node')
          );
          try {
            if (localFileExisted) {
              nativeBinding = requireFunc('../idea-parser.linux-arm64-musl.node');
            } else {
              nativeBinding = requireFunc('@stackpress/idea-parser-linux-arm64-musl');
            }
          } catch (e) {
            loadError = e as Error;
          }
        } else {
          localFileExisted = fs.existsSync(
            path.join(currentDir, 'idea-parser.linux-arm64-gnu.node')
          );
          try {
            if (localFileExisted) {
              nativeBinding = requireFunc('../idea-parser.linux-arm64-gnu.node');
            } else {
              nativeBinding = requireFunc('@stackpress/idea-parser-linux-arm64-gnu');
            }
          } catch (e) {
            loadError = e as Error;
          }
        }
        break;
      case 'arm':
        if (isMusl()) {
          localFileExisted = fs.existsSync(
            path.join(currentDir, 'idea-parser.linux-arm-musleabihf.node')
          );
          try {
            if (localFileExisted) {
              nativeBinding = requireFunc('../idea-parser.linux-arm-musleabihf.node');
            } else {
              nativeBinding = requireFunc('@stackpress/idea-parser-linux-arm-musleabihf');
            }
          } catch (e) {
            loadError = e as Error;
          }
        } else {
          localFileExisted = fs.existsSync(
            path.join(currentDir, 'idea-parser.linux-arm-gnueabihf.node')
          );
          try {
            if (localFileExisted) {
              nativeBinding = requireFunc('../idea-parser.linux-arm-gnueabihf.node');
            } else {
              nativeBinding = requireFunc('@stackpress/idea-parser-linux-arm-gnueabihf');
            }
          } catch (e) {
            loadError = e as Error;
          }
        }
        break;
      case 'riscv64':
        if (isMusl()) {
          localFileExisted = fs.existsSync(
            path.join(currentDir, 'idea-parser.linux-riscv64-musl.node')
          );
          try {
            if (localFileExisted) {
              nativeBinding = requireFunc('../idea-parser.linux-riscv64-musl.node');
            } else {
              nativeBinding = requireFunc('@stackpress/idea-parser-linux-riscv64-musl');
            }
          } catch (e) {
            loadError = e as Error;
          }
        } else {
          localFileExisted = fs.existsSync(
            path.join(currentDir, 'idea-parser.linux-riscv64-gnu.node')
          );
          try {
            if (localFileExisted) {
              nativeBinding = requireFunc('../idea-parser.linux-riscv64-gnu.node');
            } else {
              nativeBinding = requireFunc('@stackpress/idea-parser-linux-riscv64-gnu');
            }
          } catch (e) {
            loadError = e as Error;
          }
        }
        break;
      case 's390x':
        localFileExisted = fs.existsSync(
          path.join(currentDir, 'idea-parser.linux-s390x-gnu.node')
        );
        try {
          if (localFileExisted) {
            nativeBinding = requireFunc('../idea-parser.linux-s390x-gnu.node');
          } else {
            nativeBinding = requireFunc('@stackpress/idea-parser-linux-s390x-gnu');
          }
        } catch (e) {
          loadError = e as Error;
        }
        break;
      default:
        throw new Error(`Unsupported architecture on Linux: ${arch}`);
    }
    break;
  default:
    throw new Error(`Unsupported OS: ${platform}, architecture: ${arch}`);
}

if (!nativeBinding) {
  if (loadError) {
    throw loadError;
  }
  throw new Error(`Failed to load native binding`);
}

// Export the functions with proper TypeScript types
export const parse: (input: string) => any = nativeBinding.parse;
export const final: (input: any) => any = nativeBinding.final;

// Default export for compatibility
export default {
  parse,
  final
};
