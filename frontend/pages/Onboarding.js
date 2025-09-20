import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import Button from '../components/Button';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const slides = [
  { title: 'Plastic waste is harming our cities.', subtitle: 'Segregate & submit plastics.' },
  { title: 'Submit your plastic, we’ll recycle it responsibly.', subtitle: 'We partner with recyclers.' },
  { title: 'Earn rewards & coupons for your contribution.', subtitle: 'Get discounts & coupons.' }
];

export default function Onboarding({ navigation }) {
  const [index, setIndex] = useState(0);

  function next() {
    if (index < slides.length - 1) setIndex(index + 1);
    else navigation.replace('Auth');
  }

  return (
    <LinearGradient colors={['#E8FFFC', '#F9FFF8']} style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.logo}>♻ CleanGreen</Text>
        <Text style={styles.tag}>Turn Plastic into Rewards</Text>
      </View>

      <View style={styles.carousel}>
        <View style={{ width: width - 60 }}>
          <Text style={styles.title}>{slides[index].title}</Text>
          <Text style={styles.subtitle}>{slides[index].subtitle}</Text>
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>♻</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.activeDot]} />
          ))}
        </View>

        <View style={{ width: '100%', paddingHorizontal: 20 }}>
          <Button title={index === slides.length - 1 ? 'Get Started' : 'Next'} onPress={next} />
          <TouchableOpacity style={styles.skip} onPress={() => navigation.replace('Auth')}>
            <Text style={{ color: '#006C67', fontWeight: '600' }}>Skip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  top: { alignItems: 'center', marginTop: 12 },
  logo: { fontSize: 28, fontWeight: '800', color: '#006C67' },
  tag: { color: '#222', marginTop: 6 },
  carousel: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '800', color: '#006C67', marginBottom: 8 },
  subtitle: { color: '#222', marginBottom: 16 },
  imagePlaceholder: { 
    width: 220, 
    height: 180, 
    backgroundColor: '#E8F5E8', 
    borderRadius: 16, 
    justifyContent: 'center', 
    alignItems: 'center', 
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#00C897',
    borderStyle: 'dashed'
  },
  placeholderText: { 
    fontSize: 48, 
    color: '#00C897' 
  },
  footer: { paddingBottom: 20 },
  dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: 12 },
  dot: { width: 8, height: 8, borderRadius: 8, backgroundColor: '#ddd', marginHorizontal: 6 },
  activeDot: { backgroundColor: '#00C897', width: 20, borderRadius: 8 },
  skip: { marginTop: 12, alignItems: 'center' }
});
