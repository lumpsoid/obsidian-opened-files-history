import { ItemView, ViewStateResult, WorkspaceLeaf } from "obsidian";
import { LinkedList } from '../LinkedList';

export const VIEW_TYPE_HISTORY = "recent-files-linked-list";

export class OpenedFilesHistoryView extends ItemView {
  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType() {
    return VIEW_TYPE_HISTORY;
  }

  getDisplayText() {
    return "Opened files history";
  }

  getIcon(): string {
    return 'clock';
  }

  async onOpen() {
    // const container = this.containerEl.children[1];
    // container.empty();
    // container.createEl("h4", { text: "Example view" });
  }

  async onClose() {
    // Nothing to clean up.
  }

  async setState(state: any, result: ViewStateResult): Promise<void>
  {
    const container = this.containerEl.children[1];
    // state.newItem - TFile
    const newItem = createEl("p", { text: state.newItem.basename })
    newItem.addEventListener('click', (event: MouseEvent) => {
      let leaf = this.app.workspace.getMostRecentLeaf();
      if (leaf) {
        leaf.openFile(state.newItem);
      }
    });
    
    container.prepend(newItem);
  }
}
