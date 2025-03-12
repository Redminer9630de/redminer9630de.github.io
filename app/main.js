const { app, BrowserWindow, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadFile('src/index.html');
    autoUpdater.checkForUpdatesAndNotify();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

autoUpdater.on('update-available', () => {
    dialog.showMessageBox({
        type: 'info',
        title: 'Update verfügbar',
        message: 'Ein neues Update ist verfügbar und wird heruntergeladen!',
    });
});

autoUpdater.on('update-downloaded', () => {
    let updateTimeout = setTimeout(() => {
        autoUpdater.quitAndInstall();
    }, 20000);

    dialog.showMessageBox({
        type: 'question',
        buttons: ['Jetzt updaten', 'Abbrechen'],
        defaultId: 0, // Standard: "Jetzt updaten"
        cancelId: 1, // "Abbrechen" bricht das Update ab
        title: 'Update bereit',
        message: 'Das Update wurde heruntergeladen! Jetzt updaten?',
    }).then((result) => {
        clearTimeout(updateTimeout); // Timer stoppen

        if (result.response === 0) {
            autoUpdater.quitAndInstall();
        } else {
            dialog.showMessageBox({
                type: 'info',
                title: 'Update abgebrochen',
                message: 'Das Update wurde abgebrochen.'
            });
        }
    });
});
