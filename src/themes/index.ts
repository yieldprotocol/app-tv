import { css } from 'styled-components';

export const yieldTheme = {
  global: {
    focus: 'none',
    font: {
      family: 'Oswald',
      weight: '700',
    },
    colors: {
      brand: '#3f53d9',
      focus: '#3f53d999',
      selected: '#3f53d9',
      'accent-1': '#FFCA58',
      'accent-2': '#81FCED',
      text: {
        dark: '#EEEEEE',
        light: '#555555',
      },
      'text-weak': {
        dark: '#DDDDDD',
        light: '#999999',
      },
      'text-xweak': {
        dark: '#999999',
        light: '#DDDDDD',
      },
      placeholder: 'text-xweak',
      darkBackground: {
        text: '#AAAAAA',
      },
      background: {
        dark: '#DDDDDD',
        light: '#FFFFFF',
      },
    },
    input: { weight: 900 },

  },

  textInput: {
    extend: ({ theme }: any) => (
      theme.dark
        ? `color: ${theme.global.colors.text.dark}`
        : `color: ${theme.global.colors.text.light}`
    ),
  },

  select: {
    options: {
      container: {
        pad: undefined,
      },
    },
  },

  // layer: {
  //   container: {
  //     zIndex: '20',
  //   },
  //   zIndex: '20',
  //   // @ts-ignore
  //   extend: () => css`backdrop-filter: blur(3px);`,
  // },

  button: {

    border: {
      radius: '8px',
    },

    color: 'brand',

    primary: {
      extend: ({ theme }: any) => css`
      color: ${theme.global.colors.text.dark};
    `,
    },

    maxWidth: '300px',
    size: {
      large: {
        border: { radius: '8px' },
      },

    },
  },

  input: {
    border: {
      radius: '8px',
    },
    // font: {
    //   size: 'large',
    //   color: 'text-xweak',
    // },
  },
  table: {
    size: 'small',
  },
  list: {
    item: {
      pad: { horizontal: 'xsmall', vertical: undefined },
      background: 'background',
      border: false,
    },
  },
  grommet: {
    // @ts-ignore
    extend: () => css`
        a { color: grey}
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type='number'] {
          -moz-appearance: textfield;
        }
        overflow:auto;
        -ms-overflow-style: none;
        scrollbar-width: none;
        ::-webkit-scrollbar {
          display: none;
        }
      `,
  },
};
