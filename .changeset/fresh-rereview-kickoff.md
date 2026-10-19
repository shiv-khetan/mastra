---
'@mastra/factory': patch
---

Fixed re-reviews that restated the previous verdict instead of reviewing a new push. The re-review kickoff now names the current pull request head and the commit the previous verdict was recorded on, so the reviewer starts a fresh pass for the new head. Fixes [#27590](https://github.com/mastra-ai/mastra/issues/27590).
