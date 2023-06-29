import Head from "next/head";
import Image from "next/image";
import Background from "../public/background.jpg";

export default function Home() {
	return (
		<div>
			<Image
				src={Background}
				layout="fill"
				objectFit="cover"
				quality={100}
				placeholder="blur"
			/>

			<Head>
				<title>SLRR Mods</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<h1>SLRR Mods</h1>

			<hr />

			<p>
				Prepare to immerse yourself for a new SLRR experience! Our upcoming site
				will be the ultimate destination for sharing and discovering mods and
				new game content. Stay tuned.
			</p>

			<h2>Coming Soon...</h2>
		</div>
	);
}
