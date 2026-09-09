import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

test('frontend commands are unchanged and no script references the removed Node backend', () => {
  assert.equal(pkg.scripts.dev, 'vite');
  assert.equal(pkg.scripts.build, 'vite build');
  assert.equal(pkg.scripts.preview, 'vite preview');
  for (const value of Object.values(pkg.scripts)) assert.doesNotMatch(value, /server\/index\.js/);
});

for (const [name, goal] of Object.entries({server: 'spring-boot:run', 'server:dev': 'spring-boot:run', 'backend:test': 'test', 'backend:build': 'package'})) {
  test(`${name} selects the backend directory and forwards ${goal}`, () => {
    assert.equal(pkg.scripts[name], `cd backend && mvn ${goal}`);
    // Exercise only shell forwarding with a harmless Maven stand-in; no Java or database starts.
    if (process.platform === 'win32') return;
    const dir = mkdtempSync(join(tmpdir(), 'exam-workspace-'));
    try {
      mkdirSync(join(dir, 'backend'));
      mkdirSync(join(dir, 'bin'));
      const output = join(dir, 'received.json');
      const binary = join(dir, 'bin', 'mvn');
      writeFileSync(binary, `#!${process.execPath}\nrequire('node:fs').writeFileSync(process.env.WORKSPACE_TEST_OUTPUT, JSON.stringify({cwd:process.cwd(),args:process.argv.slice(2)}));\n`, {mode:0o755});
      const result = spawnSync('/bin/sh', ['-c', pkg.scripts[name]], {cwd:dir, env:{...process.env, PATH:join(dir,'bin')+':'+process.env.PATH, WORKSPACE_TEST_OUTPUT:output}, encoding:'utf8', timeout:5000});
      assert.equal(result.status, 0, result.stderr || result.error?.message);
      const received = JSON.parse(readFileSync(output, 'utf8'));
      assert.equal(resolve(received.cwd), resolve(dir, 'backend'));
      assert.deepEqual(received.args, [goal]);
    } finally { rmSync(dir, {recursive:true, force:true}); }
  });
}
