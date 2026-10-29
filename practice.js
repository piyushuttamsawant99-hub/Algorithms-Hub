/* =====================================================
   ALGORITHM HUB
   PRACTICE LAB
===================================================== */


/* =====================================================
   PRACTICE DATA
===================================================== */

const practiceData = {

    "bubble-sort": {

        title: "Bubble Sort",

        description:
            "Write a program to sort an array of integers using Bubble Sort.",

        hint:
            "Compare adjacent elements and swap them when the left element is greater.",

        input:
            "[5, 2, 8, 1, 3]",

        output:
            "[1, 2, 3, 5, 8]",

        time:
            "O(n²)",

        space:
            "O(1)",

        difficulty:
            "EASY",

        code: {

            python:
`def bubble_sort(arr):
    n = len(arr)

    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]

    return arr


arr = [5, 2, 8, 1, 3]
print(bubble_sort(arr))`,

            java:
`public class Main {

    static void bubbleSort(int[] arr) {

        for (int i = 0; i < arr.length; i++) {

            for (int j = 0; j < arr.length-i-1; j++) {

                if (arr[j] > arr[j+1]) {

                    int temp = arr[j];
                    arr[j] = arr[j+1];
                    arr[j+1] = temp;
                }
            }
        }
    }

    public static void main(String[] args) {

        int[] arr = {5, 2, 8, 1, 3};

        bubbleSort(arr);

        for (int x : arr)
            System.out.print(x + " ");
    }
}`,

            cpp:
`#include <iostream>
using namespace std;

void bubbleSort(int arr[], int n) {

    for(int i = 0; i < n; i++) {

        for(int j = 0; j < n-i-1; j++) {

            if(arr[j] > arr[j+1]) {

                swap(arr[j], arr[j+1]);
            }
        }
    }
}

int main() {

    int arr[] = {5, 2, 8, 1, 3};

    int n = 5;

    bubbleSort(arr, n);

    for(int i = 0; i < n; i++)
        cout << arr[i] << " ";

    return 0;
}`,

            c:
`#include <stdio.h>

void bubbleSort(int arr[], int n) {

    for(int i = 0; i < n; i++) {

        for(int j = 0; j < n-i-1; j++) {

            if(arr[j] > arr[j+1]) {

                int temp = arr[j];

                arr[j] = arr[j+1];

                arr[j+1] = temp;
            }
        }
    }
}

int main() {

    int arr[] = {5, 2, 8, 1, 3};

    int n = 5;

    bubbleSort(arr, n);

    for(int i = 0; i < n; i++)
        printf("%d ", arr[i]);

    return 0;
}`

        }

    },


    "selection-sort": {

        title: "Selection Sort",

        description:
            "Write a program to sort an array using Selection Sort.",

        hint:
            "Find the minimum value from the unsorted portion and place it at the beginning.",

        input:
            "[9, 4, 6, 2]",

        output:
            "[2, 4, 6, 9]",

        time:
            "O(n²)",

        space:
            "O(1)",

        difficulty:
            "EASY",

        code: {

            python:
`def selection_sort(arr):

    for i in range(len(arr)):

        min_index = i

        for j in range(i + 1, len(arr)):

            if arr[j] < arr[min_index]:
                min_index = j

        arr[i], arr[min_index] = \
            arr[min_index], arr[i]

    return arr


arr = [9, 4, 6, 2]

print(selection_sort(arr))`

        }

    },


    "insertion-sort": {

        title: "Insertion Sort",

        description:
            "Write a program to sort an array using Insertion Sort.",

        hint:
            "Take one element and insert it into its correct position in the sorted part.",

        input:
            "[7, 1, 5]",

        output:
            "[1, 5, 7]",

        time:
            "O(n²)",

        space:
            "O(1)",

        difficulty:
            "EASY",

        code: {

            python:
`def insertion_sort(arr):

    for i in range(1, len(arr)):

        key = arr[i]

        j = i - 1

        while j >= 0 and arr[j] > key:

            arr[j + 1] = arr[j]

            j -= 1

        arr[j + 1] = key

    return arr


arr = [7, 1, 5]

print(insertion_sort(arr))`

        }

    },


    "linear-search": {

        title: "Linear Search",

        description:
            "Find a target value by checking each element one by one.",

        hint:
            "Start from index 0 and compare every element with the target.",

        input:
            "[4, 8, 2, 9, 5], target = 9",

        output:
            "Index: 3",

        time:
            "O(n)",

        space:
            "O(1)",

        difficulty:
            "EASY",

        code: {

            python:
`def linear_search(arr, target):

    for i in range(len(arr)):

        if arr[i] == target:
            return i

    return -1


arr = [4, 8, 2, 9, 5]

target = 9

print("Index:", linear_search(arr, target))`

        }

    },


    "binary-search": {

        title: "Binary Search",

        description:
            "Find a target element in a sorted array using Binary Search.",

        hint:
            "Compare the target with the middle element and eliminate half of the search space.",

        input:
            "[1, 3, 5, 7, 9], target = 7",

        output:
            "Index: 3",

        time:
            "O(log n)",

        space:
            "O(1)",

        difficulty:
            "MEDIUM",

        code: {

            python:
`def binary_search(arr, target):

    left = 0

    right = len(arr) - 1

    while left <= right:

        mid = (left + right) // 2

        if arr[mid] == target:
            return mid

        elif arr[mid] < target:
            left = mid + 1

        else:
            right = mid - 1

    return -1


arr = [1, 3, 5, 7, 9]

target = 7

print("Index:", binary_search(arr, target))`

        }

    },


    "factorial": {

        title: "Factorial",

        description:
            "Calculate the factorial of a given positive integer.",

        hint:
            "Multiply every integer from 1 up to n.",

        input:
            "5",

        output:
            "120",

        time:
            "O(n)",

        space:
            "O(1)",

        difficulty:
            "EASY",

        code: {

            python:
`def factorial(n):

    result = 1

    for i in range(1, n + 1):
        result *= i

    return result


n = 5

print(factorial(n))`

        }

    },


    "fibonacci": {

        title: "Fibonacci",

        description:
            "Generate the first n Fibonacci numbers.",

        hint:
            "Each number is the sum of the previous two numbers.",

        input:
            "7",

        output:
            "[0, 1, 1, 2, 3, 5, 8]",

        time:
            "O(n)",

        space:
            "O(n)",

        difficulty:
            "EASY",

        code: {

            python:
`def fibonacci(n):

    result = []

    a = 0
    b = 1

    for i in range(n):

        result.append(a)

        a, b = b, a + b

    return result


print(fibonacci(7))`

        }

    }

};



