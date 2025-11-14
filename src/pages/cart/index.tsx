import { useEffect, useState } from "react";
import { message, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { db } from "../../firebasy/firebasyConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
// Define types
interface CartItem {
  id: string;
  price: number;
  imageURLs: string[];
  title: string;
  count: number;
}

interface Counts {
  [key: string]: number;
}

export default function YouCart() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [counts, setCounts] = useState<Counts>({});
  const [usedata, setUsedata] = useState<{ [key: string]: any }>({});
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Load counts from localStorage on mount
  useEffect(() => {
    const savedCounts = JSON.parse(localStorage.getItem("counts") || "{}");
    setCounts(savedCounts);
  }, []);

  // Fetch cart IDs from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "cart", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUsedata({ ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.uid]);

  // Fetch full product data for each cart ID
  useEffect(() => {
    if (Object.keys(usedata).length > 0) {
      const fetchProducts = async () => {
        setLoading(true);
        const cartItems: CartItem[] = [];
        for (const id of Object.keys(usedata)) {
          const docRef = doc(db, "products", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const count = usedata[id].count || 1;
            cartItems.push({
              id: docSnap.id,
              count,
              ...docSnap.data(),
            } as CartItem);
            setCounts((prev) => ({ ...prev, [id]: count }));
          }
        }
        setCart(cartItems);
        setLoading(false);
      };
      fetchProducts();
    }
  }, [usedata]);

  // Sync counts to localStorage
  useEffect(() => {
    localStorage.setItem("counts", JSON.stringify(counts));
  }, [counts]);

  const updateFirestore = async (updated: any) => {
    const docRef = doc(db, "cart", user.uid);
    await setDoc(docRef, updated);
  };

  const increment = async (id: string) => {
    const newCount = (counts[id] || 1) + 1;
    setCounts((prev) => ({ ...prev, [id]: newCount }));

    const updated = { ...usedata };
    updated[id].count = newCount;
    setUsedata(updated);

    await updateFirestore(updated);
    message.success("Count increased");
  };

  const decrement = async (id: string) => {
    const newCount = (counts[id] || 1) - 1;
    if (newCount < 1) return message.error("Count cannot be less than 1");

    setCounts((prev) => ({ ...prev, [id]: newCount }));

    const updated = { ...usedata };
    updated[id].count = newCount;
    setUsedata(updated);

    await updateFirestore(updated);
    message.success("Count decreased");
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setConfirmVisible(true);
  };

  const removeItem = async () => {
    if (!deleteId) return;

    const id = deleteId;
    setCart((prev) => prev.filter((item) => item.id !== id));

    const updated = { ...usedata };
    delete updated[id];
    setUsedata(updated);
    await updateFirestore(updated);

    setCounts((prev) => {
      const newCounts = { ...prev };
      delete newCounts[id];
      return newCounts;
    });

    setConfirmVisible(false);
    setDeleteId(null);
    message.success("Item removed");
  };

  const subtotal = cart.reduce((acc, item) => {
    const count = counts[item.id] || 1;
    return acc + item.price * count;
  }, 0);

  const shipping = 5;
  const tax = 85;
  const orderTotal = subtotal + shipping + tax;

  localStorage.setItem("cartlen", JSON.stringify(cart.length));

  return (
    <div className="container mx-auto mt-10 px-4 ">
      {loading && (
        <div className="flex justify-center mt-5">
          <span
            style={{ zoom: "2" }}
            className="loading loading-bars loading-lg"
          ></span>
        </div>
      )}
      <div className="flex  items-end mt-5">
        <Link className="btn w-[200px] btn-neutral " to={"/"}>
          Go to the Home
        </Link>
      </div>
      <div className="flex flex-col mt-12 lg:flex-row justify-between">
        <div className="flex flex-col gap-8 w-full lg:w-[700px]">
          {cart.length ? (
            cart.map((item) => (
              <div
                key={item.id}
                className="card card-side bg-base-100 shadow-xl w-full"
              >
                <figure>
                  <img
                    className="w-[100px] h-full md:w-[200px]"
                    src={item.imageURLs[0]}
                    alt={item.title}
                  />
                </figure>
                <div className="card-body flex flex-col lg:flex-row justify-between">
                  <div>
                    <h2 className="card-title">{item.title}</h2>
                    <p>${item.price}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2 lg:mt-0">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decrement(item.id)}
                        className="btn btn-primary"
                      >
                        -
                      </button>
                      <p>Count: {counts[item.id] || 1}</p>
                      <button
                        onClick={() => increment(item.id)}
                        className="btn btn-primary"
                      >
                        +
                      </button>
                    </div>
                    <DeleteOutlined
                      className="text-red-500 cursor-pointer ml-4"
                      onClick={() => confirmDelete(item.id)}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Cart is empty</p>
          )}
        </div>

        <div className="mt-5 lg:mt-0">
          <div className="flex flex-col gap-6 ">
            <div className="w-full lg:w-[325px] bg-primary-content rounded-xl text-[#394E6A] p-4 md:p-8">
              <div className="flex my-3 justify-between">
                <p>Subtotal</p>
                <p>${Math.round(subtotal)}.00</p>
              </div>
              <hr />
              <div className="flex my-3 justify-between">
                <p>Shipping</p>
                <p>${shipping}.00</p>
              </div>
              <hr />
              <div className="flex my-3 justify-between">
                <p>Tax</p>
                <p>${tax}.00</p>
              </div>
              <hr />
              <div className="flex mt-5 justify-between">
                <h3>Order Total</h3>
                <p>${Math.round(orderTotal)}.00</p>
              </div>
            </div>
            <button className="btn btn-primary w-full lg:w-[325px]">
              Checkout
            </button>
          </div>
        </div>
      </div>

      <Modal
        title="Delete item?"
        open={confirmVisible}
        onOk={removeItem}
        onCancel={() => setConfirmVisible(false)}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to remove this item?</p>
      </Modal>
    </div>
  );
}
