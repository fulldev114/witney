import React, { Component } from 'react';
import { Switch, Text, View } from 'react-native';
import { Colors, Fonts, Metrics } from '@themes';

const styles = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: Colors.settingsListItemBorder,
    padding: Metrics.paddingDefault,
  },
  text: {
    flex: 1,
    color: Colors.settingsListItemText,
    fontFamily: Fonts.family.rubik.regular,
    fontSize: Fonts.size.semiLarge,
  },
  caret: {
    color: Colors.settingsListItemCaret,
    fontSize: Fonts.size.semiLarge,
  },
};

class NotificationsSettingsListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      this.setState({
        value: nextProps.value,
      });
    }
  }

  render() {
    const { text, onValueChange, field } = this.props;
    return (
      <View style={styles.container} activeOpacity={Metrics.touchableOpacity}>
        <Text style={styles.text}>{text}</Text>
        <Switch
          onTintColor={Colors.settingsListItemCaret}
          value={this.state.value}
          onValueChange={(val) => {
            this.setState({
              value: val,
            });
            onValueChange(field, val);
          }}
        />
      </View>
    );
  }
}

NotificationsSettingsListItem.defaultProps = {
  size: 'default',
  onValueChange: () => {},
  style: {},
  value: false,
};

export default NotificationsSettingsListItem;
