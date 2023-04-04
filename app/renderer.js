const inputJS = document.getElementById("input-js")

const editor = CodeMirror.fromTextArea(inputJS, {
    value: "function myScript(){return 100;}\n",
    mode: { name: "javascript", globalVars: true },
    matchBrackets: true,
    lineWrapping: true
    , autoCloseTags: true
    , extraKeys: { "Ctrl-Space": "autocomplete" },
    hintOptions: {
        alignWithWord: false,
        completeSingle: false,
    },
});
const arrows = [37, 38, 39, 40, 8, 13, 16]
editor.on("keyup", function (cm, e) {
    if (arrows.indexOf(e.keyCode) < 0) {
        editor.showHint()
    }
})

editor.setOption('theme', 'synthwave84');


const editorOutput = CodeMirror.fromTextArea(document.getElementById("output-js"), {
    value: "function myScript(){return 100;}\n",
    mode: "javascript",
    matchBrackets: true,
    lineWrapping: true,
    readOnly: true,
    cursorBlinkRate: -10
});
editorOutput.setOption('theme', 'synthwave84');
// con esta funcion se modifica el valor
// editorOutput.setValue("dsadas")
window.Split(['#split-0', '#split-1'],

)

editor.on('change', async (...args) => {


    const value = editor.getValue()
    try {
        // const data = esprima.parseScript(value, {
        //     jsx: true, tolerant: true, loc: true
        // })
        // const result = await window.electron.babelTransform(value);
        const result = Babel.transform(value, { presets: ["env",] })

        const response = await window.electron.runJS(result.code)

        // editorOutput.setValue(result)
    } catch (error) {

        editorOutput.setValue(error.message)

        // console.log(value)
        // const textError = createTextError(lineNumber, column, description, value)
        // editorOutput.setValue(textError)
    }
}
)

window.electron.onResponseRunJs((event, value) => {
    editorOutput.setValue(value)
})



const createTextError = (lineNumber, column, description, value) => {
    const textArray = value.split('\n');
    const matriz = textArray.map(line => line.split(''))
    const text = `> ${lineNumber - 1} | ${matriz[lineNumber - 1].join('')}
      ${[...new Array(column)].join(' ')}^`
    return `${description}\n${text}`;
}



// console.log(esprima.parseScript('const answer = 42s'))