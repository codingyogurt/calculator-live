// the big result text in DOM
const resultText = document.querySelector(".p-result");
// the equation text in DOM
const equationText = document.querySelector(".p-equation");
// the dot button to enable and disable depending on decimal point
const btnDot = document.querySelector(".dot");

// function that updates the equation text. filters dot usage to one
const normalFunc = ((eContent) => {
    if (equationText.textContent === "0") {
        equationText.textContent =
            eContent;
    } else {
        updateEquation(eContent);
    }
    if (eContent === ".") {
        btnDot.disabled = true;
    }
});

// event listener for each normal buttons (numbers) target is sent to normalFunc function
document.querySelectorAll(".normal").forEach((btn) => {
    btn.addEventListener("click", (e) => {
        normalFunc(e.target.textContent);
    });
});

// function for special buttons (operators). updates the equation text depending on the class the button contains. Manages dot button also.
// for equal, when activated, pass the whole equation text content to parseProblem function for calculation.
const specialFunc = ((eClassList) => {
    if (eClassList.contains("ac")) {
        clearDisplay();
        btnDot.disabled = false;
    }
    if (eClassList.contains("del")) {
        backSpace();
    }
    if (eClassList.contains("fa-divide")) {
        updateEquation(" / ");
        btnDot.disabled = false;

    }
    if (eClassList.contains("fa-times")) {
        updateEquation(" x ");
        btnDot.disabled = false;

    }
    if (eClassList.contains("fa-minus")) {
        updateEquation(" - ");
        btnDot.disabled = false;

    }
    if (eClassList.contains("fa-plus")) {
        updateEquation(" + ");
        btnDot.disabled = false;

    }
    if (eClassList.contains("equal")) {
        resultText.innerHTML =
            `<strong>
        ${parseProblem(equationText.textContent)}
        </strong>`;
    }
});


// event listener for special buttons (operators)
document.querySelectorAll(".t").forEach((btn) => {
    btn.addEventListener("click", (e) => {
        specialFunc(btn.classList);
    });

});


// keyboard support

// printable keys
window.addEventListener("keypress", (e) => {
    const code = e.charCode;

    if (code >= 48 &&
        code <= 57 && // 0-9
        code !== 47
    ) { // unknown
        normalFunc(String.fromCharCode(code));
    }

    if (code === 46) { // dot
        if (btnDot.disabled === false) {
            normalFunc(String.fromCharCode(code));
        }
    }
    
    if (code === 127){ // delete ac
        clearDisplay();
        btnDot.disabled = false;   
    }

    if (code === 43){ // plus
        updateEquation(" + ");
        btnDot.disabled = false;
    }

    if (code === 45){ // minus
        updateEquation(" - ");
        btnDot.disabled = false;
    }

    if (code === 47){ // divide
        updateEquation(" / ");
        btnDot.disabled = false;
    }

    if (code === 42){ // times
        updateEquation(" x ");
        btnDot.disabled = false;
    }

    if (code === 61 || code === 13){ // equal or enter
        resultText.innerHTML =
        `<strong>
        ${parseProblem(equationText.textContent)}
        </strong>`;
    }

});
// non-printable keys
window.addEventListener("keydown", (e) => {
    if(e.code === "Backspace"){
        backSpace();
    }
});


// check if there is an operator in the equation text. Used for decimal point restriction.
const checkIfOperator = ((stringOperator) => {
    if (stringOperator.indexOf("x") >= 0) {
        return true;
    }
    if (stringOperator.indexOf("/") >= 0) {
        return true;
    }
    if (stringOperator.indexOf("+") >= 0) {
        return true;
    }
    if (stringOperator.indexOf("-") >= 0) {
        return true;
    }

    return false;
});

// updates the equation text. If operator is detected in the stringToAdd and endText of the equation, endText is set to the whole equation with last operator (3 because we include spaces) deleted. Then we add stringToAdd.
const updateEquation = ((stringToAdd) => {
    const text = equationText.textContent;
    let endText = text.substr(text.length - 2, 2);
    if (checkIfOperator(endText) && checkIfOperator(stringToAdd)) {
        endText = text.substr(0, text.length - 3);
        equationText.textContent = endText + stringToAdd;
    } else {
        equationText.textContent = text + stringToAdd;
    }
});

