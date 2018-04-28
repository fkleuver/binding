require.config({
  baseUrl: ".",
  paths: {
    "aurelia-binding-new": "dist/amd/aurelia-binding"
  }
});

require(["aurelia-binding-new"], function(binding) {
  window.bindingNew = binding;
});

require(["aurelia-binding"], function(binding) {
  window.bindingCurrent = binding;
});


function getTests() {
  return [
    {
      expression: '\'foo\'',
      weight: 1, parsers: [], elapsed: 0
    },
    {
      expression: 'true',
      weight: 1, parsers: [], elapsed: 0
    },
    {
      expression: 'false',
      weight: 1, parsers: [], elapsed: 0
    },
    {
      expression: 'null',
      weight: 1, parsers: [], elapsed: 0
    },
    {
      expression: 'undefined',
      weight: 1, parsers: [], elapsed: 0
    },
    {
      expression: '0',
      weight: 1, parsers: [], elapsed: 0
    },
    {
      expression: '1',
      weight: 1, parsers: [], elapsed: 0
    },
    {
      expression: '42',
      weight: 1, parsers: [], elapsed: 0
    },
    {
      expression: '-1',
      weight: 1, parsers: [], elapsed: 0
    },
    {
      expression: '9007199254740992',
      weight: 1, parsers: [], elapsed: 0
    },
    {
      expression: '1.7976931348623157e+308',
      weight: 1, parsers: [], elapsed: 0
    },
    {
      expression: '-9007199254740992',
      weight: 1, parsers: [], elapsed: 0
    },
    {
      expression: '5e-324',
      weight: 1, parsers: [], elapsed: 0
    },
    {
      expression: '2.2',
      weight: 1, parsers: [], elapsed: 0
    },
    {
      expression: '2.2e2',
      weight: 1, parsers: [], elapsed: 0
    },
    {
      expression: '.42',
      weight: 1, parsers: [], elapsed: 0
    },
    {
      expression: '0.42',
      weight: 1, parsers: [], elapsed: 0
    },
    {
      expression: 'foo & bar',
      weight: 1, parsers: [], elapsed: 0
    },
    {
      expression: 'foo & bar:x:y:z & baz:a:b:c',
      weight: 1, parsers: [], elapsed: 0
    },
    {
      expression: 'foo | bar',
      weight: 1, parsers: [], elapsed: 0
    },
    {
      expression: 'foo | bar:x:y:z | baz:a:b:c',
      weight: 1, parsers: [], elapsed: 0
    },
    {
      expression: 'foo | bar:x:y:z & baz:a:b:c',
      weight: 1, parsers: [], elapsed: 0
    },
    {
      expression: 'foo',
      weight: 50, parsers: [], elapsed: 0
    },
    {
      expression: 'foo.bar',
      weight: 50, parsers: [], elapsed: 0
    },
    {
      expression: 'foo.bar.foo.bar',
      weight: 1, parsers: [], elapsed: 0
    },
    {
      expression: 'foo = bar',
      weight: 1, parsers: [], elapsed: 0
    },
    {
      expression: 'foo = bar = baz',
      weight: 1, parsers: [], elapsed: 0
    },
    {
      expression: 'foo(x)',
      weight: 1, parsers: [], elapsed: 0
    },
    {
      expression: 'foo.bar(x)',
      weight: 1, parsers: [], elapsed: 0
    },
    {
      expression: '$this',
      weight: 1, parsers: [], elapsed: 0
    },
    {
      expression: '$this.foo',
      weight: 1, parsers: [], elapsed: 0
    },
    {
      expression: '$this()',
      weight: 1, parsers: [], elapsed: 0
    },
    {
      expression: '$this.foo(x)',
      weight: 1, parsers: [], elapsed: 0
    },
    {
      expression: '$this.foo(x, $this.foo(x))',
      weight: 1, parsers: [], elapsed: 0
    },
    {
      expression: 'matcher.bind($parent)',
      weight: 1, parsers: [], elapsed: 0
    },
    {
      expression: '{parent: $parent}',
      weight: 1, parsers: [], elapsed: 0
    },
    {
      expression: '{parent: $parent, foo: bar}',
      weight: 1, parsers: [], elapsed: 0
    },
    {
      expression: '{ foo, bar }',
      weight: 1, parsers: [], elapsed: 0
    },
    {
      expression: 'foo ? bar : baz',
      weight: 1, parsers: [], elapsed: 0
    },
    {
      expression: 'foo ? bar : (foo ? bar : baz)',
      weight: 1, parsers: [], elapsed: 0
    },
    {
      expression: 'foo === true ? bar : (foo === true ? bar : baz)',
      weight: 1, parsers: [], elapsed: 0
    }
  ];
}

function perfTest (parserCtor, iterations) {
  const tests = getTests();
  const result = { tests, weight: 0 };
  const start = performance.now();

  for (const test of tests) {
    const { expression, weight } = test;
    result.weight += weight;
    const exprStart = performance.now();
    for (let i = 0; i < weight * iterations; i++) {
      new parserCtor().parse(expression);
    }
    test.elapsed = performance.now() - exprStart;
  }

  result.elapsed = performance.now() - start;
  return result;
}

function getIterations () {
  return parseInt(document.querySelector("#iterations").value, 10);
}

function executeTest () {
  const resultCurrent = perfTest(bindingCurrent.Parser, getIterations());
  const resultNew = perfTest(bindingNew.Parser, getIterations());

  document.querySelector("table>tbody").innerHTML = "";

  const row = createRow("Total", resultCurrent, resultNew);
  document.querySelector("table>tbody").appendChild(row);

  const tests = getTests();
  for (let i = 0; i < tests.length; i++) {
    const row = createRow(tests[i].expression, resultCurrent.tests[i], resultNew.tests[i]);
    document.querySelector("table>tbody").appendChild(row);
  }
};

function createRow (expression, resultCurrent, resultNew) {
  const elapsedCurrent = resultCurrent.elapsed;
  const elapsedNew = resultNew.elapsed;

  const difference = (Math.max(elapsedCurrent, elapsedNew) / Math.min(elapsedCurrent, elapsedNew) - 1) * 100;
  const row = document.createElement("tr");
  let cell;

  cell = document.createElement("td");
  cell.innerText = expression;
  row.appendChild(cell);

  cell = document.createElement("td");
  cell.innerText = resultCurrent.weight ? resultCurrent.weight * getIterations() : "";
  row.appendChild(cell);

  cell = document.createElement("td");
  cell.innerText = `${Math.round(elapsedCurrent)}ms`;
  row.appendChild(cell);

  cell = document.createElement("td");
  cell.innerText = `${Math.round(elapsedNew)}ms`;
  row.appendChild(cell);

  cell = document.createElement("td");
  cell.innerText = `${elapsedNew > elapsedCurrent ? '-' : '+'}${Math.round(difference)}%`;
  cell.classList.add(elapsedNew > elapsedCurrent ? 'negative' : 'positive')
  row.appendChild(cell);


  return row;
}


document.querySelector("#test").addEventListener("click", executeTest);
