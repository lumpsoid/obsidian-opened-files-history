export interface FilePath {
  path: string;
  basename: string;
}

export class ListItem
{
	public value: FilePath;
	public list: LinkedList;
	public prev: ListItem | null;
	public next: ListItem | null;

	constructor(value: FilePath, list: LinkedList, prev: ListItem | null, next: ListItem | null)
	{
		this.value = value;
		this.list = list;
		this.prev = prev;
		this.next = next;
	}

	/**
	 * unlink
	 */
	public unlink(this: ListItem) {
		let prevItem = this.prev;
		let nextItem = this.next;
		if (prevItem) {
			prevItem.next = nextItem;
		}
		if (nextItem) {
			nextItem.prev = prevItem;
		}
		this.list.length -= 1;
	}

	public insertAfter(this: ListItem, value: FilePath) {
		let nextItem = this.next;
		let newItem;
		if (nextItem) {
			newItem = new ListItem(value, this.list, this, nextItem);
			nextItem.prev = newItem;
		} else {
			newItem = new ListItem(value, this.list, this, null);
		}
		this.next = newItem;
		this.list.length += 1;
	}
}

export class LinkedList
{
	public first: ListItem;
	public last: ListItem;
	public length: number = 0;

	/**
	 * push
	 */
	public push(this: LinkedList, value: FilePath): void
	{
		if (!this.first && !this.last)
		{
			let newItem = new ListItem(value, this, null, null);
			this.first = newItem;
			this.last = newItem;
			this.length += 1;
			return;
		}
		let newItem = new ListItem(value, this, this.last, null);
		this.last = newItem;
		this.length += 1;
		return;
	}

	/**
	 * addFirst
	 */
	public addFirst(this: LinkedList, value: FilePath): void {
		let newItem = new ListItem(value, this, null, this.first);
		this.first = newItem;
	}
}