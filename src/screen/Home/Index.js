import React, { Component } from "react";
import { StyleSheet, ScrollView, Dimensions, AsyncStorage } from "react-native";
import { SafeAreaView } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { Layout } from "@ui-kitten/components";
import Header from "../../components/Header";
import { Pedometer } from "expo-legacy";
import Constants from "expo-constants";

import Graph from "./Graph";
import Steps from "./Steps";
import Distance from "./Distance";
import Progress from "./Progress";
import Card from "../../components/Card/Index";
import Lazyload from "../../core/lazyloading/Index";
const DeviceWidth = Math.round(Dimensions.get("window").width / 5);
const { width } = Dimensions.get("window");
const itemWidth = (width * 80) / 100;

class HomeScreen extends Component {
  constructor() {
    super();
    this.state = {
      todaytraveld: 0,
      tobetraveld: 0,
      pedometerloading: true,
      graphloading: true,
      data: []
    };
  }

  componentDidMount() {
    Pedometer.isAvailableAsync().then(
      result => {
        if (result) {
          this.GraphData("graph");
          this.GetSteps();
          this.interval = setInterval(() => this.GetSteps(), 5000);
        } else {
          alert("Pedometer Not Avilable");
        }
      },
      error => {
        alert(error);
      }
    );
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  GetSteps() {
    AsyncStorage.getItem("steps", (err, res) => {
      if (err) {
        alert(err);
      } else {
        if (res) {
          res = JSON.parse(res);
          // Check time is expired or not
          var CurrentTime = Date.now();
          if (res.exp < CurrentTime) {
            // Get Pedometer Data
            this.PedometerData();
          } else {
            this.setState({ pedometerloading: false, todaytraveld: res.steps });
          }
        } else {
          this.PedometerData();
        }
      }
    });
  }

  PedometerData() {
    const end = new Date();
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    Pedometer.getStepCountAsync(start, end).then(
      result => {
        // this.setState({ todaytraveld: result.steps });
        var PedometerSteps = {
          steps: result.steps,
          exp: new Date().setSeconds(new Date().getSeconds() + 5)
        };
        AsyncStorage.setItem("steps", JSON.stringify(PedometerSteps)).then(
          () => {
            this.GetSteps();
          }
        );
      },
      error => {
        alert(error);
      }
    );
  }

  GraphData(key) {
    AsyncStorage.getItem(key, (error, result) => {
      if (error) {
        // console.log("Graph data get item error Line number 26");
        alert(error);
      } else {
        if (result !== null) {
          result = JSON.parse(result);
          if (
            new Date().toDateString() ===
            new Date(result[result.length - 1].date).toDateString()
          ) {
            var graphData = this.state.data.concat(result);
            var tobetraveld =
              Number(result[result.length - 1].prediction) * 1400;
            tobetraveld = Math.floor(tobetraveld);
            this.setState({
              graphloading: false,
              data: graphData,
              tobetraveld: tobetraveld
            });
            // console.log("set to State Complete");
          } else {
            // console.log("Fetching Today data");
            const end = new Date();
            const start = new Date();
            start.setDate(end.getDate() - 1);
            start.setDate(end.getDate() - 1);
            Pedometer.getStepCountAsync(start, end).then(
              result => {
                fetch(
                  `https://dash-cash-ml.herokuapp.com/?user_id=${Constants.installationId}&run=${result.steps}`
                )
                  .then(response => response.json())
                  .then(responseJson => {
                    result.push(responseJson);
                    this.saveData(key, result);
                  })
                  .catch(error => {
                    alert("error heroku data");
                  });
              },
              error => {
                alert("pedometer error");
              }
            );
          }
        } else {
          // console.log("first time data fetch");
          const end = new Date();
          const start = new Date();
          start.setDate(end.getDate() - 1);
          start.setDate(end.getDate() - 1);
          Pedometer.getStepCountAsync(start, end).then(
            result => {
              fetch(
                `https://dash-cash-ml.herokuapp.com/?user_id=${Constants.installationId}&run=${result.steps}`
              )
                .then(response => response.json())
                .then(responseJson => {
                  // console.log("firsst time data recive");
                  const value = [];
                  value.push(responseJson);
                  this.saveData(key, value);
                })
                .catch(error => {
                  console.log(error);
                  alert("heroku data error");
                  console.log(
                    `https://dash-cash-ml.herokuapp.com/?user_id=${Constants.installationId}&run=${result.steps}`
                  );
                  // console.log("first time data fetch fails");
                  // alert("error in getting graph data");
                });
            },
            error => {
              alert("pedometer error");
            }
          );
        }
      }
    });
  }
  saveData(key, data) {
    // alert(JSON.stringify(data));
    AsyncStorage.setItem(key, JSON.stringify(data)).then(() => {
      AsyncStorage.getItem(key, (error, result) => {
        if (error) {
          // console.log(error);
        } else {
          result = JSON.parse(result);
          this.setState({ data: result, graphloading: false });
        }
      });
    });
  }

  static navigationOptions = ({ navigation }) => {
    //return header with Custom View which will replace the original header
    return {
      header: <Header title="Home" />
    };
  };
  render() {
    return (
      <React.Fragment>
        <Layout style={styles.container} level="2">
          <SafeAreaView>
            <ScrollView>
              <Card>
                {this.state.graphloading && this.state.graphloading ? (
                  <Lazyload height={150} width={itemWidth} />
                ) : (
                  <Progress
                    steps={this.state.todaytraveld}
                    tobetraveld={this.state.tobetraveld}
                    DeviceWidth={DeviceWidth}
                  />
                )}
              </Card>

              <Card headername={"Steps"} headericon={"home-outline"}>
                {this.state.graphloading && this.state.graphloading ? (
                  <Lazyload height={50} width={itemWidth} />
                ) : (
                  <Steps steps={this.state.todaytraveld} />
                )}
              </Card>
              <Card headername={"Distance Coverd"} headericon={"heart-outline"}>
                {this.state.graphloading && this.state.graphloading ? (
                  <Lazyload height={50} width={itemWidth} />
                ) : (
                  <Distance steps={this.state.todaytraveld} />
                )}
              </Card>
              <Card headername={"Distance Coverd"} headericon={"heart-outline"}>
                {this.state.graphloading && this.state.graphloading ? (
                  <Lazyload height={50} width={itemWidth} />
                ) : (
                  <Graph itemWidth={itemWidth} data={this.state.data} />
                )}
              </Card>
            </ScrollView>
          </SafeAreaView>
        </Layout>
      </React.Fragment>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  layout: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
export default createStackNavigator({ HomeScreen }, { headerMode: "screen" });
