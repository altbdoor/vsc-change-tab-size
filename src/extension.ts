import { commands, ExtensionContext, TextEditor, workspace } from 'vscode';

export function activate(context: ExtensionContext) {
    context.subscriptions.push(
        commands.registerTextEditorCommand(
            'changeTabSize.followDefault',
            (editor, _) => {
                convert(editor, getGlobalTabSize());
            }
        )
    );
}

export function deactivate() {}

// =====

function getGlobalTabSize() {
    return Number(workspace.getConfiguration('editor').get('tabSize'));
}

async function convert(editor: TextEditor, target: number) {
    await commands.executeCommand('editor.action.detectIndentation');
    const currentTabSize = Number(editor.options.tabSize);

    if (target === currentTabSize) {
        return;
    }

    await commands.executeCommand('editor.action.indentationToTabs');
    editor.options.tabSize = target;
    await commands.executeCommand('editor.action.indentationToSpaces');
}
