# Running Tests

This project uses [Vitest](https://vitest.dev/) for unit testing.

## Installation

Tests require Vitest to be installed:

```bash
pnpm install
```

## Running Tests

### Run all tests once
```bash
pnpm test:run
```

**Note**: The test script automatically handles PostCSS config compatibility by temporarily renaming `postcss.config.mjs` during test execution.

### Run tests in watch mode (auto-reload on file changes)
```bash
pnpm test
# or
pnpm test:watch
```

### Run tests with UI (interactive)
```bash
pnpm test:ui
```

This opens a web UI at `http://localhost:51204/__vitest__/` where you can:
- See test results in real-time
- Filter and search tests
- View coverage reports
- Debug failing tests

## Test Files

Test files should be placed next to the code they test with the `.test.ts` or `.spec.ts` extension:

- `src/lib/marketStatus.test.ts` - Tests for market status computation
- Other test files follow the same pattern

## Writing Tests

Example test structure:

```typescript
import { describe, it, expect } from 'vitest';
import { getMarketStatus } from './marketStatus';

describe('getMarketStatus', () => {
  it('should return open status during trading hours', () => {
    const now = new Date('2025-03-18T18:00:00Z'); // 2 PM ET
    const status = getMarketStatus('nyse-market-id', now);
    
    expect(status.isOpen).toBe(true);
  });
});
```

## Current Test Coverage

The `getMarketStatus()` function has comprehensive test coverage including:

1. ✅ NYSE normal weekday open
2. ✅ NYSE before opening hours
3. ✅ NYSE after closing hours
4. ✅ LSE weekend closed (Saturday)
5. ✅ LSE weekend closed (Sunday)
6. ✅ Sun-Thu market closed on Friday
7. ✅ Sun-Thu market open on Sunday
8. ✅ Market with lunch break - closed during lunch
9. ✅ Market with lunch break - open before lunch
10. ✅ Fixed holiday closure - New Year's Day
11. ✅ Good Friday closure (Easter-derived)
12. ✅ Easter Monday closure (LSE)
13. ✅ MLK Day closure (3rd Monday of January)
14. ✅ Memorial Day closure (Last Monday of May)
15. ✅ Labor Day closure (1st Monday of September)
16. ✅ Thanksgiving closure (4th Thursday of November)
17. ✅ Half-day holiday - Day after Thanksgiving
18. ✅ Invalid market ID error handling

## Test Requirements

All tests:
- ✅ Use no external APIs (completely self-contained)
- ✅ Use static config data (markets, sessions, holidays)
- ✅ Cover edge cases and error scenarios
- ✅ Verify correct calculation of next change times
