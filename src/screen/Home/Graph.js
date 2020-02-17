import React, { Component } from "react";
import { Layout, Text } from "@ui-kitten/components";
import {
  VictoryLine,
  VictoryChart,
  VictoryTheme,
  VictoryGroup,
  VictoryBar
} from "victory-native";

export default class Graph extends Component {
  render() {
    const { itemWidth, data } = this.props;
    return (
      <Layout>
        {data.length < 3 ? (
          <Text>Use app for atleast 3 days to generate a graph</Text>
        ) : (
          <VictoryChart
            domainPadding={{ x: 40 }}
            width={itemWidth}
            theme={VictoryTheme.material}
          >
            <VictoryGroup offset={10} colorScale={"qualitative"}>
              <VictoryBar data={data} x="day" y="run" />
              <VictoryBar data={data} x="day" y="prediction" />
            </VictoryGroup>
          </VictoryChart>
        )}
      </Layout>
    );
  }
}
