export default function Header() {
    return (
        <img className="header-img" src="https://www.therange.co.uk/media/6/7/1639048212_12_3156.jpg" alt="random drink" />
    );
}



// import { useEffect, useState } from "react";
// import { randomImg } from "./RANDOM_IMG";

// export default function Header() {
//     // get new random image evry 5 seconds
//     const [randomImage, setRandomImage] = useState<string>("");
//     useEffect(() => {
//         const interval = setInterval(() => {
//             setRandomImage(randomImg[Math.floor(Math.random() * randomImg.length)]);
//         }, 8000);
//         return () => clearInterval(interval);
//     }, []);
//     console.log(randomImage);
//     return (
//         <div key={randomImage} className="header-div">
//             <img src={randomImage} alt="random drink" />
//         </div>
//     );
// }
