import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';

const initState = {
  text: '0',
  operators:['+']
}

class JavascriptCalculator extends React.Component {

  constructor(props) {
    super(props);
    this.state = initState;
    this.display = this.display.bind(this);
    this.clear = this.clear.bind(this);
    this.calculate = this.calculate.bind(this);
  }

  display(text){
    // if display is zero, remove the leading zero from the text.
    if(this.state.text == 0){
      this.state.text = '';
    }

    let regex = /[*/+-]/;

    // if text is not an operator
    if (!regex.test(text)){

      let displayed = this.state.text

      // start by adding text
      displayed += text;

      // disallow multiple decimal points in a number
      // if attempt at more than one decimal point remove last one.
      let array = displayed.split('');
      let count = 0;
      for (let i = 0; i < array.length; i++){
        if (array[i] === '.'){
          count++;
        }
      }
      // one decimal point is allowed per operator.
      // thus to allow the first decimal point,
      // this.state.operators must be initialized
      // to length of 1.
      if(count > this.state.operators.length){
        array.pop();
      }

      displayed = array.join('');
      this.setState({ text: displayed});
    }

    // if text is an operator
    if (regex.test(text)){

      // add the text to the array
      // so that repeated decimal points are prevented
      let array = this.state.operators;
      array.push(text);
      this.setState({ operators: array});

      let displayed = this.state.text
      displayed += text;
      this.setState({ text: displayed});
    }

    // if text is equals sign, run the calculate function.
    if (text === '='){
      let displayed = this.state.text.split('');
      displayed.push('=');
      this.calculate(displayed);
    }
  }

  calculate(displayed){
    let regex = /[*/+-]/;
    let regex2 = /\d/;
    let text = '';
    let length = displayed.length;
    let operators = [];

    // swap in the dummy that represents the - sign for a number
    // so that the negative sign can be swapped back in after
    // the array is split into numbers and operators
    for (let i = 0; i < length; i++){
      if (displayed[i] == '-' && regex.test(displayed[i-1])
      && regex2.test(displayed[i+1])
    ){
      displayed[i] = '@';
    }
  }

  // capture numbers longer than one digit by adding them to a string
  // and adding a ! in place of the operators. Then the string
  // can be split into an array at the !s and double digit numbers will
  // be intact.
  for (let i = 0; i < length; i++){
    // put numbers into a string
    if (displayed[i].match(/[\d.@]/)) {
      text+=displayed[i];
    }
    // add ! to string in place of operators
    if (displayed[i].match(regex)){
      text+='!';
      // add operators to their own array
      operators.push(displayed[i]);
    }
    if (displayed[i] === '='){
      break;
    }
  }

  // replace the dummy with the - sign
  let newText = text.replace('@', '-');
  let numbers = newText.split('!');
  let numbers2 = [];
  // create the numbers array
  for(let i = 0; i < numbers.length; i++){
    if (numbers[i] != "!" && numbers[i] != ''){
      numbers2.push(numbers[i]);
    }
  }

  // if there are more operators than numbers
  // remove the first operators
  if(operators.length > numbers2.length){
    operators.splice(0, numbers2.length);
  }

  // initialize answer with first number
  let answer = numbers2[0];
  let func = undefined;

  // Start with second number
  for (let i = 1; i < numbers2.length; i++){

    func = returnFunc(operators.shift());
    answer = func(answer, numbers2[i]);
    this.setState({text: answer})
  }

  function returnFunc(val) {
    switch (val) {
      case '+':
      return function sum(a,b) { return Number(a)+Number(b)};
      case '-':
      return function subtract(a,b) { return Number(a)-Number(b)};
      case '*':
      return function multiply(a,b) { return Number(a)*Number(b)};
      case '/':
      return function divide(a,b) { return Number(a)/Number(b)};
      default:
      throw new Error("Called with unknown operator " + val);
    }
  }
}

clear(){
  this.setState({text:'0', operators: ['+']});
}

render() {
  return (
    <div id="javascript-calculator">
    <h1 id="title">Javascript Calculator</h1>
    <div id="display">{this.state.text}</div>
    <hr/>
    <div>
    <button id="clear" onClick={e => this.clear()}> clear </button>
    <button id="equals" onClick={e => this.display("=")}> = </button>
    <button id="zero" onClick={e => this.display("0")}> 0 </button>
    <button id="one" onClick={e => this.display("1")}> 1 </button>
    <button id="two" onClick={e => this.display("2")}> 2 </button>
    <button id="three" onClick={e => this.display("3")}> 3 </button>
    <button id="four" onClick={e => this.display("4")}> 4 </button>
    <button id="five" onClick={e => this.display("5")}> 5 </button>
    <button id="six" onClick={e => this.display("6")}> 6 </button>
    <button id="seven" onClick={e => this.display("7")}> 7 </button>
    <button id="eight" onClick={e => this.display("8")}> 8 </button>
    <button id="nine" onClick={e => this.display("9")}> 9 </button>
    <button id="add" onClick={e => this.display("+")}> + </button>
    <button id="subtract" onClick={e => this.display("-")}> - </button>
    <button id="multiply" onClick={e => this.display("*")}> * </button>
    <button id="divide" onClick={e => this.display("/")}> / </button>
    <button id="decimal" onClick={e => this.display(".")}> . </button>
    </div>
    </div>
  );
}
}

ReactDOM.render(<JavascriptCalculator />, document.getElementById("app"));
