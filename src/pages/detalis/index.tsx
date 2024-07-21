import { Link, useParams } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../firebasy/firebasyConfig";
import { message } from "antd";

function Detalis() {
  const { id } = useParams();
  const [data, setData] = useState<any[]>([]);
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [usedata, setUsedata] = useState<any>({});
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  console.log(data);

  useEffect(() => {
    const docRef = doc(db, "cart", user.uid);
    getDoc(docRef).then((docSnap) => {
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setUsedata({ ...docSnap.data() });
      } else {
        console.log("No such document!");
      }
    });
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setData([docSnap.data()]);
      } else {
        message.error("No such document!");
      }
      setLoading(false);
    };

    fetchData();
  }, [id]);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    if (count <= 1) {
      message.error("Count cannot be less than 1");
      return;
    }
    setCount(count - 1);
  };

  const addToCart = () => {
    const cartItem = {
      count: count,
      title: data[0].title,
      price: data[0].price,
      img: data[0].imageURLs,
      ingredients: data[0].ingredients,
      category: data[0].category,
    };
    if (user && user.uid) {
      usedata[`${id}`] = { ...cartItem };
      console.log(usedata);
      setDoc(doc(db, "cart", user.uid), usedata);
      message.success("Item added to cart.");
    } else {
      message.error("User not logged in, cannot add to cart.");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto flex items-center justify-center mt-5">
        <span
          style={{ zoom: "2" }}
          className="loading loading-bars loading-lg"
        ></span>
      </div>
    );
  }

  return (
    <div className="my-5 container">
      {data.map((item: any) => (
        <div key={item.id}>
          <div className="flex justify-end items-end mt-5">
            <Link className="btn w-[200px] btn-neutral " to={"/"}>
              Back
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-3">Recipe elements</h1>
          <div className="flex gap-5 bg-slate-700 w-full rounded-xl p-6 overflow-x-auto">
            {item.imageURLs.map((image: any, index: number) => (
              <img
                key={index}
                className="w-[320px] h-[170px] object-cover"
                src={image}
                alt="Recipe"
              />
            ))}
          </div>
          <div className="w-full mt-14 flex flex-col md:flex-row justify-between">
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl font-bold">{item.title}</h1>
              <div className="flex gap-2 items-center">
                <p>Ingredients:</p>
                <div className="flex gap-2 flex-wrap">
                  {item.ingredients.map((ing: any, index: number) => (
                    <span key={index} className="badge badge-neutral pb-1">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
              <p>Cooking time: {item.cookingTime} minutes</p>
              <h3>Method</h3>
              <p>{item.method}</p>
            </div>

            <div className="flex justify-between items-center mt-5 md:mt-0">
              <div className="flex flex-col items-center gap-8">
                <div className="flex items-center gap-2 w-full">
                  <button onClick={decrement} className="btn  btn-primary">
                    -
                  </button>
                  <p>Count: {count}</p>
                  <button onClick={increment} className="btn  btn-primary">
                    +
                  </button>
                </div>
                <button
                  className="btn btn-outline w-full btn-primary mr-2"
                  onClick={addToCart}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Detalis;
