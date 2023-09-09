# @test-monorepo-gas/saya1

## Sparse Checkout

```shell
REPO=test-monorepo-gas PACKAGE=saya1 TEMPDIR=$(mktemp -d) \
sh -c 'git -C ${TEMPDIR} clone --filter=blob:none --no-checkout git@github.com:takuyahara/${REPO}.git && \
git -C ${TEMPDIR}/${REPO} sparse-checkout set && \
git -C ${TEMPDIR}/${REPO} sparse-checkout add ${PACKAGE} && \
git -C ${TEMPDIR}/${REPO} checkout && \
cp -r ${TEMPDIR}/${REPO}/${PACKAGE} . && \
rm -rf ${TEMPDIR}/${REPO} && \
cat .git/info/sparse-checkout | grep -v "!/${PACKAGE}/" > .git/info/sparse-checkout'
```
