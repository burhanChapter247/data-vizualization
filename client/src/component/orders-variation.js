import * as React from "react";
import Paper from "@material-ui/core/Paper";
import {
  Chart,
  ArgumentAxis,
  ValueAxis,
  //AreaSeries,
  Title,
  Legend,
  Tooltip,
} from "@devexpress/dx-react-chart-material-ui";
import { withStyles } from "@material-ui/core/styles";
import {
  ArgumentScale,
  Animation,
  EventTracker,
  ValueScale,
  Palette,
  AreaSeries,
} from "@devexpress/dx-react-chart";
import { curveCatmullRom, area } from "d3-shape";
import { scalePoint, scaleLog, scaleTime } from "d3-scale";
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
  const { isLoading, error, data: ordersVariation, isFetching } = useQuery(
    "ordersVariation",
    async () => {
      const { data } = await axios("/v1/order/order-diff");
      return data;
    }
  );

  const modifyDomain = (param) => {
    console.log(param);
    return [0, 10];
  };

  const TooltipContent = ({ targetItem, ...props }) => {
    console.log(props);
    let obj = ordersVariation.data.chartData[targetItem.point];
    return (
      <ul>
        <li>
          Current week: {obj.currentWeekDate} <br></br>
          Count: {obj.orderCurrent}
        </li>
        <li>
          Last week: {obj.lastWeekDate} <br></br>
          Count: {obj.orderLast}
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
          <p>{ordersVariation.data.diff}</p>
          <br></br>
          <h3>{ordersVariation.data.orderCountLast}</h3>

          <Chart
            data={ordersVariation.data.chartData}
            className={classes.chart}
          >
            <ArgumentScale factory={scalePoint} />
            <ValueScale modifyDomain={modifyDomain} />
            <ArgumentAxis />
            <ValueAxis />

            <AreaSeries
              name="Last Week"
              valueField="orderLast"
              argumentField="currentWeekDate"
              color="#DCDCDC"
              opacity="1"
              seriesComponent={Area}
            />

            {/* <Palette scheme={["#1b9e77"]} /> */}
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
            <Title text="Orders Variation Chart" />
          </Chart>
        </>
      )}
    </Paper>
  );
};
