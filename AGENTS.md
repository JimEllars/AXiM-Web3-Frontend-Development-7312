# Development Agent Handoff

Use one feature branch per task. Before editing, create a descriptive branch from the current
`main` and keep unrelated changes out of it.

1. Run the relevant tests, lint, and production build before handoff.
2. Commit only the completed task with a clear conventional commit message.
3. Publish the branch with `git push -u origin <branch-name>` and verify `git status` reports a
   clean tree that is up to date with `origin/<branch-name>`.
4. Use the workspace's authorized **Submit**, **Finish**, or completion action, then disconnect
   from the workspace. That completion/disconnect step triggers the platform handoff so human
   maintainers can review and merge the published branch.

Never claim a branch was published when `git push` or the completion workflow failed. Report the
exact failure and the commit SHA instead; do not amend a commit after handoff without publishing
the replacement commit.
