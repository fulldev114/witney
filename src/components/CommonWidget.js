import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Colors, Styles } from '@themes';

const CommonWidget = {
  renderActivityIndicator: (color = Colors.activityIndicator) => (
    <View style={[Styles.background, Styles.activityIndicator]}>
      <ActivityIndicator color={color} size={'small'} />
    </View>
  ),

  renderSecondaryActivityIndicator: (color = Colors.activityIndicator) => (
    <View style={Styles.activityIndicator}>
      <ActivityIndicator color={color} size={'small'} />
    </View>
  ),
};

export default CommonWidget;
