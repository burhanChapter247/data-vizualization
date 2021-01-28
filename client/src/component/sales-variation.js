import * as React from "react";
import Paper from "@material-ui/core/Paper";
import {
  Chart,
  ArgumentAxis,
  ValueAxis,
  AreaSeries,
  Title,
  Legend,
  Tooltip,
} from "@devexpress/dx-react-chart-material-ui";
import { withStyles } from "@material-ui/core/styles";
import {
  ArgumentScale,
  Animation,
  EventTracker,
} from "@devexpress/dx-react-chart";
import { curveCatmullRom, area } from "d3-shape";
import { scalePoint } from "d3-scale";
import axios from "axios";
import { useQuery } from "react-query";
import { makeStyles } from "@material-ui/core/styles";

const legendStyles = () => ({
  root: {
    display: "flex",
    margin: "auto",
    flexDirection: "row",
  },
});

const legendRootBase = ({ classes, ...restProps }) => (
  <Legend.Root {...restProps} className={classes.root} />
);
const Root = withStyles(legendStyles, { name: "LegendRoot" })(legendRootBase);
const legendLabelStyles = () => ({
  label: {
    whiteSpace: "nowrap",
  },
});
const legendLabelBase = ({ classes, ...restProps }) => (
  <Legend.Label className={classes.label} {...restProps} />
);
const Label = withStyles(legendLabelStyles, { name: "LegendLabel" })(
  legendLabelBase
);
const useStyles = makeStyles({
  chart: {
    paddingRight: "20px",
  },
  totalAmount: {
    float: "right",
    paddingRight: "50px",
  },
});

const Area = (props) => (
  <AreaSeries.Path
    {...props}
    path={area()
      .x(({ arg }) => arg)
      .y1(({ val }) => val)
      .y0(({ startVal }) => startVal)
      .curve(curveCatmullRom)}
  />
);

export default () => {
  const classes = useStyles();
  const { isLoading, error, data: salesVariation } = useQuery(
    "salesVariation",
    async () => {
      const { data } = await axios("/v1/order/sales-percentage");
      return data;
    }
  );

  const TooltipContent = ({ targetItem, ...props }) => {
    let obj = salesVariation.data.chartData[targetItem.point];
    return (
      <ul>
        <li>
          Current week: {obj.currentWeekDate} <br></br>
          Amount: {obj.orderCurrent}
        </li>
        <li>
          Last week: {obj.lastWeekDate} <br></br>
          Amount: {obj.orderLast}
        </li>
      </ul>
    );
  };

  return (
    <Paper>
      {isLoading ? (
        <div>Retrieving Sales Amount Variation Chart ...</div>
      ) : error ? (
        <div>Something went wrong ...</div>
      ) : (
        <>
          <span>Increase & decrease sales amount per day</span>
          <br></br>
          <p>{salesVariation.data.percentage}</p>
          <br></br>
          <h3>{salesVariation.data.saleAmountLast}</h3>

          <Chart data={salesVariation.data.chartData} className={classes.chart}>
            <ArgumentScale factory={scalePoint} />
            <ArgumentAxis />
            <ValueAxis />

            <AreaSeries
              name="Last Week"
              valueField="orderLast"
              argumentField="currentWeekDate"
              color="#DCDCDC"
              seriesComponent={Area}
            />

            <AreaSeries
              name="Current Week"
              valueField="orderCurrent"
              argumentField="currentWeekDate"
              color="#990066"
              seriesComponent={Area}
            />
            <EventTracker />
            <Tooltip contentComponent={TooltipContent} />

            <Animation />
            <Legend
              position="bottom"
              rootComponent={Root}
              labelComponent={Label}
            />
            <Title text="Sales Amount Variation Chart" />
          </Chart>
        </>
      )}
    </Paper>
  );
};
