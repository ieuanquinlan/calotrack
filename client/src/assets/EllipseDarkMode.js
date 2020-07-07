import React, {Fragment} from 'react'

function EllipseDarkMode({stroke, radius, normalizedRadius, circumference, strokeDashoffset, strokeColor, circlePos, goal}) {
  return (
      <Fragment>
<svg height={radius * 3.1} width={radius * 3.1}>
        <g filter='url(#filter0_dd)'>
          <circle cx={circlePos} cy={circlePos} r={radius} fill='#2e333a' />
        </g>
        <defs>
          <linearGradient id='gradient1' gradientTransform='rotate(45)'>
            <stop offset='0%' stopColor='#00fff8' />
            <stop offset='100%' stopColor='#0052ff' />
          </linearGradient>
          <linearGradient id='gradient2' gradientTransform='rotate(45)'>
            <stop offset='0%' stopColor='#ff005f' />
            <stop offset='100%' stopColor='#ff0000' />
          </linearGradient>
          <filter
            id='filter0_dd'
            x='10%'
            y='10%'
            width='100%'
            height='100%'
            filterUnits='userSpaceOnUse'
            colorInterpolationFilters='sRGB'
          >
            <feFlood floodOpacity='0' result='BackgroundImageFix' />
            <feColorMatrix
              in='SourceAlpha'
              type='matrix'
              values='0.21     0     0     0     0
              0     0.24     0     0     0
              0     0     0.27     0     0
              0     0     0     1     0'
            />
            <feOffset dx='1' dy='1' />
            <feGaussianBlur stdDeviation='10' />
            <feColorMatrix
              type='matrix'
              values='0 0 0 0 0.501961 0 0 0 0 0.501961 0 0 0 0 0.501961 0 0 0 0.5 0'
            />
            <feBlend
              mode='normal'
              in2='BackgroundImageFix'
              result='effect1_dropShadow'
            />
            <feColorMatrix
              in='SourceAlpha'
              type='matrix'
              values='0.11     0     0     0     0
              0     0.12     0     0     0
              0     0     0.14     0     0
              0     0     0     1     0'
            />
            <feOffset dx='-2' dy='-2' />
            <feGaussianBlur stdDeviation='10' />
            <feColorMatrix
              type='matrix'
              values='0.11     0     0     0     0
              0     0.12     0     0     0
              0     0     0.14     0     0
              0     0     0     1     0'
            />
            <feBlend
              mode='normal'
              in2='effect1_dropShadow'
              result='effect2_dropShadow'
            />
            <feBlend
              mode='normal'
              in='SourceGraphic'
              in2='effect2_dropShadow'
              result='shape'
            />
          </filter>
        </defs>
        <circle
          fill='transparent'
          stroke={'#7f7f7f'}
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={circlePos}
          cy={circlePos}
        ></circle>
        <circle
          stroke={strokeColor}
          fill='transparent'
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={circlePos}
          cy={circlePos}
        >
          90%
        </circle>
      </svg>
      <div>{goal}% of goal</div>
      </Fragment>
  )
}

export default EllipseDarkMode
