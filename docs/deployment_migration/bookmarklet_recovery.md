# 最も簡単なデータ救出方法（ブックマークレット）

パソコン内部のファイルから直接データを自動救出する処理を試みましたが、ブラウザ特有の強力な暗号化・圧縮がかかっており、システムからの自動取り出しができない状態でした。

そこで、**「開発者ツール（F12）」などの難しい操作を一切しなくても、エラー画面で1クリックするだけでデータを全自動ダウンロードできる「魔法のボタン（ブックマーク）」** を作成しました。
以下の手順でデータの救出をお願いいたします。（※PCのChromeまたはEdgeで行ってください）

### 手順1: 魔法のボタン（ブックマークレット）を作る
1. ブラウザのブックマークバー（お気に入りバー）の空いているところを「右クリック」し、**「ページを追加（またはフォルダを追加してその中に）」**を選択します。
2. 追加画面が出たら、以下のように入力して保存します。
   - **名前**: `データ救出`（何でもOKです）
   - **URL**: 下記の `javascript:...` から始まるコードを**すべてコピーして、そのまま貼り付けます**。

```javascript
javascript:(function(){var d={tasks:localStorage.getItem("bayesTasks"),hypotheses:localStorage.getItem("bayesHypotheses"),logs:localStorage.getItem("bayesLogs"),dailyLogs:localStorage.getItem("bayesDailyLogs"),selfAnalysis:localStorage.getItem("bayesSelfAnalysis")};var b=new Blob([JSON.stringify(d,null,2)],{type:"application/json"});var a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="haze_strategy_backup.json";document.body.appendChild(a);a.click();document.body.removeChild(a);alert("データの救出（ダウンロード）が完了しました！");})();
```

### 手順2: エラー画面でボタンを押す
1. エラーになって開けない元のウェブサイトにアクセスします。
   　👉 `https://haze-strategy-web.an.r.appspot.com` 
   （※「503 サーバーエラー」の画面が出たままの状態でOKです）
2. そのエラー画面を開いたままの状態で、手順1で作った **「データ救出」ブックマークをクリック** します。

### 手順3: 完了！
「データの救出（ダウンロード）が完了しました！」というポップアップが出現し、`haze_strategy_backup.json` というファイルがパソコンに自動でダウンロードされます。
これで大切なデータは手元に確保されました。

---
ダウンロードが確認できましたらお知らせください。新しい無料サーバー（Vercel）の立ち上げと、このデータを入れる作業を進めます！
