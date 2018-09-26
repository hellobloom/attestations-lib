### attestations-lib

This library contains attestation specific types and logic, to be shared between
bloom repos.

#### Scripts

Build: Run `yarn build`, which runs `bin/build`.
Lint: Run `bin/tslint`
Pretty: Run `bin/prettier`

#### Packaging
1. Bump version in `package.json` and commit / push
2. Remove any previous package files from the repo directory (the next step would create the package with these unecessary files/folders)
3. Run `yarn pack` to create the .tgz that will be uploaded in the following step.
4. Create a release on GitHub, tag it with version number, associate it with the commit from step 1, and upload the aforementioned .tgz file. 

#### Consuming

In order to consume this package, go to: https://github.com/hellobloom/attestations-lib/releases
and run: `yarn add DIRECT_LINK_TO_RELEASE_TGZ`
