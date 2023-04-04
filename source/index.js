const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const utils = require('electron-util');
const fs = require('fs');
const spawnSync = require('child_process').spawnSync;


let win
function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            sandbox: false
        },
        titleBarStyle: 'hidden',
        titleBarOverlay: true
    })


    win.loadFile(path.join(__dirname, '../app/index.html'))
    // win.webContents.send('lib-system-font', systemFonts)

}


const runJsMain = async (event, code) => {

    try {

        await fs.promises.writeFile(path.join(app.getAppPath(), '/../mi.js'), code, 'utf-8')
        const exist = fs.existsSync(path.join(app.getAppPath(), '/../mi.js'))
        if (exist) {
            const result = spawnSync('node',
                [path.join(app.getAppPath('tmp'), '/../mi.js')],);
            console.log(result.stdout.toString())
            win.webContents.send('update-output', result.stdout?.toString())
        } else {
            dialog.showMessageBox(win, { message: 'archivo no existe, ' + path.join(app.getAppPath('tmp'), '/mi.js') })

        }

    } catch (error) {
        dialog.showMessageBox(win, { message: JSON.stringify(error) + path.join(app.getAppPath('tmp'), '/mi.js'), })
        console.log(error)

    }
    // const result = utils.runJS(code).then(r => {
    //     console.log({ r })
    // }).catch((e) => {
    //     console.log({ e })
    // })
    // console.log({ result })s
    // return result;
}

app.whenReady().then(() => {
    ipcMain.on('runjs', runJsMain)
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
