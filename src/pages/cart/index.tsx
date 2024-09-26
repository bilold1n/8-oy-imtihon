import { useEffect, useState } from "react";
import { message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { db } from "../../firebasy/firebasyConfig";
import { doc, getDoc } from "firebase/firestore";

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
    const savedCounts = JSON.parse(localStorage.getItem("counts") || "{}");
    setCounts(savedCounts);
  }, []);

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
    console.log(id);
    message.info("Bu yerni qila olmadim");
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
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-center mt-5">
        {loading ? (
          <span
            style={{ zoom: "2" }}
            className="loading loading-bars loading-lg"
          ></span>
        ) : null}
      </div>
      <div className="flex flex-col lg:flex-row justify-between">
        <div className="flex flex-col gap-8 w-full lg:w-[700px]">
          {cart.length ? (
            cart.map((item) => (
              <div key={item.id} className="w-full">
                <div className="card card-side bg-base-100 shadow-xl">
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
                        onClick={() => removeItem(item.id)}
                      />
                    </div>
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
    </div>
  );
}
