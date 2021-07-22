import * as React from 'react';

function TSTMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 254 254">
      <g>
        <circle fill="#E84142" cx="127" cy="127" r="127" />
        <path
          fill="#FFFFFF"
          d="M171.8,130.3c4.4-7.6,11.5-7.6,15.9,0l27.4,48.1c4.4,7.6,0.8,13.8-8,13.8h-55.2c-8.7,0-12.3-6.2-8-13.8
            L171.8,130.3z M118.8,37.7c4.4-7.6,11.4-7.6,15.8,0l6.1,11L155.1,74c3.5,7.2,3.5,15.7,0,22.9l-48.3,83.7
            c-4.4,6.8-11.7,11.1-19.8,11.6H46.9c-8.8,0-12.4-6.1-8-13.8L118.8,37.7z"
        />
      </g>
    </svg>
  );
}

export default TSTMark;
