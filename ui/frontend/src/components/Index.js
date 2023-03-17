import "glider-js/glider.min.css";
import { useContext } from "react";
import Glider from "react-glider";
import { Link } from "react-router-dom";

import slider1 from "../assets/images/slider/1.svg";
import slider2 from "../assets/images/slider/2.svg";
import slider3 from "../assets/images/slider/3.svg";
import slider4 from "../assets/images/slider/4.svg";
import slider5 from "../assets/images/slider/5.svg";
import slider6 from "../assets/images/slider/6.svg";
import { DatasetsContext } from "../contexts/datasets";

function Index() {
  const { datasets } = useContext(DatasetsContext);
  return (
    <div className="p-4">
      <div className="header_font leading-relaxed text-blue-900">
        <span className="header_font font-extrabold">Summary Explorer</span> is
        a tool to visually inspect the summaries from several state-of-the-art
        neural summarization models across multiple datasets. It provides a
        guided assessment of summary quality dimensions such as coverage,
        faithfulness and position bias. You can inspect summaries from a single
        model or compare multiple models.
        <div className="">
          To integrate your model in{" "}
          <span className="header_font font-extrabold">Summary Explorer</span>,
          please prepare your summaries as described{" "}
          <Link to="/about" className="underline">
            here
          </Link>{" "}
          and contact us.
        </div>
      </div>
      <ul className="mb-8 mt-8 grid grid-cols-1 gap-20 sm:grid-cols-2 lg:grid-cols-3">
        {datasets.map(({ name, description_items, id }) => (
          <li
            key={id}
            className="z-0 col-span-1 divide-y divide-gray-200 rounded-lg bg-white"
          >
            <div className="flex w-full items-center justify-between space-x-6 p-6">
              <div className="flex-1 truncate">
                <div className="flex items-center space-x-3">
                  <h3 className="truncate text-sm font-bold text-blue-800">
                    {name}
                  </h3>
                </div>
                {description_items.map((item, i) => (
                  <p key={i} className="mt-1 text-gray-600 text-sm truncate">
                    {item}
                  </p>
                ))}
              </div>
            </div>
            <div>
              <div className="-mt-px flex divide-x divide-gray-200">
                <div className="-ml-px flex w-0 flex-1 bg-blue-800 hover:bg-red-700">
                  <Link
                    to={`/main?dataset=${id}`}
                    className="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg py-4 text-sm font-medium text-white"
                  >
                    <span className="ml-3">Explore</span>
                  </Link>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mx-28">
        <div className="glider-contain mt-10">
          <Glider
            draggable
            rewind
            hasArrows
            arrows={{
              prev: ".glider-prev",
              next: ".glider-next",
            }}
            dots=".dots"
            hasDots
            slidesToShow={1}
            slidesToScroll={1}
          >
            <img className="m-auto" alt="" src={slider1} />
            <img className="m-auto" alt="" src={slider2} />
            <img className="m-auto" alt="" src={slider3} />
            <img className="m-auto" alt="" src={slider4} />
            <img className="m-auto" alt="" src={slider5} />
            <img className="m-auto" alt="" src={slider6} />
          </Glider>
          <button
            type="button"
            aria-label="Previous"
            className="glider-prev mt-16 -translate-x-2 text-5xl"
          >
            &lsaquo;
          </button>
          <button
            type="button"
            aria-label="Next"
            className="glider-next mt-16 translate-x-2 text-5xl"
          >
            &rsaquo;
          </button>
          <div role="tablist" className="dots opacity-50" />
        </div>
      </div>
    </div>
  );
}

export default Index;
