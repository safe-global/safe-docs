import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  List,
  ListItem,
  FormControlLabel
} from '@mui/material'

import ChevronDownIcon from '../../assets/svg/chevron-down.svg'

import css from './styles.module.css'
import React from 'react'

export const SidebarAccordion: React.FC<{
  title: string
  items: string[]
  selectedItems: string[]
  onChange: (item: string, checked: boolean) => void
}> = ({ title, items, selectedItems, onChange }) => {
  return (
    <Accordion
      defaultExpanded
      className={css.accordion}
      sx={{ backgroundColor: 'transparent' }}
    >
      <AccordionSummary expandIcon={<ChevronDownIcon />}>
        <Typography variant='caption' color='text.primary'>
          {title}
        </Typography>
      </AccordionSummary>

      <AccordionDetails>
        <List className={css.list}>
          {items.map(item => (
            <ListItem key={item} disablePadding>
              <FormControlLabel
                label={item}
                labelPlacement='start'
                value={item}
                sx={{ marginLeft: 0 }}
                control={
                  <Checkbox
                    onChange={(_, checked) => {
                      onChange(item, checked)
                    }}
                    checked={selectedItems.includes(item)}
                    edge='end'
                  />
                }
                componentsProps={{ typography: { variant: 'body2' } }}
                className={css.label}
              />
            </ListItem>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  )
}
