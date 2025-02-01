import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Switch,
  Clipboard,
  TouchableOpacity,
  ToastAndroid,
  Platform,
  Alert,
} from 'react-native';
import Slider from '@react-native-community/slider';

export default function App() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);

  const generatePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let chars = '';
    if (includeUppercase) chars += uppercase;
    if (includeLowercase) chars += lowercase;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;

    if (chars === '') {
      showNotification('Please select at least one character type');
      return;
    }

    let generatedPassword = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      generatedPassword += chars[randomIndex];
    }
    setPassword(generatedPassword);
  };

  const copyToClipboard = () => {
    if (password) {
      Clipboard.setString(password);
      showNotification('Password copied to clipboard!');
    }
  };

  const showNotification = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Notification', message);
    }
  };

  const getPasswordStrength = (): { text: string; color: string } => {
    if (!password) return { text: 'No Password', color: '#666' };
    
    let strength = 0;
    if (includeUppercase) strength += 1;
    if (includeLowercase) strength += 1;
    if (includeNumbers) strength += 1;
    if (includeSymbols) strength += 1;
    
    if (length < 8) return { text: 'Weak', color: '#ff4444' };
    if (length < 12 && strength < 3) return { text: 'Weak', color: '#ff4444' };
    if (length < 16 && strength < 4) return { text: 'Medium', color: '#ffbb33' };
    return { text: 'Strong', color: '#00C851' };
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <Text style={styles.title}>Password Generator</Text>
      
      <View style={styles.passwordContainer}>
        <Text style={styles.password}>{password || 'Generate a password'}</Text>
        <TouchableOpacity onPress={copyToClipboard} disabled={!password}>
          <Text style={[styles.copyButton, !password && styles.disabled]}>Copy</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.strengthIndicator, { color: getPasswordStrength().color }]}>
        Strength: {getPasswordStrength().text}
      </Text>

      <View style={styles.optionsContainer}>
        <Text style={styles.lengthText}>Length: {length}</Text>
        <Slider
          style={styles.slider}
          minimumValue={4}
          maximumValue={32}
          step={1}
          value={length}
          onValueChange={setLength}
          minimumTrackTintColor="#2196F3"
          maximumTrackTintColor="#000000"
        />

        <View style={styles.optionRow}>
          <Text>Uppercase (A-Z)</Text>
          <Switch value={includeUppercase} onValueChange={setIncludeUppercase} />
        </View>

        <View style={styles.optionRow}>
          <Text>Lowercase (a-z)</Text>
          <Switch value={includeLowercase} onValueChange={setIncludeLowercase} />
        </View>

        <View style={styles.optionRow}>
          <Text>Numbers (0-9)</Text>
          <Switch value={includeNumbers} onValueChange={setIncludeNumbers} />
        </View>

        <View style={styles.optionRow}>
          <Text>Symbols (!@#$)</Text>
          <Switch value={includeSymbols} onValueChange={setIncludeSymbols} />
        </View>
      </View>

      <TouchableOpacity style={styles.generateButton} onPress={generatePassword}>
        <Text style={styles.generateButtonText}>Generate Password</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  passwordContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  password: {
    flex: 1,
    fontSize: 16,
    marginRight: 10,
  },
  copyButton: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.5,
  },
  strengthIndicator: {
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  optionsContainer: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  lengthText: {
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 20,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  generateButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  generateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
