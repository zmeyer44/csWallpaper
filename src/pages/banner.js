import { useState, useEffect, useRef } from "react";
import { HiHeart } from "react-icons/hi";
import { fetchEnsName } from "../utils";
const wdts = require("../assets/wdts.png");
const wdtsw = require("../assets/wdts_w.png");
const skull1 = require("../assets/skull_1.png");
const skull2 = require("../assets/skull_2.png");
const skull2b = require("../assets/skull_2b.png");
const cs = require("../assets/cs.png");
const csw = require("../assets/cs_w.png");

const lords = ["9", "19", "20", "24", "27", "36", "41", "42", "43", "70"];
const lordsColors = {
  9: "#324951",
  19: "#324951",
  20: "#000000",
  24: "#000000",
  27: "#000000",
  36: "#000000",
  41: "#000000",
  42: "#c80008",
  43: "#000000",
  70: "#532cb3",
};
function Banner() {
  const [image, setImage] = useState(null);
  const [owner, setOwner] = useState("Loading...");
  const [error, setError] = useState(false);
  const [input, setInput] = useState("");
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
  function get_pixel_color(img, x, y) {
    var canvasImg = document.createElement("canvas");
    canvasImg.width = img.width;
    canvasImg.height = img.height;
    canvasImg.getContext("2d").drawImage(img, 0, 0, img.width, img.height);
    var pixelData = canvasImg.getContext("2d").getImageData(x, y, 1, 1).data;
    return pixelData;
  }
  function bonesCheck(img) {
    var canvasImg = document.createElement("canvas");
    canvasImg.width = img.width;
    canvasImg.height = img.height;
    canvasImg.getContext("2d").drawImage(img, 0, 0, img.width, img.height);
    var pixelData = canvasImg.getContext("2d").getImageData(56, 7, 1, 1).data;

    return pixelData[0] == 38 && pixelData[1] == 50 && pixelData[2] == 56;
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

  function removeSkullAndEyeColor(img) {
    var c = document.createElement("canvas");

    var w = img.width,
      h = img.height;

    c.width = w;
    c.height = h;

    var ctx = c.getContext("2d");

    ctx.drawImage(img, 0, 0, w, h);
    var imageData = ctx.getImageData(0, 0, w, h);
    var eyeColor = ctx.getImageData(133, 147, 1, 1).data;
    if (eyeColor[0] === 38 && eyeColor[1] === 50) {
      eyeColor = [1, 1, 1, 0];
    }
    var bonesColor = ctx.getImageData(63, 21, 1, 1).data;
    var skullColor = ctx.getImageData(119, 189, 1, 1).data;

    var pixel = imageData.data;

    var r = 0,
      g = 1,
      b = 2,
      a = 3;
    for (var p = 0; p < pixel.length; p += 4) {
      if (
        (pixel[p + r] == skullColor[0] &&
          pixel[p + g] == skullColor[1] &&
          pixel[p + b] == skullColor[2]) ||
        (pixel[p + r] == eyeColor[0] &&
          pixel[p + g] == eyeColor[1] &&
          pixel[p + b] == eyeColor[2]) ||
        (pixel[p + r] == bonesColor[0] &&
          pixel[p + g] == bonesColor[1] &&
          pixel[p + b] == bonesColor[2])
      ) {
        // if white then change alpha to 0
        pixel[p + a] = 0;
      }
    }

    ctx.putImageData(imageData, 0, 0);

    return c.toDataURL("image/png");
  }
  function removeSkullColor(img) {
    var c = document.createElement("canvas");

    var w = img.width,
      h = img.height;

    c.width = w;
    c.height = h;

    var ctx = c.getContext("2d");

    ctx.drawImage(img, 0, 0, w, h);
    var imageData = ctx.getImageData(0, 0, w, h);
    var skullColor = ctx.getImageData(119, 189, 1, 1).data;

    var pixel = imageData.data;

    var r = 0,
      g = 1,
      b = 2,
      a = 3;
    for (var p = 0; p < pixel.length; p += 4) {
      if (
        pixel[p + r] == skullColor[0] &&
        pixel[p + g] == skullColor[1] &&
        pixel[p + b] == skullColor[2]
      ) {
        // if white then change alpha to 0
        pixel[p + a] = 0;
      }
    }

    ctx.putImageData(imageData, 0, 0);

    return c.toDataURL("image/png");
  }

  useEffect(() => {
    if (generate) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      canvas.height = 500;
      canvas.width = 1500;

      //Skull 5
      let orig = new Image();
      orig.src = image;
      orig.onload = () => {
        //Background Color
        const { bgColor, sum } = get_bg_color(orig);
        context.fillStyle = bgColor;
        context.fillRect(0, 0, canvas.width, canvas.height);

        //Skull 1
        let s1 = new Image();
        s1.src = skull1;
        s1.onload = () => {
          context.drawImage(s1, 40, 125, 275, 275);
        };
        //Skull 2
        let s2 = new Image();
        s2.src = bonesCheck(orig) ? skull2b : skull2;
        s2.onload = () => {
          context.drawImage(s2, 326.25, 125, 275, 275);
        };
        //Skull 3
        let s3 = new Image();
        s3.src = removeSkullAndEyeColor(orig);
        s3.onload = () => {
          context.drawImage(s3, 612.5, 125, 275, 275);
        };
        //Skull 4
        let s4 = new Image();
        s4.src = removeSkullColor(orig);
        s4.onload = () => {
          context.drawImage(s4, 898.75, 125, 275, 275);
        };
        //Skull 5
        let s5 = new Image();
        s5.src = image;
        s5.onload = () => {
          context.drawImage(s5, 1185, 125, 275, 275);
        };

        //WDTS
        let wd = new Image();
        //CS Logo
        let csImage = new Image();
        if (sum < 301) {
          wd.src = wdtsw;
          csImage.src = csw;
        } else {
          wd.src = wdts;
          csImage.src = cs;
        }
        wd.onload = () => {
          context.drawImage(wd, 540, 420, 420, 60);
        };
        csImage.onload = () => {
          context.drawImage(csImage, 1410, 410, 70, 70);
        };
        //Text
        context.fillStyle = sum < 301 ? "#ffffff" : "#212121";
        context.font = `25px 'PressStart2P'`;
        context.fillText(`CRYPTO SKULL #${input}`, 20, 45);
        if (owner.length > 20) {
          context.fillText(
            `OWNER: ${owner?.slice(0, 4)}...${owner?.slice(-4)}`,
            950,
            45
          );
        } else {
          context.fillText(`OWNER: ${owner}`, 950, 45);
        }
      };
    }
  }, [generate, owner]);

  const downloadImage = () => {
    const canvas = canvasRef.current;

    var url = canvas.toDataURL("image/png");
    var link = document.createElement("a");
    link.download = "CSTwitterBanner.png";
    link.href = url;
    link.click();
  };

  const handleSearch = () => {
    setLoading(true);
    if (!input) {
      return setError("*** Please enter a Token ID ***");
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
    setGenerate(false);
    setLoading(false);
  };

  return (
    <div className="bg-dark min-h-screen flex flex-col justify-center items-center px-3">
      <h1 className="mb-4 text-6xl title text-center text-white sm:mb-6 md:mb-10 md:text-7xl lg:mb-12 lg:text-8xl">
        CS <span className="text-red-700">Banner</span>
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
            className="flex justify-center scale-50 mt-[-140px] mb-[-120px]"
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
  );
}

export default Banner;
