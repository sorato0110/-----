# Tooltip Reflection Memo Implementation Plan

振り返り（Reflection）機能で記録したメモ（Growth, Autonomy, Connectionのテキストなど）を、後から省スペースで確認できるように、ツールチップ（ホバー・吹き出し方式）を用いたUIを実装します。

## Proposed Changes

### 1. `style.css`
- **[MODIFY]** `style.css`
  - 新たに `.reflection-tooltip-container` クラスと `.reflection-tooltip-text` クラスを追加します。
  - アイコン部分（`.reflection-tooltip-container`）にホバーした際、絶対配置（`position: absolute`）でツールチップ（`.reflection-tooltip-text`）がふわっと浮かび上がるCSSアニメーションとスタイルを定義します。
  - ツールチップは暗めの背景色に白文字など、見やすい配色に設定します。

### 2. `script.js`
- **[MODIFY]** `script.js`
  - 実験ログを表示する `renderLogs()` （または該当の関数）の描画ロジックを修正します。
  - 各ログデータ内に `reflection` オブジェクト（`growth`, `autonomy`, `connection` の各 `text`）が存在し、かつテキストが空でないかをチェックします。
  - メモが存在する場合、ログの表示エリア（例えばタイトルの横や、カードの右端など）に「💬 メモを見る」などのアイコン要素（`<span class="reflection-tooltip-container">`）を動的に生成して追加します。
  - そのアイコン要素の中に、抽出したメモの内容を改行などを整理してツールチップ要素として埋め込みます。

## Verification Plan
### Manual Verification
1. ローカルサーバーでサイトを開き、「自信度分析」タブへ移動。
2. テスト用のアーム（仮説）で振り返り（Reflection）まで完了させ、メモを入力する。
3. 学習ログのリストに💬アイコンが表示されているか確認する。
4. アイコンにマウスカーソルを合わせた際、ツールチップがはみ出さずに表示され、入力したメモ内容が正しく読めるか確認する。
