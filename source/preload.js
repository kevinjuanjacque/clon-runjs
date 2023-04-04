
const { contextBridge, ipcRenderer } = require('electron');


// const codemirror = require('codemirror')

// const SystemFonts = require('system-font-families').default;
// const systemFonts = new SystemFonts()




contextBridge.exposeInMainWorld(
    'electron',
    {
        runJS: (code) => ipcRenderer.send('runjs', code),
        onResponseRunJs: (callback) => ipcRenderer.on('update-output', callback)
    }
)

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }


    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type])
    }



})
