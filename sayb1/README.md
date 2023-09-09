# @test-monorepo-gas/sayb1

```shell
REPO=test-monorepo-gas TEMPDIR=$(mktemp -d) \
sh -c 'git -C ${TEMPDIR} clone --filter=blob:none --no-checkout git@github.com:takuyahara/${REPO}.git && \
git -C ${TEMPDIR}/${REPO} sparse-checkout set && \
git -C ${TEMPDIR}/${REPO} sparse-checkout add sayb1 && \
git -C ${TEMPDIR}/${REPO} checkout && \
cp -r ${TEMPDIR}/${REPO}/sayb1 . && \
rm -rf ${TEMPDIR}/${REPO}'
```
