import MissingPropertyError from "../../common/exceptions/MissingPropertyError";

export type ItemParams = {
  id?: string;
  orderId: string;
  productId: number;
  productName?: string;
  productDescription?: string;
  quantity: number;
  unitPrice: number;
};

export default class Item {
  private id!: string | undefined;
  private orderId!: string;
  private productId!: number;
  private productName!: string | undefined;
  private productDescription!: string | undefined;
  private quantity!: number;
  private unitPrice!: number;
  private totalPrice!: number;

  constructor({ id, orderId, productId, productName, productDescription, quantity, unitPrice }: ItemParams) {
    this.id = id;
    this.orderId = orderId;
    this.productId = productId;

    this.productName = productName;
    this.productDescription = productDescription;
    this.unitPrice = unitPrice;

    this.setQuantity(quantity);

    this.updateTotalPrice();
  }

  getId() {
    return this.id;
  }

  getOrderId() {
    return this.orderId;
  }

  getProductId() {
    return this.productId;
  }

  getProductName() {
    return this.productName;
  }

  getProductDescription() {
    return this.productDescription;
  }

  getQuantity() {
    return this.quantity;
  }

  getUnitPrice() {
    return this.unitPrice;
  }

  getTotalPrice() {
    return this.totalPrice;
  }

  setQuantity(quantity: number) {
    Item.validateQuantity(quantity);
    this.quantity = quantity;
    this.updateTotalPrice();
  }

  private updateTotalPrice() {
    this.totalPrice = this.unitPrice * this.quantity;
  }

  private static validateQuantity(quantity: number) {
    if (!quantity || quantity <= 0) {
      throw new MissingPropertyError("quantity");
    }
  }

  getAttributes() {
    return {
      id: this.id,
      orderId: this.orderId,
      productId: this.productId,
      productDescription: this.productDescription,
      productName: this.productName,
      quantity: this.quantity,
      unitPrice: this.unitPrice,
      totalPrice: this.totalPrice
    };
  }
}
