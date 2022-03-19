import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { HiHeart } from "react-icons/hi";

function Combine() {
  const [count, setCount] = useState(2);
  const [skulls, setSkulls] = useState([]);
  const [skullImages, setSkullImages] = useState([]);
  const [error, setError] = useState(false);
  const [generate, setGenerate] = useState(false);
  const [loading, setLoading] = useState(false);

  const canvasRef = useRef(null);

  useEffect(() => {
    if (generate) {
      console.log("CALLED", skullImages);
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      //Skull 1
      let s1 = new Image();
      s1.src = skullImages[0];
      s1.onload = () => {
        canvas.height = s1.height;
        canvas.width = s1.width;
        context.drawImage(s1, 0, 0, canvas.width, canvas.height);
        skullImages.forEach((imgUrl, index) => {
          if (index === 0) return;
          if (index === 1) {
            let image = new Image();
            image.src = imgUrl;
            return (image.onload = () => {
              context.drawImage(
                image,
                image.width / 2,
                0,
                image.width / 2,
                image.height,
                canvas.width / 2,
                0,
                image.width / 2,
                image.height
              );
            });
          } else if (index === 2) {
            console.log("THird");
            let image = new Image();
            image.src = imgUrl;
            return (image.onload = () => {
              context.drawImage(
                image,
                0,
                image.height / 2,
                image.width,
                image.height / 2,
                0,
                canvas.height / 2,
                image.width,
                image.height / 2
              );
            });
          } else {
            let image = new Image();
            image.src = imgUrl;
            return (image.onload = () => {
              context.drawImage(
                image,
                image.height / 2,
                image.height / 2,
                image.width / 2,
                image.height / 2,
                canvas.width / 2,
                canvas.height / 2,
                image.width / 2,
                image.height / 2
              );
            });
          }
        });
      };
    }
  }, [generate]);

  const downloadImage = () => {
    const canvas = canvasRef.current;

    var url = canvas.toDataURL("image/png");
    var link = document.createElement("a");
    link.download = "CSCombined.png";
    link.href = url;
    link.click();
  };

  const handleSearch = async () => {
    setLoading(true);
    if (skulls.length < 2) {
      return setError("*** Must have at least 2 skulls ***");
    }

    const options = { method: "GET" };
    skulls.forEach(async (skull, index) => {
      return await fetch(
        `https://api.opensea.io/api/v1/asset/0xc1caf0c19a8ac28c41fe59ba6c754e4b9bd54de9/${skull}`,
        options
      )
        .then((response) => response.json())
        .then(async (response) => {
          await download(response.image_url, index);
          setError(null);
          return;
        })
        .catch((err) => console.error(err));
    });
  };

  const download = async (openseaUrl, index) => {
    return await fetch(openseaUrl, {
      method: "GET",
      headers: {},
    })
      .then((response) => {
        response.arrayBuffer().then(function (buffer) {
          const url = window.URL.createObjectURL(new Blob([buffer]));
          let tempArr = skullImages;
          tempArr[index] = url;
          setSkullImages(tempArr);
          if (tempArr.filter((item) => item !== "").length == count) {
            setGenerate(true);
            setLoading(false);
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const reset = () => {
    setSkulls([]);
    setSkullImages([]);
    setCount(2);
    setGenerate(false);
    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Combine | Crypto Skulls</title>
        <meta name="description" content="Multi Pfp Skull Generator" />
      </Helmet>
      <div className="bg-dark min-h-screen flex flex-col justify-center items-center px-3">
        <h1 className="mb-4 text-6xl title text-center text-white sm:mb-6 md:mb-10 md:text-7xl lg:mb-12 lg:text-8xl">
          CS <span className="text-red-700">Combine</span>
        </h1>
        {!generate ? (
          <form className="w-full max-w-lg bg-zinc-800 rounded-lg py-6 px-3 flex flex-col justify-center shadow-md">
            {Array(count)
              .fill("")
              .map((_, index) => (
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-slate-500 text-xs font-bold mb-2">
                    {index + 1} Skull ID
                  </label>
                  <input
                    className={`appearance-none block w-full bg-gray-200 placeholder-gray-800::placeholder text-gray-700 border ${
                      error && "border-red-500"
                    }  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                    type="text"
                    name="TokenID"
                    value={skulls[index]}
                    onChange={(text) => {
                      let tempArr = skulls;
                      tempArr[index] = text.target.value;
                      setSkulls(tempArr);
                    }}
                    placeholder="Token ID"
                    maxLength={4}
                  />
                </div>
              ))}

            <div>
              <button
                onClick={handleSearch}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 ml-3 mt-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
              >
                {loading ? "Loading" : "Generate"}
              </button>
              {count < 4 && (
                <button
                  onClick={() => setCount(count + 1)}
                  className="bg-zinc-200 hover:bg-zinc-400 text-red-600 py-2 px-4 ml-3 mt-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                >
                  Add Skull
                </button>
              )}
            </div>
          </form>
        ) : (
          <div className="flex flex-col justify-center items-center w-full">
            <div
              className="flex justify-center"
              style={{
                fontFamily: "PressStart2P",
              }}
            >
              <canvas ref={canvasRef} className=""></canvas>
            </div>
            <button
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 mt-4 rounded flex items-center mx-auto"
              onClick={downloadImage}
            >
              <svg
                className="fill-current w-4 h-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
              </svg>
              <span>Download</span>
            </button>
            <p
              className="text-red-600 font-mono underline mt-3 cursor-pointer"
              onClick={reset}
            >
              reset
            </p>
          </div>
        )}

        <div className="flex items-center mt-4">
          <p className="text-slate-500">Made with</p>
          <HiHeart className="mx-2 text-red-600" />
          <p className="text-slate-500">
            by{" "}
            <a
              href="https://twitter.com/zmeyer44"
              target="_blank"
              rel="noreferrer"
              className="text-red-600"
            >
              Zachm.eth
            </a>
            <span className="tech text-dark">!</span>
          </p>
        </div>
        {/* <div className="flex md:hidden justify-center items-center text-red-600 fixed top-0 bottom-0 left-0 right-0 bg-zinc-900 z-50">
        <h1 className="font-mono text-xl">Must view on Desktop</h1>
      </div> */}
      </div>
    </>
  );
}

export default Combine;
