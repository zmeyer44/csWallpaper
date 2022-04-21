import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { HiHeart } from "react-icons/hi";

function Combine() {
  const [ogSkull, setOgSkull] = useState("");
  const [demonicSkull, setDemonicSkull] = useState("");
  const [ogSkullImage, setOgSkullImage] = useState("");
  const [demonicSkullImage, setDemonicSkullImage] = useState("");
  const [error, setError] = useState(false);
  const [generate, setGenerate] = useState(false);
  const [loading, setLoading] = useState(false);

  const canvasRef = useRef(null);

  useEffect(() => {
    if (generate) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      //OG Skull
      let s1 = new Image();
      s1.src = ogSkullImage;
      s1.onload = () => {
        canvas.height = s1.height;
        canvas.width = s1.width;
        context.drawImage(s1, 0, 0, canvas.width, canvas.height);
        let ds = new Image();
        ds.src = demonicSkullImage;
        return (ds.onload = () => {
          context.drawImage(
            ds,
            ds.width / 2,
            67,
            ds.width / 2,
            ds.height - 62,
            canvas.width / 2,
            0,
            canvas.width / 2,
            canvas.height
          );
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
    if (!ogSkull || !demonicSkull) {
      return setError("*** Must add both Skulls ***");
    }
    const options = { method: "GET" };
    await fetch(
      `https://api.opensea.io/api/v1/asset/0xc1caf0c19a8ac28c41fe59ba6c754e4b9bd54de9/${ogSkull}`,
      options
    )
      .then((response) => response.json())
      .then(async (response) => {
        await download(response.image_url, true);
        setError(null);
        return;
      })
      .catch((err) => console.error(err));
    return await fetch(
      `https://api.opensea.io/api/v1/asset/0xd3cf04d7a5513ce8148790d90d91361476f5da94/${demonicSkull}`,
      options
    )
      .then((response) => response.json())
      .then(async (response) => {
        await download(response.image_url);
        setError(null);
        return;
      })
      .catch((err) => console.error(err));
  };

  const download = async (openseaUrl, og) => {
    return await fetch(openseaUrl, {
      method: "GET",
      headers: {},
    })
      .then((response) => {
        response.arrayBuffer().then(function (buffer) {
          const url = window.URL.createObjectURL(new Blob([buffer]));
          if (og) {
            setOgSkullImage(url);
          } else {
            setDemonicSkullImage(url);
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (ogSkullImage && demonicSkullImage) {
      setGenerate(true);
      setLoading(false);
    }
  }, [ogSkullImage, demonicSkullImage]);

  const reset = () => {
    setOgSkull("");
    setDemonicSkull("");
    setOgSkullImage("");
    setDemonicSkullImage("");
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
          oG x <span className="text-red-700">Demonic</span>
        </h1>
        {!generate ? (
          <form className="w-full max-w-lg bg-zinc-800 rounded-lg py-6 px-3 flex flex-col justify-center shadow-md">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-slate-500 text-xs font-bold mb-2">
                OG Skull ID
              </label>
              <input
                className={`appearance-none block w-full bg-gray-200 placeholder-gray-800::placeholder text-gray-700 border ${
                  error && "border-red-500"
                }  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                type="text"
                name="TokenID"
                value={ogSkull}
                onChange={(text) => {
                  setOgSkull(text.target.value);
                }}
                placeholder="Token ID"
                maxLength={4}
              />
            </div>
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-slate-500 text-xs font-bold mb-2">
                Demonic Skull ID
              </label>
              <input
                className={`appearance-none block w-full bg-gray-200 placeholder-gray-800::placeholder text-gray-700 border ${
                  error && "border-red-500"
                }  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                type="text"
                name="TokenID"
                value={demonicSkull}
                onChange={(text) => {
                  setDemonicSkull(text.target.value);
                }}
                placeholder="Token ID"
                maxLength={5}
              />
            </div>

            <div>
              <button
                onClick={handleSearch}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 ml-3 mt-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
              >
                {loading ? "Loading" : "Generate"}
              </button>
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
