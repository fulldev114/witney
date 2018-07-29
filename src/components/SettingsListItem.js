import React, { Component } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

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

class SettingsListItem extends Component {
  render() {
    const { text, onPress } = this.props;
    return (
      <TouchableOpacity style={styles.container} activeOpacity={Metrics.touchableOpacity} onPress={onPress}>
        <Text style={styles.text}>{text}</Text>
        <Icon name={'chevron-right'} style={styles.caret} />
      </TouchableOpacity>
    );
  }
}

SettingsListItem.defaultProps = {
  size: 'default',
  onPress: () => {},
  style: {},
};

export default SettingsListItem;
