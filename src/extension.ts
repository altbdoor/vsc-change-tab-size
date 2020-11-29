import {
    commands,
    ExtensionContext,
    TextEditor,
    window,
    workspace,
} from 'vscode';

export async function activate(context: ExtensionContext) {
    const disposable = commands.registerCommand(
        'changeTabSize.followDefault',
        async () => {
            const editor = window.activeTextEditor;

            if (!editor) {
                return;
            }

            const defaultTabSize = Number(
                workspace.getConfiguration('editor').get('tabSize')
            );
            convert(editor, defaultTabSize);
        }
    );

    context.subscriptions.push(disposable);
}

export async function deactivate() {}

// =====

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
