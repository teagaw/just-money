#!/usr/bin/env bash
# =============================================================================
# Modern Tech Resume Pack — Compile all 5 .tex files into PDFs
# =============================================================================
# Usage:
#     ./compile.sh
#
# Requirements:
#     - xelatex (install via MacTeX, TeX Live, or MiKTeX)
#     - bash 4+ (for the associative array; macOS users: `brew install bash`)
#
# Output:
#     5 PDFs in ./compiled/, one per style. The script compiles each .tex
#     twice so cross-references and page counts resolve correctly.
# =============================================================================

set -euo pipefail

DELIVERABLES_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_DIR="$DELIVERABLES_DIR/compiled"

STYLES=(
  "the-minimalist"
  "the-modern"
  "the-bold"
  "the-engineer"
  "the-founder"
)

mkdir -p "$OUTPUT_DIR"

if ! command -v xelatex >/dev/null 2>&1; then
  echo "ERROR: xelatex not found in PATH." >&2
  echo "Install TeX Live (Linux), MacTeX (macOS), or MiKTeX (Windows), then re-run." >&2
  exit 1
fi

echo "Compiling ${#STYLES[@]} resumes into $OUTPUT_DIR ..."
echo ""

PASS=0
FAIL=0
for style in "${STYLES[@]}"; do
  TEX_FILE="$DELIVERABLES_DIR/$style.tex"
  if [ ! -f "$TEX_FILE" ]; then
    echo "  ✗ $style: missing $TEX_FILE" >&2
    FAIL=$((FAIL + 1))
    continue
  fi

  echo "  → $style"

  # xelatex writes a bunch of aux files; isolate them per-style in a temp dir
  # so the 5 builds don't clobber each other's refs.
  WORK_DIR="$(mktemp -d)"
  trap "rm -rf '$WORK_DIR'" EXIT

  (
    cd "$WORK_DIR"
    # First pass — pick up \ref and \cite
    if ! xelatex -interaction=nonstopmode -halt-on-error "$TEX_FILE" >"$WORK_DIR/build.log" 2>&1; then
      echo "    ✗ first pass failed (see $WORK_DIR/build.log)" >&2
      exit 1
    fi
    # Second pass — resolve the cross-references
    if ! xelatex -interaction=nonstopmode -halt-on-error "$TEX_FILE" >"$WORK_DIR/build.log" 2>&1; then
      echo "    ✗ second pass failed (see $WORK_DIR/build.log)" >&2
      exit 1
    fi
  ) || { FAIL=$((FAIL + 1)); continue; }

  PDF_NAME="$style.pdf"
  if [ -f "$WORK_DIR/$PDF_NAME" ]; then
    mv "$WORK_DIR/$PDF_NAME" "$OUTPUT_DIR/$PDF_NAME"
    rm -f "$WORK_DIR"/*.aux "$WORK_DIR"/*.log "$WORK_DIR"/*.out "$WORK_DIR"/*.toc 2>/dev/null || true
    echo "    ✓ compiled/$PDF_NAME"
    PASS=$((PASS + 1))
  else
    echo "    ✗ xelatex ran but no PDF was produced" >&2
    FAIL=$((FAIL + 1))
  fi
done

echo ""
echo "==============================================="
echo "Compiled: $PASS / $((PASS + FAIL))"
echo "Output:   $OUTPUT_DIR"
echo "==============================================="

if [ "$FAIL" -gt 0 ]; then
  exit 1
fi
