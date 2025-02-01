import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";

import ResourceNotFoundError from "../../../../core/common/exceptions/ResourceNotFoundError";

import CustomerDTO from "../../../../core/customers/dto/CustomerDTO";
import ItemDTO from "../../../../core/orders/dto/ItemDTO";
import OrderDTO from "../../../../core/orders/dto/OrderDTO";
import ProductDTO from "../../../../core/products/dto/ProductDTO";

import OrderGateway from "../../../../core/interfaces/OrderGateway";
import FakeCustomerGateway from "../../../../gateways/FakeCustomerGateway";
import FakeOrderGateway from "../../../../gateways/FakeOrderGateway";
import FakeProductGateway from "../../../../gateways/FakeProductGateway";

import AddItemUseCase from "../../../../core/orders/use-cases/AddItemUseCase";
import CreateOrderUseCase from "../../../../core/orders/use-cases/CreateOrderUseCase";

chai.use(chaiAsPromised);

const PRODUCT_DTO = new ProductDTO({
  name: "Hamburguer",
  category: "Lanche",
  description: "Hamburguer used for tests",
  price: 12.99,
});

const CUSTOMER_DTO = new CustomerDTO({
  name: "John Doe",
  cpf: "11111111111",
  email: "john.doe@gmail.com",
});

let customerGateway: FakeCustomerGateway,
  productGateway: FakeProductGateway,
  orderGateway: OrderGateway;

describe("Add Item", () => {
  beforeEach(() => {
    customerGateway = new FakeCustomerGateway();
    orderGateway = new FakeOrderGateway();
    productGateway = new FakeProductGateway();
  });

  function setupCreateOrderUseCase() {
    return new CreateOrderUseCase(orderGateway, customerGateway);
  }

  function setupAddItemUseCase() {
    return new AddItemUseCase(orderGateway, productGateway);
  }

  async function createCustomer() {
    return await customerGateway.create(CUSTOMER_DTO);
  }

  async function createProduct() {
    return await productGateway.createProduct(PRODUCT_DTO);
  }

  async function createOrderDTO() {
    const customer = await createCustomer();
    return new OrderDTO({ customerId: customer!.id });
  }

  it("should add item to order", async () => {
    const createOrderUseCase = setupCreateOrderUseCase();
    const addItemUseCase = setupAddItemUseCase();

    const product = await createProduct();
    const orderDTO = await createOrderDTO();
    const order = await createOrderUseCase.createOrder(orderDTO);
    const itemDTO = new ItemDTO({
      productId: product.id,
      quantity: 2,
    });

    const orderWithItems = await addItemUseCase.addItem(order.id!, itemDTO);

    expect(orderWithItems).to.not.be.undefined;
    expect(orderWithItems.items).to.not.be.undefined;
    expect(orderWithItems.items!.length).to.be.at.least(1);

    const createdItem = orderWithItems.items![0];
    expect(createdItem.id).to.not.be.undefined;
    expect(createdItem.productId).to.be.equals(product.id);
    expect(createdItem.quantity).to.be.equals(2);
    expect(createdItem.totalPrice).to.be.equals(
      createdItem.quantity! * product.price!
    );
  });

  it("should throw error when order does not exist", async () => {
    const addItemUseCase = setupAddItemUseCase();

    const product = await createProduct();
    const unexistingOrderId = -1;
    const itemDTO = new ItemDTO({
      productId: product.id,
      quantity: 2,
    });
    await expect(
      addItemUseCase.addItem(unexistingOrderId, itemDTO)
    ).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it("should throw error when product does not exist", async () => {
    const createOrderUseCase = setupCreateOrderUseCase();
    const addItemUseCase = setupAddItemUseCase();

    const unexistingProductId = -1;
    const orderDTO = await createOrderDTO();
    const order = await createOrderUseCase.createOrder(orderDTO);
    const itemDTO = new ItemDTO({
      productId: unexistingProductId,
      quantity: 2,
    });
    await expect(
      addItemUseCase.addItem(order.id!, itemDTO)
    ).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });
});
