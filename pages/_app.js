import "../styles/globals.css";
import Image from "next/image";
import Background from "../public/background.jpg";

function MyApp({ Component, pageProps }) {
	return (
		<div>
			<Image src={Background} layout="fill" placeholder="blur" />

			<Component {...pageProps} />
		</div>
	);
}

export default MyApp;
