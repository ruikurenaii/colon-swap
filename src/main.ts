import { Plugin, TFile, NormalizePath } from 'obsidian';

export default class ColonSwapPlugin extends Plugin {
	async onload() {
		this.registerEvent(
			this.app.vault.on('create', async (file: TFile) => {
				await this.swapColon(file);
			})
		);
		
		this.registerEvent(
			this.app.vault.on('rename', async (file: TFile, previousPath: string) => {
				await this.swapColon(file);
			})
		);
	}
	
	private async swapColon(file: TFile) {
		if (!(file instanceof TFile)) return;
		
		const fileName = file.name;
		if (!fileName.includes(':')) return;
		
		const newFileName = fileName.replace(/:/g, '։');
		const newFilePath = normalizePath(file.path.replace(file.name, newFileName));
		
		// notices and logging
		try {
			await this.app.fileManager.renameFile(file, newFilePath);
			new Notice('Colon detected!');
		} catch (err) {
			new Notice('Yikes! Something went wrong!');
			console.log('ColonSwap found the issue: ', err);
		}
	}
}
