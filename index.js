const electron = require('electron');
const {app, BrowserWindow} = electron;
let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({width: 800, height: 535}); // Create new window
	mainWindow.loadURL('file://' + __dirname + '/index.html'); // Load the index file
	//mainWindow.webContents.openDevTools();
	mainWindow.on('closed', () => {
		mainWindow = null;
	});
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
	app.quit();
});
app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});
