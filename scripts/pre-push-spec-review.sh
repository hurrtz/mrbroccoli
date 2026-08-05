#!/usr/bin/env bash
# Review living specs before code-bearing commits are pushed.

set -eu

ZERO_SHA="0000000000000000000000000000000000000000"
MIN_JUSTIFICATION_LEN=10

if [ -n "${SPEC_REVIEW_BASELINE:-}" ]; then
  BASELINE="$SPEC_REVIEW_BASELINE"
else
  default_ref=$(git symbolic-ref --quiet refs/remotes/origin/HEAD 2>/dev/null || true)
  if [ -n "$default_ref" ]; then
    BASELINE="${default_ref#refs/remotes/}"
  elif git rev-parse --verify --quiet origin/main >/dev/null; then
    BASELINE="origin/main"
  else
    BASELINE="origin/master"
  fi
fi

changed_files=""
commit_ranges=""

add_range() {
  local base="$1"
  local tip="$2"
  local files
  files=$(git diff --name-only "${base}..${tip}" 2>/dev/null || true)
  changed_files=$(printf '%s\n%s\n' "$changed_files" "$files")
  commit_ranges="$commit_ranges ${base}..${tip}"
}

resolve_baseline_or_skip() {
  if git rev-parse --verify --quiet "$BASELINE" >/dev/null; then
    return 0
  fi
  printf 'spec-review: cannot resolve baseline %s; skipping\n' "$BASELINE" >&2
  exit 0
}

if [ -t 0 ]; then
  resolve_baseline_or_skip
  merge_base=$(git merge-base "$BASELINE" HEAD 2>/dev/null || true)
  if [ -z "$merge_base" ]; then
    printf 'spec-review: no merge-base between %s and HEAD; skipping\n' "$BASELINE" >&2
    exit 0
  fi
  add_range "$merge_base" HEAD
else
  pushed_refs=$(cat)
  if [ -z "$pushed_refs" ]; then
    printf 'spec-review: nothing being pushed; skipping\n'
    exit 0
  fi

  while IFS=' ' read -r _local_ref local_sha _remote_ref remote_sha; do
    [ -n "$local_sha" ] || continue
    [ "$local_sha" != "$ZERO_SHA" ] || continue

    if [ "$remote_sha" = "$ZERO_SHA" ]; then
      resolve_baseline_or_skip
      base=$(git merge-base "$BASELINE" "$local_sha" 2>/dev/null || true)
      [ -n "$base" ] || continue
    else
      base="$remote_sha"
    fi
    add_range "$base" "$local_sha"
  done <<<"$pushed_refs"
fi

changed_files=$(printf '%s\n' "$changed_files" | grep -v '^$' | sort -u || true)
commit_ranges="${commit_ranges# }"

if [ -z "$changed_files" ]; then
  printf 'spec-review: no file changes in this push; skipping\n'
  exit 0
fi

code_files=$(
  printf '%s\n' "$changed_files" |
    grep -E \
      '^(app|src|android|ios|plugins|scripts|data|\.maestro|\.githooks)/|^(app\.json|eas\.json|package(-lock)?\.json|tsconfig[^/]*\.json|eslint\.config\.js|jest\.config\.js|jest\.setup\.js|knip\.json|metro\.config\.js|babel\.config\.js|Makefile)$' |
    grep -Ev '\.(md|txt)$' || true
)
spec_files=$(printf '%s\n' "$changed_files" | grep -E '(^|/)(SPEC|DESIGN)\.md$' || true)

if [ -z "$code_files" ]; then
  printf 'spec-review: no code, native, build, or script files in this push; skipping\n'
  exit 0
fi

if [ -n "${SPEC_REVIEW_ACK:-}" ]; then
  if [ "${#SPEC_REVIEW_ACK}" -lt "$MIN_JUSTIFICATION_LEN" ]; then
    printf 'spec-review: SPEC_REVIEW_ACK must contain at least %d characters of justification\n' "$MIN_JUSTIFICATION_LEN" >&2
    exit 1
  fi
  printf 'spec-review: acknowledged via SPEC_REVIEW_ACK ("%s")\n' "$SPEC_REVIEW_ACK"
  exit 0
fi

# shellcheck disable=SC2086
trailer=$(git log $commit_ranges --format=%B 2>/dev/null | grep -E '^Spec-Review:' | head -1 || true)
if [ -n "$trailer" ]; then
  justification=$(printf '%s' "$trailer" | sed -E 's/^Spec-Review:[[:space:]]*//')
  if [ "${#justification}" -lt "$MIN_JUSTIFICATION_LEN" ]; then
    printf 'spec-review: Spec-Review trailer must contain at least %d characters of justification\n' "$MIN_JUSTIFICATION_LEN" >&2
    exit 1
  fi
  printf 'spec-review: acknowledged via Spec-Review trailer ("%s")\n' "$justification"
  exit 0
fi

relevant_specs=$(
  {
    [ -f SPEC.md ] && printf 'SPEC.md\n'
    [ -f DESIGN.md ] && printf 'DESIGN.md\n'
    printf '%s\n' "$code_files" | while IFS= read -r code_file; do
      [ -n "$code_file" ] || continue
      directory=$(dirname "$code_file")
      while [ "$directory" != "." ] && [ "$directory" != "/" ]; do
        [ -f "$directory/SPEC.md" ] && printf '%s/SPEC.md\n' "$directory"
        [ -f "$directory/DESIGN.md" ] && printf '%s/DESIGN.md\n' "$directory"
        directory=$(dirname "$directory")
      done
    done
  } | sort -u
)

cat <<'EOF'

============================================================
LIVING SPEC REVIEW REQUIRED
============================================================

This push contains code, native, build, or script changes. Review the
SPEC.md / DESIGN.md chain and answer four questions:

  1. MODIFY       Does existing behavior or rationale need documenting?
  2. CREATE       Does a new stable boundary need its own living spec?
  3. RESTRUCTURE  Did ownership move so specs should move or split?
  4. DROP         Did deleted behavior make a spec obsolete?

The review covers only the commits in this push. Spec updates may be in any
of those commits, or absent when the acknowledgement explains why.

Context:
EOF

printf '  Baseline: %s\n' "$BASELINE"
printf '  Commit ranges: %s\n\n' "$commit_ranges"
printf '  Changed implementation files:\n'
printf '%s\n' "$code_files" | sed 's/^/    - /'
printf '\n  Spec files changed in this push:\n'
if [ -n "$spec_files" ]; then
  printf '%s\n' "$spec_files" | sed 's/^/    - /'
else
  printf '    (none)\n'
fi
printf '\n  Relevant living specs:\n'
if [ -n "$relevant_specs" ]; then
  printf '%s\n' "$relevant_specs" | sed 's/^/    - /'
else
  printf '    (none found; consider whether the affected boundary needs one)\n'
fi

cat <<EOF

After reviewing, push again with one of:

  SPEC_REVIEW_ACK="updated the affected voice specs" git push

or add a durable commit trailer:

  Spec-Review: documented the affected runtime contract

Justifications must contain at least ${MIN_JUSTIFICATION_LEN} characters.
============================================================
EOF

exit 1
