# rspres

## ドキュメントの品質担保

1. ファイル保存時、保存したファイルにlinterを動作させる。
2. コミット時、ステージング状態のファイルにlinterを動作させる。なお、linterに定義されているルールを守っていない個所がある場合、コミットが許可されない。
3. Pull Request時、プロジェクト全体にlinterを動作させる。なお、linterに定義されているルールを守っていない個所がある場合、マージが許可されない。

本質ではない体裁に関する類のルールは、すべてlinterに落とし込むこと。

## 利用ツール

- textlnt: markdownファイルなどを対象とした文章校正をする静的解析ツール
- commitlint: コミットメッセージを対象としたメッセージの校正をする静的解析ツール
- lint-staged: staging状態のファイルを対象としてlintツールを実行させるツール
- husky: gitのフックを利用してスクリプトを実行するツール

\*lint-stagedを使わなくてもlinterを実行することは出来るが、ステージングされたファイルのみを対象とすることで動作を軽くする目的がある。

\*プロジェクト全体へのlinterのチェックはCI/CDにて対応する。

## 拡張機能

[Markdown All in One](https://marketplace.visualstudio.com/items/?itemName=yzhang.markdown-all-in-one)

Markdownの基本的な予測変換等をしてくれます。

[Conventional Commits](https://marketplace.visualstudio.com/items/?itemName=vivaxy.vscode-conventional-commits)

Conventional Commitsルールに従ってコミットメッセージを記述できます。

[textlint](https://marketplace.visualstudio.com/items/?itemName=3w36zj6.textlint)

ファイル保存と同時にtextlintを動作させることができます。

[prettier](https://marketplace.visualstudio.com/items/?itemName=esbenp.prettier-vscode)

ファイル保存と同時にprettierを動作させることができます。

[Markdownlint](https://marketplace.visualstudio.com/items/?itemName=DavidAnson.vscode-markdownlint)

Markdownの構文をチェックします。

## textlint

不自然なアルファベットを検出する：[textlint-rule-ja-unnatural-alphabet](https://github.com/textlint-ja/textlint-rule-ja-unnatural-alphabet)

冗長な表現を禁止する：[textlint-rule-ja-no-redundant-expression](https://github.com/textlint-ja/textlint-rule-ja-no-redundant-expression)

技術文書向けプリセット：[textlint-rule-preset-ja-technical-writing](https://github.com/textlint-ja/textlint-rule-preset-ja-technical-writing)

### 事例

[SmartHR](https://note.com/smarthr_co/n/n881866630eda)

[Qiita](https://qiita.com/tsubasa_k0814/items/23a7e0511616d5470625)

[DeNA](https://qiita.com/uhooi/items/02c269da914b77a029a6)

## Commitlint &　lint-staged & husky

npm install --save-dev husky lint-staged @commitlint/cli @commitlint/config-conventional

ファイルが作成される。

```commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
};
```

huskyのインストール。

```cli
npx husky-init
```

commit-msgフックの追加。

```cli
npx husky add .husky/commit-msg "npx commitlint --edit \$1"
```

.husky/commit-msg

```sh
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx commitlint --edit $1
```

.lintstagedrc.jsの作成。

```js
module.exports = {
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.md": ["textlint --fix"],
  "*.txt": ["textlint --fix"],
};
```

pre-commitフックの追加。

```cli
npx husky add .husky/pre-commit "npx lint-staged"
```

.husky/pre-commit

```sh
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
```

## JTF style check

日本語とEnglishの間にはスペースを入れる。（自動修正される）
自動修正以外のルールがチェックされないままコミットを通過してしまう問題を修正。
