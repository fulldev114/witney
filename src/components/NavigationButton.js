import React, { Component } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Styles, Colors } from '@themes';

class NavigationButton extends Component {
  render() {
    const tintColor = this.props.tintColor ? this.props.tintColor : Colors.navigationText;
    let iconUI = null;
    if (this.props.icon) {
      iconUI = (<FontAwesome name={this.props.icon} style={[Styles.navigationButtonIcon, { color: tintColor }]} />);
    }

    let textUI = null;
    if (this.props.text) {
      textUI = (<Text style={[Styles.navigationButtonText, { color: tintColor }]}>{this.props.text}</Text>);
    }

    return (
      <TouchableOpacity onPress={this.props.onPress} style={Styles.navigationButton}>
        {iconUI}
        {textUI}
      </TouchableOpacity>
    );
  }
}

export default NavigationButton;
