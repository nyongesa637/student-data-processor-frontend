#!/usr/bin/env bash
# =============================================================================
# Student Data Processor - Frontend Setup & Run Script
# Works on Linux, macOS, and Windows (Git Bash / WSL / MSYS2)
#
# Usage:
#   ./run.sh                  Full setup: install Node.js, npm deps, build & run
#   ./run.sh --skip-setup     Skip installation, validate & run only
#   ./run.sh -s               Short alias for --skip-setup
#   ./run.sh --check          Only validate environment, don't run
# =============================================================================
set -euo pipefail

# --- Colors (disabled on dumb terminals) ---
if [[ "${TERM:-dumb}" != "dumb" ]] && command -v tput &>/dev/null; then
    RED=$(tput setaf 1) GREEN=$(tput setaf 2) YELLOW=$(tput setaf 3)
    BLUE=$(tput setaf 4) BOLD=$(tput bold) NC=$(tput sgr0)
else
    RED="" GREEN="" YELLOW="" BLUE="" BOLD="" NC=""
fi

info()  { echo "${BLUE}[INFO]${NC}  $*"; }
ok()    { echo "${GREEN}[OK]${NC}    $*"; }
warn()  { echo "${YELLOW}[WARN]${NC}  $*"; }
fail()  { echo "${RED}[FAIL]${NC}  $*"; }
header(){ echo ""; echo "${BOLD}=== $* ===${NC}"; }

# --- Detect OS ---
detect_os() {
    case "$(uname -s)" in
        Linux*)  OS=linux ;;
        Darwin*) OS=mac ;;
        MINGW*|MSYS*|CYGWIN*) OS=windows ;;
        *) OS=unknown ;;
    esac

    if [[ "$OS" == "linux" ]]; then
        if command -v dnf &>/dev/null; then PKG=dnf
        elif command -v apt-get &>/dev/null; then PKG=apt
        elif command -v pacman &>/dev/null; then PKG=pacman
        elif command -v zypper &>/dev/null; then PKG=zypper
        else PKG=unknown; fi
    elif [[ "$OS" == "mac" ]]; then
        PKG=brew
    else
        PKG=manual
    fi
}

# --- Parse arguments ---
SKIP_SETUP=false
CHECK_ONLY=false
for arg in "$@"; do
    case "$arg" in
        --skip-setup|-s) SKIP_SETUP=true ;;
        --check|-c) CHECK_ONLY=true ;;
        --help|-h)
            echo "Usage: ./run.sh [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  (no args)        Full setup: install Node.js, install deps, build & serve"
            echo "  --skip-setup, -s Skip installation, only validate environment & run"
            echo "  --check, -c      Only validate environment, don't run"
            echo "  --help, -h       Show this help"
            exit 0 ;;
    esac
done

# --- Validation functions ---
has_cmd() { command -v "$1" &>/dev/null; }

check_node() {
    if has_cmd node; then
        local ver
        ver=$(node -v | sed 's/v//' | cut -d. -f1)
        if [[ "$ver" -ge 18 ]]; then
            ok "Node.js $(node -v) found"
            return 0
        else
            warn "Node.js $(node -v) found, but v18+ is required"
            return 1
        fi
    else
        fail "Node.js not found"
        return 1
    fi
}

check_npm() {
    if has_cmd npm; then
        ok "npm $(npm -v) found"
        return 0
    else
        fail "npm not found"
        return 1
    fi
}

check_node_modules() {
    if [[ -d "node_modules" ]]; then
        ok "node_modules directory exists"
        return 0
    else
        warn "node_modules not found (run npm install)"
        return 1
    fi
}

check_backend_reachable() {
    if has_cmd curl; then
        if curl -s --connect-timeout 2 http://localhost:8080/api/students &>/dev/null; then
            ok "Backend is reachable at http://localhost:8080"
            return 0
        else
            warn "Backend not reachable at http://localhost:8080 (start it before using the app)"
            return 1
        fi
    else
        info "Cannot check backend (curl not available). Ensure it's running on port 8080."
        return 0
    fi
}

# --- Install functions ---
install_node() {
    header "Installing Node.js 18"
    case "$OS" in
        linux)
            case "$PKG" in
                dnf) sudo dnf install -y nodejs npm ;;
                apt)
                    if has_cmd curl; then
                        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
                        sudo apt-get install -y nodejs
                    else
                        sudo apt-get update && sudo apt-get install -y nodejs npm
                    fi ;;
                pacman) sudo pacman -S --noconfirm nodejs npm ;;
                zypper) sudo zypper install -y nodejs npm ;;
                *)
                    # Fallback: use nvm
                    if ! has_cmd nvm; then
                        info "Installing nvm..."
                        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
                        export NVM_DIR="$HOME/.nvm"
                        # shellcheck disable=SC1091
                        [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                    fi
                    nvm install 18
                    nvm use 18
                    ;;
            esac ;;
        mac)
            if ! has_cmd brew; then
                fail "Homebrew not found. Install it from https://brew.sh then re-run."
                exit 1
            fi
            brew install node@18
            brew link --overwrite node@18 2>/dev/null || true
            ;;
        windows)
            if has_cmd winget; then
                winget install --id OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements
            elif has_cmd choco; then
                choco install nodejs-lts -y
            else
                fail "Install Node.js 18+ manually: https://nodejs.org/en/download/"
                fail "Then re-run this script."
                exit 1
            fi ;;
    esac
}

install_deps() {
    header "Installing npm Dependencies"
    npm install
    ok "Dependencies installed"
}

# --- Main logic ---
main() {
    header "Student Data Processor - Frontend"
    detect_os
    info "Detected OS: $OS (package manager: $PKG)"

    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    cd "$SCRIPT_DIR"
    info "Working directory: $(pwd)"

    if [[ "$SKIP_SETUP" == true || "$CHECK_ONLY" == true ]]; then
        header "Validating Environment"
        ERRORS=0
        check_node         || ERRORS=$((ERRORS + 1))
        check_npm          || ERRORS=$((ERRORS + 1))
        check_node_modules || ERRORS=$((ERRORS + 1))
        check_backend_reachable || true  # non-fatal

        if [[ $ERRORS -gt 0 ]]; then
            echo ""
            fail "$ERRORS check(s) failed. Fix the issues above or run without --skip-setup for auto-install."
            if [[ "$CHECK_ONLY" == true ]]; then exit 1; fi
            warn "Continuing anyway..."
        else
            ok "All checks passed!"
        fi

        if [[ "$CHECK_ONLY" == true ]]; then
            exit 0
        fi
    else
        header "Setting Up Environment"

        # Node.js
        if ! check_node 2>/dev/null; then
            install_node
            # Reload PATH for newly installed tools
            hash -r 2>/dev/null || true
            check_node || { fail "Node.js installation failed"; exit 1; }
        fi

        # npm (comes with Node)
        check_npm || { fail "npm not available. Reinstall Node.js."; exit 1; }

        # Dependencies
        if [[ ! -d "node_modules" ]]; then
            install_deps
        else
            info "node_modules exists. Running npm install to ensure deps are current..."
            npm install
            ok "Dependencies up to date"
        fi
    fi

    # Run
    header "Starting Frontend Dev Server"
    info "URL: http://localhost:4200"
    info "Backend must be running on http://localhost:8080"
    info "Press Ctrl+C to stop"
    echo ""
    npx ng serve --open 2>/dev/null || npx ng serve
}

main "$@"