/* =====================================================
   ELEMENTS
===================================================== */

const algorithmSelect =
    document.getElementById(
        "practiceAlgorithm"
    );

const languageSelect =
    document.getElementById(
        "languageSelect"
    );

const codeEditor =
    document.getElementById(
        "codeEditor"
    );

const lineNumbers =
    document.getElementById(
        "lineNumbers"
    );

const runBtn =
    document.getElementById(
        "runBtn"
    );

const resetCodeBtn =
    document.getElementById(
        "resetCodeBtn"
    );

const problemTitle =
    document.getElementById(
        "problemTitle"
    );

const problemDescription =
    document.getElementById(
        "problemDescription"
    );

const hintText =
    document.getElementById(
        "hintText"
    );

const exampleInput =
    document.getElementById(
        "exampleInput"
    );

const exampleOutput =
    document.getElementById(
        "exampleOutput"
    );

const timeComplexity =
    document.getElementById(
        "timeComplexity"
    );

const spaceComplexity =
    document.getElementById(
        "spaceComplexity"
    );

const fileName =
    document.getElementById(
        "fileName"
    );

const editorStatus =
    document.getElementById(
        "editorStatus"
    );

const outputContent =
    document.getElementById(
        "outputContent"
    );

const executionTime =
    document.getElementById(
        "executionTime"
    );

const testSummary =
    document.getElementById(
        "testSummary"
    );

const successCard =
    document.getElementById(
        "successCard"
    );



/* =====================================================
   LANGUAGE EXTENSIONS
===================================================== */

const extensions = {

    python: "py",

    java: "java",

    cpp: "cpp",

    c: "c"

};



/* =====================================================
   UPDATE LINE NUMBERS
===================================================== */

function updateLineNumbers() {

    const count =
        codeEditor.value
            .split("\n")
            .length;


    let html = "";


    for (
        let i = 1;
        i <= count;
        i++
    ) {

        html +=
            `${i}<br>`;

    }


    lineNumbers.innerHTML =
        html;

}



/* =====================================================
   LOAD CODE
===================================================== */

function loadCode() {

    const algorithm =
        algorithmSelect.value;

    const language =
        languageSelect.value;

    const data =
        practiceData[algorithm];


    if (!data) return;


    const code =
        data.code[language]
        || data.code.python;


    codeEditor.value =
        code;


    fileName.textContent =
        `solution.${extensions[language]}`;


    updateLineNumbers();

}



/* =====================================================
   UPDATE PROBLEM
===================================================== */

function updateProblem() {

    const data =
        practiceData[
            algorithmSelect.value
        ];


    if (!data) return;


    problemTitle.textContent =
        data.title;

    problemDescription.textContent =
        data.description;

    hintText.textContent =
        data.hint;

    exampleInput.textContent =
        data.input;

    exampleOutput.textContent =
        data.output;

    timeComplexity.textContent =
        data.time;

    spaceComplexity.textContent =
        data.space;


    successCard.style.display =
        "none";


    resetTests();


    loadCode();

}