// backspace function
const backSpace = () => {
    let text = equationText.textContent;
    
    // if dot is found in the solution disable dot button
    if (text.indexOf(".") >= 0) {
        btnDot.disabled = true;
    }

    // if space is detected at the end of the equation. This indicates that endText is an operator so we delete 3 chars (spaces both side operator included)
    if (text.substr(text.length - 1, text.length) === " ") {
        text = text.substr(0, text.length - 3);
    } else {
        text = text.substr(0, text.length - 1);
    }

    equationText.textContent = text;

    // enables dot if endText is an operator. this means we can use dot even if dot is found as the function above.
    let dotCheck = text.substr(text.length - 3, 3);
    if (checkIfOperator(dotCheck)) {
        btnDot.disabled = false;
    }

    // spaces turned to 0
    if (equationText.textContent === "") {
        equationText.textContent = "0";
        resultText.innerHTML =
            `<strong>0</strong>`;
        btnDot.disabled = false;
    }
}

const clearDisplay = () => {
    equationText.textContent = "0";
    resultText.innerHTML =
        `<strong>0</strong>`;
}

// function to parse the problem. Accepts string problem. Uses space as an indicator for operands and operator
// runs through the whole string detecting operators by MDAS order.Once operator is detected we get operatorIndex-1 as num1 and operatorIndex+1 as num2, then operate two nums depending on the operator. Once an operator is not detected anymore we jump to the next operator (M -> D -> A -> S) until S.
const parseProblem = ((stringProblem) => {
    // check for syntax error
    let endText = stringProblem.substr(stringProblem.length - 2, 2);
    if (checkIfOperator(endText)) {
        return "OOPS!";
    }

    // check for dividing by 0
    endText = stringProblem.substr(stringProblem.length - 3, 3);
    if (endText.indexOf("/") >= 0) {
        endText = stringProblem.substr(stringProblem.length - 2, 2);
        if (endText.indexOf("0") >= 0) {
            return "NOPE!";
        }
    }

    const arrayProblem = stringProblem.split(" ");

    let num1, num2;
    // MDAS (M)
    while (arrayProblem.indexOf("x") !== -1) {
        const xIndex = arrayProblem.indexOf("x");
        num1 = arrayProblem[xIndex - 1];
        num2 = arrayProblem[xIndex + 1];
        arrayProblem.splice(
            xIndex - 1,
            3,
            multiply(num1, num2)
        );
    }
    // (D)
    while (arrayProblem.indexOf("/") !== -1) {
        const xIndex = arrayProblem.indexOf("/");
        num1 = arrayProblem[xIndex - 1];
        num2 = arrayProblem[xIndex + 1];
        arrayProblem.splice(
            xIndex - 1,
            3,
            divide(num1, num2)
        );
    }
    // (A)
    while (arrayProblem.indexOf("+") !== -1) {
        const xIndex = arrayProblem.indexOf("+");
        num1 = arrayProblem[xIndex - 1];
        num2 = arrayProblem[xIndex + 1];
        arrayProblem.splice(
            xIndex - 1,
            3,
            add(num1, num2)
        );
    }
    // (S)
    while (arrayProblem.indexOf("-") !== -1) {
        const xIndex = arrayProblem.indexOf("-");
        num1 = arrayProblem[xIndex - 1];
        num2 = arrayProblem[xIndex + 1];
        arrayProblem.splice(
            xIndex - 1,
            3,
            substract(num1, num2)
        );
    }

    return Number(arrayProblem.join("")).toFixed(2);
});

// returns the operation solution depending on the operator string (symbol) passed.
const operate = ((operator, num1, num2) => {
    if (operator === "x") { // MDAS
        return multiply(num1, num2);
    }
    if (operator === "/") {
        return divide(num1, num2);
    }
    if (operator === "+") {
        return add(num1, num2);
    }
    if (operator === "-") {
        return substract(num1, num2);
    }
});

// for clearer visual of my functions
const add = ((num1, num2) => {
    return Number(num1) + Number(num2);
});

const substract = ((num1, num2) => {
    return Number(num1) - Number(num2);
});

const multiply = ((num1, num2) => {
    return Number(num1) * Number(num2);
});

const divide = ((num1, num2) => {
    return Number(num1) / Number(num2);
});
