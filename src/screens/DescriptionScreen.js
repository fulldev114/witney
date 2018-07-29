import React, { Component } from 'react';
import { ScrollView, Text, View } from 'react-native';

import NavigationHeader from '@components/NavigationHeader';
import { Colors, Fonts, Metrics, Styles } from '@themes';

const styles = {
  text: {
    color: Colors.descriptionText,
    fontFamily: Fonts.family.rubik.regular,
    fontSize: Fonts.size.default,
    padding: Metrics.paddingDefault * 2,
  },
};

class DescriptionScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: navigation.state.params.title,
    header: props => <NavigationHeader {...props} />,
  });

  render() {
    const { text } = this.props.navigation.state.params;
    return (
      <View style={[Styles.container, Styles.backgroundSecondary]}>
        <ScrollView style={[Styles.container, Styles.backgroundTransparent]}>
          <Text style={[styles.text]}>{text}</Text>
        </ScrollView>
      </View>
    );
  }
}

export default DescriptionScreen;
