# Gama 夥伴的海底郵局

Gene 的送別卡：選名字 → 讀 Gene 寫給你的信 → 包一根糖蔥送給 Gene 大星。不需要任何帳號。

- 網站：https://cliffwithai.github.io/cliffwithai-gene-farewell/（GitHub Pages，從 `main` 分支根目錄發布）
- 糖蔥存放：Firebase Firestore 的 `candies` 集合，每位訪客用匿名登入，只能寫自己那一根
- 設定：`index.html` 裡的 `FIREBASE_CONFIG`；安全規則在 `firebase/firestore.rules`

管理留言：在 Firebase 後台的 Firestore 裡，對某根糖蔥加上欄位 `hidden`（布林值 true）就會隱藏；刪掉文件則永久移除。

`apps-script/Code.gs` 是先前 Google 試算表方案的備份，目前未使用。
