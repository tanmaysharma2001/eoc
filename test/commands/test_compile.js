/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2022 Yegor Bugayenko
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const fs = require('fs');
const path = require('path');
const {runSync, assertFilesExist} = require('../helpers');

describe('eoc', function() {
  it('compiles a simple .EO program into Java bytecode .class files', function(done) {
    this.timeout(100000);
    home = path.resolve('temp/test-compile/simple');
    fs.rmSync(home, {recursive: true, force: true});
    fs.mkdirSync(path.resolve(home, 'src'), {recursive: true});
    fs.writeFileSync(
      path.resolve(home, 'src/simple.eo'),
      [
        '+package foo.bar',
        '+alias org.eolang.io.stdout',
        '',
        '[args...] > app',
        '  stdout "Hello, world!" > @',
        '',
      ].join('\n')
    );
    runSync([
      'register', '-s', path.resolve(home, 'src'), '-t', path.resolve(home, 'target'),
    ]);
    runSync([
      'assemble', '-t', path.resolve(home, 'target'),
    ]);
    runSync([
      'transpile', '-t', path.resolve(home, 'target'),
    ]);
    const stdout = runSync([
      'compile', '-t', path.resolve(home, 'target'),
    ]);
    assertFilesExist(
      stdout, home,
      [
        'target/generated-sources/EOfoo/EObar/EOapp.java',
        'target/generated-sources/EOorg/EOeolang/EObytes.java',
        'target/classes/EOfoo/EObar/EOapp.class',
        'target/classes/org/eolang/Phi.class',
        'target/classes/EOorg/EOeolang/EOint.class',
      ]
    );
    done();
  });
});