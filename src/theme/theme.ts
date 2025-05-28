import { MantineThemeOverride } from '@mantine/core';

export const theme: MantineThemeOverride = {
  colorScheme: 'light',
  fontFamily: 'Noto Sans JP, sans-serif',
  primaryColor: 'green',
  colors: {
    green: [
      '#E6F7EF',
      '#C3ECD8',
      '#A0E1C1',
      '#7DD6AA',
      '#5ACB93',
      '#37C07C',
      '#06C755', // Primary (Line brand color)
      '#05A347',
      '#048039',
      '#035C2B'
    ],
    gray: [
      '#F8F9FA',
      '#F1F3F5',
      '#E9ECEF',
      '#DEE2E6',
      '#CED4DA',
      '#ADB5BD',
      '#868E96',
      '#495057',
      '#343A40',
      '#212529'
    ]
  },
  shadows: {
    xs: '0 1px 3px rgba(0, 0, 0, 0.05)',
    sm: '0 1px 5px rgba(0, 0, 0, 0.05)',
    md: '0 2px 10px rgba(0, 0, 0, 0.1)',
    lg: '0 8px 30px rgba(0, 0, 0, 0.12)',
  },
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      }
    },
    Paper: {
      defaultProps: {
        radius: 'md',
      }
    }
  }
};