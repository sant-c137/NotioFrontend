'use client'

import { useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'

export default function Home() {
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: 'Songs that makes me think about you',
      items: [
        { text: "It's you - Henrry", checked: false },
        { text: 'La promesa - Melendi', checked: false },
        { text: 'The one - Kodaline', checked: false },
        { text: 'Piensalo - Banda MS', checked: false },
      ],
      pinned: true,
    },
  ])

  const [newNote, setNewNote] = useState('')

  const handleNewNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const handleNewNoteSubmit = (event) => {
    if (event.key === 'Enter' && newNote.trim()) {
      setNotes([
        ...notes,
        {
          id: Date.now(),
          title: newNote,
          items: [],
          pinned: false,
        },
      ])
      setNewNote('')
    }
  }

  const toggleItemCheck = (noteId, itemIndex) => {
    setNotes(
      notes.map((note) =>
        note.id === noteId
          ? {
              ...note,
              items: note.items.map((item, index) =>
                index === itemIndex ? { ...item, checked: !item.checked } : item
              ),
            }
          : note
      )
    )
  }

  return (
    <Box sx={{ maxWidth: 900, margin: '0 auto' }}>
      <Paper
        elevation={1}
        sx={{
          p: 2,
          mb: 4,
          maxWidth: 600,
          margin: '0 auto',
        }}
      >
        <TextField
          fullWidth
          placeholder="Take a note..."
          value={newNote}
          onChange={handleNewNoteChange}
          onKeyPress={handleNewNoteSubmit}
        />
      </Paper>

      {notes.some((note) => note.pinned) && (
        <>
          <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 2 }}>
            PINNED
          </Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {notes
              .filter((note) => note.pinned)
              .map((note) => (
                <Grid item xs={12} sm={6} md={4} key={note.id}>
                  <Card sx={{ bgcolor: 'rgb(207, 223, 235)' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {note.title}
                      </Typography>
                      {note.items.map((item, index) => (
                        <FormControlLabel
                          key={index}
                          control={
                            <Checkbox
                              icon={<CheckBoxOutlineBlankIcon />}
                              checkedIcon={<CheckBoxIcon />}
                              checked={item.checked}
                              onChange={() => toggleItemCheck(note.id, index)}
                            />
                          }
                          label={item.text}
                        />
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </>
      )}

      {notes.some((note) => !note.pinned) && (
        <>
          <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 2 }}>
            OTHERS
          </Typography>
          <Grid container spacing={2}>
            {notes
              .filter((note) => !note.pinned)
              .map((note) => (
                <Grid item xs={12} sm={6} md={4} key={note.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {note.title}
                      </Typography>
                      {note.items.map((item, index) => (
                        <FormControlLabel
                          key={index}
                          control={
                            <Checkbox
                              icon={<CheckBoxOutlineBlankIcon />}
                              checkedIcon={<CheckBoxIcon />}
                              checked={item.checked}
                              onChange={() => toggleItemCheck(note.id, index)}
                            />
                          }
                          label={item.text}
                        />
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </>
      )}
    </Box>
  )
}

