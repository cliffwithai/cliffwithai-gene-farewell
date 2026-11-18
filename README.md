# Gama 夥伴的海底郵局

Gene 的送別卡：選名字 → 讀 Gene 寫給你的信 → 包一根糖蔥送給 Gene 大星。不需要任何帳號。

- 網站：本 repo 的 GitHub Pages（從 `main` 分支根目錄發布）
- 糖蔥存放：Google 試算表「Gene 大星的糖蔥（海底郵局留言）」，透過 `apps-script/Code.gs` 讀寫
- 設定：把 Apps Script 部署成網頁應用程式後，把網址填進 `index.html` 的 `const SHEET_API = "";`

管理留言：在試算表 H 欄填 TRUE 可隱藏一根糖蔥，刪掉整列則永久移除。
