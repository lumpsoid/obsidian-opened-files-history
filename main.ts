import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, WorkspaceLeaf, ViewState } from 'obsidian';
import { LinkedList, ListItem, FilePath } from './LinkedList';
import { OpenedFilesHistoryView, VIEW_TYPE_HISTORY } from "./view/OpenedFilesHistoryView";


interface MyPluginSettings
{
	historyLimit: number;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	historyLimit: 0
}

export default class MyPlugin extends Plugin
{
	settings: MyPluginSettings;

	async onload()
	{
		await this.loadSettings();

		this.registerView(
			VIEW_TYPE_HISTORY,
			(leaf) => new OpenedFilesHistoryView(leaf)
		);

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) =>
		{
			// Called when the user clicks the icon.
			// new Notice('TEST!');
			this.activateView();
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		// const statusBarItemEl = this.addStatusBarItem();
		// statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		// this.addCommand({
		// 	id: 'open-sample-modal-simple',
		// 	name: 'Open sample modal (simple)',
		// 	callback: () =>
		// 	{
		// 		new SampleModal(this.app).open();
		// 		this.activateView();
		// 	}
		// });

		this.registerEvent(this.app.workspace.on('file-open', (file) =>
		{
			if (!file) return;
			this.app.workspace.getLeavesOfType(VIEW_TYPE_HISTORY).forEach((leaf) =>
			{
				if (leaf.view instanceof OpenedFilesHistoryView)
				{
					// Access your view instance.
					leaf.setViewState({"type": VIEW_TYPE_HISTORY, state: {newItem: file}})
				}
			});
		}));

		// This adds a settings tab so the user can configure various aspects of the plugin
		// this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, 'click', (evt: MouseEvent) =>
		// {
		// 	console.log('click', evt);
		// });

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload(){}

	async activateView()
	{
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(VIEW_TYPE_HISTORY);

		if (leaves.length > 0)
		{
			// A leaf with our view already exists, use that
			leaf = leaves[0];
		} else
		{
			// Our view could not be found in the workspace, create a new leaf
			// in the right sidebar for it
			leaf = workspace.getRightLeaf(false);
			await leaf.setViewState({ type: VIEW_TYPE_HISTORY, active: true });
		}

		// "Reveal" the leaf in case it is in a collapsed sidebar
		workspace.revealLeaf(leaf);
	}

	async loadSettings()
	{
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings()
	{
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal
{
	constructor(app: App)
	{
		super(app);
	}

	onOpen()
	{
		const { contentEl } = this;
		contentEl.setText('TEST!');
	}

	onClose()
	{
		const { contentEl } = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab
{
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin)
	{
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void
	{
		const { containerEl } = this;

		containerEl.empty();
		
		new Setting(containerEl)
			.setName('History limit')
			.setDesc('How many pages save in view.\n0 - means infinite.')
			.addText(text => text
				.setPlaceholder('Enter limit')
				.setValue(this.plugin.settings.historyLimit.toString())
				.onChange(async (value) =>
				{
					let newNumber = parseInt(value);
					if (Number.isNaN(newNumber)) {
						new Notice('Value is not a number.');
						return
					}
					console.log(newNumber);
					this.plugin.settings.historyLimit = newNumber;
					await this.plugin.saveSettings();
				}));
	}
}
