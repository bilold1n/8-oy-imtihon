import { message } from "antd";
import useGetData from "../hooks/usegetdata";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { DeleteDocitem1 } from "../../../firebasy/firebasyConfig";
import { useState } from "react";
export default function Home() {
  const [fresh, setFresh] = useState(false);
  const handleDelete = async (id: any) => {
    const status = await DeleteDocitem1("products", id);
    console.log(status);
    setFresh((prev) => !prev);
  };
  const { data, isPending, error } = useGetData("products", fresh);
  console.log(data);
  if (error.status) {
    message.error(error.message);
  }
  return (
    <div className="mt-[50px] container">
      <h1 className="text-[30px] font-semibold pb-3">Recipes</h1>
      <div className="mx-auto flex items-center justify-center mt-5">
        {isPending && (
          <span
            style={{ zoom: "2" }}
            className="loading loading-bars loading-lg"
          ></span>
        )}
      </div>
      <div className="mygrid">
        {data &&
          data.map((item: any) => (
            <>
              <div className="card bg-base-100 w-[350px]   shadow-xl overflow-hidden">
                <div className="">
                  <div className="flex justify-end items-end  rounded-full">
                    <button
                      onClick={() => {
                        const isConfirmed = window.confirm(
                          "Haqiqatdan ham productni o'chirishni xohlaysizmi?"
                        );
                        if (isConfirmed) {
                          handleDelete(item.id);
                        }
                      }}
                      className="rounded-full  p-1 mx-5 pt-5"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="17"
                        height="17"
                        viewBox="0 0 100 100"
                      >
                        <line
                          x1="10"
                          y1="10"
                          x2="90"
                          y2="90"
                          stroke="#0009"
                          stroke-width="10"
                        />
                        <line
                          x1="90"
                          y1="10"
                          x2="10"
                          y2="90"
                          stroke="#0009"
                          stroke-width="10"
                        />
                      </svg>
                    </button>
                  </div>
                  <Link to={`/detalis/${item.id}`}>
                    <h2 className="text-2xl font-bold px-8">{item.title}</h2>
                    <p className=" px-8">
                      {item.method.split(" ").slice(0, 10).join(" ")}
                    </p>

                    <div className="flex gap-3 items-end justify-end py-2 px-8">
                      <div className="badge badge-neutral h-7">NEW</div>
                      <div className="badge badge-secondary h-7">
                        <ClockCircleOutlined className="mr-[5px]  " />{" "}
                        {item.cookingTime} minutes
                      </div>
                    </div>

                    <figure>
                      <img
                        className="w-full h-[170px]"
                        width={150}
                        height={150}
                        src={item.imageURLs[0]}
                        alt="Shoes"
                      />
                    </figure>
                  </Link>
                </div>
              </div>
            </>
          ))}
      </div>
      <div className="mt-[10px] flex justify-center gap-[20px] flex-wrap"></div>
    </div>
  );
}
