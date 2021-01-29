import React, { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import {
  Chart,
  //BarSeries,
  Title,
  ArgumentAxis,
  ValueAxis,
  Tooltip,
  Legend,
} from "@devexpress/dx-react-chart-material-ui";
import { withStyles } from "@material-ui/core/styles";
import {
  ValueScale,
  ArgumentScale,
  Stack,
  Animation,
  EventTracker,
  HoverState,
  SelectionState,
  BarSeries,
} from "@devexpress/dx-react-chart";
import axios from "axios";
import { useQuery } from "react-query";

export default () => {
  const { isLoading, error, data } = useQuery("pchart", async () => {
    const { data } = await axios("/v1/product/chart-data");
    return data;
  });

  const TooltipContent = ({ targetItem, ...props }) => {
    return data.data[targetItem.point].title;
  };

  const modifyBar = (restProps) => {
    if (data.data[restProps.index].count <= 5) {
      return <BarSeries.Point {...restProps} color="#22f2e8" />;
    }
    return <BarSeries.Point {...restProps} />;
  };

  return (
    <Paper>
      {isLoading ? (
        <div>Retrieving Product Chart ...</div>
      ) : error ? (
        <div>Something went wrong ...</div>
      ) : (
        <Chart data={data.data}>
          <ValueScale />
          <ArgumentAxis />
          <ValueAxis />
          <BarSeries
            name="Products"
            valueField="count"
            argumentField="sku"
            color="#3266a8"
            pointComponent={modifyBar}
          />
          <EventTracker />
          <Tooltip contentComponent={TooltipContent} />
          {/* <Legend position="bottom" /> */}
          <Title text="Product chart" />
          <Animation />
        </Chart>
      )}
    </Paper>
  );
};
