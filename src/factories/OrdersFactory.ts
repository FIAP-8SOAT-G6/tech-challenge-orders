import CustomerGateway from "../gateways/CustomerGateway";
import OrderGateway from "../gateways/OrderGateway";

import { OrderDataSource } from "../interfaces/DataSources";
import CreateOrder from "../core/orders/interfaces/CreateOrder";
import GetOrder from "../core/orders/interfaces/GetOrder";
import GetOrders from "../core/orders/interfaces/GetOrders";
import GetOrdersAll from "../core/orders/interfaces/GetOrdersAll";
import GetPaymentStatus from "../core/orders/interfaces/GetPaymentStatus";
import UpdateOrderStatus from "../core/orders/interfaces/UpdateOrderStatus";
import CheckoutOrder from "../core/orders/interfaces/CheckoutOrder";
import AddItem from "../core/orders/interfaces/AddItem";
import DeleteItem from "../core/orders/interfaces/DeleteItem";
import UpdateItem from "../core/orders/interfaces/UpdateItem";

import GetOrdersAllUseCase from "../core/orders/use-cases/GetOrdersAllUseCase";
import GetOrdersUseCase from "../core/orders/use-cases/GetOrdersUseCase";
import GetOrderUseCase from "../core/orders/use-cases/GetOrderUseCase";
import CreateOrderUseCase from "../core/orders/use-cases/CreateOrderUseCase";
import GetPaymentStatusUseCase from "../core/orders/use-cases/GetPaymentStatusUseCase";
import UpdateOrderStatusUseCase from "../core/orders/use-cases/UpdateOrderStatusUseCase";
import CheckoutOrderUseCase from "../core/orders/use-cases/CheckoutOrderUseCase";
import AddItemUseCase from "../core/orders/use-cases/AddItemUseCase";
import DeleteItemUseCase from "../core/orders/use-cases/DeleteItemUseCase";
import UpdateItemUseCase from "../core/orders/use-cases/UpdateItemUseCase";
import ProductGateway from "../gateways/ProductGateway";
import { PaymentSystem } from "../interfaces/PaymentSystem";
import { PaymentGateway } from "../gateways/PaymentGateway";
import { CustomersSource } from "../interfaces/CustomersSource";
import { ProductsSource } from "../interfaces/ProductsSource";
import MockPaymentGateway from "../gateways/MockPaymentGateway";

export class OrdersFactory {
  public static makeCreateOrder(
    orderDataSource: OrderDataSource,
    customerDataSource: CustomersSource
  ): CreateOrder {
    return new CreateOrderUseCase(
      new OrderGateway(orderDataSource),
      new CustomerGateway(customerDataSource)
    );
  }

  public static makeGetOrder(orderDataSource: OrderDataSource): GetOrder {
    return new GetOrderUseCase(new OrderGateway(orderDataSource));
  }

  public static makeGetOrders(orderDataSource: OrderDataSource): GetOrders {
    return new GetOrdersUseCase(new OrderGateway(orderDataSource));
  }

  public static makeGetOrdersAll(
    orderDataSource: OrderDataSource
  ): GetOrdersAll {
    return new GetOrdersAllUseCase(new OrderGateway(orderDataSource));
  }

  public static makeGetPaymentStatus(
    orderDataSource: OrderDataSource
  ): GetPaymentStatus {
    return new GetPaymentStatusUseCase(new OrderGateway(orderDataSource));
  }
  public static makeUpdateOrderStatus(
    orderDataSource: OrderDataSource
  ): UpdateOrderStatus {
    return new UpdateOrderStatusUseCase(new OrderGateway(orderDataSource));
  }

  public static makeCheckout(
    orderDataSource: OrderDataSource,
    paymentSystem: PaymentSystem
  ): CheckoutOrder {
    return new CheckoutOrderUseCase(
      new OrderGateway(orderDataSource),
      new PaymentGateway(new OrderGateway(orderDataSource), paymentSystem)
    );
  }

  public static makeAddItem(
    orderDataSource: OrderDataSource,
    productDataSource: ProductsSource
  ): AddItem {
    return new AddItemUseCase(
      new OrderGateway(orderDataSource),
      new ProductGateway(productDataSource)
    );
  }

  public static makeUpdateItem(orderDataSource: OrderDataSource): UpdateItem {
    return new UpdateItemUseCase(new OrderGateway(orderDataSource));
  }

  public static makeDeleteItem(orderDataSource: OrderDataSource): DeleteItem {
    return new DeleteItemUseCase(new OrderGateway(orderDataSource));
  }
}
