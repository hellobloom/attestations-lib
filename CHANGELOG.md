## 5.4.0

**Improvements**

- Remove dependency on [@bloomprotocol/verify-kit](https://github.com/hellobloom/verify-kit)
  - This removes the circular dependency between `verify-kit` and `attestations-lib`
- Add types related to verifiable presentation and credentials
  - These types were previously in `verify-kit` which was causing the circular dependency

## 5.3.0

- Adds `dob` property to `IBaseAttPEPData` type.

## 5.0.0

**Improvements**

- Use [tsdx](https://github.com/palmerhq/tsdx) to build

**Breaking**

- The way the package is bundled/shipped has changed. If you are using just the top-level entry point you can upgrade to this version with no trouble.
