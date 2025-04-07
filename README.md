# rspress


## textlint

自然言語のリンター。

不自然なアルファベットを検出する
https://github.com/textlint-ja/textlint-rule-ja-unnatural-alphabet

冗長な表現を禁止する
https://github.com/textlint-ja/textlint-rule-ja-no-redundant-expression

技術文書向けプリセット
https://github.com/textlint-ja/textlint-rule-preset-ja-technical-writing


### 事例

SmartHR
https://note.com/smarthr_co/n/n881866630eda

Qiita
https://qiita.com/tsubasa_k0814/items/23a7e0511616d5470625

DeNA
https://qiita.com/uhooi/items/02c269da914b77a029a6

## Commitlint &　lint-staged & husky

npm install --save-dev husky lint-staged @commitlint/cli @commitlint/config-conventional

ファイルが作成される。
```commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
};
```

husky のインストール。
```
npx husky-init
```

commit-msg フックの追加。
```
npx husky add .husky/commit-msg "npx commitlint --edit \$1"
```

.husky/commit-msg
```
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx commitlint --edit $1
```

.lintstagedrc.js の作成。
```
module.exports = {
    '*.{js,jsx,ts,tsx}': [
      'eslint --fix',
      'prettier --write',
    ],
    '*.md': [
        'textlint --fix'
      ],
      '*.txt': [
        'textlint --fix'
      ]
  };
  
```

pre-commit フックの追加。
```
npx husky add .husky/pre-commit "npx lint-staged"
```

.husky/pre-commit
```
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
```