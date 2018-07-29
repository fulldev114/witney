import React, { Component } from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Metrics, Styles } from '@themes';
import Icon from 'react-native-vector-icons/FontAwesome';

class Button extends Component {
  render() {
    return (
      <TouchableOpacity style={this.props.buttonStyle} activeOpacity={Metrics.touchableOpacity} onPress={this.props.onPress} disabled={this.props.disabled}>
        {this.props.icon ? <Icon name={this.props.icon} style={this.props.iconStyle} /> : null}
        {this.props.text ? <Text style={this.props.textStyle}>{this.props.text}</Text> : null}
        {this.props.submitting ? <ActivityIndicator {...this.props.submittingProps} /> : null}
      </TouchableOpacity>
    );
  }
}

Button.defaultProps = {
  renderContent: node => (<Text>{node.Text}</Text>),
  buttonStyle: Styles.buttonStyle,
  textStyle: Styles.buttonTextStyle,
  submittingProps: {},
  onPress: () => {},
  disabled: false,
};

export default Button;
