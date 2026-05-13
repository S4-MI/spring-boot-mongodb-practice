---
description: Generate a commit message from staged changes
allowed-tools: Bash(git diff:*), Bash(git status:*), Bash(git log:*)
---

Generate a commit message based on the currently staged changes.

Rules:
- Follow the repo's existing style: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:` — short imperative subject, no trailing period, under 70 chars.
- One subject line. Add bullet points in the body only if the "why" is not obvious from the subject or multiple distinct changes are bundled.
- Focus on intent ("why"), not file list ("what").
- Do NOT run `git commit`. Only print the message.
- Do NOT include `Co-Authored-By` or any tool attribution lines.

Steps:
1. Run `git diff --cached --stat` to check for staged changes.
2. If staged changes exist, run `git diff --cached` and base the message on those.
3. If nothing is staged, run `git diff` and `git status` and base the message on all unstaged + untracked changes. Note in one line above the code block that no changes are staged.
4. Run `git log -5 --oneline` to match existing style.
5. Print the commit message in a fenced code block. Nothing else.
