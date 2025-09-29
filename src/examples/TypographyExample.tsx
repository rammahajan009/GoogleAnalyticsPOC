import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Typography from '../components/Typography/Typography';

const TypographyExample: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Typography h1 bold>
          Roboto Bold Heading 1
        </Typography>
        
        <Typography h2 black>
          Roboto Black Heading 2
        </Typography>
        
        <Typography h3 medium>
          Roboto Medium Heading 3
        </Typography>
      </View>

      <View style={styles.section}>
        <Typography h4>Default Roboto Regular</Typography>
        <Typography h4 bold>Roboto Bold</Typography>
        <Typography h4 italic>Roboto Italic</Typography>
        <Typography h4 bold italic>Roboto Bold Italic</Typography>
        <Typography h4 black>Roboto Black</Typography>
        <Typography h4 black italic>Roboto Black Italic</Typography>
      </View>

      <View style={styles.section}>
        <Typography body1>Body 1 - Regular Roboto</Typography>
        <Typography body1 bold>Body 1 - Bold Roboto</Typography>
        <Typography body1 italic>Body 1 - Italic Roboto</Typography>
        <Typography body1 bold italic>Body 1 - Bold Italic Roboto</Typography>
      </View>

      <View style={styles.section}>
        <Typography body2>Body 2 - Regular Roboto</Typography>
        <Typography body2 light>Body 2 - Light Roboto</Typography>
        <Typography body2 medium>Body 2 - Medium Roboto</Typography>
        <Typography body2 semibold>Body 2 - Semibold Roboto</Typography>
      </View>

      <View style={styles.section}>
        <Typography caption>Caption - Regular Roboto</Typography>
        <Typography caption thin>Caption - Thin Roboto</Typography>
        <Typography caption light>Caption - Light Roboto</Typography>
      </View>

      <View style={styles.section}>
        <Typography button black>
          Button - Black Roboto
        </Typography>
        <Typography button bold>
          Button - Bold Roboto
        </Typography>
      </View>

      <View style={styles.section}>
        <Typography overline>Overline - Regular Roboto</Typography>
        <Typography overline bold>Overline - Bold Roboto</Typography>
      </View>

      <View style={styles.section}>
        <Typography center h3 bold>
          Centered Bold Heading
        </Typography>
        <Typography right body1 italic>
          Right Aligned Italic Text
        </Typography>
        <Typography justify body2>
          Justified text that demonstrates how the Roboto font looks with longer content. 
          This text is justified to show the font rendering across multiple lines.
        </Typography>
      </View>

      <View style={styles.section}>
        <Typography size={24} black>
          Custom Size 24 - Black Roboto
        </Typography>
        <Typography size={18} medium>
          Custom Size 18 - Medium Roboto
        </Typography>
        <Typography size={14} light>
          Custom Size 14 - Light Roboto
        </Typography>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  section: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
});

export default TypographyExample;
