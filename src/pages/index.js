import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { HiHeart } from "react-icons/hi";
import { fetchEnsName } from "../utils";
const skullNation = require("../assets/skullnation.png");
const skullNationw = require("../assets/skullnation_w.png");
const cs = require("../assets/cs.png");
const csw = require("../assets/cs_w.png");

function Index() {
  const [image, setImage] = useState(null);
  const [owner, setOwner] = useState("Loading...");
  const [error, setError] = useState(false);
  const [input, setInput] = useState("");
  const [phone, setPhone] = useState("");
  const [generate, setGenerate] = useState(false);
  const [loading, setLoading] = useState(false);

  const canvasRef = useRef(null);

  function get_bg_color(img) {
    var canvasImg = document.createElement("canvas");
    canvasImg.width = img.width;
    canvasImg.height = img.height;
    canvasImg.getContext("2d").drawImage(img, 0, 0, img.width, img.height);
    var pixelData = canvasImg.getContext("2d").getImageData(0, 0, 1, 1).data;

    return {
      sum: pixelData[0] + pixelData[1] + pixelData[2],
      bgColor: `rgb(${pixelData[0]},${pixelData[1]},${pixelData[2]})`,
    };
  }

  const updateName = async () => {
    const newName = await fetchEnsName(owner);
    setOwner(newName);
  };

  useEffect(() => {
    if (owner) {
      updateName();
    }
  }, [owner]);

  useEffect(() => {
    if (generate) {
      const dimensions = JSON.parse(phone);
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      canvas.height = dimensions.height;
      canvas.width = dimensions.width;

      //Skull Image
      let skullImage = new Image();
      skullImage.src = image;

      skullImage.onload = () => {
        context.drawImage(
          skullImage,
          canvas.width * 0.08,
          canvas.height * 0.39,
          canvas.width * 0.84,
          canvas.width * 0.84
        );
        const { bgColor, sum } = get_bg_color(skullImage);
        //Background Color
        context.fillStyle = bgColor;
        context.fillRect(0, 0, canvas.width, canvas.height);

        //Redraw Skull
        context.drawImage(
          skullImage,
          canvas.width * 0.08,
          canvas.height * 0.39,
          canvas.width * 0.84,
          canvas.width * 0.84
        );

        //Text
        context.fillStyle = sum < 301 ? "#ffffff" : "#212121";
        context.font = `${canvas.width / 17.83}px 'PressStart2P'`;
        context.fillText("CRYPTO", 15, canvas.height * 0.3);
        context.fillText("SKULL", 15, canvas.height * 0.3 + 36);
        context.fillText(`#${input}`, 15, canvas.height * 0.3 + 72);
        context.fillText("<WEB3>", canvas.width - 156, canvas.height * 0.3);

        //Bottom Text
        context.font = `${canvas.width / 19.45}px 'PressStart2P'`;

        context.fillText(
          "OWNER:",
          15,
          canvas.height * 0.36 + canvas.width * 0.84 + 50
        );
        if (owner.length > 20) {
          context.fillText(
            `${owner?.slice(0, 4)}...${owner?.slice(-4)}`,
            15,
            canvas.height * 0.36 + canvas.width * 0.84 + 82
          );
        } else {
          context.fillText(
            owner,
            15,
            canvas.height * 0.36 + canvas.width * 0.84 + 82
          );
        }
        //CS Logo
        let csImage = new Image();
        //Skull Nation
        let skullNationImage = new Image();
        if (sum < 301) {
          csImage.src = csw;
          skullNationImage.src = skullNationw;
        } else {
          csImage.src = cs;
          skullNationImage.src = skullNation;
        }
        csImage.onload = () => {
          context.drawImage(
            csImage,
            canvas.width - canvas.width * 0.1 - 35,
            canvas.height * 0.36 + canvas.width * 0.84 + 25,
            canvas.width * 0.14,
            canvas.width * 0.14
          );
        };

        skullNationImage.onload = () => {
          context.drawImage(
            skullNationImage,
            canvas.width * 0.15,
            canvas.height * 0.08,
            canvas.width * 0.7,
            canvas.width * 0.35
          );
        };
      };
    }
  }, [generate, owner]);

  const downloadImage = () => {
    const canvas = canvasRef.current;

    var url = canvas.toDataURL("image/png");
    var link = document.createElement("a");
    link.download = "CSWallpaper.png";
    link.href = url;
    link.click();
  };

  const handleSearch = () => {
    setLoading(true);
    if (!input) {
      return setError("*** Please enter a Token ID ***");
    }
    if (!phone) {
      return setError("*** Please choose a phone ***");
    }
    const options = { method: "GET" };
    fetch(
      `https://api.opensea.io/api/v1/asset/0xc1caf0c19a8ac28c41fe59ba6c754e4b9bd54de9/${input}`,
      options
    )
      .then((response) => response.json())
      .then(async (response) => {
        download(response.image_url);
        setError(null);
        setOwner(response.owner.address);
        return await fetchEnsName(response.owner.address);
      })
      .then((name) => setOwner(name))
      .catch((err) => console.error(err));
  };

  const download = (openseaUrl) => {
    fetch(openseaUrl, {
      method: "GET",
      headers: {},
    })
      .then((response) => {
        response.arrayBuffer().then(function (buffer) {
          const url = window.URL.createObjectURL(new Blob([buffer]));
          setImage(url);
          setGenerate(true);
          setLoading(false);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const reset = () => {
    setImage(null);
    setOwner("Loading...");
    setInput("");
    setPhone("");
    setGenerate(false);
    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Wallpaper | Crypto Skulls</title>
        <meta
          name="description"
          content="Suit up your Phone with a custom wallpaper of your CryptoSkull!"
        />
      </Helmet>
      <div className="bg-dark min-h-screen flex flex-col justify-center items-center px-3">
        <h1 className="mb-4 text-6xl title text-center text-white sm:mb-6 md:mb-10 md:text-7xl lg:mb-12 lg:text-8xl">
          CS <span className="text-red-700">Wallpaper</span>
        </h1>
        {!generate ? (
          <form className="w-full max-w-lg bg-zinc-800 rounded-lg py-6 px-3 flex flex-col justify-center shadow-md">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-slate-500 text-xs font-bold mb-2">
                Skull ID
              </label>
              <input
                className={`appearance-none block w-full bg-gray-200 placeholder-gray-800::placeholder text-gray-700 border ${
                  error && "border-red-500"
                }  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                type="text"
                name="TokenID"
                value={input}
                onChange={(text) => setInput(text.target.value)}
                placeholder="Token ID"
                maxLength={4}
              />
            </div>
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-slate-500 text-xs font-bold mb-2">
                Phone
              </label>
              <div className="relative">
                <select
                  className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  placeholder="Select a Team"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
                >
                  <option value="">Choose your Phone</option>
                  <option value='{ "width": 390, "height": 844 }'>
                    iPhone 13/12
                  </option>
                  <option value='{ "width": 428, "height": 926 }'>
                    iPhone 13/12 Max
                  </option>
                  <option value='{ "width": 375, "height": 812 }'>
                    iPhone 13/12 Mini
                  </option>
                  <option value='{ "width": 375, "height": 667 }'>
                    iPhone SE 2nd Gen
                  </option>
                  <option value='{ "width": 414, "height": 896 }'>
                    iPhone 11/XR/XS
                  </option>
                  <option value='{ "width": 375, "height": 667 }'>
                    iPhone 8
                  </option>
                  <option value='{ "width": 414, "height": 736 }'>
                    iPhone 8 Plus
                  </option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              {error && (
                <p className="text-red-500 text-xs italic mt-2">{error}</p>
              )}
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
              className="flex justify-center scale-50 my-[-200px]"
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

export default Index;
