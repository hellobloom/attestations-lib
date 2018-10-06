### attestations-lib

Shared types and logic between blooms [iOS](https://itunes.apple.com/us/app/bloom-secure-identity/id1380492735) and [web](https://bloom.co/) dApp, [attestation-kit](https://github.com/hellobloom/attestation-kit), and [share-kit](https://github.com/hellobloom/share-kit).

#### Installation

`yarn add @bloomprotocol/attestations-lib`

### Attestations

| AttestationTypeID   | Web                | iOS                |
| ------------------- | ------------------ | ------------------ |
| `'phone'`           | :white_check_mark: | :white_check_mark: |
| `'email'`           | :white_check_mark: | :white_check_mark: |
| `'facebook'`        | :white_check_mark: | :white_check_mark: |
| `'sanction-screen'` | :white_check_mark: | :x:                |
| `'pep-screen'`      | :x:                | :x:                |
| `'id-document'`     | :white_check_mark: | :x:                |
| `'google'`          | :white_check_mark: | :white_check_mark: |
| `'linkedin'`        | :white_check_mark: | :white_check_mark: |
| `'twitter'`         | :white_check_mark: | :white_check_mark: |
| `'payroll'`         | :x:                | :x:                |
| `'ssn'`             | :x:                | :x:                |
| `'criminal'`        | :x:                | :x:                |
| `'offense'`         | :x:                | :x:                |
| `'driving'`         | :x:                | :x:                |
| `'employment'`      | :x:                | :x:                |
| `'education'`       | :x:                | :x:                |
| `'drug'`            | :x:                | :x:                |
| `'bank'`            | :x:                | :x:                |
| `'utility'`         | :x:                | :x:                |
| `'income'`          | :x:                | :x:                |
| `'assets'`          | :x:                | :x:                |
| `'full-name'`       | :x:                | :x:                |
| `'birth-date'`      | :x:                | :x:                |
| `'gender'`          | :x:                | :x:                |
