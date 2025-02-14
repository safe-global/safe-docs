# Migrate to v6

This guide references the major changes between v5 and v6 to help those migrating an existing app.

## Removing `SigningMethod` and `SigningMethodType`

We moved these types to the `api-kit`.

```typescript
// old v5 code
import { SigningMethod, SigningMethodType } from '@safe-global/protocol-kit'

// new v6 code
import { SigningMethod, SigningMethodType } from '@safe-global/api-kit'
```
