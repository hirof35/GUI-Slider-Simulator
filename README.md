# 🌊 Random Water Slider Simulator

TypeScriptとHTML5 Canvasで開発した、リアルタイム・ランダムウォータースライダー・シミュレーターです。
コースがランダムかつ滑らかに自動生成され、サーファー（🏄）が速度やコースの形状（急降下や水溜まり）に応じてエフェクトと共に滑り降ります。
<img width="1293" height="989" alt="スクリーンショット 2026-06-02 074717" src="https://github.com/user-attachments/assets/ebdaf60b-9271-407c-a5cd-977272563490" />

> **デモサイト:** [こちらからブラウザで遊べます](https://[あなたのユーザー名].github.io/random-water-slider/)

---

## 🚀 特徴

- **100% TypeScript**: 型安全な設計で、ゲームロジックと描画ロジックを分離して管理。
- **ランダム＆無限コース生成**: 走行距離に応じて、直線・左カーブ・右カーブ・急降下・スプラッシュなどのパーツが重み付きランダムで自動的に生成されます。
- **滑らかなアニメーション**: `requestAnimationFrame` を使用し、秒間60フレームの滑らかなスクロールと、慣性を考慮したプレイヤー（🏄）の左右の動きを表現。
- **動的なステータス変化**: コースの状況によってプレイヤーの速度がリアルタイムに変化し、特殊なセグメントでは視覚的なエフェクト（トースト通知、コースの色変化）が発生します。

---

## 📁 フォルダ構成

```text
├── index.html         # ゲーム画面を表示するメインHTML
├── tsconfig.json       # TypeScript設定ファイル
├── README.md           # 本ドキュメント
├── src/
│   └── slider.ts       # 【TypeScript】ゲームロジック・Canvas描画
└── dist/
    └── slider.js       # 【JavaScript】コンパイル後の成果物（.gitignoreにより通常はGit追跡対象外）
🛠️ ローカルでの実行方法
1. 前提条件のインストール
Node.js環境とTypeScriptがインストールされている必要があります。

Bash
npm install -g typescript
2. リポジトリのクローン
Bash
git clone [https://github.com/](https://github.com/)[あなたのユーザー名]/random-water-slider.git
cd random-water-slider
3. TypeScriptのコンパイル
ファイルを監視して自動コンパイル（Watchモード）を実行します：

Bash
npx tsc -w
実行すると、新たに dist/slider.js が生成されます。

4. ブラウザで起動
ルートフォルダにある index.html をブラウザ（Chrome、Edge、Safariなど）でダブルクリック等で開くだけで、シミュレーターがスタートします。

🎮 ゲームのルール（仕様）
ゴール: 150mを滑りきるとゲームクリア。

コースセグメントの特徴:

STRAIGHT (水色): 通常コース。徐々に加速します。

LEFT_TURN / RIGHT_TURN (水色): 急カーブ。プレイヤーが左右に振られ、遠心力で少し減速します。

DROP (紫色): 急降下。コース幅が狭くなり、時速が急激に跳ね上がります。

SPLASH (濃紺色): 水溜まり。コース幅が広がり、水飛沫とともに大きく減速します。

📝 ライセンス
MIT
