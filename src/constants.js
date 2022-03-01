export const initialState = {
  history: [
    {
      squares: Array(9).fill(null),
    },
  ],
  currentStepNumber: 0,
  xIsNext: true,
}

export const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  color: '#fff',
  bgcolor: '#323232',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
