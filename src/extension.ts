import {
    commands,
    ExtensionContext,
    TextEditor,
    window,
    workspace,
} from 'vscode';

export function activate(context: ExtensionContext) {
    context.subscriptions.push(
        commands.registerTextEditorCommand(
            'changeTabSize.followDefault',
            (editor, _) => {
                convert(editor, getGlobalTabSize());
            }
        )
    );

    window.onDidChangeActiveTextEditor(
        (editor) => {
            if (!editor) {
                return;
            }

            const activeLanguages: string[] =
                workspace
                    .getConfiguration('changeTabSize')
                    .get('activateOnLanguages') || [];

            if (activeLanguages.includes(editor.document.languageId)) {
                convert(editor, getGlobalTabSize());
            }
        },
        null,
        context.subscriptions
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
