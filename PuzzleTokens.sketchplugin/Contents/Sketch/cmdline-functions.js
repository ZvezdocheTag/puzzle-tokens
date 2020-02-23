@import "classes/DSApp.js";
@import "classes/DSApp.js"
var Document = require('sketch/dom').Document

// osascript -e 'quit app "Sketch"'
const example = `
/Applications/Sketch.app/Contents/Resources/sketchtool/bin/sketchtool --without-activating=YES --new-instance=No run ~/Library/Application\ Support/com.bohemiancoding.sketch3/Plugins/PuzzleTokens.sketchplugin "cmdRun"  --context='{"file":"/Users/baza/GitHub/puzzle-tokens/Styles/material-palettes/palettes.sketch","styles":"/Users/baza/GitHub/puzzle-tokens/Styles/material-palettes/scss/palettes.scss","commands":"apply,save,close"}'
`


function applyStyles(context, runOptions) {
    log(" APPLY STYLES...")
    var myless = new DSApp(context)
    myless.runFromCmd(context.styles)
}

function showError(error) {
    log(error + "\n")
    log("Command line example:")
    log(example + "\n")
}

function saveDocument(document) {
    log(" SAVING DOCUMENT...")
    document.save(err => {
        if (err) {
            log(" Failed to save a document. Error: " + err)
        }
    })
}

function saveDocumentAs(document, filePath) {
    log(" SAVING DOCUMENT TO " + filePath)
    /*document.save(filePath, {
        saveMode: Document.SaveMode.SaveTo,
    })*/

    var newFileURL = NSURL.fileURLWithPath(filePath)
    document.sketchObject.writeToURL_ofType_forSaveOperation_originalContentsURL_error_(newFileURL, "com.bohemiancoding.sketch.drawing",
        NSSaveOperation, nil, nil);
}


function closeDocument(document) {
    log(" CLOSING DOCUMENT...")
    document.close()
}

var cmdRun = function (context) {
    let Document = require('sketch/dom').Document

    // Parse command line arguments    
    let path = context.file + ""
    if ('' == path) {
        return showError("context.file is not specified")
    }

    log("PROCESS " + path)

    let styles = context.styles + ""
    if ('' == styles) {
        return showError("context.styles is not specified")
    }

    let argCommands = context.commands + ""
    if ('' == argCommands) {
        return showError("context.commands is not specified")
    }

    const commandsList = argCommands.split(',')
    const allCommands = ['save', 'apply', 'close']
    const cmds = {}
    for (var cmd of allCommands) {
        cmds[cmd] = commandsList.includes(cmd)
    }
    // Open Sketch document 
    Document.open(path, (err, document) => {
        if (err || !document) {
            log("ERROR: Can't open  " + path)
            return
        }
        const runOptions = {
            cmd: "applyStyles",
            fromCmd: true,
            sDoc: document,
            nDoc: document.sketchObject
        }
        context.document = document.sketchObject
        if (cmds.apply) applyStyles(context, runOptions)
        if (cmds.save) {
            if (context.saveAs)
                saveDocumentAs(document, context.saveAs)
            else
                saveDocument(document)
        }
        if (cmds.close) closeDocument(document)
    })

};

