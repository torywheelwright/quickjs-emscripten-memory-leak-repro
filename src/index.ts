import {
  QuickJSContext,
  QuickJSHandle,
  Scope,
  TestQuickJSWASMModule,
  getQuickJS,
} from 'quickjs-emscripten';

async function testWithScope(code: string) {
  const QuickJS = await getQuickJS();

  await Scope.withScopeAsync(async scope => {
    const ctx = scope.manage(QuickJS.newContext());

    try {
      ctx.evalCode(code);
    } catch (e) {
      console.error('caught:', e);
      return;
    }

    throw new Error('expected evalCode to throw');
  });
}

async function testWithoutScope(code: string) {
  const QuickJS = await getQuickJS();
  const ctx = QuickJS.newContext();

  try {
    ctx.evalCode(code);
  } catch (e) {
    console.error('caught:', e);
    return;
  } finally {
    ctx.dispose();
  }

  throw new Error('expected evalCode to throw');
}

const SYNC_CODE = 'function run() { run(); }; run()';
const ASYNC_CODE = 'async function run() { await run(); }; run()';

async function main() {
  await testWithoutScope(SYNC_CODE);
  // await testWithoutScope(ASYNC_CODE);
  // await testWithScope(SYNC_CODE);
  // await testWithScope(ASYNC_CODE);
}

main();
