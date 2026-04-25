const { useReducer } = React;

const PRODUCTS = [
  { id: 1, name: "React тениска", price: 29.99, emoji: "T" },
  { id: 2, name: "JavaScript чаша", price: 14.99, emoji: "C" },
  { id: 3, name: "CSS стикери", price: 4.99, emoji: "S" },
  { id: 4, name: "Node.js шапка", price: 24.99, emoji: "H" },
];

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((item) => item.product.id === action.product.id);

      return {
        items: existing
          ? state.items.map((item) =>
              item.product.id === action.product.id ? { ...item, quantity: item.quantity + 1 } : item
            )
          : [...state.items, { product: action.product, quantity: 1 }],
      };
    }
    case "REMOVE_ITEM":
      return {
        items: state.items.filter((item) => item.product.id !== action.id),
      };
    case "UPDATE_QUANTITY":
      return {
        items: state.items
          .map((item) =>
            item.product.id === action.id ? { ...item, quantity: Math.max(0, action.quantity) } : item
          )
          .filter((item) => item.quantity > 0),
      };
    case "CLEAR_CART":
      return { items: [] };
    default:
      return state;
  }
}

function formatPrice(value) {
  return `${value.toFixed(2)} лв.`;
}

function ProductCatalog({ onAdd }) {
  return (
    <section className="panel">
      <h2>Каталог</h2>
      <div className="catalog-grid">
        {PRODUCTS.map((product) => (
          <article key={product.id} className="product-card">
            <span className="product-symbol">{product.emoji}</span>
            <div>
              <h3>{product.name}</h3>
              <p className="price">{formatPrice(product.price)}</p>
            </div>
            <button type="button" onClick={() => onAdd(product)}>
              Добави
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function CartItem({ item, onUpdateQty, onRemove }) {
  return (
    <article className="cart-item">
      <div className="cart-item-header">
        <div>
          <strong>{item.product.name}</strong>
          <div className="price">{formatPrice(item.product.price)}</div>
        </div>
        <strong>{formatPrice(item.product.price * item.quantity)}</strong>
      </div>
      <div className="quantity-row">
        <button type="button" onClick={() => onUpdateQty(item.quantity - 1)}>
          -
        </button>
        <strong>{item.quantity}</strong>
        <button type="button" onClick={() => onUpdateQty(item.quantity + 1)}>
          +
        </button>
        <button type="button" className="remove-button" onClick={onRemove}>
          Премахни
        </button>
      </div>
    </article>
  );
}

function CartSummary({ totalItems, total, onClear }) {
  return (
    <section className="summary">
      <div className="summary-row">
        <span>Общо артикули</span>
        <strong>{totalItems}</strong>
      </div>
      <div className="summary-row">
        <span>Обща цена</span>
        <strong>{formatPrice(total)}</strong>
      </div>
      <button type="button" className="clear-button" onClick={onClear} disabled={totalItems === 0}>
        Изчисти
      </button>
    </section>
  );
}

function ShoppingApp() {
  const [cart, dispatch] = useReducer(cartReducer, { items: [] });
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const addProduct = (product) => dispatch({ type: "ADD_ITEM", product });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  return (
    <div className="shopping-app">
      <h1>Количка за пазаруване</h1>
      <div className="layout">
        <ProductCatalog onAdd={addProduct} />

        <section className="panel">
          <h2>Количка ({totalItems} артикула)</h2>
          {cart.items.length === 0 ? (
            <div className="empty-cart">Количката е празна.</div>
          ) : (
            <div className="cart-list">
              {cart.items.map((item) => (
                <CartItem
                  key={item.product.id}
                  item={item}
                  onUpdateQty={(quantity) =>
                    dispatch({ type: "UPDATE_QUANTITY", id: item.product.id, quantity })
                  }
                  onRemove={() => dispatch({ type: "REMOVE_ITEM", id: item.product.id })}
                />
              ))}
            </div>
          )}
          <CartSummary
            totalItems={totalItems}
            total={totalPrice}
            onClear={clearCart}
          />
        </section>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<ShoppingApp />);
