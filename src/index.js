function eval() {
  // Do not use eval!!!
  return;
}

function expressionCalculator(expr) {
  /*
    we check every operator with an iteration through the expression, so we need
    to give the division higher priority than multiplication and subtraction - higher than adding.
    so, our order is : division, multiplication, subtraction, addition;
  */
  const operators = ['/', '*', '-', '+'];

  /*
    first: get rid of brackets to realise expressions inside them,
    because brackets has higher arithmetical priority than any operator
  */
  while (/\(.*\)/.test(expr)) {
    const openBracketIndex = expr.lastIndexOf('(');
    const closeBracketIndex = expr.indexOf(')', openBracketIndex + 1);
    const bracketsContent = expr.slice(openBracketIndex + 1, closeBracketIndex);
    expr = expr.replace(`(${bracketsContent})`, expressionCalculator(bracketsContent));
  }

  /* second: check for unresolved opening bracket */
  if (/[()]/.test(expr)) throw new Error('ExpressionError: Brackets must be paired');

  /* third: resolve expressions according to arithmetical priority */
  for (let operator of operators) {
    const operatorRegExp = new RegExp(`\\d+\\s*\\${operator}\\s*[+\\-]?\\d+`);

    while (operatorRegExp.test(expr)) {
      const exprPartRegEx = new RegExp(`([+\\-]?[\\d.e\\-]+)\\s*\\${operator}\\s*([+\\-]?[\\d.e\\-]+)`);
      const matches = expr.match(exprPartRegEx);
      const [exprPart, partOne, partTwo] = matches;

      if (partTwo === '0' && operator === '/') throw new Error('TypeError: Division by zero.');

      switch(operator) {
          case '+':
              expr = expr.replace(exprPart, +partOne + +partTwo);
              break;
          case '-':
              expr = expr.replace(exprPart, +partOne - +partTwo);
              break;
          case '*':
              expr = expr.replace(exprPart, +partOne * +partTwo);
              break;
          case '/':
              expr = expr.replace(exprPart, +partOne / +partTwo);
      }
    }
  }

  return parseFloat(expr);

}

module.exports = {
  expressionCalculator
};