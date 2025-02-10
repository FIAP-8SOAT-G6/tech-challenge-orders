export default class ItemDTO {
  public id?: string;
  public orderId?: string;
  public productId?: number;
  public productName?: string;
  public productDescription?: string;
  public quantity?: number;
  public unitPrice?: number;
  public totalPrice?: number;

  constructor({
    id,
    orderId,
    productId,
    productName,
    productDescription,
    quantity,
    unitPrice,
    totalPrice
  }: {
    id?: string;
    orderId?: string;
    productId?: number;
    productName?: string;
    productDescription?: string;
    quantity?: number;
    unitPrice?: number;
    totalPrice?: number;
  }) {
    this.id = id;
    this.orderId = orderId;
    this.productId = productId;
    this.productName = productName;
    this.productDescription = productDescription;
    this.quantity = Number(quantity);
    this.unitPrice = Number(unitPrice);
    this.totalPrice = Number(totalPrice);
  }
}
