export interface LyricalAnalysis {
  coreNarrative: string;
  emotionalSpectrum: {
    primaryEmotion: string;
    intensity: number;
    moodShift: string;
  };
  literaryDevices: {
    device: string;
    explanation: string;
  }[];
  subtext: string;
  vibeAndSetting: string;
}
