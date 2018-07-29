import React, { Component } from 'react';
import { WebView, View } from 'react-native';

import NavigationHeader from '@components/NavigationHeader';
import { Styles } from '@themes';

class DescriptionScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: navigation.state.params.title,
    header: props => <NavigationHeader {...props} />,
  });

  render() {
    const { uri } = this.props.navigation.state.params;
    return (
      <View style={[Styles.container, Styles.backgroundSecondary]}>
        <WebView
          source={{ uri }}
          style={Styles.container}
        />
      </View>
    );
  }
}

export default DescriptionScreen;
