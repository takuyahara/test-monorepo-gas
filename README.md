# test-monorepo-gas

Google Apps Script (GAS) をモノレポにするための検証記録。

# Sparse Checkout

以下のコマンドを実行後にクローンされたフォルダをエディタで開き、各種パッケージをさらに Sparse Checkout する。

```shell
REPO=test-monorepo-gas && \
git clone --filter=blob:none --no-checkout git@github.com:takuyahara/${REPO}.git && \
git -C ./${REPO} sparse-checkout init --no-cone && \
echo '/*' > ./${REPO}/.git/info/sparse-checkout && \
echo '/*/' >> ./${REPO}/.git/info/sparse-checkout && \
echo '!/saya1/' >> ./${REPO}/.git/info/sparse-checkout && \
echo '!/sayb1/' >> ./${REPO}/.git/info/sparse-checkout && \
git -C ./${REPO} checkout
```

## [1.2.0 - `pnpm` を利用する](https://github.com/takuyahara/test-monorepo-gas/tree/1.2.0)

パッケージマネージャーとして yarn ではなく `pnpm` を用いる。要点は以下の 2 点。

1. ロックファイルの非共有

`.npmrc` ファイルを作成し、以下を記述する。これにより `pnpm install` にてパッケージがインストールされた際に、ロックファイルが各ディレクトリに作成されるため Sparse Checkout を用いた開発に対応できる。

```ini
shared-workspace-lockfile=false
```

2. ワークスペースの指定

pnpm においては、ワークスペースは `pnpm-workspace.yaml` に以下のように記述する。

```yaml
packages:
  - "saya1"
  - "sayb1"
  - "invalid_package"
```

## [1.1.0 - `yarn workspaces` を利用する](https://github.com/takuyahara/test-monorepo-gas/tree/1.1.0)

1. 各ディレクトリにおける package.json に[必要事項を入力](https://github.com/takuyahara/test-monorepo-gas/commit/4f0f0911efb1c9f6074983baf1024d4fe4b042b6)する。

2. プロジェクトルートディレクトリにてパッケージインストールを実行すると [package.json](https://github.com/takuyahara/test-monorepo-gas/blob/4f0f0911efb1c9f6074983baf1024d4fe4b042b6/package.json) に記載のパッケージ、および .workspaces.packages に記載のディレクトリ配下における package.json 内に記載のパッケージが一括でプロジェクトルートディレクトリの node_modules へインストールされる。

```shell
$ cd /workspaces/test-monorepo-gas
$ yarn install
(...略...)
Done in 0.12s.
$ ls -l node_modules | grep uglify-js
drwxr-xr-x   8 node node   256 Sep  9 22:05 uglify-js
```

Workspaces 配下に生成される node_modules の中身は、プロジェクトルートディレクトリの node_modules へインストールされたファイルへのシンボリックリンクになっている。

```shell
$ ls -l sayb1/node_modules/.bin/uglifyjs
lrwxr-xr-x 1 node node 44 Sep  9 22:05 sayb1/node_modules/.bin/uglifyjs -> ../../../node_modules/uglify-js/bin/uglifyjs
```

3. 独自パッケージを持つプロジェクトにて、ビルドとプロジェクトのプッシュの両方が成功することを確認する。

```shell
$ cd sayb1
$ make build
$ npx clasp push
```

また .workspaces.packages に無効なパッケージ名を指定してもエラーは発生せず、処理が正常に終了するため Sparse Checkout を用いて**一部のパッケージのみをクローンして開発する**ことも可能である。

**追記**

Sparse Checkout を使って開発すると yarn.lock ファイルに記述が変わる。例えば独自パッケージを用いる sayb1 の開発後にコミットし、その後に saya1 を Sparse Checkout して `yarn install` すると独自パッケージがインストールされないため、差分が yarn.lock 反映されてしまう。改善策を要調査。

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
