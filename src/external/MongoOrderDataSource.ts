import { OrderDataSource } from "../interfaces/DataSources";
import OrderDTO from "../core/orders/dto/OrderDTO";
import ItemDTO from "../core/orders/dto/ItemDTO";
import OrderSchema from "../infrastructure/database/schemas/OrderSchema";

export default class MongoOrderDataSource implements OrderDataSource {
  async create(orderDTO: OrderDTO): Promise<OrderDTO> {
    const createdOrder = new OrderSchema({
      code: orderDTO.code,
      status: orderDTO.status,
      totalPrice: orderDTO.totalPrice,
      customerId: orderDTO.customerId,
      paymentStatus: orderDTO.paymentStatus,
    });
    await createdOrder.save();

    console.log(createdOrder);
    return this.createOrderDTO(createdOrder);
  }

  async findById(id: string): Promise<OrderDTO | undefined> {
    const order = await OrderSchema.findById(id);
    return order ? this.createOrderDTO(order) : undefined;
  }

  async findAll(): Promise<OrderDTO[]> {
    const orders = await OrderSchema.find().sort({ createdAt: -1 });
    return orders.map(this.createOrderDTO);
  }

  async findOrdersByStatusAndSortByAscDate(
    status: string
  ): Promise<OrderDTO[]> {
    const orders = await OrderSchema.find({ status }).sort({ createdAt: 1 });
    return orders.map(this.createOrderDTO);
  }

  async updateOrder(orderDTO: OrderDTO): Promise<OrderDTO | undefined> {
    const updatedOrder = await OrderSchema.findByIdAndUpdate(
      orderDTO.id,
      {
        code: orderDTO.code,
        status: orderDTO.status,
        totalPrice: orderDTO.totalPrice,
        customerId: orderDTO.customerId,
        paymentStatus: orderDTO.paymentStatus,
      },
      { new: true }
    );
    return updatedOrder ? this.createOrderDTO(updatedOrder) : undefined;
  }

  async createItem(orderDTO: OrderDTO, itemDTO: Required<ItemDTO>) {
    const order = await OrderSchema.findById(orderDTO.id);
    if (order) {
      order.items.push(itemDTO);
      await order.save();
      return this.createOrderDTO(order);
    }
  }

  async updateItem(itemId: string, itemDTO: ItemDTO) {
    await OrderSchema.findOneAndUpdate(
      { _id: itemDTO.orderId, "items._id": itemId },
      {
        $set: {
          "items.$": {
            _id: itemId,
            productId: itemDTO.productId!,
            productName: itemDTO.productName!,
            productDescription: itemDTO.productDescription!,
            quantity: itemDTO.quantity!,
            unitPrice: itemDTO.unitPrice!,
            totalPrice: itemDTO.totalPrice!,
          },
        },
      }
    );
  }

  async removeItem(orderId: string, itemId: string) {
    await OrderSchema.findByIdAndUpdate(
      {
        _id: orderId,
      },
      {
        $pull: {
          items: { _id: itemId },
        },
      }
    );
  }

  private createOrderDTO(databaseOrder: any) {
    return new OrderDTO({
      id: databaseOrder._id.toString(),
      createdAt: databaseOrder.createdAt,
      code: databaseOrder.code,
      status: databaseOrder.status,
      totalPrice: databaseOrder.totalPrice,
      customerId: databaseOrder.customerId,
      paymentStatus: databaseOrder.paymentStatus,
      items: databaseOrder.items.map(
        (item: any) =>
          new ItemDTO({
            id: item._id.toString(),
            orderId: databaseOrder._id.toString(),
            productId: item.productId,
            productName: item.productName,
            productDescription: item.productDescription,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          })
      ),
    });
  }
}
