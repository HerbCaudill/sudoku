import colors from 'tailwindcss/colors'
import _Confetti from 'react-confetti'

const selectedColors = ['slate', 'stone', 'neutral', 'blue'] as const
const selectedShades = ['100', '200', '300', '400', '500'] as const
export const Confetti = () => {
  // get viewport dimensions
  const { innerWidth } = window
  return (
    <_Confetti
      recycle={false}
      gravity={0.2} //
      friction={0.99}
      confettiSource={{ x: 0, y: 0, w: innerWidth, h: innerWidth }}
      numberOfPieces={10000}
      initialVelocityY={500}
      tweenDuration={5000}
      colors={['white', ...selectedColors.flatMap(color => selectedShades.map(shade => colors[color][shade]))]}
    />
  )
}
