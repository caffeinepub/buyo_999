import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ShoppingListItemResponse {
    id: bigint;
    name: string;
    completed: boolean;
    amount: bigint;
}
export interface SortOrder {
    asc: boolean;
}
export interface ShoppingListResponse {
    id: bigint;
    name: string;
    items: Array<ShoppingListItemResponse>;
}
export interface ShoppingListItem {
    id: bigint;
    completed: boolean;
    amount: bigint;
}
export interface ListItemPaginatedResponse {
    total: bigint;
    page: bigint;
    pageSize: bigint;
    items: Array<ListItem>;
}
export interface ListItemPaginationRequest {
    sortOrder: SortOrder;
    page: bigint;
    pageSize: bigint;
    search?: string;
}
export interface ListItem {
    id: bigint;
    name: string;
}
export interface ShoppingList {
    id: bigint;
    name: string;
    items: Array<ShoppingListItem>;
}
export interface backendInterface {
    addItemsToShoppingList(listId: bigint, shoppingListItems: Array<ShoppingListItem>): Promise<ShoppingListResponse>;
    addListItem(name: string): Promise<ListItem>;
    addShoppingList(name: string): Promise<Array<ShoppingListResponse>>;
    cloneShoppingList(listId: bigint, newName: string): Promise<ShoppingList>;
    completeItems(listId: bigint, itemIds: Array<bigint>): Promise<ShoppingList>;
    deleteShoppingLists(listIds: Array<bigint>): Promise<Array<ShoppingListResponse>>;
    editItemsInShoppingList(listId: bigint, items: Array<ShoppingListItem>): Promise<ShoppingListResponse>;
    getListItemsPaginated(paginationRequest: ListItemPaginationRequest): Promise<ListItemPaginatedResponse>;
    getShoppingList(listId: bigint): Promise<ShoppingListResponse>;
    getShoppingLists(): Promise<Array<ShoppingListResponse>>;
    init(items: Array<string>): Promise<void>;
    isInited(): Promise<boolean>;
    removeItemFromShoppingList(listId: bigint, itemId: bigint): Promise<void>;
}
