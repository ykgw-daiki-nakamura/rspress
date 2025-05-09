# Git ブランチ戦略

## ブランチ基本方針

- 直 push は feature ブランチのみとする
- 新機能開発や修正など、すべてのコード変更は feature ブランチのみとする
- 環境ブランチ（開発、検証）は継続的デプロイをサポートする（*本番環境は Ops による手動デプロイ）

## ブランチ種類とライフサイクル

| ブランチ名           | 用途                          | 説明                                              | ライフサイクル       | 派生元  | CI/CD 対応 |
| :------------------: | :---------------------------: | :----------------------------------------------: | :-----------------: | :----: | :--------: |
| main                 | 本番環境                       | develop ブランチで安定したコードを main にマージする| 永続                | -      | ✔         |
| develop              | 開発環境                      | feature ブランチをマージさせて確認する              | 永続                | main   | ✔         |
| feature/{Issue No}   | 機能開発用                    | 個別機能開発用のブランチ                            | 機能開発完了まで    | develop | ✔         |
| env/{Env Name}       | 検証環境、個別環境             | uat, in-validation, ex-validation, qa などの環境  | 検証完了まで        | develop | ✖         |

## Pull Request

PR に適切なラベルを設定し、[自動生成リリースノート - GitHub Docs](https://docs.github.com/ja/repositories/releasing-projects-on-github/automatically-generated-release-notes) で利用できる `.github/release.yml` を設定し、リリースノートを自動生成する。

## Release & Tags

### Tag

- バージョンごとにタグを発行する
- バージョンタグの発行は、GitHubのリリース機能のUIから実行することを推奨とする
- バージョンタグは[セマンティックバージョニング](https://semver.org/lang/ja/)に従う (例: `v1.2.4`)

セマンティックバージョニングは、以下の形式を使用します：

`**vX.Y.Z**`

- `X`: メジャーバージョン（大きな機能追加、非互換変更）
- `Y`: マイナーバージョン（後方互換のある新機能追加）
- `Z`: パッチバージョン（バグ修正や小規模改善）

>[!CAUTION]
>リリース後、修正が発生した場合、新しいバージョンタグを作成します（例: v1.2.1）。

### Release

Release Note は、[Generate release note] で作成することを推奨とする

>[!NOTE]
>[Generate release note] は、Pull Request のラベルと内容が反映されるので、Pull Request を適切に運用すること

## 開発～リリースフロー

### 開発フェーズ

1. **Feature Issue 作成**  
   開発が確定した機能について GitLab 上で Issue を作成する。

2. **feature ブランチ作成**  
   Feature Issue から [Create a branch] を押下し、`develop` から `feature/*` を作成。

3. **機能開発**  
   ソースコード変更後、`feature/*` ブランチにコミット・プッシュ。

4. **レビュー依頼 (Pull Request)**  
   開発完了後、`feature/*` から `develop` への Merge Request (Pull Request) を作成してレビューを依頼。

5. **マージ**  
   レビュー通過後、`develop` ブランチへマージ。

6. **Issue クローズ**  
   Pull Request マージ時、関連する Issue をクローズ。

7. **feature ブランチ削除**  
   Merge 完了後、`feature/*` ブランチを削除。

### 検証～リリースフェーズ

1. **検証環境ブランチ作成**  
   検証開始時、`develop` から `env/uat` / `env/in-validation` / `env/ex-validation` を作成し、各環境で検証を行う。

2. **修正対応**  
   検証中に修正が発生した場合は再度 `feature` ブランチで修正し、`develop` へマージ後、該当検証ブランチへ反映。

3. **リリース**  
   検証が完了したコードは、`main` に反映を完了させる。タグを付け、GitHub Release を発行する。その後、Ops により本番環境へデプロイ。

## テスト実行タイミング

| テストサイズ      | 総実行時間 | 実行者 | タイミング         | 概要                                         |
| ----------------- | ---------- | ------ | ------------------ | -------------------------------------------- |
| Smallテスト       | 1分以下    | 人/CI  | すべてのビルド時   | コード単独の単体テスト                       |
| Mediumテスト      | 5分以下    | CI     | Push時             | DB 等を含むユニット/結合テスト                |
| Largeテスト       | 15分以下   | CI     | Pull Request 時     | E2E テスト（一時的なコンテナ環境へのデプロイ） |
| Enormousテスト    | 1時間以下  | CI     | Daily (日次実行)   | STG 等共用環境での大規模 E2E リグレッションテスト |

## コミットメッセージ規約

[Semantic Commit Message](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716) に従います。  
`Conventional Commits` を推奨し、VS Code 拡張機能等を活用します。

| プレフィックス | 説明                               |
| -------------- | ---------------------------------- |
| feat:          | 新機能                             |
| fix:           | バグ修正                           |
| docs:          | ドキュメントのみの変更             |
| style:         | 機能影響なしのコードスタイル変更   |
| refactor:      | バグ修正・新機能以外のコード改善   |
| perf:          | パフォーマンス改善                 |
| test:          | テスト追加・修正                   |
| chore:         | ツールやライブラリ、補助的変更     |

## FAQ

### release-branch は不要なのか？

本アプリケーションは常に最新バージョンが展開され、旧バージョン維持を想定していないため、`release-branch` は不要です。

### hotfix-branch は不要なのか？

緊急修正も同様に `feature` ブランチで行い、厳格なフローに則って品質を確保します。

## 参考資料

### Git 運用に関する資料

- [GitLab Flowのベストプラクティス](https://about.gitlab.com/ja-jp/topics/version-control/what-are-gitlab-flow-best-practices/)
- [GitLab flowから学ぶワークフローの実践](https://postd.cc/gitlab-flow/)
- [GitLab Flow + GitHub Actions ではじめる、デプロイフローの改善・自動化](https://techblog.exawizards.com/entry/2021/01/21/111031)
- [Combine GitLab Flow and GitLab Duo for a workflow powerhouse](https://about.gitlab.com/blog/2023/07/27/gitlab-flow-duo/)
- [Gitブランチフロー規約 | Future Enterprise Coding Standards](https://future-architect.github.io/coding-standards/documents/forGitBranch/git_branch_standards.html)

### コミットメッセージに関する資料

- [コミットメッセージ規約「Conventional Commits」を導入してみよう！](https://speakerdeck.com/cocoeyes02/lets-use-conventional-commits)
- [良いコミットメッセージのルールメモ](https://zenn.dev/shotaro/articles/idea-git-commit-massage)
- [Gitのコミットメッセージの書き方（2023年ver.）](https://zenn.dev/itosho/articles/git-commit-message-2023)

### テストに関する資料

- [ユニットテストってもう言わない！ CI/CD時代のテスト分類に最適なテストサイズという考え方](https://zenn.dev/koduki/articles/e0f8824adbe0e9)
