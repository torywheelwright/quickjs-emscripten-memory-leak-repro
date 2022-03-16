import assert from 'assert';
import { QuickJSHandle, getQuickJS } from 'quickjs-emscripten';

function get(): number {
  return process.memoryUsage().external;
}

function format(mem: number): string {
  return `${mem / (1000 * 1000)}`;
}

async function main() {
  const QuickJS = await getQuickJS();

  const initial = get();
  let n = 0;
  let last = initial;

  while (true) {
    const vm = QuickJS.createVm();
    const result = vm.evalCode("const arr = []; for (let i = 0; i < 1000; ++i) { arr.push(i); } arr");
    assert(!result.error);

    // It doesn't leak if you comment this line out.
    vm.dump(result.value);

    result.value.dispose();
    vm.dispose();

    const current = get();

    if (n % 1000 === 0) {
      console.log(
        new Date().toISOString(),
        '[',
        n,
        ']',
        'initial:',
        format(initial),
        'current:',
        format(current),
        'cumulative change:',
        format(current - initial),
      );
    }

    last = current;
    ++n;
  }
}

main();
