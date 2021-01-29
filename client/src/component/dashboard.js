import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import ProductChart from "./products-chart";
import SalesVariation from "./sales-variation";
import OrdersVariation from "./orders-variation";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
}));

export default () => {
  const classes = useStyles();

  return (
    <Grid container className={classes.root} spacing="2">
      <Grid item xs={12}>
        <Grid container justify="center" spacing="2">
          <Grid item>
            <ProductChart />
          </Grid>
          <Grid item>
            <SalesVariation />
          </Grid>
          <Grid item>
            <OrdersVariation />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
