import React, { useState, useRef } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StickyScrollView from '../components/StickyScrollView';
import { ResponsiveStyleSheet, s, f, b } from '../utils/ResponsiveStyle/ResponsiveStyleSheet';

interface StickyScreenProps {
  onNavigateToAnalytics: () => void;
}

const StickyScreen: React.FC<StickyScreenProps> = ({ onNavigateToAnalytics }) => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'features' | 'details'>('overview');
  const [stickyHeaderHeight, setStickyHeaderHeight] = useState(0);
  
  // Refs for content sections
  const overviewRef = useRef<View>(null);
  const featuresRef = useRef<View>(null);
  const detailsRef = useRef<View>(null);
  const stickyScrollViewRef = useRef<any>(null);

  const colors = ResponsiveStyleSheet.getThemeColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <View style={styles.stickyScreen}>
        <View 
          style={[styles.stickyHeader, { backgroundColor: colors.surface, borderBottomColor: colors.disabled }]}
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            setStickyHeaderHeight(height);
          }}
        >
          <Text style={[styles.stickyTitle, { color: colors.text }]}>🎯 StickyScrollView Demo</Text>
          <Text style={[styles.stickySubtitle, { color: colors.textSecondary }]}>
            Scroll down to see the button become sticky
          </Text>

          <Button
            title="⬅️ Back to Analytics"
            onPress={onNavigateToAnalytics}
            color={colors.textSecondary}
          />
        </View>

        <StickyScrollView
          ref={stickyScrollViewRef}
          stickyHeaderIndices={[1]}
          externalOffset={stickyHeaderHeight}
          onSectionChange={(sectionName) => {
            if (sectionName === 'overview' || sectionName === 'features' || sectionName === 'details') {
              setSelectedTab(sectionName);
            }
          }}
          header={
            <View style={[styles.contentHeader, { backgroundColor: colors.surface, borderLeftColor: colors.info }]}>
              <Text style={[styles.contentHeaderTitle, { color: colors.text }]}>📚 Content Sections</Text>
              <Text style={[styles.contentHeaderSubtitle, { color: colors.textSecondary }]}>
                Navigate through different sections using the tabs below. Each section contains detailed information about the StickyScrollView component.
              </Text>
            </View>
          }
          top={
            <>
              <View
                ref={overviewRef}
                style={[styles.contentSection, { borderBottomColor: colors.disabled }]}
                onLayout={(event) => {
                  const { y, height } = event.nativeEvent.layout;
                  stickyScrollViewRef.current?.registerSection('overview', y, height);
                }}
              >
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Overview</Text>
                <Text style={[styles.contentText, { color: colors.textSecondary }]}>
                  This demonstrates the StickyScrollView component with sticky button functionality.
                  Scroll down to see the button become sticky at the bottom of the screen.
                </Text>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>How it works</Text>
                <Text style={[styles.contentText, { color: colors.textSecondary }]}>
                  • The button starts as part of the content{'\n'}
                  • When scrolling down, it smoothly becomes sticky{'\n'}
                  • When scrolling up, it rejoins the content flow{'\n'}
                  • Smooth animations with native performance
                </Text>
              </View>

              <View
                ref={featuresRef}
                style={[styles.contentSection, { borderBottomColor: colors.disabled }]}
                onLayout={(event) => {
                  const { y, height } = event.nativeEvent.layout;
                  stickyScrollViewRef.current?.registerSection('features', y, height);
                }}
              >
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Features</Text>
                <Text style={[styles.contentText, { color: colors.textSecondary }]}>
                  • Smooth sticky behavior with native performance{'\n'}
                  • Customizable content sections{'\n'}
                  • Responsive design for all screen sizes{'\n'}
                  • Easy integration with existing components
                </Text>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>Benefits</Text>
                <Text style={[styles.contentText, { color: colors.textSecondary }]}>
                  • Improved user experience with always-accessible buttons{'\n'}
                  • Clean, modern UI design{'\n'}
                  • Optimized scrolling performance{'\n'}
                  • Cross-platform compatibility
                </Text>
              </View>

              <View
                ref={detailsRef}
                style={[styles.contentSection, { borderBottomColor: colors.disabled }]}
                onLayout={(event) => {
                  const { y, height } = event.nativeEvent.layout;
                  stickyScrollViewRef.current?.registerSection('details', y, height);
                }}
              >
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Technical Details</Text>
                <Text style={[styles.contentText, { color: colors.textSecondary }]}>
                  • Built with React Native core components{'\n'}
                  • Uses ScrollView with custom scroll handling{'\n'}
                  • Implements sticky positioning with absolute positioning{'\n'}
                  • Optimized with useRef and useEffect hooks
                </Text>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>Implementation</Text>
                <Text style={[styles.contentText, { color: colors.textSecondary }]}>
                  • Custom scroll event handling{'\n'}
                  • Dynamic button state management{'\n'}
                  • Smooth opacity transitions{'\n'}
                  • Responsive layout calculations
                </Text>
              </View>
            </>
          }
          tabs={
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tab, 
                  { backgroundColor: colors.surface },
                  selectedTab === 'overview' && { backgroundColor: colors.primary }
                ]}
                onPress={() => {
                  setSelectedTab('overview');
                  stickyScrollViewRef.current?.scrollToSection('overview', true);
                }}
              >
                <Text style={[
                  styles.tabText, 
                  { color: colors.textSecondary },
                  selectedTab === 'overview' && [styles.tabTextActive, { color: colors.onPrimary }]
                ]}>
                  Overview
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tab, 
                  { backgroundColor: colors.surface },
                  selectedTab === 'features' && { backgroundColor: colors.primary }
                ]}
                onPress={() => {
                  setSelectedTab('features');
                  stickyScrollViewRef.current?.scrollToSection('features', true);
                }}
              >
                <Text style={[
                  styles.tabText, 
                  { color: colors.textSecondary },
                  selectedTab === 'features' && [styles.tabTextActive, { color: colors.onPrimary }]
                ]}>
                  Features
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tab, 
                  { backgroundColor: colors.surface },
                  selectedTab === 'details' && { backgroundColor: colors.primary }
                ]}
                onPress={() => {
                  setSelectedTab('details');
                  stickyScrollViewRef.current?.scrollToSection('details', true);
                }}
              >
                <Text style={[
                  styles.tabText, 
                  { color: colors.textSecondary },
                  selectedTab === 'details' && [styles.tabTextActive, { color: colors.onPrimary }]
                ]}>
                  Details
                </Text>
              </TouchableOpacity>
            </View>
          }
          buttonContent={
            <View style={[styles.stickyButton, styles.stickyButtonStretch, { backgroundColor: colors.success }]}>
              <Text style={[styles.buttonText, { color: colors.onPrimary }]}>🎯 Sticky Button</Text>
              <Text style={[styles.buttonSubtext, { color: colors.onPrimary }]}>Tap me!</Text>
            </View>
          }
          footer={
            <View style={styles.stickyBottomContent}>
              <View style={[styles.contentBlock, { backgroundColor: colors.surface }]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Section 1</Text>
                <Text style={[styles.contentText, { color: colors.textSecondary }]}>
                  More content here to demonstrate scrolling. Keep scrolling down to see the sticky button behavior.
                </Text>
              </View>

              <View style={[styles.contentBlock, { backgroundColor: colors.surface }]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Section 2</Text>
                <Text style={[styles.contentText, { color: colors.textSecondary }]}>
                  The button will become sticky when it goes out of view from the bottom. This provides a great user experience for important actions.
                </Text>
              </View>

              <View style={[styles.contentBlock, { backgroundColor: colors.surface }]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Section 3</Text>
                <Text style={[styles.contentText, { color: colors.textSecondary }]}>
                  Final section. Try scrolling up and down to see the complete sticky button behavior in action.
                </Text>
              </View>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stickyScreen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  stickyHeader: {
    padding: s(5),
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  stickyTitle: {
    fontSize: f(20),
    fontWeight: 'bold',
    marginBottom: s(2),
    textAlign: 'center',
  },
  stickySubtitle: {
    fontSize: f(14),
    textAlign: 'center',
    marginBottom: s(4),
  },
  contentHeader: {
    padding: s(5),
    borderRadius: b('xl'),
    marginBottom: s(5),
    borderLeftWidth: 4,
  },
  contentHeaderTitle: {
    fontSize: f(18),
    fontWeight: 'bold',
    marginBottom: s(2),
    textAlign: 'center',
  },
  contentHeaderSubtitle: {
    fontSize: f(14),
    textAlign: 'center',
    lineHeight: f(20),
  },
  stickyBottomContent: {
    padding: s(5),
  },
  contentBlock: {
    padding: s(4),
    borderRadius: b('lg'),
    marginBottom: s(4),
  },
  contentText: {
    fontSize: f(14),
    lineHeight: f(20),
    marginBottom: s(4),
  },
  stickyButton: {
    borderRadius: b('full'),
    paddingVertical: s(4),
    paddingHorizontal: s(6),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    marginHorizontal: s(5),
  },
  buttonText: {
    fontSize: f(18),
    fontWeight: 'bold',
    marginBottom: s(1),
  },
  buttonSubtext: {
    fontSize: f(12),
    opacity: 0.8,
  },
  tabContainer: {
    flexDirection: 'row',
    padding: s(5),
  },
  tab: {
    padding: s(5),
    margin: s(2),
    flex: 1,
    borderRadius: b('md'),
  },
  tabText: {
    fontSize: f(14),
    fontWeight: '600',
    textAlign: 'center',
  },
  tabTextActive: {
    fontWeight: '700',
  },
  stickyButtonStretch: {
    alignSelf: 'stretch',
  },
  contentSection: {
    paddingHorizontal: s(5),
    marginBottom: s(7),
    paddingBottom: s(5),
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: f(16),
    fontWeight: 'bold',
    marginBottom: s(2),
    textAlign: 'center',
  },
});

export default StickyScreen;
