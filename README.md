# test-monorepo-gas

Google Apps Script (GAS) をモノレポにするための検証記録。

## [1.0.0 - 共通化するには工夫が必要](https://github.com/takuyahara/test-monorepo-gas/tree/1.0.0)

1. 共有パッケージ clasp をインストールする。

```shell
$ cd /workspaces/test-monorepo-gas
$ yarn install
(...略...)
Done in 0.12s.
```

2. 独自パッケージを持たないプロジェクトをプッシュする。

```shell
$ cd saya1
$ npx clasp push
└─ appsscript.json
└─ Code.js
Pushed 2 files.
```

3. 別プロジェクト用の独自パッケージをインストールする。

```shell
$ cd /workspaces/test-monorepo-gas
$ yarn --cwd sayb1 --modules-folder $(pwd)/node_modules install
(...略...)
Done in 0.12s.
```

4. 別プロジェクトにて独自パッケージを用いたビルドを実行する。

```shell
$ cd sayb1
$ make build
```

5. 💀 プロジェクトのプッシュに失敗する。

```shell
$ npx clasp push
npm ERR! could not determine executable to run
```

原因は 3. で独自パッケージをインストールしたこと。その際に利用した `./sayb1/package.json` には clasp が記述されていないため、不要なパッケージと判断されて削除されている。
