#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ZOLA_VERSION="${ZOLA_VERSION:-0.22.1}"
TOOLS_DIR="$REPO_ROOT/.tools/zola-$ZOLA_VERSION"
ZOLA_CMD=""

version_of() {
  local cmd out
  cmd="$1"
  out="$($cmd --version)"
  out="${out#zola }"
  printf '%s\n' "$out"
}

download_file() {
  local url="$1"
  local out="$2"
  if command -v curl >/dev/null 2>&1; then
    curl -fsSL "$url" -o "$out"
  elif command -v wget >/dev/null 2>&1; then
    wget -qO "$out" "$url"
  else
    echo "[setup] missing downloader: install curl or wget"
    exit 1
  fi
}

detect_target() {
  local os arch
  os="$(uname -s | tr '[:upper:]' '[:lower:]')"
  arch="$(uname -m | tr '[:upper:]' '[:lower:]')"

  case "$arch" in
    x86_64|amd64) arch="x86_64" ;;
    aarch64|arm64) arch="aarch64" ;;
    *)
      echo "[setup] unsupported architecture: $arch"
      exit 1
      ;;
  esac

  case "$os" in
    linux*)
      echo "$arch-unknown-linux-gnu|tar.gz"
      ;;
    darwin*)
      echo "$arch-apple-darwin|tar.gz"
      ;;
    msys*|mingw*|cygwin*)
      echo "$arch-pc-windows-msvc|zip"
      ;;
    *)
      echo "[setup] unsupported OS: $os"
      exit 1
      ;;
  esac
}

install_zola_local() {
  local target ext archive_name url tmp_dir archive_path binary_path
  IFS='|' read -r target ext <<< "$(detect_target)"
  archive_name="zola-v$ZOLA_VERSION-$target.$ext"
  url="https://github.com/getzola/zola/releases/download/v$ZOLA_VERSION/$archive_name"

  mkdir -p "$TOOLS_DIR"
  tmp_dir="$(mktemp -d)"
  archive_path="$tmp_dir/$archive_name"

  echo "[setup] downloading Zola v$ZOLA_VERSION for $target"
  download_file "$url" "$archive_path"

  if [ "$ext" = "tar.gz" ]; then
    tar -xzf "$archive_path" -C "$tmp_dir"
    binary_path="$tmp_dir/zola"
  else
    if command -v unzip >/dev/null 2>&1; then
      unzip -q "$archive_path" -d "$tmp_dir"
    else
      echo "[setup] unzip is required to install Zola on Windows"
      exit 1
    fi
    binary_path="$tmp_dir/zola.exe"
  fi

  if [ ! -f "$binary_path" ]; then
    echo "[setup] failed to locate Zola binary after extraction"
    exit 1
  fi

  cp "$binary_path" "$TOOLS_DIR/"
  chmod +x "$TOOLS_DIR/$(basename "$binary_path")"
  rm -rf "$tmp_dir"

  ZOLA_CMD="$TOOLS_DIR/$(basename "$binary_path")"
}

echo "[setup] checking Zola"
if command -v zola >/dev/null 2>&1; then
  SYSTEM_ZOLA="$(command -v zola)"
  SYSTEM_ZOLA_VERSION="$(version_of "$SYSTEM_ZOLA")"
  if [ "$SYSTEM_ZOLA_VERSION" = "$ZOLA_VERSION" ]; then
    ZOLA_CMD="$SYSTEM_ZOLA"
  elif [ -x "$TOOLS_DIR/zola" ]; then
    ZOLA_CMD="$TOOLS_DIR/zola"
  elif [ -x "$TOOLS_DIR/zola.exe" ]; then
    ZOLA_CMD="$TOOLS_DIR/zola.exe"
  else
    echo "[setup] system zola is $SYSTEM_ZOLA_VERSION, expected $ZOLA_VERSION"
    echo "[setup] downloading pinned Zola v$ZOLA_VERSION locally"
    install_zola_local
  fi
elif [ -x "$TOOLS_DIR/zola" ]; then
  ZOLA_CMD="$TOOLS_DIR/zola"
elif [ -x "$TOOLS_DIR/zola.exe" ]; then
  ZOLA_CMD="$TOOLS_DIR/zola.exe"
else
  install_zola_local
fi

echo "[setup] syncing and initializing git submodules"
git submodule sync --recursive
git submodule update --init --recursive

echo "[setup] zola version: $($ZOLA_CMD --version)"

echo "[setup] validating site"
$ZOLA_CMD check

echo "[setup] setup complete"
