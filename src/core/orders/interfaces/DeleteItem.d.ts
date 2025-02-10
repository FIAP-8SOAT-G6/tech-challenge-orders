export default interface DeleteItem {
  deleteItem(orderId: string, itemId: string): Promise<undefined>;
}
