# Task 1 Report — Backend: project summaries endpoint

Status: DONE

## Commits
- (pending commit) feat: project summaries endpoint for home page

## Implementation
- studio.py: added `project_summaries()` after `list_projects()`. Iterates `PROJECTS_DIR`-derived `_projects_dir()`, reads `project_config.json` (defaults "", "", "en"), counts `scene_*.md` matching `^scene_\d+\.md$`, computes `last_modified` from newest scene mtime (or project dir mtime), `last_scene_preview` first 80 chars of highest-numbered scene. Sorts by last_modified desc (name asc tiebreak).
- web_ui.py: `/api/projects` now returns `{"projects": [...summaries...], "active": str}`.
- test_studio.py: added `test_project_summaries` covering 0/1/multiple projects, sorting not explicitly but preview truncation and missing files.

## Test summary
1 passed (test_project_summaries); full suite 35 passed, 1 pre-existing failure (test_generate_one_stream missing git_commit_scene, unrelated).

## Concerns
- mtime-based sorting depends on filesystem resolution; added deterministic name tiebreak.
- Pre-existing slow test failure unrelated to this task.
