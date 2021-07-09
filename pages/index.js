import { Grid, Paper } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";

import SubHeader from "../components/SubHeader";
import Layout from "../components/Layout";

export default function HomePage() {
	return (
		<Layout>
			<Grid container spacing={1}>
				<Grid item xs={12}>
					<SubHeader />
				</Grid>

				<Grid item container spacing={1}>
					<Grid item container spacing={1} xs>
						<Grid item xs={12}>
							<Paper>mano aqui é o content blz</Paper>
						</Grid>

						<Grid item xs={12}>
							<Paper>mano aqui é o content blz</Paper>
						</Grid>

						<Grid item xs={12}>
							<Paper>mano aqui é o content blz</Paper>
						</Grid>

						<Grid item xs={12}>
							<Paper>mano aqui é o content blz</Paper>
						</Grid>

						<Grid item container xs={12}>
							<Grid item>Items Per Page: 10</Grid>
							<Grid item>
								<Pagination
									count={10}
									size="large"
									showFirstButton
									showLastButton
								/>
							</Grid>
						</Grid>
					</Grid>

					<Grid item xs={3}>
						<Paper>mano aqui é a lista de categoria ok</Paper>
					</Grid>
				</Grid>
			</Grid>
		</Layout>
	);
}