/* =====================================================
   RESET TESTS
===================================================== */

function resetTests() {

    for (
        let i = 1;
        i <= 3;
        i++
    ) {

        const card =
            document.getElementById(
                `test${i}`
            );


        card.classList.remove(
            "passed",
            "failed"
        );


        card.querySelector(
            ".test-result"
        ).textContent =
            "Not Run";

    }


    testSummary.textContent =
        "0 / 3 Passed";

}



/* =====================================================
   SIMULATE EXECUTION
===================================================== */

function executeCode() {

    editorStatus.textContent =
        "Running...";


    outputContent.innerHTML =
        `<span class="output-muted">
            Compiling and testing solution...
        </span>`;


    const start =
        performance.now();


    runBtn.disabled =
        true;


    setTimeout(() => {

        const end =
            performance.now();


        executionTime.textContent =
            `${Math.round(end - start)} ms`;


        const algorithm =
            algorithmSelect.value;


        const result =
            simulateAlgorithm(
                algorithm
            );


        outputContent.innerHTML =
            `<span>
                ${result.output}
            </span>`;


        runTests(
            result.passed
        );


        editorStatus.textContent =
            result.passed
                ? "Accepted"
                : "Wrong Answer";


        runBtn.disabled =
            false;

    }, 650);

}



/* =====================================================
   SIMULATION
===================================================== */

function simulateAlgorithm(
    algorithm
) {

    switch (algorithm) {

        case "bubble-sort":

            return {

                output:
                    "[1, 2, 3, 5, 8]",

                passed: true

            };


        case "selection-sort":

            return {

                output:
                    "[2, 4, 6, 9]",

                passed: true

            };


        case "insertion-sort":

            return {

                output:
                    "[1, 5, 7]",

                passed: true

            };


        case "linear-search":

            return {

                output:
                    "Index: 3",

                passed: true

            };


        case "binary-search":

            return {

                output:
                    "Index: 3",

                passed: true

            };


        case "factorial":

            return {

                output:
                    "120",

                passed: true

            };


        case "fibonacci":

            return {

                output:
                    "[0, 1, 1, 2, 3, 5, 8]",

                passed: true

            };


        default:

            return {

                output:
                    "Execution completed.",

                passed: true

            };

    }

}



/* =====================================================
   RUN TESTS
===================================================== */

function runTests(
    passed
) {

    let passedCount = 0;


    for (
        let i = 1;
        i <= 3;
        i++
    ) {

        const card =
            document.getElementById(
                `test${i}`
            );


        card.classList.remove(
            "passed",
            "failed"
        );


        const result =
            card.querySelector(
                ".test-result"
            );


        if (passed) {

            card.classList.add(
                "passed"
            );


            result.innerHTML =
                `<i class="fa-solid fa-check"></i>
                 Passed`;

            passedCount++;

        } else {

            card.classList.add(
                "failed"
            );


            result.innerHTML =
                `<i class="fa-solid fa-xmark"></i>
                 Failed`;

        }

    }


    testSummary.textContent =
        `${passedCount} / 3 Passed`;


    if (
        passedCount === 3
    ) {

        successCard.style.display =
            "flex";

    }

}



/* =====================================================
   RESET CODE
===================================================== */

function resetCode() {

    loadCode();


    outputContent.innerHTML =
        `<span class="output-muted">
            Click "Run Code" to execute
            your solution.
        </span>`;


    editorStatus.textContent =
        "Ready";


    executionTime.textContent =
        "0 ms";


    resetTests();

}



/* =====================================================
   EVENTS
===================================================== */

algorithmSelect.addEventListener(
    "change",
    updateProblem
);


languageSelect.addEventListener(
    "change",
    loadCode
);


runBtn.addEventListener(
    "click",
    executeCode
);


resetCodeBtn.addEventListener(
    "click",
    resetCode
);


codeEditor.addEventListener(
    "input",
    updateLineNumbers
);


codeEditor.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Tab"
        ) {

            event.preventDefault();


            const start =
                codeEditor.selectionStart;

            const end =
                codeEditor.selectionEnd;


            codeEditor.value =
                codeEditor.value.substring(
                    0,
                    start
                )
                +
                "    "
                +
                codeEditor.value.substring(
                    end
                );


            codeEditor.selectionStart =
                codeEditor.selectionEnd =
                    start + 4;


            updateLineNumbers();

        }

    }
);



/* =====================================================
   INITIALIZE
===================================================== */

window.addEventListener(
    "DOMContentLoaded",
    () => {

        updateProblem();

        updateLineNumbers();

    }
);