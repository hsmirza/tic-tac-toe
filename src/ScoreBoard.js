import { useEffect, useState } from 'react'
import axios from 'axios'

import { styled } from '@mui/material/styles'
import { Table, TableBody, TableCell , TableContainer, TableHead, TableRow, Paper} from '@mui/material'
import { tableCellClasses } from '@mui/material/TableCell'


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontSize: 16,
    fontWeight: '700'
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 16,
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

const ScoreBoard = () => {
  const [scores, setScores] = useState([])

  useEffect(() => {
    axios.get('http://localhost:3000/stats/index')
    .then(response => setScores(response.data));
  }, [])



  return (
    <div className={'score-board'}>
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Player Name</StyledTableCell>
              <StyledTableCell align="right">Won</StyledTableCell>
              <StyledTableCell align="right">Lose</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {scores.map((row) => (
              <StyledTableRow key={row.name}>
                <StyledTableCell component="th" scope="row">
                  {row.name}
                </StyledTableCell>
                <StyledTableCell align="right">{row.win}</StyledTableCell>
                <StyledTableCell align="right">{row.loss}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default ScoreBoard
