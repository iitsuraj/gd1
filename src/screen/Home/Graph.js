// import React, { Component } from "react";
// import { Layout, Text } from "@ui-kitten/components";

// export default class Graph extends Component {
//   render() {
//     const { itemWidth, data } = this.props;
//     let Graph;
//     if (data.length < 3) {
//       Graph = <Text>To View Graph Use app 3 day</Text>;
//     } else {
//       Graph = (
//         <VictoryChart
//           domainPadding={{ x: 40 }}
//           width={itemWidth}
//           theme={VictoryTheme.material}
//         >
//           <VictoryGroup colorScale={"qualitative"}>
//             <VictoryLine data={data} x="day" y="run" />
//             <VictoryLine data={data} x="day" y="perdition" />
//           </VictoryGroup>
//         </VictoryChart>
//       );

//       return (
//         <Layout>
//           <Text>suraj</Text>
//         </Layout>
//       );
//     }
//   }
// }

import React from "react";
import { Layout, Text } from "@ui-kitten/components";
import {
  VictoryLine,
  VictoryChart,
  VictoryTheme,
  VictoryGroup
} from "victory-native";
class Graph extends React.Component {
  render() {
    const { itemWidth, data } = this.props;
    let Graph;
    if (data.length < 3) {
      Graph = <Text>To View Graph Use app 3 day</Text>;
    } else {
      Graph = (
        <VictoryChart
          domainPadding={{ x: 40 }}
          width={itemWidth}
          theme={VictoryTheme.material}
        >
          <VictoryGroup colorScale={"qualitative"}>
            <VictoryLine data={data} x="day" y="run" />
            <VictoryLine data={data} x="day" y="perdition" />
          </VictoryGroup>
        </VictoryChart>
      );
    }
    return <Layout>{Graph}</Layout>;
  }
}

export default Graph;
