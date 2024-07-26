import { useState } from "react";
import { message, Modal } from "antd";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebasy/firebasyConfig";

export default function CreateRecipe() {
  const [title, setTitle] = useState("");
  const [cookingTime, setCookingTime] = useState<number | undefined>(undefined);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [ingredient, setIngredient] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [imageURLs, setImageURLs] = useState<string[]>([]);
  const [method, setMethod] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(0);
  const [modal2Open, setModal2Open] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const isValidURL = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleAddIngredient = () => {
    if (ingredient.trim()) {
      setIngredients((prevIngredients) => [...prevIngredients, ingredient]);
      setIngredient("");
    }
  };

  const handleAddImageURL = () => {
    if (imageURL.trim() && isValidURL(imageURL) && imageURLs.length < 4) {
      setImageURLs((prevImageURLs) => [...prevImageURLs, imageURL]);
      setImageURL("");
    } else if (!isValidURL(imageURL)) {
      message.error("Invalid URL format. Please enter a valid URL.");
    }
  };

  const validateForm = () => {
    if (!title.trim()) {
      message.error("Title is required.");
      return false;
    }
    if (cookingTime === undefined || cookingTime <= 0) {
      message.error("Cooking time must be a positive number.");
      return false;
    }
    if (ingredients.length === 0) {
      message.error("At least one ingredient is required.");
      return false;
    }
    if (imageURLs.length === 0) {
      message.error("At least one image URL is required.");
      return false;
    }
    if (imageURLs.length > 4) {
      message.error("You can only add up to 4 image URLs.");
      return false;
    }
    if (!method.trim()) {
      message.error("Method is required.");
      return false;
    }
    if (!category.trim()) {
      message.error("Category is required.");
      return false;
    }
    if (price <= 0) {
      message.error("Price must be a positive number.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const recipe = {
      title,
      cookingTime,
      ingredients,
      imageURLs,
      method,
      category,
      price,
    };

    try {
      await addDoc(collection(db, "products"), recipe);
      message.success("Recipe submitted successfully!");
      setCategory("");
      setCookingTime(undefined);
      setIngredients([]);
      setImageURLs([]);
      setMethod("");
      setPrice(0);
      setTitle("");
      navigate("/");
    } catch (error) {
      console.error("Error adding document: ", error);
      message.error("Error submitting the recipe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full pb-5">
      <div className="max-w-[520px] mx-auto mt-[30px]">
        <div className="flex flex-col text-center">
          <h1 className="text-[25px] font-semibold">Add New Recipe</h1>
          <div className="flex flex-col gap-[10px] px-[10px] mt-[20px]">
            <label className="form-control w-full max-w-[100%] text-left">
              <label className="text-xl mb-1">Title:</label>
              <input
                type="text"
                placeholder="Enter your meal name"
                className="input input-bordered w-full max-w-[100%]"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <label className="form-control w-full max-w-[100%] text-left">
              <label className="text-xl mb-1">Cooking time:</label>
              <input
                type="number"
                placeholder="Enter preparation time your meal"
                className="input input-bordered w-full max-w-[100%]"
                value={cookingTime ?? ""}
                onChange={(e) => setCookingTime(Number(e.target.value))}
              />
            </label>
            <label className="form-control w-full max-w-[100%] text-left">
              <label className="text-xl mb-1">Category:</label>
              <select
                className="select select-bordered w-full max-w-[100%]"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="" disabled>
                  Select a category
                </option>
                <option value="Qovurilgan">Qovurilgan</option>
                <option value="Qaynatilgan">Qaynatilgan</option>
                <option value="Dimlangan">Dimlangan</option>
                <option value="Dudlangan">Dudlangan</option>
                <option value="Shirinlik">Shirinlik</option>
                <option value="Dessert">Dessert</option>
              </select>
            </label>
            <label className="form-control w-full max-w-[100%] text-left">
              <label className="text-xl mb-1">Price:</label>
              <div className="flex justify-between mt-1">
                <span className="font-bold">Min-price:$0</span>
                <span className="font-bold">Selected price:${price}</span>
                <span className="font-bold">Max-price:$100</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="range"
              />
            </label>
            <div className="text-left">
              <label className="text-xl">Ingredients</label>
              <div className="flex justify-between mt-2 gap-[10px] items-center">
                <input
                  type="text"
                  placeholder="Enter ingredients of meal"
                  className="input input-bordered w-full max-w-[100%]"
                  value={ingredient}
                  onChange={(e) => setIngredient(e.target.value)}
                />
                <button
                  type="button"
                  className="btn w-[80px] bg-accent text-primary-content text-[20px]"
                  onClick={handleAddIngredient}
                >
                  +
                </button>
              </div>
              <div className="flex gap-[12px] mt-[8px] items-center flex-wrap">
                <p>Ingredients:</p>
                {ingredients.length > 0 ? (
                  ingredients.map((ing, index) => (
                    <span key={index} className="p-[5px] rounded-[18px] border">
                      {ing}
                    </span>
                  ))
                ) : (
                  <p className="p-[5px] rounded-[18px] border">
                    No Ingredients yet
                  </p>
                )}
              </div>
            </div>
            <div className="text-left">
              <label className="text-xl mb-1">Image URL:</label>
              <div className="flex justify-between gap-[10px] items-center mt-2">
                <input
                  type="text"
                  placeholder="Enter image URL"
                  className="input input-bordered w-full max-w-[100%]"
                  value={imageURL}
                  onChange={(e) => setImageURL(e.target.value)}
                  disabled={imageURLs.length >= 4}
                />
                <button
                  type="button"
                  className={`btn bg-accent text-primary-content w-[80px] text-[20px] ${
                    imageURLs.length >= 4 ? "btn-disabled" : ""
                  }`}
                  onClick={handleAddImageURL}
                  disabled={imageURLs.length >= 4}
                >
                  +
                </button>
              </div>
              <div className="flex gap-[12px] mt-[8px] items-center flex-wrap">
                <p>Images:</p>
                {imageURLs.length > 0 ? (
                  imageURLs.map((url, index) => (
                    <img
                      key={index}
                      className="w-[40px] h-[40px] object-cover rounded-lg"
                      src={url}
                      alt={`Image ${index}`}
                    />
                  ))
                ) : (
                  <p className="p-[5px] rounded-[18px] border">No images yet</p>
                )}
              </div>
            </div>
            <div className="flex flex-col text-left">
              <h1>Method:</h1>
              <textarea
                className="textarea textarea-bordered"
                placeholder="Enter method of meal"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              ></textarea>
            </div>
            <div className="flex justify-center gap-[10px] flex-wrap">
              <button
                className="btn bg-info w-[245px]"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <span
                      style={{ zoom: "2" }}
                      className="loading loading-bars loading-lg"
                    ></span>
                  </div>
                ) : (
                  "Apply"
                )}
              </button>
              <button
                onClick={() => setModal2Open(true)}
                className="btn bg-accent w-[245px]"
              >
                Preview
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Recipe Preview"
        centered
        open={modal2Open}
        footer={null}
        width={600}
        onCancel={() => setModal2Open(false)}
      >
        <div className="flex flex-wrap gap-4 justify-center">
          {imageURLs.map((image, index) => (
            <img
              key={index}
              className="w-[200px] sm:w-[200px] h-auto object-cover rounded-lg"
              src={image}
              alt={`Preview ${index}`}
            />
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-4">
          <h1 className="text-2xl font-bold">{title}</h1>
          <div className="flex flex-wrap gap-2">
            <p className="font-bold">Ingredients:</p>
            <div className="flex gap-2 flex-wrap">
              {ingredients.map((ing, index) => (
                <span key={index} className="badge badge-neutral">
                  {ing}
                </span>
              ))}
            </div>
          </div>
          <p className="font-bold">Cooking time: {cookingTime} minutes</p>
          <div className="flex flex-col gap-2">
            <h3 className="font-bold">Method:</h3>
            <p>{method}</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
