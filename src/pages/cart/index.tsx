import { useEffect, useState } from "react";
import { message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { db, DeleteDocitem1 } from "../../firebasy/firebasyConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

// Define types for better type safety
type CartItem = {
  id: string;
  price: number;
  imageURLs: string[];
  title: string;
};

type Counts = {
  [key: string]: number;
};

export default function YouCart() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [counts, setCounts] = useState<Counts>({});
  const [usedata, setUsedata] = useState<{ [key: string]: any }>({});
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "cart", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUsedata({ ...docSnap.data() });
      } else {
        console.log("No such document!");
      }
      setLoading(false); // Set loading to false after fetching data
    };
    fetchData();
  }, [user.uid]);

  useEffect(() => {
    localStorage.setItem("lengt", JSON.stringify(Object.keys(usedata).length));
  }, [Object.keys(usedata).length]);

  useEffect(() => {
    if (Object.keys(usedata).length > 0) {
      const fetchProducts = async () => {
        setLoading(true); // Set loading to true before fetching products
        const cartItems: CartItem[] = [];
        for (const id of Object.keys(usedata)) {
          const docRef = doc(db, "products", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            cartItems.push({
              id: docSnap.id,
              ...usedata[id],
              ...docSnap.data(),
            });
          }
        }
        setCart(cartItems);
        setLoading(false); // Set loading to false after fetching products
      };
      fetchProducts();
    }
  }, [usedata]);

  const increment = (id: string) => {
    setCounts((prevCounts) => ({
      ...prevCounts,
      [id]: (prevCounts[id] || 1) + 1,
    }));
  };

  const decrement = (id: string) => {
    setCounts((prevCounts) => {
      const newCount = (prevCounts[id] || 1) - 1;
      if (newCount < 1) {
        message.error("Count cannot be less than 1");
        return prevCounts;
      }
      return {
        ...prevCounts,
        [id]: newCount,
      };
    });
  };

  const removeItem = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this item from your cart?"
    );
    if (confirmDelete) {
      console.log(id);
      console.log(cart);

      await DeleteDocitem1("cart", id); // Update the delete function here

      const docRef = doc(db, "cart", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const newData = { ...docSnap.data() };
        delete newData[id]; // Remove the item from the local state
        await updateDoc(docRef, newData); // Update Firestore document
        setUsedata(newData); // Update local state with new data
      } else {
        console.log("No such document!");
      }

      message.success("Item removed from cart");
    }
  };

  const getSubtotal = () => {
    if (!cart || cart.length === 0) return 0;
    return cart.reduce((acc, item) => {
      const itemCount = counts[item.id] || 1;
      return acc + item.price * itemCount;
    }, 0);
  };

  const subtotal = getSubtotal();
  const shipping = 5;
  const tax = 85;
  const orderTotal = subtotal + shipping + tax;

  return (
    <div className="container">
      <div className="mx-auto flex items-center justify-center mt-5">
        {loading ? (
          <span
            style={{ zoom: "2" }}
            className="loading loading-bars loading-lg"
          ></span>
        ) : null}
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col gap-8">
          {cart.length ? (
            cart.map((item) => (
              <div key={item.id} className="w-[700px]">
                <div className="card card-side bg-base-100 shadow-xl">
                  <figure>
                    <img
                      className="w-[200px] h-full"
                      width={200}
                      height={100}
                      src={item.imageURLs[0]}
                      alt={item.title}
                    />
                  </figure>
                  <div className="card-body flex">
                    <div className="flex justify-between">
                      <div>
                        <h2 className="card-title">{item.title}</h2>
                        <p>${item.price}</p>
                      </div>
                      <div>
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
                        <span className="text-2xl flex justify-end mt-5">
                          <DeleteOutlined
                            className="text-red-500 cursor-pointer"
                            onClick={() => removeItem(item.id)}
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p></p>
          )}
        </div>
        <div>
          <div className="flex flex-col gap-6 ">
            <div className="w-[325px] bg-primary-content rounded-xl text-[#394E6A] p-8">
              <div className="flex my-3">
                <p className="mr-auto">Subtotal</p>
                <p>${Math.round(subtotal)}.00</p>
              </div>
              <hr />
              <div className="flex my-3">
                <p className="mr-auto">Shipping</p>
                <p>${shipping}.00</p>
              </div>
              <hr />
              <div className="flex my-3">
                <p className="mr-auto">Tax</p>
                <p>${tax}.00</p>
              </div>
              <hr />
              <div className="flex mt-5">
                <h3 className="mr-auto">Order Total</h3>
                <p>${Math.round(orderTotal)}.00</p>
              </div>
            </div>
            <button className="btn btn-primary w-[325px]">Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
}
