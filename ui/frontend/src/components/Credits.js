/* eslint-disable */
import JaenickeSrc from "../assets/images/jaenicke.jpg";
import UniDenmarkSrc from "../assets/images/university-of-southern-denmark.png";

function Credits() {
  return (
    <div id="root" className="container mx-auto mt-2 w-full">
      <div className="left-0 mt-4 w-full justify-end rounded-lg p-1 px-4 py-4 text-left text-sm ">
        <h1
          className="text-normal article_header header_font mb-0 px-4 py-2 text-justify text-2xl font-extrabold
                             text-blue-900"
        >
          Credits
        </h1>

        <div>
          <ul className="grid grid-cols-1 gap-y-4 gap-x-4 px-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:lg:grid-cols-4 ">
            <li className="col-span-1 bg-white">
              <a href="https://temir.org/people.html">
                <div className="flex h-auto flex-row overflow-hidden lg:flex-row">
                  <img
                    className="block h-full flex-none sm:h-auto "
                    src="https://webis.de/img/people/syed.jpg"
                  />
                  <div className="flex flex-col justify-between rounded-b bg-white p-4 leading-normal lg:rounded-b-none lg:rounded-r">
                    <div className="mb-1 text-base leading-tight text-gray-700">
                      Shahbaz Syed
                    </div>
                    <div className="text-xs text-gray-600">
                      Leipzig University
                    </div>
                    <img
                      src="https://webis.de/img/organizations/logo-universitaet-leipzig.png"
                      className="w-32"
                    />
                  </div>
                </div>
              </a>
            </li>

            <li className="col-span-1 bg-white">
              <a href="https://temir.org/people.html">
                <div className="flex h-auto flex-row overflow-hidden lg:flex-row  ">
                  <img
                    className="block h-full flex-none   sm:h-auto"
                    src="https://temir.org/people/img/yousef.jpg"
                  />
                  <div className="flex flex-col justify-between rounded-b bg-white p-4 leading-normal lg:rounded-b-none lg:rounded-r">
                    <div className="mb-1 text-base leading-tight text-gray-700">
                      Tariq Yousef
                    </div>
                    <div className="text-xs text-gray-600">
                      Leipzig University
                    </div>
                    <img
                      src="https://webis.de/img/organizations/logo-universitaet-leipzig.png"
                      className="w-32"
                    />
                  </div>
                </div>
              </a>
            </li>

            <li className="col-span-1 bg-white">
              <a href="https://temir.org/people.html">
                <div className="flex h-auto flex-row  overflow-hidden lg:flex-row  ">
                  <img
                    className="block h-full flex-none sm:h-auto"
                    src="https://temir.org/people/img/alkhatib.jpg"
                  />
                  <div className="flex flex-col justify-between rounded-b bg-white p-4 leading-normal lg:rounded-b-none lg:rounded-r">
                    <div className="mb-1 text-base leading-tight text-gray-700">
                      Khalid Al-Khatib
                    </div>
                    <div className="text-xs text-gray-600">
                      Leipzig University
                    </div>
                    <img
                      src="https://webis.de/img/organizations/logo-universitaet-leipzig.png"
                      className="w-32"
                    />
                  </div>
                </div>
              </a>
            </li>

            <li className="col-span-1 bg-white">
              <a href="https://imada.sdu.dk/~stjaenicke/">
                <div className="flex h-auto flex-row  overflow-hidden lg:flex-row  ">
                  <img
                    className="block h-full flex-none sm:h-full"
                    src={JaenickeSrc}
                  />
                  <div className="flex flex-col justify-between rounded-b bg-white p-4 leading-normal lg:rounded-b-none lg:rounded-r">
                    <div className="mb-1 text-base leading-tight text-gray-700">
                      Stefan Jänicke
                    </div>
                    <div className="pb-0 text-xs text-gray-600">
                      University of Southern Denmark
                    </div>
                    <img src={UniDenmarkSrc} className="w-16" />
                  </div>
                </div>
              </a>
            </li>

            <li className="col-span-1 bg-white">
              <a href="https://temir.org/people.html">
                <div className="flex h-auto flex-row overflow-hidden object-none lg:flex-row  ">
                  <img
                    className="block h-full flex-none   sm:h-auto"
                    src="https://webis.de/img/people/potthast.jpg"
                  />
                  <div className="flex flex-col justify-between rounded-b bg-white p-4 leading-normal lg:rounded-b-none lg:rounded-r">
                    <div className="mb-1 text-base leading-tight text-gray-700">
                      Martin Potthast
                    </div>
                    <div className="text-xs text-gray-600">
                      {" "}
                      Leipzig University
                    </div>
                    <img
                      src="https://webis.de/img/organizations/logo-universitaet-leipzig.png"
                      className="w-32"
                    />
                  </div>
                </div>
              </a>
            </li>
          </ul>
        </div>

        <div className="mt-10 mb-10">
          <h1
            className="text-normal article_header header_font mb-0 px-4 py-2 text-justify text-xl font-extrabold
                text-blue-900"
          >
            Acknowledgements
          </h1>

          <p className="px-4">
            We sincerely thank all the authors who made their code and model
            outputs publicly available, meta evaluations of{" "}
            <a
              href="https://github.com/Yale-LILY/SummEval"
              className="underline"
            >
              Fabbri et al., 2020
            </a>{" "}
            and{" "}
            <a href="https://github.com/neulab/REALSumm" className="underline">
              Bhandari et al., 2020
            </a>
            , and the summarization leaderboard at{" "}
            <a
              href="https://nlpprogress.com/english/summarization.html"
              className="underline"
            >
              NLP-Progress.
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Credits;
