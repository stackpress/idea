// CommonJS wrapper for the native Rust parser
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';

// CJS environment - use global variables
const currentDir = __dirname;
const requireFunc = require;

const { platform, arch } = process;

let nativeBinding: any = null;
let localFileExisted = false;
let loadError: Error | null = null;

function isMusl(): boolean {
  // For Node 10
  if (!process.report || typeof process.report.getReport !== 'function') {
    try {
      const lddPath = requireFunc('child_process').execSync('which ldd').toString().trim();
      return readFileSync(lddPath, 'utf8').includes('musl');
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
        localFileExisted = existsSync(join(currentDir, 'idea-parser-rust.android-arm64.node'));
        try {
          if (localFileExisted) {
            nativeBinding = requireFunc('./idea-parser-rust.android-arm64.node');
          } else {
            nativeBinding = requireFunc('@stackpress/idea-parser-rust-android-arm64');
          }
        } catch (e) {
          loadError = e as Error;
        }
        break;
      case 'arm':
        localFileExisted = existsSync(join(currentDir, 'idea-parser-rust.android-arm-eabi.node'));
        try {
          if (localFileExisted) {
            nativeBinding = requireFunc('./idea-parser-rust.android-arm-eabi.node');
          } else {
            nativeBinding = requireFunc('@stackpress/idea-parser-rust-android-arm-eabi');
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
        localFileExisted = existsSync(
          join(currentDir, 'idea-parser-rust.win32-x64-msvc.node')
        );
        try {
          if (localFileExisted) {
            nativeBinding = requireFunc('./idea-parser-rust.win32-x64-msvc.node');
          } else {
            nativeBinding = requireFunc('@stackpress/idea-parser-rust-win32-x64-msvc');
          }
        } catch (e) {
          loadError = e as Error;
        }
        break;
      case 'ia32':
        localFileExisted = existsSync(
          join(currentDir, 'idea-parser-rust.win32-ia32-msvc.node')
        );
        try {
          if (localFileExisted) {
            nativeBinding = requireFunc('./idea-parser-rust.win32-ia32-msvc.node');
          } else {
            nativeBinding = requireFunc('@stackpress/idea-parser-rust-win32-ia32-msvc');
          }
        } catch (e) {
          loadError = e as Error;
        }
        break;
      case 'arm64':
        localFileExisted = existsSync(
          join(currentDir, 'idea-parser-rust.win32-arm64-msvc.node')
        );
        try {
          if (localFileExisted) {
            nativeBinding = requireFunc('./idea-parser-rust.win32-arm64-msvc.node');
          } else {
            nativeBinding = requireFunc('@stackpress/idea-parser-rust-win32-arm64-msvc');
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
    localFileExisted = existsSync(join(currentDir, 'idea-parser-rust.darwin-universal.node'));
    try {
      if (localFileExisted) {
        nativeBinding = requireFunc('./idea-parser-rust.darwin-universal.node');
      } else {
        nativeBinding = requireFunc('@stackpress/idea-parser-rust-darwin-universal');
      }
      break;
    } catch {}
    switch (arch) {
      case 'x64':
        localFileExisted = existsSync(join(currentDir, 'idea-parser-rust.darwin-x64.node'));
        try {
          if (localFileExisted) {
            nativeBinding = requireFunc('./idea-parser-rust.darwin-x64.node');
          } else {
            nativeBinding = requireFunc('@stackpress/idea-parser-rust-darwin-x64');
          }
        } catch (e) {
          loadError = e as Error;
        }
        break;
      case 'arm64':
        localFileExisted = existsSync(
          join(currentDir, 'idea-parser-rust.darwin-arm64.node')
        );
        try {
          if (localFileExisted) {
            nativeBinding = requireFunc('./idea-parser-rust.darwin-arm64.node');
          } else {
            nativeBinding = requireFunc('@stackpress/idea-parser-rust-darwin-arm64');
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
    localFileExisted = existsSync(join(currentDir, 'idea-parser-rust.freebsd-x64.node'));
    try {
      if (localFileExisted) {
        nativeBinding = requireFunc('./idea-parser-rust.freebsd-x64.node');
      } else {
        nativeBinding = requireFunc('@stackpress/idea-parser-rust-freebsd-x64');
      }
    } catch (e) {
      loadError = e as Error;
    }
    break;
  case 'linux':
    switch (arch) {
      case 'x64':
        if (isMusl()) {
          localFileExisted = existsSync(
            join(currentDir, 'idea-parser-rust.linux-x64-musl.node')
          );
          try {
            if (localFileExisted) {
              nativeBinding = requireFunc('./idea-parser-rust.linux-x64-musl.node');
            } else {
              nativeBinding = requireFunc('@stackpress/idea-parser-rust-linux-x64-musl');
            }
          } catch (e) {
            loadError = e as Error;
          }
        } else {
          localFileExisted = existsSync(
            join(currentDir, 'idea-parser-rust.linux-x64-gnu.node')
          );
          try {
            if (localFileExisted) {
              nativeBinding = requireFunc('./idea-parser-rust.linux-x64-gnu.node');
            } else {
              nativeBinding = requireFunc('@stackpress/idea-parser-rust-linux-x64-gnu');
            }
          } catch (e) {
            loadError = e as Error;
          }
        }
        break;
      case 'arm64':
        if (isMusl()) {
          localFileExisted = existsSync(
            join(currentDir, 'idea-parser-rust.linux-arm64-musl.node')
          );
          try {
            if (localFileExisted) {
              nativeBinding = requireFunc('./idea-parser-rust.linux-arm64-musl.node');
            } else {
              nativeBinding = requireFunc('@stackpress/idea-parser-rust-linux-arm64-musl');
            }
          } catch (e) {
            loadError = e as Error;
          }
        } else {
          localFileExisted = existsSync(
            join(currentDir, 'idea-parser-rust.linux-arm64-gnu.node')
          );
          try {
            if (localFileExisted) {
              nativeBinding = requireFunc('./idea-parser-rust.linux-arm64-gnu.node');
            } else {
              nativeBinding = requireFunc('@stackpress/idea-parser-rust-linux-arm64-gnu');
            }
          } catch (e) {
            loadError = e as Error;
          }
        }
        break;
      case 'arm':
        if (isMusl()) {
          localFileExisted = existsSync(
            join(currentDir, 'idea-parser-rust.linux-arm-musleabihf.node')
          );
          try {
            if (localFileExisted) {
              nativeBinding = requireFunc('./idea-parser-rust.linux-arm-musleabihf.node');
            } else {
              nativeBinding = requireFunc('@stackpress/idea-parser-rust-linux-arm-musleabihf');
            }
          } catch (e) {
            loadError = e as Error;
          }
        } else {
          localFileExisted = existsSync(
            join(currentDir, 'idea-parser-rust.linux-arm-gnueabihf.node')
          );
          try {
            if (localFileExisted) {
              nativeBinding = requireFunc('./idea-parser-rust.linux-arm-gnueabihf.node');
            } else {
              nativeBinding = requireFunc('@stackpress/idea-parser-rust-linux-arm-gnueabihf');
            }
          } catch (e) {
            loadError = e as Error;
          }
        }
        break;
      case 'riscv64':
        if (isMusl()) {
          localFileExisted = existsSync(
            join(currentDir, 'idea-parser-rust.linux-riscv64-musl.node')
          );
          try {
            if (localFileExisted) {
              nativeBinding = requireFunc('./idea-parser-rust.linux-riscv64-musl.node');
            } else {
              nativeBinding = requireFunc('@stackpress/idea-parser-rust-linux-riscv64-musl');
            }
          } catch (e) {
            loadError = e as Error;
          }
        } else {
          localFileExisted = existsSync(
            join(currentDir, 'idea-parser-rust.linux-riscv64-gnu.node')
          );
          try {
            if (localFileExisted) {
              nativeBinding = requireFunc('./idea-parser-rust.linux-riscv64-gnu.node');
            } else {
              nativeBinding = requireFunc('@stackpress/idea-parser-rust-linux-riscv64-gnu');
            }
          } catch (e) {
            loadError = e as Error;
          }
        }
        break;
      case 's390x':
        localFileExisted = existsSync(
          join(currentDir, 'idea-parser-rust.linux-s390x-gnu.node')
        );
        try {
          if (localFileExisted) {
            nativeBinding = requireFunc('./idea-parser-rust.linux-s390x-gnu.node');
          } else {
            nativeBinding = requireFunc('@stackpress/idea-parser-rust-linux-s390x-gnu');
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

// CommonJS exports
module.exports = {
  parse: nativeBinding.parse,
  final: nativeBinding.final
};
module.exports.parse = nativeBinding.parse;
module.exports.final = nativeBinding.final;
